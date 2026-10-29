/* fill-form/idcard: dispatch to the shared scanned source sampler. */
(function () {
  'use strict';
  env.scenario('fill-form', { name: 'idcard', sample: (rng, opts) => env.taskOf('fill-form').lib.scanSpec(rng, 'idcard', opts) });
})();
