/* choose-option/scenarios/checkbox.js: checkbox sampling and start states. */
(function () {
  'use strict';
  const { sampleOptions, errorOf } = env.taskOf('choose-option').lib;



  env.scenario('choose-option', {
    name: 'checkbox',
    sample(rng, spec, opts, { cat, tr }) {
      const grid = !!tr.grid;
      let n = grid ? (opts.ood ? rng.fork('grid').int(25, 32) : rng.fork('grid').int(12, 24)) : opts.ood ? rng.int(11, 16) : rng.int(4, 10);
      if (tr.count) n = rng.fork('count').int(tr.count[0], tr.count[1]); // trait count [lo, hi]: the number of options
      const k = grid ? rng.fork('gridk').int(2, opts.ood ? 7 : 5) : rng.int(1, Math.min(opts.ood ? 6 : 4, n - 2));
      const { options, targets } = sampleOptions(rng, cat, n, k, spec.csplit);
      return Object.assign(spec, { options, targets: options.filter((o) => targets.includes(o)) });
    },
    init(spec, rng, { v, mode, wrongs }) {
      const k = spec.targets.length;
      const extra = v === 'chips' ? { open: false } : {};
      if (mode === 'partial') {
        const c = rng.int(1, Math.max(1, k - 1));
        const on = new Set(k > 1 ? rng.sample(spec.targets, c) : []);
        return { values: spec.options.filter((o) => on.has(o)), ...extra };
      }
      if (mode === 'wrong') {
        const on = new Set([...rng.sample(wrongs, rng.int(1, Math.min(3, wrongs.length))), ...rng.sample(spec.targets, rng.int(0, k - 1))]);
        return { values: spec.options.filter((o) => on.has(o)), ...extra };
      }
      for (let t = 0; t < 30; t++) {
        if (!rng.bool(0.8)) break;
        const c = rng.int(0, k - 1);
        const w = rng.int(0, Math.min(2, wrongs.length));
        if (c + w === 0) continue;
        const on = new Set([...rng.sample(spec.targets, c), ...rng.sample(wrongs, w)]);
        const values = spec.options.filter((o) => on.has(o));
        if (errorOf({ values }, spec) >= 0.4) return { values, ...extra };
      }
      return { values: [], ...extra };
    },
  });
})();
