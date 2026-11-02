/* choose-option/scenarios/dropdown.js: dropdown sampling and start states. */
(function () {
  'use strict';
  const { sampleOptions } = env.taskOf('choose-option').lib;



  env.scenario('choose-option', {
    name: 'dropdown',
    sample(rng, spec, opts, { cat }) {
      const { options, targets } = sampleOptions(rng, cat, opts.ood ? rng.int(16, 20) : rng.int(5, 15), 1, spec.csplit);
      return Object.assign(spec, { options, target: targets[0], placeholder: `Select ${/^[aeiou]/i.test(cat.noun) ? 'an' : 'a'} ${cat.noun}` });
    },
    init(spec, rng, { mode, near }) {
      if (mode === 'partial' || mode === 'scene') return { value: '', open: true }; // scene: open, nothing selected
      if (mode === 'wrong') return { value: near(spec.target), open: false };
      return { value: rng.bool(0.6) ? '' : near(spec.target), open: false };
    },
  });
})();
