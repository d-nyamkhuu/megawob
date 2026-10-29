/* choose-option/scenarios/combobox.js: combobox sampling and start states. */
(function () {
  'use strict';
  const { C, uniq, alpha, lc, keysOf, baseSpec, comboFilter } = env.taskOf('choose-option').lib;

  function sampleCombobox(rng, spec, opts) {
    const n = opts.ood ? rng.int(50, 80) : rng.int(18, 35);
    const pool = C.split(C.PRODUCTS, spec.csplit);
    const cats = rng.sample(uniq(pool.map((p) => p.category)), rng.int(1, 3));
    let items = uniq(pool.filter((p) => cats.includes(p.category)).map((p) => p.name));
    if (items.length < n) items = uniq(items.concat(rng.shuffle(pool.map((p) => p.name))));
    const options = rng.sample(items, n).sort(alpha);
    for (let t = 0; t < 40; t++) {
      const target = rng.pick(options);
      const words = uniq(target.split(/[\s,()/]+/).filter((w) => w.length >= 3 && /[a-z]/i.test(w)));
      const good = words.map((w) => [w, options.filter((o) => lc(o).includes(lc(w))).length]).filter(([, k]) => k >= 1 && k <= 5);
      if (!good.length) continue;
      // Prefer words shared with a few rivals (typing does not trivially isolate the target).
      good.sort((a, b) => Math.abs(a[1] - 3) - Math.abs(b[1] - 3));
      const query = rng.bool(0.7) ? good[0][0] : rng.pick(good)[0];
      return Object.assign(spec, { options, target, query, keys: keysOf(opts, rng.bool(0.3)),
        placeholder: rng.pick([
          'Select a product', 'Choose an item', 'Search products…', 'Browse the items', 'Search the list',
          'Choose from list'
        ]) });
    }
    return null;
  }

  env.scenario('choose-option', {
    name: 'combobox',
    sample(rng, spec, opts, { base }) {
      const scenario = spec.scenario;
      Object.assign(spec, baseSpec(rng, scenario, 'product'), base);
      spec.title = rng.pick([
        'Create an order', 'Log a return', 'Add to wishlist', 'New support ticket', 'Price alert', 'Catalog browsing',
        'Item discovery', 'Product inquiry', 'Gift selection', 'Catalog reference'
      ]);
      return sampleCombobox(rng, spec, opts);
    },
    init(spec, rng, { mode, wrongs }) {
      const m = { value: '', open: false, query: '', active: -1 };
      const sib = comboFilter(spec, spec.query).filter((o) => o !== spec.target);
      if (mode === 'scene') return { ...m, open: true }; // open, nothing typed or chosen
      if (mode === 'partial') return { ...m, open: true, query: spec.query.slice(0, 2), active: 0 };
      if (mode === 'wrong') return { ...m, value: rng.pick(sib.length ? sib : wrongs) };
      return { ...m, value: rng.bool(0.6) ? '' : rng.pick(wrongs) };
    },
  });
})();
