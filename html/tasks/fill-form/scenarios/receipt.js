/* fill-form/receipt: dispatch to the shared scanned source sampler. */
(function () {
  'use strict';
  env.scenario('fill-form', { name: 'receipt', sample: (rng, opts) => env.taskOf('fill-form').lib.scanSpec(rng, 'receipt', opts) });
})();
