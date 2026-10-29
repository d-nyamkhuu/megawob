/* fill-form/claim: dispatch to the shared scanned source sampler. */
(function () {
  'use strict';
  env.scenario('fill-form', { name: 'claim', sample: (rng, opts) => env.taskOf('fill-form').lib.scanSpec(rng, 'claim', opts) });
})();
