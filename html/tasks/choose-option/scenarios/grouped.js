/* choose-option/scenarios/grouped.js: grouped sampling and start states. */
(function () {
  'use strict';
  const { C, CITY_ROWS, uniq, alpha, aliasesFor, routeOf, DEF_LAY, rowY } = env.taskOf('choose-option').lib;

  function sampleGrouped(rng, spec, opts) {
    const fromCities = rng.bool(0.55);
    const G = opts.ood ? rng.int(8, 11) : rng.int(4, 7);
    let groups;
    if (fromCities) {
      const by = {};
      for (const c of C.split(CITY_ROWS, spec.csplit)) (by[c.country] ||= []).push(c.city);
      let names = Object.keys(by).filter((k) => uniq(by[k]).length >= 3);
      if (names.length < G) {
        for (const c of CITY_ROWS) (by[c.country] ||= []).includes(c.city) || by[c.country].push(c.city);
        names = Object.keys(by).filter((k) => uniq(by[k]).length >= 3);
      }
      groups = rng.sample(names, G).sort(alpha).map((name) => ({ name, options: rng.sample(uniq(by[name]), rng.int(3, 6)).sort(alpha) }));
      Object.assign(spec, { label: rng.pick([
        'Destination', 'City', 'Office location', 'Pickup city', 'Town', 'Travel city', 'Service city',
        'Workplace city'
      ]), noun: 'city', plural: 'cities',
        title: rng.pick([
          'Plan a trip', 'Book a transfer', 'Office settings', 'Find a store', 'City services'
        ]), note: rng.pick(['Some cities are unavailable this season.', 'Greyed-out cities are fully booked.', 'Only cities we serve are listed.']) });
    } else {
      const cats = rng.sample(C.PRODUCT_CATEGORIES, Math.min(G, C.PRODUCT_CATEGORIES.length));
      groups = cats.map((cat) => {
        const items = uniq(C.split(C.PRODUCTS, spec.csplit).filter((p) => p.category === cat.id).map((p) => p.name));
        return { name: cat.label, options: rng.sample(items, rng.int(3, Math.min(6, items.length))).sort(alpha) };
      }).filter((g) => g.options.length >= 3);
      Object.assign(spec, { label: rng.pick([
        'Product', 'Item', 'Featured product', 'Order item', 'Sale item'
      ]), noun: 'product', plural: 'products',
        title: rng.pick([
          'Create a promotion', 'Add to order', 'Store settings', 'Product offers', 'Order contents', 'Catalog setup'
        ]), note: rng.pick(['Out-of-stock items cannot be selected.', 'Unavailable items are greyed out.']) });
    }
    spec.labelAliases = aliasesFor(spec.label);
    const options = groups.flatMap((g) => g.options);
    if (new Set(options).size !== options.length) return null;
    const criterion = rng.bool(0.35) ? 'firstAvail' : 'name';
    const rows = rng.int(5, 8);
    const route = routeOf(opts, rng.bool(0.5) ? 'wheel' : 'drag');
    // Disabled options: ~25%, never the target; firstAvail groups usually start with a disabled one.
    const disabled = new Set(options.filter(() => rng.bool(0.25)));
    let gi;
    let target;
    // The target sits below the first view (the popup must be scrolled).
    const lay = { ...DEF_LAY, view: rows * DEF_LAY.row };
    const below = (i) => rowY({ groups }, lay, i) + lay.row > lay.view;
    const cand = groups.map((g, k) => k).filter((k) => {
      const first = options.indexOf(groups[k].options[0]);
      return below(first + groups[k].options.length - 1);
    });
    if (!cand.length) return null;
    gi = rng.pick(cand);
    const g = groups[gi];
    if (criterion === 'firstAvail') {
      const nOff = rng.bool(0.75) ? rng.int(1, Math.min(2, g.options.length - 1)) : 0;
      g.options.forEach((o, k) => { if (k < nOff) disabled.add(o); else disabled.delete(o); });
      // keep some later ones disabled for realism
      if (g.options.length - nOff > 2 && rng.bool(0.5)) disabled.add(g.options[g.options.length - 1]);
      target = g.options[nOff];
    } else {
      const able = g.options.filter((o) => !below(options.indexOf(o)) ? false : true);
      target = rng.pick(able.length ? able : g.options);
      disabled.delete(target);
      // A disabled near-namesake in another group, when one exists, makes "read the state" matter.
    }
    if (!below(options.indexOf(target))) return null;
    return Object.assign(spec, { groups, options, disabled: options.filter((o) => disabled.has(o)), target, group: g.name,
      criterion, rows, route, placeholder: `Select ${/^[aeiou]/i.test(spec.noun) ? 'an' : 'a'} ${spec.noun}` });
  }

  env.scenario('choose-option', {
    name: 'grouped',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleGrouped(rng, spec, opts);
    },
    init(spec, rng, { mode }) {
      const able = spec.options.filter((o) => o !== spec.target && !spec.disabled.includes(o));
      const g = spec.groups.find((x) => x.name === spec.group);
      const sib = g.options.filter((o) => o !== spec.target && !spec.disabled.includes(o));
      const m = { value: '', open: false, top: 0 };
      if (mode === 'partial' || mode === 'scene') return { ...m, open: true };
      if (mode === 'wrong') return { ...m, value: rng.pick(sib.length ? sib : able) };
      return { ...m, value: rng.bool(0.6) ? '' : rng.pick(able) };
    },
  });
})();
