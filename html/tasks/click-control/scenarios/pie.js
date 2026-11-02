/*
 * click-control / pie: click-pie.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const { pickIn, T, targetCorrect } = fam.lib;

  const PIE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('');

  function samplePie(rng, ctx) {
    const items = rng.sample(PIE_CHARS, ctx.ood ? rng.int(9, 12) : rng.int(4, 8));
    return { items, target: rng.pick(items) };
  }

  env.scenario('click-control', {
    name: 'pie',
    sample: samplePie,
    baseModel(spec, c) {
      return { open: false, ...c };
    },
    progress: (model) => model.open ? 0.5 : 1,
    correct: targetCorrect,
    result: (spec, key) => `Item ${key} chosen`,
    wrongFinal(spec, rng) {
      return { key: rng.pick(spec.items.filter((k) => k !== spec.target)) };
    },
    scene() {
      return { open: true };
    },
    planStep: (model, spec) => model.open ? { click: { slice: spec.target } } : { click: { pie: 'open' } },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.items = pickIn(r, spec.items, (x) => x === spec.target, k(3, 5));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      core = P(T.pie, { q: q(spec.target) });
      terse = `pie menu ${q(spec.target)}`;
      return { core, terse, steps };
    },
    phKind: () => 'pie',
    retarget: (spec, model, rng, out, other) => other(spec.items, spec.target),
  });
})();
