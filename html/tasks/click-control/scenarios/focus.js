/*
 * click-control / focus: focus-text / -2.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { fieldLabels, keepIdxOf, ordinal, T, targetCorrect } = fam.lib;

  const ORD_WORDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

  function sampleFocus(rng, ctx) {
    const n = ctx.ood ? rng.int(4, 5) : rng.bool(0.4) ? 1 : 3;
    const fl = C.sample(rng, fieldLabels(), n, ctx.o);
    const by = n > 1 && rng.bool(0.5) ? 'label' : 'ordinal';
    return { fields: fl.map((f) => ({ label: f.label, aliases: f.aliases })), target: rng.int(0, n - 1), by };
  }

  env.scenario('click-control', {
    name: 'focus',
    sample: sampleFocus,
    correct: targetCorrect,
    result: (spec, key) => `Editing ${spec.fields[key].label}`,
    wrongFinal(spec, rng) {
      const ks = spec.fields.map((_, i) => i).filter((i) => i !== spec.target);
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    planStep(model, spec) {
      return { click: { field: spec.target } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      if (easy && spec.fields.length > 2) {
        const keep = keepIdxOf(r, spec.fields, (_, i) => i === spec.target, 1);
        spec.target = keep.indexOf(spec.target);
        spec.fields = keep.map((i) => spec.fields[i]);
      }
    },
    phrase(spec, rng, P) {
      const I = env.instruct;
      let core, terse, steps;
      if (spec.fields.length === 1) core = P(T.focus1, {});
      else if (spec.by === 'label') {
        const f = spec.fields[spec.target];
        const label = I.alias(rng, f.label, f.aliases);
        core = P(T.focusLabel, { label: rng.bool(0.5) ? q(label) : label });
        terse = `${label} field`;
      } else core = P(T.focusOrd, { ord: ordinal(spec.target), ordw: ORD_WORDS[spec.target], n: spec.target + 1 });
      return { core, terse, steps };
    },
    phKind: () => 'focus',
    retarget: (spec, model, rng, out, other) => other(spec.fields.map((_, i) => i), spec.target),
  });
})();
