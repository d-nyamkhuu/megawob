/* act-in-time/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('act-in-time', (T) => {
    const { def: fam } = T;
    const SCENARIOS = fam.scenarios;
    const { initModel, simulate, nd } = T.lib;
    const { boardDims, chasePos, itemPos, act } = T.helpers;
    const { tolerance, error: errorOf, ended: endedOf, instruction: instructionOf,
      solve: solveOf, plan: planOf, tick: tickOf, init: initOf } = fam;
    const modes = ['off', 'partial', 'wrong', 'solved'];
    // Every scenario without traits, then the opt-in orientation (alone and with traits.moving) on many seeds.
    const runs = SCENARIOS.map((v) => [v, null]).concat([['chase', { orient: 'vertical' }], ['moving', { orient: 'vertical' }],
      ['moving', { orient: 'vertical', moving: { visible: true, shapes: ['circle', 'square', 'triangle'], items: 9 } }]]);
    for (const beat of [1000, 600, 2000, 500]) {
      for (const [scenario, traits] of runs) {
        T.sweep({ scenarios: [scenario], seeds: 40, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ seed, rng }) => {
          const mode = modes[seed % 4];
          const tag = `${scenario}${traits ? ' ' + JSON.stringify(traits) : ''} beat ${beat} seed ${seed} ${mode}`;
          let spec;
          let m;
          try {
            spec = fam.sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, stepMs: beat, startMode: mode, ood: seed % 5 === 0,
              csplit: seed % 3 === 0 ? 'heldout' : 'train', isplit: seed % 2 ? 'heldout' : 'train', recover: seed % 7 === 0 ? false : null,
              level: [undefined, 'easy', 'medium'][seed % 3],
              ...(traits ? { traits } : {}) });
            if (traits && traits.orient === 'vertical' && spec.orient !== 'vertical') T.fail(`${tag}: traits.orient not applied`);
            m = initModel(spec);
          } catch (e) {
            T.fail(`${tag}: ${e}`);
            return;
          }
          const tol = tolerance(spec);
          const e0 = errorOf(m, spec);
          if (mode === 'off' && !(e0 > tol.minInitialError)) T.fail(`${tag}: start error ${e0} <= ${tol.minInitialError}`);
          if (mode !== 'solved' && !(e0 > tol.tau)) T.fail(`${tag}: start already within tau`);
          if (endedOf(m, spec)) T.fail(`${tag}: start already ended`);
          const text = instructionOf(spec, rng.fork('i'));
          T.check(text, `${tag}: empty instruction`);
          if (/submit/i.test(text)) T.fail(`${tag}: instruction names the end control`);
          if (errorOf(solveOf(spec, m), spec) > tol.tau + 1e-9) T.fail(`${tag}: solve() not within tau`);
          let k = 0;
          let why = null;
          for (; k < 34 && errorOf(m, spec) > tol.tau + 1e-9; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            m = simulate(m, spec, step);
            why = endedOf(m, spec);
            if (why) break;
            for (let s = 0; s < beat && !why; s += 50) {
              m = tickOf(m, spec, Math.min(50, beat - s));
              why = endedOf(m, spec);
            }
            if (why && errorOf(m, spec) > tol.tau + 1e-9) break;
          }
          const e = errorOf(m, spec);
          if (e > tol.tau + 1e-9) T.fail(`${tag}: plan ends at error ${e} after ${k} steps (${why})`);
          else if (why && !['time-up'].includes(why)) T.fail(`${tag}: episode ended (${why}) before the plan reached the target`);
          if (k > 28) T.fail(`${tag}: plan took ${k} steps`);
        });
      }
    }
    // traits.orient: {} and 'horizontal' sample exactly as no traits; 'vertical' is the same episode transposed
    // (positions swapped at every time, the board upright); unknown values throw.
    const opt = (scenario, seed, extra) => ({ scenario, scenarios: SCENARIOS, stepMs: 1000, startMode: 'off', ood: seed % 4 === 0, ...extra });
    for (let seed = 0; seed < 30; seed++) {
      for (const scenario of SCENARIOS) {
        const base = JSON.stringify(fam.sample(new env.Rng(5100 + seed), opt(scenario, seed, {})));
        for (const traits of [{}, { orient: 'horizontal' }]) {
          if (JSON.stringify(fam.sample(new env.Rng(5100 + seed), opt(scenario, seed, { traits }))) !== base) T.fail(`${scenario}/${seed}: traits ${JSON.stringify(traits)} changed sampling`);
        }
      }
      const swap = (p) => (p ? [p[1], p[0]] : null);
      const near = (a, b) => (a === null && b === null) || (!!a && !!b && Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9);
      const ch = fam.sample(new env.Rng(5100 + seed), opt('chase', seed, {}));
      const cv = fam.sample(new env.Rng(5100 + seed), opt('chase', seed, { traits: { orient: 'vertical' } }));
      if (cv.orient !== 'vertical' || boardDims(cv).join() !== `1,${ch.A}` || boardDims(ch).join() !== `${ch.A},1`) T.fail(`chase/${seed}: vertical board`);
      for (let t = 0; t <= ch.dur; t += 250) if (!near(chasePos(cv, t), swap(chasePos(ch, t)))) { T.fail(`chase/${seed}: vertical path at ${t}`); break; }
      const mh = fam.sample(new env.Rng(5100 + seed), opt('moving', seed, {}));
      const mv = fam.sample(new env.Rng(5100 + seed), opt('moving', seed, { traits: { orient: 'vertical' } }));
      if (mv.orient !== 'vertical' || !mv.lanes.every((l, i) => l.x === mh.lanes[i].y && l.y === undefined)) T.fail(`moving/${seed}: vertical lanes`);
      for (let t = -2000; t <= mh.end; t += 250) {
        if (!mh.items.every((_, i) => near(itemPos(mv, i, t), swap(itemPos(mh, i, t))))) { T.fail(`moving/${seed}: vertical positions at ${t}`); break; }
      }
    }
    for (const bad of ['diagonal', 'Vertical', null, true]) {
      let msg = '';
      try { fam.sample(new env.Rng(1), opt('delay', 1, { traits: { orient: bad } })); } catch (e) { msg = String(e); }
      if (!/act-in-time: traits\.orient must be/.test(msg)) T.fail(`traits.orient ${JSON.stringify(bad)} not rejected`);
    }
    // Difficulty ladder: normal (level unset or 'normal') samples exactly as before, easy and medium differ.
    for (let seed = 0; seed < 20; seed++) {
      for (const scenario of SCENARIOS) {
        const base = JSON.stringify(fam.sample(new env.Rng(7000 + seed), opt(scenario, seed, {})));
        if (JSON.stringify(fam.sample(new env.Rng(7000 + seed), opt(scenario, seed, { level: 'normal' }))) !== base) T.fail(`${scenario}/${seed}: level normal changed sampling`);
      }
    }
    // Judge episodes: sample() with opts.judge draws nothing from the main stream (the rest of the spec is the
    // normal one), the page starts within tau and nothing ends the episode by itself.
    for (let seed = 0; seed < 12; seed++) {
      for (const scenario of SCENARIOS) {
        const o = opt(scenario, seed, { csplit: seed % 3 === 0 ? 'heldout' : 'train', level: [undefined, 'easy', 'medium'][seed % 3] });
        const base = fam.sample(new env.Rng(9100 + seed), o);
        const spec = fam.sample(new env.Rng(9100 + seed), { ...o, judge: 'impossible' });
        const j = spec.judge;
        if (!j || j.mode !== 'impossible') { T.fail(`${scenario}/${seed}: no impossible judge`); continue; }
        const { judge, ...rest } = spec;
        if (JSON.stringify(rest) !== JSON.stringify(base)) T.fail(`${scenario}/${seed}: judge changed the normal sample`);
        const m = initOf(spec);
        if (errorOf(m, spec) > tolerance(spec).tau + 1e-9) T.fail(`${scenario}/${seed}: judge start not within tau`);
        let m2 = m;
        for (let s = 0; s < 60 * 1000; s += 500) m2 = tickOf(m2, spec, 500);
        if (endedOf(m2, spec) || errorOf(m2, spec) > tolerance(spec).tau + 1e-9) T.fail(`${scenario}/${seed}: judge episode drifts or ends`);
        if (!instructionOf(spec, new env.Rng(3)) || !/can't/.test(j.message)) T.fail(`${scenario}/${seed}: judge text`);
      }
    }
    // Grading spot checks.
    const sq = { scenario: 'simon', seq: [1, 0, 2], beat: 1000, show: 3000 };
    if (Math.abs(errorOf({ presses: [1] }, sq) - 2 / 3) > 1e-9) T.fail('simon: one correct press');
    if (errorOf({ presses: [1, 2] }, sq) < 2 / 3 - 1e-9 || !endedOf({ t: 4000, presses: [1, 2] }, sq)) T.fail('simon: wrong press');
    const iv = { scenario: 'delay', mode: 'interval', waitMs: 3000 };
    if (errorOf({ clicks: [{ key: 'one', t: 0 }, { key: 'two', t: 3000 }] }, iv) !== 0) T.fail('interval: exact timing');
    if (Math.abs(errorOf({ clicks: [{ key: 'one', t: 0 }, { key: 'two', t: 2000 }] }, iv) - 1 / 3) > 1e-9) T.fail('interval: early TWO');
    if (errorOf({ clicks: [{ key: 'two', t: 0 }] }, iv) !== 1) T.fail('interval: TWO first');
    const dl = { scenario: 'delay', mode: 'enable', delay: 2500 };
    if (!endedOf({ t: 1000, clicks: [{ key: 'go', t: 1000 }] }, dl)) T.fail('delay: early click not ended');
    if (errorOf({ t: 3000, clicks: [{ key: 'go', t: 3000 }] }, dl) !== 0) T.fail('delay: ready click');
    T.check(nd('kitten', 'sitting') === 3 / 7, 'edit distance');
    const ld = { scenario: 'loading', load: 2000, target: 1, recoverable: true, results: [{}, {}, {}] };
    let lm = act({ t: 0, searched: null, open: null, strikes: 0 }, ld, { search: true });
    lm = act({ ...lm, t: 1000 }, ld, { result: 0 });
    if (lm.open !== null) T.fail('loading: click before the results');
    lm = act({ ...lm, t: 2000 }, ld, { result: 0 });
    if (errorOf(lm, ld) !== 1 || endedOf(lm, ld)) T.fail('loading: recoverable wrong result');
    lm = act(lm, ld, { back: true });
    if (errorOf(lm, ld) !== 0.5) T.fail('loading: back to results');
    if (endedOf(act(lm, ld, { result: 2 }), ld) !== 'wrong-choice') T.fail('loading: second strike');
    const cd = { scenario: 'countdown', hold: 5000, groups: [{ key: 'a', want: 'x' }, { key: 'b', want: 'y' }], recoverable: false };
    if (Math.abs(errorOf({ t: 0, sel: { a: 'x' }, confirmed: false, strikes: 0 }, cd) - 2 / 3) > 1e-3) T.fail('countdown: partial');
    if (endedOf({ t: 5000, sel: {}, confirmed: false, strikes: 0 }, cd) !== 'expired') T.fail('countdown: expiry');
  });
})();
