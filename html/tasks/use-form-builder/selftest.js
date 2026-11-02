/* use-form-builder/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';
  env.selfTest('use-form-builder', (T) => {
    const { def } = T;
    for(const scenario of ['addq','branching','reorder','validation','settings']) for(const level of ['easy','medium','normal']) {
      const s=def.sample(new env.Rng(41),{scenario,level,judge:'impossible'}),tag=`impossible/${scenario}/${level}`;
      const text=def.instruction(s,new env.Rng(5));
      T.check(text&&text.includes(s.judge.rule),`${tag}: instruction ${text}`);
      T.check(s.judge.what&&s.judge.what.length,`${tag}: no what`);
    }
  });
})();
