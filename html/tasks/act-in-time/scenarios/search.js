/*
 * act-in-time / search: a debounced product search box (M7).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { absentFrom, act, fmt$, limit, nameMatches, PRODUCT_NAMES, Q, searchList, snap, toleranceOpen } = fam.lib;

  // Products of one category: { items: [{ name, price }], query }.
  function searchItems(rng, n, o) {
    const cats = rng.shuffle(C.PRODUCT_CATEGORIES.slice());
    const ok = (p) => !/"/.test(p.name) && p.name.length <= 40;
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
    return { items: prods.slice(0, n).map((p) => ({ name: p.name, price: C.price(rng, p).amount })), category: query };
  }

  // A product search box: results for the typed text appear only after `debounce` ms of quiet plus `latency` ms
  // of loading; until then the list still shows the previous results (stale). Opening any result while the
  // list is stale is a mistake (the page jumped to the wrong thing); so is opening a wrong product.
  function sampleSearch(rng, beat, o) {
    const lv = o.lv || 0;
    const n = o.ood ? rng.int(10, 11) : rng.int(7, 9);
    const { items, category } = searchItems(rng, n, o);
    const label = rng.pick(['Search products', 'Search the shop', 'Find an item', 'Search', 'Enter a term']);
    let target = 0;
    let query = '';
    for (let tries = 0; tries < 160; tries++) {
      target = rng.int(0, items.length - 1);
      const w = (items[target].name.match(/[A-Za-z]+/) || [''])[0];
      let found = null;
      for (let L = 2; L <= Math.min(5, w.length); L++) {
        const cnt = items.filter((it) => nameMatches(it.name, w.slice(0, L))).length;
        if (cnt >= 2 && cnt <= 5) { found = w.slice(0, L); break; }
        if (cnt < 2) break;
      }
      if (!found && tries >= 80 && w.length >= 3) found = w.slice(0, Math.min(5, w.length));
      if (found) { query = found; break; }
    }
    if (!query) throw new Error('act-in-time search: no query for the target');
    const others = items.map((_, i) => i).filter((i) => i !== target);
    const popular = rng.sample(others, Math.min(5, others.length)).sort((a, b) => a - b);
    const debounce = snap(rng.float(0.5, 1) * beat * (1 - 0.3 * lv));
    const latency = snap(rng.float(0.8, 1.6) * beat * (1 - 0.3 * lv));
    return { label, category, items, target, query, popular, debounce: Math.max(50, debounce), latency: Math.max(50, latency) };
  }

  const T_SEARCH = ['Search for {query} and open {name}.', 'Type {query} in the search box and open {name} from the results.',
    'Look up {query}, then click {name} in the list that appears.', 'Search {query} and open the product {name}.',
    'Find {name} by searching for {query}, then open it.', 'Enter {query} into the search field and click the result {name}.',
    'Open {name} once results for {query} have loaded.', 'Run a search for {query}. After it loads, open {name}.',
    'Let a search for {query} finish before opening {name}.'];

  // A query (prefix of the first word, matching 2-5 items) that finds item t, as sampleSearch picks one; '' when none.
  function queryFor(items, t) {
    const w = (items[t].name.match(/[A-Za-z]+/) || [''])[0];
    for (let L = 2; L <= Math.min(5, w.length); L++) {
      const cnt = items.filter((it) => nameMatches(it.name, w.slice(0, L))).length;
      if (cnt >= 2 && cnt <= 5) return w.slice(0, L);
      if (cnt < 2) break;
    }
    return '';
  }

  env.scenario('act-in-time', {
    name: 'search',
    sample: sampleSearch,
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, q: '', qAt: null, settled: '', open: null, openStale: false, strikes: 0, focus: false };
      if (mode === 'partial') Object.assign(m, { q: spec.query, settled: spec.query });
      if (mode === 'wrong') Object.assign(m, { open: spec.popular[0], strikes: 1 });
      return m;
    },
    error(model, spec) {
      if (model.open !== null) return model.open === spec.target && !model.openStale ? 0 : 1;
      if (!searchList(spec, model.q).includes(spec.target)) return 1;
      return model.settled === model.q ? 0.4 : 0.6;
    },
    endedBy(model, spec) {
      if (model.strikes >= limit(spec)) return model.openStale ? 'stale-click' : 'wrong-choice';
      return null;
    },
    tolerance: toleranceOpen,
    tickBy(model, spec, dt, t) {
      if (model.qAt !== null && model.q !== model.settled && t >= model.qAt + spec.debounce + spec.latency - 1e-9) return { ...model, t, settled: model.q };
      return { ...model, t };
    },
    act(model, spec, ev, m, t) {
      if (ev.input !== undefined) Object.assign(m, { q: ev.input, qAt: t });
      else if (ev.result !== undefined && m.open === null) {
        m.open = ev.result;
        m.openStale = m.q !== m.settled;
        if (m.openStale || ev.result !== spec.target) m.strikes += 1;
      } else if (ev.back) Object.assign(m, { open: null, openStale: false });
      else if (ev.focus !== undefined) m.focus = ev.focus;
    },
    simulate(m, spec, step, c) {
      if (step.type) m = act(act(m, spec, { focus: true }), spec, { input: step.type[1] });
      else if (c.result !== undefined) m = act(m, spec, { result: c.result });
      else if (c.back) m = act(m, spec, { back: true });
      return m;
    },
    plan(model, spec) {
      if (model.open !== null) return model.open === spec.target && !model.openStale ? null : { click: { back: true } };
      if (!searchList(spec, model.q).includes(spec.target)) return { type: [{ field: 'q' }, spec.query] };
      return model.settled === model.q ? { click: { result: spec.target } } : { wait: true };
    },
    solveBy(spec, model, m) {
      return { ...m, q: spec.query, qAt: null, settled: spec.query, open: spec.target, openStale: false, strikes: 0 };
    },
    phrase(spec, rng, pick, say) {
      const nm = spec.items[spec.target].name;
      return say(I.fill(pick(T_SEARCH), { query: Q(spec.query), name: Q(nm) }), { steps: [`search for ${Q(spec.query)}`, 'wait for the new results', `open ${Q(nm)}`] });
    },
    judgeAsk(jr, spec, mk, cant) {
      const name = absentFrom(jr, PRODUCT_NAMES, spec.csplit, spec.items.map((x) => x.name));
      const query = ((name.match(/[A-Za-z]+/) || ['Item'])[0]).slice(0, 4);
      return mk(name, T_SEARCH, { query: Q(query), name: Q(name) }, cant(`${name} is not in the shop`));
    },
    factRows(model, spec, f) {
      if (model.open === null) return [];
      const it = spec.items[model.open];
      const n = searchList(spec, model.settled).length;
      return [f('Price', fmt$(it.price)), f('Product', it.name, ['Name', 'Opened product']), f('Results', `${n} results for “${model.settled}”`, ['Search results', 'Result count'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      if (!(next.open === spec.target && !next.openStale && prev.open !== next.open)) return null;
      Object.assign(m, { open: null, openStale: false });
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good, others) {
      for (const t of rng.shuffle(others(spec.items.length, spec.target, model.open === null ? -1 : model.open).filter((i) => !spec.popular.includes(i)))) {
        const query = queryFor(spec.items, t);
        if (!query) continue;
        const r = good({ ...base, target: t, query });
        if (r) return r;
      }
      return null;
    },
  });
})();
