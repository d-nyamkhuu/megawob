/* draw-shape/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('draw-shape', (T) => {
    const { def, lib } = T;
    const { BOARD, dist, errorOf, factsOf, figurePts, fitCircle, fitLine, frameOf, ideal, initOf,
      instructionOf, len, MIN_AREA, partsOf, planOf, polyIoU, retargetOf, silentOf, simulate, solveOf, sub, V } = lib;
    const fails = T.fails;
    const fit = fitCircle(Array.from({ length: 30 }, (_, i) => [0.7 + 0.2 * Math.cos(i / 3), 0.4 + 0.2 * Math.sin(i / 3)]));
    T.check(!(!fit || dist(fit.c, [0.7, 0.4]) > 1e-9 || Math.abs(fit.r - 0.2) > 1e-9), `fitCircle off: ${JSON.stringify(fit)}`);
    const fl = fitLine([[0, 0], [1, 1], [2, 2]]);
    if (fl.dev > 1e-12 || Math.abs(Math.abs(fl.d[0]) - Math.SQRT1_2) > 1e-12) fails.push('fitLine off');
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    if (Math.abs(polyIoU(sq, sq) - 1) > 1e-9) fails.push('polyIoU self');
    if (Math.abs(polyIoU(sq, sq.map((p) => [p[0] + 0.5, p[1]])) - 1 / 3) > 0.02) fails.push('polyIoU half');
    // Start error, solve(), instruction and the closed-loop plan (in model space) of one episode.
    const episode = (spec, s, mode, tag) => {
      const { tau } = def.tolerance(spec);
      const model = initOf(spec, new env.Rng(s));
      const e0 = errorOf(model, spec);
      if (!(e0 > tau)) fails.push(`${tag}: start error ${e0} within tau`);
      if (mode === 'off' && !(e0 > (def.tolerance(spec).minInitialError ?? 3 * tau))) fails.push(`${tag}: off start error ${e0}`);
      const es = errorOf(solveOf(spec, model), spec);
      if (!(es <= tau * 0.5 + 1e-9)) fails.push(`${tag}: solve() error ${es.toFixed(4)} > tau/2`);
      if (!instructionOf(spec, new env.Rng(s))) fails.push(`${tag}: empty instruction`);
      if (/submit/i.test(instructionOf(spec, new env.Rng(s)))) fails.push(`${tag}: names the end control`);
      // Closed-loop plan in model space.
      let m = model;
      let k = 0;
      try {
        for (; k < 30 && errorOf(m, spec) > tau; k++) {
          const step = planOf(m, spec);
          if (!step) break;
          m = simulate(m, spec, step);
        }
      } catch (err) {
        fails.push(`${tag}: plan raised ${err}`);
      }
      const ef = errorOf(m, spec);
      if (!(ef <= tau)) fails.push(`${tag}: plan ends at error ${ef.toFixed(4)} after ${k} steps`);
    };
    // Custom sampling keeps the original unforked RNG, start modes, tags and strict convergence threshold.
    T.sweep({ seeds: 30, sample: false }, ({ scenario, seed: s }) => {
      for (const mode of ['off', 'partial', 'wrong']) {
        const ood = s % 5 === 4;
        const spec = def.sample(new env.Rng(9000 + s), { scenarios: def.scenarios, scenario, ood, startMode: mode, csplit: s % 3 ? 'train' : 'heldout' });
        episode(spec, s, mode, `${scenario}/${s}/${mode}${ood ? '/ood' : ''}`);
      }
    });
    // Grading spot checks of the original scenarios.
    for (const scenario of ['line', 'circle', 'trace']) {
      for (let s = 0; s < 20; s++) {
        const spec = def.sample(new env.Rng(7000 + s), { scenarios: def.scenarios, scenario });
        const { tau } = def.tolerance(spec);
        const k = ideal(spec);
        const u = sub(k[k.length - 1], k[0]);
        const ul = len(u);
        const off = ul > 1e-6 ? [(-u[1] / ul) * 3 * tau, (u[0] / ul) * 3 * tau] : [3 * tau, 0];
        const shifted = k.map((p) => [p[0] + off[0], p[1] + off[1]]);
        if (errorOf({ strokes: [shifted] }, spec) <= tau) fails.push(`${scenario}/${s}: shifted stroke passes`);
        if (errorOf({ strokes: [k.slice(0, Math.ceil(k.length / 2))] }, spec) <= tau) fails.push(`${scenario}/${s}: half stroke passes`);
        if (errorOf({ strokes: [k, shifted] }, spec) <= tau) fails.push(`${scenario}/${s}: last stroke not scored`);
      }
    }
    // The scenarios' own spot checks.
    for (const scenario of def.scenarios) if (V[scenario].check) V[scenario].check(fails);
    // Board geometry traits: traits {} leaves every scenario's sampling unchanged; malformed values throw.
    for (const scenario of def.scenarios) {
      for (let s = 0; s < 10; s++) {
        const o = { scenarios: def.scenarios, scenario, ood: s % 5 === 4, startMode: 'off' };
        if (JSON.stringify(def.sample(new env.Rng(4400 + s), o)) !== JSON.stringify(def.sample(new env.Rng(4400 + s), { ...o, traits: {} }))) fails.push(`${scenario}/${s}: traits {} changed sampling`);
      }
    }
    for (const tr of [{ aspect: 'wide' }, { aspect: NaN }, { aspect: 3 }, { aspect: 0.5 }, { aspect: [2, 1] }, { aspect: [1, 2.5] }, { aspect: [1] },
      { placement: 'middle' }, { placement: ['left'] }, { placement: { x: 0, y: 0, w: 0, h: 1 } }, { placement: { x: 0.6, y: 0, w: 0.5, h: 1 } },
      { placement: { x: -0.1, y: 0, w: 0.6, h: 1 } }, { placement: { x: 0, y: 0, w: NaN, h: 1 } }, { placement: { x: 0, y: 0, w: 0.3, h: 1 } },
      { placement: { x: 0, y: 0, w: 1, h: 0.5 } }, { aspect: [0.8, 2], placement: { x: 0, y: 0, w: 0.5, h: 1 } }]) {
      let msg = '';
      try { def.sample(new env.Rng(1), { scenarios: def.scenarios, scenario: 'line', traits: tr }); } catch (err) { msg = String(err); }
      if (!/draw: traits\.(aspect|placement)/.test(msg)) fails.push(`malformed ${JSON.stringify(tr)} not rejected (${msg || 'no error'})`);
    }
    // Each geometry on every scenario: board and area as declared, the figure inside them, start / solve / plan.
    const geos = [{ aspect: 0.8 }, { aspect: 2.4 }, { aspect: [0.8, 2.4] }, { placement: 'left' }, { placement: 'right', aspect: 0.8 },
      { placement: 'top', aspect: [0.8, 1.2] }, { placement: 'bottom', aspect: 2.4 }, { placement: 'center' },
      { placement: { x: 0.1, y: 0.3, w: 0.45, h: 0.6 }, aspect: [1.5, 2] }];
    const inside = (p, q, m = 1e-3) => p[0] >= q.x - m && p[0] <= q.x + q.w + m && p[1] >= q.y - m && p[1] <= q.y + q.h + m;
    for (const [gi, tr] of geos.entries()) {
      for (const scenario of def.scenarios) {
        // connect and erase ignore placement: only the geometries that change their board.
        if (tr.aspect === undefined && !V[scenario].placed) continue;
        for (let s = 0; s < 9; s++) {
          for (const mode of [['off', 'partial', 'wrong'][s % 3]]) {
            const ood = s % 4 === 3;
            const tag = `geo${gi} ${JSON.stringify(tr)} ${scenario}/${s}/${mode}${ood ? '/ood' : ''}`;
            const spec = def.sample(new env.Rng(3300 + s), { scenarios: def.scenarios, scenario, ood, startMode: mode, traits: { ...tr, layers: s % 2 === 1 } });
            const a = Array.isArray(tr.aspect) ? tr.aspect : [tr.aspect ?? BOARD.w, tr.aspect ?? BOARD.w];
            if (!(spec.board.h === 1 && spec.board.w >= a[0] && spec.board.w <= a[1])) fails.push(`${tag}: board ${JSON.stringify(spec.board)}`);
            const wantArea = tr.placement !== undefined && !!V[scenario].placed;
            if (!!spec.area !== wantArea) fails.push(`${tag}: spec.area ${JSON.stringify(spec.area)}`);
            const A = spec.area;
            if (A && !(A.w >= MIN_AREA.w - 1e-3 && A.h >= MIN_AREA.h - 1e-3 && inside([A.x, A.y], frameOf(spec.board), 1e-4) && inside([A.x + A.w, A.y + A.h], frameOf(spec.board), 1e-4))) fails.push(`${tag}: area ${JSON.stringify(A)}`);
            const pts = figurePts(spec);
            // erase's decorative strokes may overshoot the board by a hair (as on the default board).
            if (pts.some((p) => !inside(p, frameOf(spec.board), scenario === 'erase' ? 0.01 : 1e-3))) fails.push(`${tag}: figure leaves the board`);
            if (A && pts.some((p) => !inside(p, A))) fails.push(`${tag}: figure leaves spec.area`);
            episode(spec, s, mode, tag);
          }
        }
      }
    }
    // Round-2 hooks: facts on a solved model, silent keeps the error above tau without touching its inputs,
    // retarget gives a new goal the current model misses, with an instruction and a plan that reaches it.
    for (const scenario of def.scenarios) {
      for (let s = 0; s < 12; s++) {
        const tag = `hooks ${scenario}/${s}`;
        const spec = def.sample(new env.Rng(2200 + s), { scenarios: def.scenarios, scenario, ood: s % 6 === 5, startMode: ['off', 'partial', 'wrong'][s % 3] });
        const tau = def.tolerance(spec).tau;
        const m0 = initOf(spec, new env.Rng(s));
        const sol = solveOf(spec, m0);
        const facts = factsOf(sol, spec);
        if (facts.length && (facts.length < 2 || facts.length > 4 || facts.some((f) => !f.label || typeof f.value !== 'string' || !f.value))) fails.push(`${tag}: facts ${JSON.stringify(facts)}`);
        const parts = partsOf(sol, spec);
        if (!parts.length || parts.some((x) => !x.name) || new Set(parts.map((x) => x.name)).size !== parts.length) fails.push(`${tag}: parts ${JSON.stringify(parts)}`);
        const snap = JSON.stringify([sol, m0]);
        const sil = silentOf(sol, m0, spec, new env.Rng(s).fork('sil'));
        if (JSON.stringify([sol, m0]) !== snap) fails.push(`${tag}: silent mutated its inputs`);
        if (sil && !(errorOf(sil, spec) > tau)) fails.push(`${tag}: silent error ${errorOf(sil, spec)} within tau`);
        if (sil && Object.keys(sil).sort().join() !== Object.keys(sol).sort().join()) fails.push(`${tag}: silent changed the model shape`);
        for (const [which, m] of [['start', m0], ['solved', sol]]) {
          const ns = retargetOf(spec, m, new env.Rng(s).fork('re'));
          if (!ns) continue;
          const t2 = `${tag} retarget@${which}`;
          if (!(errorOf(m, ns) > def.tolerance(ns).tau)) fails.push(`${t2}: already satisfied`);
          if (!Number.isFinite(errorOf(m0, ns))) fails.push(`${t2}: start error not finite`);
          const i1 = instructionOf(spec, new env.Rng(s));
          const i2 = instructionOf(ns, new env.Rng(s));
          if (!i2 || i1 === i2) fails.push(`${t2}: instruction unchanged`);
          let mm = m;
          for (let k = 0; k < 30 && errorOf(mm, ns) > def.tolerance(ns).tau; k++) {
            const st = planOf(mm, ns);
            if (!st) break;
            mm = simulate(mm, ns, st);
          }
          if (!(errorOf(mm, ns) <= def.tolerance(ns).tau)) fails.push(`${t2}: plan ends at ${errorOf(mm, ns)}`);
        }
      }
    }
    if (fails.length > 40) fails.splice(40, fails.length - 40, '...');
  });
})();
