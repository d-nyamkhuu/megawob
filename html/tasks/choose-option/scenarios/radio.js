/* choose-option/scenarios/radio.js: radio sampling and start states. */
(function () {
  'use strict';
  const { CATEGORIES, C, uniq, CRIT_TEXT, sampleOptions } = env.taskOf('choose-option').lib;

  function sampleRadio(rng, spec, opts) {
    const cat = CATEGORIES[spec.category];
    if (spec.category === 'shipping' && rng.bool(0.6)) {
      // Page-grounded: options show price and delivery time; the goal is a criterion over them.
      for (let t = 0; t < 60; t++) {
        const r = rng.fork(`crit${t}`);
        const n = opts.ood ? r.int(6, 8) : r.int(3, 6);
        const ms = r.sample(C.SHIPPING_METHODS, n);
        const kind = r.pick(['cheapest', 'fastest', 'within']);
        let pool = ms;
        let days;
        if (kind === 'within') {
          days = r.pick(uniq(ms.map((m) => m.days[1])).filter((d) => d >= 1));
          if (days === undefined) continue;
          pool = ms.filter((m) => m.days[1] <= days);
          if (pool.length < 2 || pool.length === ms.length) continue;
        }
        const key = kind === 'fastest' ? (m) => m.days[1] : (m) => m.price;
        const best = Math.min(...pool.map(key));
        const win = pool.filter((m) => key(m) === best);
        if (win.length !== 1) continue;
        const options = ms.map((m) => m.name);
        const details = Object.fromEntries(ms.map((m) => [m.name, CRIT_TEXT(m)]));
        return Object.assign(spec, { options, target: win[0].name, details, criterion: { kind, days } });
      }
    }
    const { options, targets } = sampleOptions(rng, cat, opts.ood ? rng.int(7, 9) : rng.int(3, 6), 1, spec.csplit);
    return Object.assign(spec, { options, target: targets[0] });
  }

  env.scenario('choose-option', {
    name: 'radio',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleRadio(rng, spec, opts);
    },
    init(spec, rng, { mode, near }) {
      if (mode === 'partial') return { value: '' };
      if (mode === 'wrong') return { value: near(spec.target) };
      return { value: rng.bool(0.55) ? '' : near(spec.target) };
    },
  });
})();
