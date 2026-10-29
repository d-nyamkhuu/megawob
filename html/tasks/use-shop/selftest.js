/* use-shop/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-shop', (T) => {
    const { def, lib } = T;
    const V = env.scenariosOf('use-shop');
    const { instructionOf, weekday, days, fromDays } = lib;
    const modes = ['off', 'partial', 'wrong', 'scene'];

    // Every scenario, 60 seeds: sampling, start state, instruction, closed-loop plan, solve(), the scenario's own spec checks.
    T.sweep({
      seeds: 60,
      rng: (seed) => new env.Rng(seed * 7919 + 17),
      sample: (scenario, seed) => ({
        startMode: modes[(seed + (seed >> 2)) % 4],
        recover: seed % 2 === 0,
        // the widget traits each scenario tests (testTraits); routes cycle.
        traits: V[scenario].testTraits ? V[scenario].testTraits(seed) : {},
        route: [undefined, 'keyboard', 'wheel', 'pointer'][seed % 4],
        ood: seed % 5 === 4,
        csplit: seed % 7 === 3 ? 'heldout' : 'train',
        isplit: seed % 4 === 1 ? 'heldout' : 'train',
      }),
    }, (ep) => {
      const { scenario, seed, spec, rng } = ep;
      const mode = modes[(seed + (seed >> 2)) % 4];
      const recover = seed % 2 === 0;
      const tag = `${scenario} seed ${seed} ${mode}${recover ? ' recover' : ''}`;
      const traits = V[scenario].testTraits ? V[scenario].testTraits(seed) : {};
      let m = ep.model;
      const e0 = def.error(m, spec);
      if (mode === 'off' && !(e0 > 0.5)) T.fail(`${tag}: start error ${e0}`);
      if (!(e0 > 1e-9)) T.fail(`${tag}: starts solved`);
      if (def.ended(m, spec)) T.fail(`${tag}: start state already ended`);
      const text = instructionOf(spec, rng.fork('i'));
      if (!text) T.fail(`${tag}: empty instruction`);
      if (/submit/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
      let k = 0;
      try {
        for (; k < 60 && def.error(m, spec) > 1e-9; k++) {
          const step = def.plan(m, spec);
          if (!step) break;
          m = def.helpers.apply(m, spec, step);
          if (def.ended(m, spec)) throw new Error(`plan ended the episode with ${JSON.stringify(step)}`);
        }
      } catch (e) {
        T.fail(`${tag}: ${e}`);
      }
      if (def.error(m, spec) > 1e-9) T.fail(`${tag}: plan ends at error ${def.error(m, spec)} after ${k} steps`);
      if (k > 34) T.fail(`${tag}: plan took ${k} steps`);
      if (def.error(def.solve(spec, def.init(spec, rng.fork('init'))), spec) > 1e-9) T.fail(`${tag}: solve() not on target`);
      if (V[scenario].checkSpec) {
        const fails = [];
        V[scenario].checkSpec(spec, traits, tag, fails);
        for (const f of fails) T.fail(f);
      }
    });

    // Judge data (structure only; the kit grades the reply): ambiguous needs two or more candidate names and the other
    // same-kind names, impossible needs what names the missing thing.
    for (const mode of ['ambiguous', 'impossible']) {
      T.sweep({ seeds: 6, rng: (seed) => new env.Rng(seed * 31 + 5), sample: false }, (ep) => {
        const { scenario, seed } = ep;
        const tag = `${scenario} ${mode} judge seed ${seed}`;
        try {
          const spec = def.sample(ep.rng, { scenario, scenarios: def.scenarios, judge: mode, startMode: 'off',
            csplit: seed % 2 ? 'heldout' : 'train', isplit: 'train' });
          const j = spec.judge;
          const names = (xs) => Array.isArray(xs) && xs.length > 0 && xs.every((c) => Array.isArray(c) && c.length > 0 && c.every((x) => typeof x === 'string' && x.trim()));
          if (!j) T.fail(`${tag}: no judge`);
          else if (mode === 'ambiguous' && (!names(j.cands) || j.cands.length < 2 || !Array.isArray(j.others))) T.fail(`${tag}: cands / others`);
          else if (mode === 'impossible' && !(Array.isArray(j.what) && j.what.length && j.what.every((x) => typeof x === 'string' && x.trim()))) T.fail(`${tag}: what`);
          else if (!instructionOf(spec, new env.Rng(seed + 3))) T.fail(`${tag}: empty instruction`);
        } catch (e) {
          T.fail(`${tag}: ${e && e.stack || e}`);
        }
      });
    }

    // Grading spot checks.
    for (const scenario of def.scenarios) if (V[scenario].check) for (const f of V[scenario].check()) T.fail(f);
    T.check(weekday('2026-10-13') === 2, 'weekday(2026-10-13) is not Tuesday');
    if (env.ui && env.ui.calendar && env.ui.calendar.check) for (const f of env.ui.calendar.check({ days, fromDays, weekday })) T.fail(f);
  });
})();
