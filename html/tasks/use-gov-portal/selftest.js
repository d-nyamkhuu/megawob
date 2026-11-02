/* use-gov-portal/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-gov-portal', (T) => {
    const { def } = T;
    for (const scenario of def.scenarios) for (const level of ['easy','medium','normal']) for (const ood of [false,true]) {
      const s = def.sample(new env.Rng(43), {scenario, level, ood, judge:'impossible', startMode:'off'}), tag = `impossible/${scenario}/${level}/${ood}`;
      T.check(s.judge.what && s.judge.what.length, `${tag}: no what`);
      T.check(def.instruction(s, new env.Rng(5)), `${tag}: no instruction`);
    }
  });
})();
