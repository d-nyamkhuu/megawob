/* fill-form/fix: dispatch to the shared single-field correction sampler. */
(function () {
  'use strict';
  env.scenario('fill-form', { name: 'fix', sample: (rng, opts) => env.taskOf('fill-form').lib.fixSpec(rng, opts) });
})();
