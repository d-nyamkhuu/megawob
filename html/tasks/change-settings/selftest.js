/* change-settings/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';

  function simulate(m, spec, st, helpers) {
    const { setQuery, setValue, isDirty, save, discard, setTab, stepOf, openSelect } = helpers;
    if (st.type) {
      const [t, text] = st.type;
      if (t.search) return setQuery(m, text);
      const v = text === '' ? '' : Number(text);
      return setValue(m, spec, t.control, v);
    }
    const t = st.click;
    if (t.save) return isDirty(m, spec) ? save(m) : m;
    if (t.discard) return discard(m);
    if (t.tab) return setTab(m, t.tab);
    if (t.option) return setValue(m, spec, t.option[0], t.option[1]);
    if (t.step) {
      const s = spec.settings[t.step[0]];
      return setValue(m, spec, s.id, Number(m.values[s.id]) + t.step[1] * stepOf(s));
    }
    if (t.control) {
      const s = spec.settings[t.control];
      if (s.kind === 'toggle') return setValue(m, spec, s.id, !m.values[s.id]);
      if (s.kind === 'select') return openSelect(m, s.id);
    }
    return m;
  }

  env.selfTest('change-settings', (T) => {
    const { def, helpers, lib } = T;
    const { sample, init, error, solve, plan, instruction } = def;
    const SCENARIOS = def.scenarios;
    const JUDGE_MODES = def.judgeModes;
    const { same } = lib;
    const { matches } = helpers;
    for (let seed = 0; seed < 80; seed++) {
      for (const scenario of SCENARIOS) {
        for (const ood of [false, true]) {
          const rng = new env.Rng(seed * 97 + 5);
          const spec = sample(rng, { scenario, ood, csplit: seed % 4 ? 'train' : 'heldout', isplit: 'all' });
          const tag = `${scenario}${ood ? '/ood' : ''}#${seed}`;
          if (!spec.goals.length) { T.fail(`${tag}: no goals`); continue; }
          for (const g of spec.goals) T.check(!same(spec.base[g.id], g.value), `${tag}: goal ${g.id} already at target`);
          T.check(!(spec.layout === 'tabs' && spec.sections.some((s) => s.ids.length > 4)), `${tag}: tab too tall`);
          for (const g of spec.goals) T.check(matches(spec, g.id, spec.queries[g.id]), `${tag}: query misses ${g.id}`);
          for (const mode of ['off', 'partial', 'wrong']) {
            spec.startMode = mode;
            let m = init(spec, rng.fork(mode));
            T.check(error(m, spec) > 0, `${tag} ${mode}: starts solved`);
            T.check(error(solve(spec, m), spec) === 0, `${tag} ${mode}: solve() not within tau`);
            // Simulate the plan on the model (what a perfect widget does).
            for (let k = 0; k < 60 && error(m, spec) > 0; k++) {
              const st = plan(m, spec);
              if (!st) { T.fail(`${tag} ${mode}: plan stops at error ${error(m, spec)}`); break; }
              m = simulate(m, spec, st, helpers);
            }
            T.check(!(error(m, spec) > 0), `${tag} ${mode}: plan does not converge (${error(m, spec)})`);
          }
          const text = instruction(spec, rng.fork('i'));
          for (const judge of JUDGE_MODES) {
            const js = sample(new env.Rng(seed * 31 + 7), { scenario, ood, csplit: 'train', isplit: 'all', judge });
            const j = js.judge;
            if (!j) continue;
            T.check(instruction(js, new env.Rng(seed + 4)), `${tag} ${judge}: no instruction`);
            if (judge === 'ambiguous') T.check(j.cands && j.cands.length === 2 && j.cands.every((c) => c.length && c.every((n) => typeof n === 'string' && n)), `${tag}: cands ${JSON.stringify(j.cands)}`);
            if (judge === 'ambiguous') T.check(j.text && j.text.w, `${tag}: ambiguous text`);
            if (judge === 'impossible') T.check(j.what && j.what.length, `${tag}: no what`);
          }
          T.check(!/\bsubmit\b/i.test(text), `${tag}: names the end control`);
          T.check(!/\{[a-zA-Z]+\}/.test(text), `${tag}: unfilled slot: ${text}`);
        }
      }
    }
  });
})();
