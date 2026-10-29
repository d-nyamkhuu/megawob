/* choose-option/scenarios/chips.js: chips sampling and start states. */
(function () {
  'use strict';
  const { sampleChips, errorOf } = env.taskOf('choose-option').lib;



  env.scenario('choose-option', {
    name: 'chips',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleChips(rng, spec, opts);
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
