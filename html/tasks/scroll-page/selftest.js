/* scroll-page/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('scroll-page', (T) => {
    const { def, lib, helpers } = T;
    const { CONTAINERS, JUDGE_MODES, actionsOf } = lib;
    const { nonEmpty } = env.util;

    T.sweep({ seeds: 60, sample: false }, ({ scenario, seed }) => {
    for (const ood of [false, true]) {
      const rng = new env.Rng(seed * 31 + 7);
      const spec = def.sample(rng, { scenario, ood, csplit: seed % 3 ? 'train' : 'heldout', isplit: 'all' });
      const ids = actionsOf(spec).map((a) => a.id);
      if (new Set(ids).size !== ids.length) T.fail(`${scenario}#${seed}: duplicate action ids`);
      if (scenario !== 'copy' && !ids.includes(spec.target)) T.fail(`${scenario}#${seed}: target missing`);
      for (const mode of ['off', 'partial', 'wrong']) {
        spec.startMode = mode;
        const m = def.init(spec, rng.fork(mode));
        if (!(def.error(m, spec) > 0)) T.fail(`${scenario}#${seed} ${mode}: starts solved`);
        if (def.error(def.solve(spec, m), spec) !== 0) T.fail(`${scenario}#${seed} ${mode}: def.solve() not within tau`);
      }
      if (CONTAINERS.includes(scenario)) {
        const ix = spec.pane.rows.findIndex((r) => r.id === spec.row);
        if (ix < 0) T.fail(`${scenario}#${seed}: target row missing`);
        if (scenario === 'lazy' && !(ix >= spec.pane.initial)) T.fail(`${scenario}#${seed}: target row already loaded`);
        if (scenario === 'siblings' && spec.pane2.rows.some((r) => r.actions.some((a) => a.id === spec.target))) T.fail(`${scenario}#${seed}: target in the other pane`);
      }
      for (const mode of JUDGE_MODES) {
        const js = def.sample(new env.Rng(seed * 31 + 7), { scenario, ood, csplit: seed % 3 ? 'train' : 'heldout', isplit: 'all', judge: mode });
        if (!js.judge || js.judge.mode !== mode) { T.fail(`${scenario}#${seed} judge=${mode}: no spec.judge`); continue; }
        js.startMode = 'off';
        const jm = def.init(js, rng.fork('j' + mode));
        const jt = def.instruction(js, rng.fork('ji'));
        if (jt.includes('{') || /undefined/.test(jt)) T.fail(`${scenario}#${seed} judge=${mode}: bad text "${jt}"`);
        if (mode === 'ambiguous' && !(Array.isArray(js.judge.cands) && js.judge.cands.length >= 2 && js.judge.cands.every(nonEmpty) && Array.isArray(js.judge.others))) T.fail(`${scenario}#${seed} ambiguous: cands ${JSON.stringify(js.judge.cands)}`);
        if (mode === 'ambiguous' && !js.judge.cands.every((c) => c.some((n) => jt.toLowerCase().includes(String(n).toLowerCase())))) T.fail(`${scenario}#${seed} ambiguous: instruction lacks a candidate "${jt}"`);
        if (mode === 'impossible' && !nonEmpty(js.judge.what)) T.fail(`${scenario}#${seed} impossible: what ${JSON.stringify(js.judge.what)}`);
        if (mode === 'confirm') {
          if (!(def.error(jm, js) > def.tolerance(js).tau)) T.fail(`${scenario}#${seed} confirm: starts within tau`);
          if (!(def.error(def.solve(js, jm), js) <= def.tolerance(js).tau)) T.fail(`${scenario}#${seed} confirm: def.solve() not within tau`);
        } else if (!(def.error(jm, js) <= def.tolerance(js).tau)) T.fail(`${scenario}#${seed} judge=${mode}: start not within tau`);
      }
      const text = def.instruction(spec, rng.fork('i'));
      const bare = actionsOf(spec).reduce((t, x) => t.split(x.label).join(''), text);
      if (/\bsubmit\b/i.test(bare)) T.fail(`${scenario}#${seed}: instruction names the end control`);
      if (text.includes('{')) T.fail(`${scenario}#${seed}: unfilled slot in "${text}"`);
      spec.recoverable = false;
      const w = actionsOf(spec).find((a) => a.id !== spec.target);
      if (w && !def.ended(helpers.clickAction(def.init({ ...spec, startMode: 'off' }, rng), spec, w.id), spec)) T.fail(`${scenario}#${seed}: wrong click does not end`);
      spec.recoverable = true;
      if (w) {
        const m1 = helpers.clickAction(def.init({ ...spec, startMode: 'off' }, rng), spec, w.id);
        if (def.ended(m1, spec) || def.error(m1, spec) !== 1) T.fail(`${scenario}#${seed}: recoverable wrong click`);
        if (def.ended(helpers.goBack(m1), spec)) T.fail(`${scenario}#${seed}: back`);
      }
    }
    });
  });
})();
