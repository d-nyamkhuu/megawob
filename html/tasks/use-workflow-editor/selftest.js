/* use-workflow-editor/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-workflow-editor', (T) => {
    const { def } = T;
    for (const scenario of ['connect', 'place', 'reroute', 'remove', 'configure']) for (const level of ['easy', 'medium', 'normal']) for (const ood of [false, true]) {
      const s = def.sample(new env.Rng(31), { scenario, level, ood, judge: 'ambiguous' }), j = s.judge, tag = `ambiguous/${scenario}/${level}/${ood}`;
      const text = def.instruction(s, new env.Rng(5));
      T.check(text && text.includes(j.label), `${tag}: instruction ${text}`);
      T.check(j.cands && j.cands.length >= 2 && !j.cands.some((c) => !c.length || c.some((x) => !x)), `${tag}: cands`);
      T.check(s.nodes.filter((n) => n.label === j.label).length === 2, `${tag}: label not on two nodes`);
    }
  });
})();
