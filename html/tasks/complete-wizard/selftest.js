/* complete-wizard/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('complete-wizard', (T) => {
    const { reviewOf, typed, shiftDate, F, correct, fmtDate, longDate, parseDate, effect } = T.lib;
    const { validate } = T.helpers;
    const errorOf = T.def.error;
    const planOf = T.def.plan;
    const self = T.def;
    // Custom loops retain the original start-mode order, RNG forks and oracle step counting.
    for (const scenario of self.scenarios) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        for (let seed = 0; seed < 30; seed++) {
          const rng = new env.Rng(seed * 7919 + 31);
          const ood = seed % 3 === 0;
          const tag = `${scenario}/${startMode}${ood ? '/ood' : ''} seed ${seed}`;
          let spec;
          let model;
          try {
            spec = self.sample(rng.fork('s'), { scenario, scenarios: self.scenarios, startMode, ood, isplit: 'all', csplit: 'all' });
            model = self.init(spec, rng.fork('i'));
            self.instruction(spec, rng.fork('t'));
          } catch (e) {
            T.fail(`${tag}: ${e}`);
            continue;
          }
          const R = reviewOf(spec);
          if (R < 3 || R > 6) T.fail(`${tag}: ${R} input steps`);
          if (new Set(spec.fields.map((f) => f.id)).size !== spec.fields.length) T.fail(`${tag}: duplicate ids`);
          for (const f of spec.fields) {
            const v = typed(f);
            if (validate(f, v, Object.fromEntries(spec.fields.map((g) => [g.id, typed(g)])))) T.fail(`${tag}: target of ${f.id} (${v}) fails validation`);
            if (!correct(f, v)) T.fail(`${tag}: target of ${f.id} not correct`);
            if ((f.kind === 'choice' || f.kind === 'select') && !f.options.includes(f.target)) T.fail(`${tag}: ${f.id} target not an option`);
          }
          T.check(errorOf(model, spec) > 0, `${tag}: starts solved`);
          let m = model;
          let k = 0;
          for (; k < 60; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            const next = effect(m, spec, step);
            if (JSON.stringify(next) === JSON.stringify(m) && !step.type) { T.fail(`${tag}: plan step ${JSON.stringify(step)} has no effect`); break; }
            m = next;
            if (errorOf(m, spec) === 0) break;
          }
          if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
          if (k > 36) T.fail(`${tag}: plan took ${k} steps`);
          if (errorOf(self.solve(spec, model), spec) !== 0) T.fail(`${tag}: solve() not on target`);
        }
      }
    }
    if (parseDate('02/29/2028', 'MM/DD/YYYY') !== '2028-02-29' || parseDate('29.02.2027', 'DD.MM.YYYY') !== null) T.fail('parseDate');
    if (fmtDate('2027-03-04', 'DD/MM/YYYY') !== '04/03/2027' || longDate('2027-03-04') !== 'March 4, 2027') T.fail('fmtDate');
    if (shiftDate('2027-12-31', 1) !== '2028-01-01' || shiftDate('2028-03-01', -1) !== '2028-02-29') T.fail('shiftDate');
    const ph = F('phone', 'text', { fmt: 'phone', target: '(415) 555-0123' });
    if (!correct(ph, '415 555 0123') || validate(ph, 'abc', {}) === null) T.fail('phone compare/validate');
    // judge modes: ambiguous has two labelled candidates and the instruction says "name"; impossible names the option
    T.sweep({ seeds: 12, sample: false }, ({ scenario, seed }) => {
      for (const judge of ['ambiguous', 'impossible']) {
        const tag = `${scenario} seed ${seed} ${judge}`;
        try {
          const js = self.sample(new env.Rng(seed * 17 + 5), { scenario, scenarios: self.scenarios, startMode: 'off', judge, isplit: 'train', csplit: 'train' });
          const j = js.judge;
          if (!j) continue;
          const text = self.instruction(js, new env.Rng(seed + 4));
          if (judge === 'ambiguous') {
            if (!(j.cands && j.cands.length === 2 && j.cands.every((c) => c[0]) && j.cands[0][0] !== j.cands[1][0])) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
            if (!text || !j.value) T.fail(`${tag}: ambiguous instruction ${text}`);
          } else if (!(j.what && j.what.length)) T.fail(`${tag}: no what`);
        } catch (e) {
          T.fail(`${tag}: ${e}`);
        }
      }
    });
  });
})();
