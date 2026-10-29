/* use-text-editor/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-text-editor', (T) => {
    const fam = T.def;
    const { dist, PROSE_SCENARIOS, act, canonKey } = T.lib;
    const { nonEmpty } = env.util;
    const { init: initModel, error: errorOf, instruction: instructionOf, plan: planOf, solve: solveOf } = fam;
    const modes = ['off', 'partial', 'wrong'];
    const docs = [['code', ['cursor', 'multiline', 'multicursor', 'findreplace', 'autocomplete']], ['prose', PROSE_SCENARIOS]];
    for (const [doc, vs] of docs) {
      T.sweep({ scenarios: vs, seeds: 40, rng: (seed) => new env.Rng(seed * 7919 + 31), sample: false }, ({ scenario, seed, rng }) => {
        const startMode = modes[seed % 3];
        const tag = `${doc}/${scenario} seed ${seed} (${startMode})`;
        let spec;
        let m;
        try {
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: vs, traits: { doc }, startMode, ood: seed % 5 === 4,
            level: seed % 6 === 5 ? 'easy' : undefined, route: seed % 4 === 3 ? 'keyboard' : undefined,
            isplit: seed % 2 ? 'heldout' : 'train', csplit: seed % 7 === 3 ? 'heldout' : 'train' });
          m = initModel(spec, rng.fork('i'));
        } catch (e) {
          T.fail(`${tag}: ${e.stack || e}`);
          return;
        }
        const e0 = errorOf(m, spec);
        T.check(e0 > 0, `${tag}: starts solved`);
        const text = instructionOf(spec, rng.fork('n'));
        T.check(text && !/submit/i.test(text), `${tag}: bad instruction ${text}`);
        let k = 0;
        try {
          for (; k < 40 && errorOf(m, spec) > 0; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            m = act(m, spec, step);
          }
        } catch (e) {
          T.fail(`${tag}: ${e.stack || e}`);
        }
        if (errorOf(m, spec) > 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
        T.check(k <= 34, `${tag}: plan took ${k} steps`);
        if (errorOf(solveOf(spec, initModel(spec, null)), spec) > 0) T.fail(`${tag}: solve() not on target`);
        for (const judge of ['ambiguous', 'impossible']) {
          try {
            const js = fam.sample(rng.fork(`j${judge}`), { scenario, scenarios: vs, traits: { doc }, startMode: 'off', judge });
            if (!js.judge || !js.judge.message || !js.judge.text) T.fail(`${tag}: no ${judge} judge`);
            else if (errorOf(initModel(js, null), js) > 0) T.fail(`${tag}: ${judge} does not start within tau`);
            if (js.judge && judge === 'ambiguous') {
              const jj = js.judge;
              if (!Array.isArray(jj.cands) || jj.cands.length < 2 || !jj.cands.every(nonEmpty)) T.fail(`${tag}: cands ${JSON.stringify(jj.cands)}`);
              if (!Array.isArray(jj.others) || !jj.others.every(nonEmpty)) T.fail(`${tag}: others ${JSON.stringify(jj.others)}`);
            } else if (js.judge && !nonEmpty(js.judge.what)) T.fail(`${tag}: what ${JSON.stringify(js.judge.what)}`);
          } catch (e) {
            T.fail(`${tag} ${judge}: ${e.stack || e}`);
          }
        }
      });
    }
    const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) T.fail(`${what}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); };
    eq(dist('kitten', 'sitting'), 3, 'dist');
    eq(canonKey('Shift+('), '(', 'canonKey printable');
    eq(canonKey('Control+Shift+K'), 'Control+Shift+k', 'canonKey ctrl letter');
    eq(canonKey('Space'), ' ', 'canonKey space');
  });
})();
