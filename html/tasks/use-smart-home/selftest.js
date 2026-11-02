/* use-smart-home/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-smart-home', (T) => {
    const { def } = T;
    for (const scenario of def.scenarios) for (const level of ['easy', 'medium', 'normal']) for (const ood of [false, true]) {
      const s = def.sample(new env.Rng(47), { scenario, level, ood, judge: 'impossible' }), tag = `impossible/${scenario}/${level}/${ood}`;
      T.check(s.judge.what && s.judge.what.length && !s.judge.what.some(x => !x), `${tag}: no what`);
      const text = def.instruction(s, new env.Rng(5));
      T.check(text && s.judge.what.some(x => text.includes(x)), `${tag}: instruction ${text}`);
    }
  });
})();
