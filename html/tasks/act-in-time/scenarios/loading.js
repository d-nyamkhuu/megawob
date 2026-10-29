/*
 * act-in-time / loading: click "Search" (the query is prefilled), a spinner and skeleton rows run for spec.load ms, then
 * the results appear.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { absentFrom, endedWrongChoice, fmt$, PRODUCT_NAMES, Q, resultsShown, round2, snap, toleranceOpen } = fam.lib;

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

  function sampleLoading(rng, beat, o) {
    let n = o.ood ? rng.int(8, 9) : rng.int(4, 7);
    // A category whose split part has enough products (heldout parts are small: top up from the rest).
    const cats = rng.shuffle(C.PRODUCT_CATEGORIES.slice());
    const ok = (p) => !/"/.test(p.name) && p.name.length <= 44;
    let best = null;
    for (const cat of cats) {
      const all = C.PRODUCTS.filter((p) => p.category === cat.id && ok(p));
      const pool = C.split(all, o.csplit);
      if (!best || pool.length > best.pool.length) best = { cat, all, pool };
      if (pool.length >= n) break;
    }
    const prods = rng.sample(best.pool, n);
    for (const p of rng.shuffle(best.all)) if (prods.length < n && !prods.includes(p)) prods.push(p);
    const query = best.cat.label.toLowerCase();
    n = prods.length;
    // Distinct prices and ratings, so "cheapest" and "best rated" have one answer.
    const prices = new Set();
    const ratings = new Set();
    const results = prods.map((p) => {
      let price;
      for (let k = 0; k < 20; k++) {
        price = C.price(rng, p).amount;
        if (!prices.has(price)) break;
      }
      prices.add(price);
      let rating;
      for (let k = 0; k < 20; k++) {
        rating = round2(rng.int(30, 50) / 10);
        if (!ratings.has(rating)) break;
      }
      ratings.add(rating);
      return { name: p.name, price, rating, reviews: rng.int(3, 4800), note: rng.pick([
        'Free delivery', 'Arrives tomorrow', 'In stock', 'Ships in 2 days', 'Only 3 left', 'Free returns',
        'Ships today', 'Store pickup', 'Ships weekdays', 'Tracking sent'
      ]) };
    });
    const uniq = (f) => results.filter((r) => f(r) === Math.min(...results.map(f))).length === 1;
    const ways = ['name', 'name', 'position'];
    if (uniq((r) => r.price)) ways.push('cheapest', 'cheapest');
    if (uniq((r) => -r.rating)) ways.push('rated');
    const by = rng.pick(ways);
    let target = rng.int(0, n - 1);
    if (by === 'cheapest') target = results.findIndex((r) => r.price === Math.min(...results.map((x) => x.price)));
    if (by === 'rated') target = results.findIndex((r) => r.rating === Math.max(...results.map((x) => x.rating)));
    const load = snap((o.ood ? rng.float(3, 4.6) : rng.float(1.2, 3.2)) * beat);
    return { query, results, target, by, load };
  }

  const T_LOADING = {
    name: ['Search for {query} and open {name}.', 'Run the {query} search and open the result {name}.', 'Find {name} in the {query} results and open it.',
      'Look up {query}, wait for the results, and click {name}.',
      'After searching {query}, find and open {name}.',
      'Open {name} once the {query} results appear.',
      'With {query} as your search, find and open {name}.',
      'Let the {query} search finish, then open {name}.'],
    cheapest: ['Search for {query} and open the cheapest result.', 'Run the {query} search and open whichever result costs the least.',
      'Find the lowest-priced item in the {query} results and open it.',
      'Open whichever {query} search result has the lowest price.'],
    rated: ['Search for {query} and open the best-rated result.', 'Run the {query} search and open the result with the highest rating.',
      'Open the top-rated item from the {query} search.',
      'Compare ratings in the {query} search and open the best.'],
    position: ['Search for {query} and open the {ord} result.', 'Run the {query} search and click the {ord} item in the list.',
      'Open result number {k} of the {query} search.',
      'Open item {k} after the {query} search loads.'],
  };

  env.scenario('act-in-time', {
    name: 'loading',
    sample: sampleLoading,
    level(spec, lv, r, keep) {
      const beat = spec.beat;
      const k = keep(3, 4);
      if (spec.results.length > k) {
        const others = r.sample(spec.results.map((_, i) => i).filter((i) => i !== spec.target), k - 1).concat([spec.target]).sort((a, b) => a - b);
        spec.results = others.map((i) => spec.results[i]);
        spec.target = others.indexOf(spec.target);
      }
      spec.load = Math.max(snap(beat), snap(spec.load * (1 - 0.4 * lv)));
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, searched: null, open: null, strikes: 0 };
      if (mode === 'partial' || mode === 'wrong') m.searched = -spec.load;
      if (mode === 'wrong') {
        m.open = (spec.target + 1 + (spec.results.length > 2 ? 1 : 0)) % spec.results.length;
        m.strikes = 1;
      }
      return m;
    },
    error(model, spec) {
      if (model.open !== null) return model.open === spec.target ? 0 : 1;
      if (resultsShown(spec, model)) return 0.5;
      return model.searched !== null ? 0.6 : 1;
    },
    endedBy: endedWrongChoice,
    tolerance: toleranceOpen,
    act(model, spec, ev, m, t) {
      if (ev.search && m.open === null) m.searched = t;
      else if (ev.result !== undefined && resultsShown(spec, m) && m.open === null) {
        m.open = ev.result;
        if (ev.result !== spec.target) m.strikes += 1;
      } else if (ev.back) m.open = null;
    },
    plan(model, spec) {
      if (model.open !== null) return model.open === spec.target ? null : { click: { back: true } };
      if (model.searched === null) return { click: { search: true } };
      if (!resultsShown(spec, model)) return { wait: true };
      return { click: { result: spec.target } };
    },
    solveBy(spec, model, m) {
      return { ...m, searched: -spec.load, open: spec.target, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      const r = spec.results[spec.target];
      const core = I.fill(pick(T_LOADING[spec.by]), { query: Q(spec.query), name: Q(r.name), ord: ORD[spec.target], k: spec.target + 1 });
      return say(core, { steps: [`search for ${Q(spec.query)}`, 'wait for the results', spec.by === 'name' ? `open ${Q(r.name)}` : `open the ${spec.by === 'position' ? ORD[spec.target] : spec.by === 'cheapest' ? 'cheapest' : 'best-rated'} one`] });
    },
    judgeAsk(jr, spec, mk, cant) {
      const name = absentFrom(jr, PRODUCT_NAMES, spec.csplit, spec.results.map((r) => r.name));
      return mk(name, T_LOADING.name, { query: Q(spec.query), name: Q(name) }, cant(`${name} is not in the results`));
    },
    factRows(model, spec, f) {
      if (model.open === null) return [];
      const r = spec.results[model.open];
      return [f('Price', fmt$(r.price)), f('Rating', r.rating.toFixed(1), ['Stars']), f('Reviews', r.reviews.toLocaleString('en-US'), ['Review count', 'Number of reviews']), f('Note', r.note, ['Delivery', 'Availability'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      if (next.open === spec.target && prev.open !== spec.target) m.open = null;
      else if (prev.searched === null && next.searched !== null) m.searched = null;
      else return null;
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good, others) {
      const t = others(spec.results.length, spec.target, model.open === null ? -1 : model.open);
      return t.length ? good({ ...base, target: rng.pick(t), by: rng.pick(['name', 'name', 'position']) }) : null;
    },
  });
})();
