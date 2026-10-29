/* crop-image/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('crop-image', (T) => {
    const { def, lib, helpers } = T;
    const { iou, inView, rectOf, sameRect } = lib;
    const { applyDrag, applyRatio, handlePoint, marqueeRect, nudge } = helpers;
    const { clamp } = env.util;

    const a = { l: 0.1, t: 0.1, r: 0.5, b: 0.5 };
    T.check(Math.abs(iou(a, a) - 1) <= 1e-12, 'iou(a, a) != 1');
    T.check(iou(a, { l: 0.6, t: 0.6, r: 0.9, b: 0.9 }) === 0, 'iou of disjoint boxes != 0');
    T.check(Math.abs(iou(a, { l: 0.1, t: 0.1, r: 0.3, b: 0.5 }) - 0.5) <= 1e-12, 'iou of half box != 0.5');

    // One episode: init, solve, scene sanity, instruction, and the plan simulated with the same mechanics in
    // model space until it converges. Returns the start model.
    const episode = (spec, rng, tag) => {
      let m = def.init(spec, rng.fork('init'));
      const m0 = { ...m };
      const zx = spec.zoom ? spec.zoom.x : 1;
      m.px = { W: Math.round(700 * zx), H: Math.round((700 * zx) / spec.aspect) };
      const tol = def.tolerance(spec);
      T.check(def.error(def.solve(spec, m), spec) <= 1e-9, `${tag}: solve() is not exact`);
      for (const ob of spec.objects) {
        const q = ob.box;
        T.check(q.l >= 0 && q.t >= 0 && q.r <= 1 && q.b <= 1 && q.l < q.r && q.t < q.b, `${tag}: bbox outside image`);
      }
      const target = spec.target;
      T.check(target.l >= 0 && target.t >= 0 && target.r <= 1 + 1e-9 && target.b <= 1 + 1e-9, `${tag}: target outside image`);
      const ins = def.instruction(spec, rng.fork('i'));
      T.check(!(/submit/i.test(ins) || /\{\w+\}|undefined/.test(ins)), `${tag}: bad instruction ${ins}`);
      let n = 0;
      for (; n < 30 && def.error(m, spec) > tol.tau; n++) {
        const step = def.plan(m, spec);
        if (!step) break;
        const unapply = (x) => (spec.apply ? { ...x, applied: null } : x);
        if (step.wheel) {
          const p = m.pan;
          m = { ...m, pan: { x: clamp(p.x + step.wheel[2] / m.px.W, 0, 1 - spec.view.w), y: clamp(p.y + step.wheel[1] / m.px.H, 0, 1 - spec.view.h) } };
        } else if (step.click && step.click.nav) {
          m = { ...m, pan: { x: clamp(step.click.nav[0] - spec.view.w / 2, 0, 1 - spec.view.w), y: clamp(step.click.nav[1] - spec.view.h / 2, 0, 1 - spec.view.h) } };
        } else if (step.click && step.click.preset) m = unapply({ ...m, ...applyRatio(m, step.click.preset, spec), ratio: step.click.preset });
        else if (step.click && step.click.apply) m = { ...m, applied: rectOf(m) };
        else if (step.click) m = { ...m, focus: true };
        else if (step.key) m = unapply(nudge(m, step.key, spec));
        else if (step.drag[0].mark) {
          const r = marqueeRect(step.drag[0].mark, step.drag[1].mark, spec);
          if (r) m = unapply({ ...m, ...r, on: true });
          if (m.pan && !inView({ l: Math.min(...step.drag.map((e) => e.mark[0])), r: Math.max(...step.drag.map((e) => e.mark[0])),
            t: Math.min(...step.drag.map((e) => e.mark[1])), b: Math.max(...step.drag.map((e) => e.mark[1])) }, m.pan, spec, 0)) T.fail(`${tag}: marquee drag leaves the window`);
        } else {
          const [f, g] = step.drag;
          const p = handlePoint(f.rect || m, f.handle);
          const q = handlePoint(g.rect || m, g.handle);
          if (m.pan && !inView({ l: Math.min(p[0], q[0]), r: Math.max(p[0], q[0]), t: Math.min(p[1], q[1]), b: Math.max(p[1], q[1]) }, m.pan, spec, 0)) T.fail(`${tag}: drag leaves the window`);
          m = unapply({ ...m, ...applyDrag(m, f.handle, q[0] - p[0], q[1] - p[1], spec) });
        }
      }
      T.check(def.error(m, spec) <= tol.tau, `${tag}: plan did not converge (error ${def.error(m, spec).toFixed(3)} after ${n})`);
      return m0;
    };

    // The plan, simulated with the same mechanics in model space, converges for every seed/scenario/mode.
    T.sweep({ seeds: 80, rng: (seed) => new env.Rng(seed), sample: false }, ({ scenario, seed, rng }) => {
      for (const startMode of ['off', 'partial', 'wrong']) {
        const spec = def.sample(rng.fork('spec'), { scenario, scenarios: def.scenarios, startMode, ood: seed % 11 === 0 });
        episode(spec, rng, `${scenario}/${startMode}#${seed}`);
      }
    });

    // Every target can be cropped: it is at least spec.min on both sides (pan ood included, at every zoom).
    T.sweep({ seeds: 150, rng: (s) => new env.Rng(5200 + s), sample: false }, ({ scenario, seed: s, rng }) => {
      const spec = def.sample(rng, { scenarios: def.scenarios, scenario, ood: s % 2 === 1 });
      const t = spec.target;
      T.check(!(t.r - t.l < spec.min.w - 1e-9 || t.b - t.t < spec.min.h - 1e-9), `${scenario}/${s}: target ${JSON.stringify(t)} smaller than spec.min ${JSON.stringify(spec.min)}`);
    });

    // Image geometry traits: traits {} leaves sampling unchanged; malformed values throw.
    T.sweep({ seeds: 10, sample: false }, ({ scenario, seed: s }) => {
      const o = { scenarios: def.scenarios, scenario, ood: s % 5 === 4, startMode: 'off' };
      T.check(JSON.stringify(def.sample(new env.Rng(4400 + s), o)) === JSON.stringify(def.sample(new env.Rng(4400 + s), { ...o, traits: {} })), `${scenario}/${s}: traits {} changed sampling`);
    });
    for (const tr of [{ aspect: 'tall' }, { aspect: NaN }, { aspect: 0.5 }, { aspect: 2.5 }, { aspect: [2, 1] }, { aspect: [0.6] }, { aspect: [0.6, 3] },
      { placement: 'middle' }, { placement: ['left'] }, { placement: { x: 0, y: 0, w: 0.3, h: 1 } }, { placement: { x: 0.7, y: 0, w: 0.5, h: 1 } },
      { placement: { x: -0.1, y: 0, w: 0.5, h: 1 } }, { placement: { x: 0, y: 0, w: 1, h: NaN } }, { placement: { x: 0, y: 0, w: 1 } },
      { startBox: 'whole' }, { startBox: { x: 0, y: 0, w: 0.05, h: 0.5 } }, { startBox: { x: 0.5, y: 0.5, w: 0.6, h: 0.2 } }, { startBox: null }]) {
      let msg = '';
      try { def.sample(new env.Rng(1), { scenarios: def.scenarios, scenario: 'default', traits: tr }); } catch (err) { msg = String(err); }
      T.check(/crop: traits\.(aspect|placement|startBox)/.test(msg), `malformed ${JSON.stringify(tr)} not rejected (${msg || 'no error'})`);
    }

    // Each geometry on every scenario: aspect, area and start box as declared, the target in the area, the plan converges.
    const geos = [{ aspect: 0.6 }, { aspect: 2.4 }, { aspect: [0.6, 1] }, { placement: 'left' }, { placement: 'right', aspect: 0.6 },
      { placement: 'top', aspect: 2.4 }, { placement: 'bottom' }, { placement: 'center', aspect: [0.6, 2.4] },
      { placement: { x: 0.55, y: 0.5, w: 0.45, h: 0.5 }, aspect: [1.2, 1.8] }, { startBox: 'full' }, { startBox: 'center', aspect: 0.8 },
      { startBox: { x: 0.05, y: 0.5, w: 0.5, h: 0.45 }, placement: 'top' }];
    const inR = (p, q) => p.l >= q.l - 1e-4 && p.t >= q.t - 1e-4 && p.r <= q.r + 1e-4 && p.b <= q.b + 1e-4;
    for (const [gi, tr] of geos.entries()) {
      T.sweep({ seeds: 12, rng: (s) => new env.Rng(7700 + s), sample: false }, ({ scenario, seed: s, rng }) => {
        const startMode = ['off', 'partial', 'wrong'][s % 3];
        const spec = def.sample(rng.fork('spec'), { scenario, scenarios: def.scenarios, startMode, ood: s % 4 === 3, traits: tr });
        const tag = `geo${gi} ${JSON.stringify(tr)} ${scenario}/${startMode}#${s}`;
        if (tr.aspect !== undefined) {
          const [lo, hi] = Array.isArray(tr.aspect) ? tr.aspect : [tr.aspect, tr.aspect];
          const asp = scenario === 'pan' ? (spec.aspect * spec.zoom.y) / spec.zoom.x : spec.aspect;
          T.check(asp >= lo - 0.01 && asp <= hi + 0.01, `${tag}: aspect ${asp}`);
        }
        T.check(!!spec.area === (tr.placement !== undefined), `${tag}: spec.area ${JSON.stringify(spec.area)}`);
        T.check(!(spec.area && !inR(spec.target, spec.area)), `${tag}: target ${JSON.stringify(spec.target)} outside spec.area`);
        T.check(!(spec.area && scenario === 'position' && spec.relation && !inR(spec.objects[spec.goal].box, spec.area)), `${tag}: relation object outside spec.area`);
        const hasStart = tr.startBox !== undefined && scenario !== 'marquee' && scenario !== 'pan';
        T.check(!!spec.startBox === hasStart, `${tag}: spec.startBox ${JSON.stringify(spec.startBox)}`);
        const m0 = episode(spec, rng, tag);
        T.check(!(hasStart && startMode === 'off' && !spec.keyRoute && 1 - iou(spec.startBox, spec.target) > 3 * (1 - spec.threshold)
          && !sameRect(m0, spec.startBox)), `${tag}: off start is not spec.startBox`);
        T.check(!(startMode === 'off' && def.error(m0, spec) < def.tolerance(spec).minInitialError), `${tag}: start too close`);
      });
    }

    // judge episodes: ambiguous holds both candidates (non-empty names) in its goal, impossible names what
    for (const judge of ['ambiguous', 'impossible']) {
      T.sweep({ seeds: 10, sample: false }, ({ scenario, seed: s }) => {
        const spec = def.sample(new env.Rng(7900 + s), { scenarios: def.scenarios, scenario, judge });
        const j = spec.judge;
        const tag = `judge ${judge} ${scenario}#${s}`;
        const ins = def.instruction(spec, new env.Rng(s)).toLowerCase();
        const names = judge === 'ambiguous' ? (j.cands || []).map((c) => c[0]) : (j.what || []).slice(0, 1);
        T.check(!(judge === 'ambiguous' && names.length < 2), `${tag}: cands ${JSON.stringify(j.cands)}`);
        T.check(!(judge === 'impossible' && !names.length), `${tag}: no what`);
        T.check(!names.some((n) => typeof n !== 'string' || !n.trim() || !ins.includes(n.toLowerCase())), `${tag}: instruction lacks ${JSON.stringify(names)}: ${ins}`);
      });
    }
  });
})();
