/* recall-info/scenarios/compare.js: sampling, model, scoring, instructions and oracle for compare. */
(function () {
  'use strict';
  const { C, I, pickError } = env.taskOf('recall-info').lib;

  const CMP_CATS = ['electronics', 'kitchen', 'home', 'office', 'sports', 'tools', 'garden', 'music'];
  const COLOURS = ['Black', 'White', 'Silver', 'Navy', 'Red', 'Green', 'Graphite', 'Sand', 'Teal', 'Orange'];
  const ACT = ['Choose', 'Select', 'Shortlist'];

  function cmpAsks(spec) {
    const it = spec.items;
    const best = (key, dir) => it.reduce((b, r, i) => (b < 0 || (dir === 'min' ? r[key] < it[b][key] : r[key] > it[b][key]) ? i : b), -1);
    const out = [
      { mode: 'best', key: 'price', dir: 'min', target: best('price', 'min') },
      { mode: 'best', key: 'rating', dir: 'max', target: best('rating', 'max') },
      { mode: 'best', key: 'delivery', dir: 'min', target: best('delivery', 'min') },
    ];
    it.forEach((x, i) => out.push({ mode: 'match', key: 'colour', val: x.colour, target: i }));
    return out;
  }

  function sampleCompare(rng, spec, opts, impossible) {
    const cr = rng.fork('items');
    const N = spec.ood ? cr.int(7, 9) : opts.level === 'easy' ? 3 : opts.level === 'medium' ? 4 : cr.int(4, 6);
    const catId = cr.pick(CMP_CATS);
    const pool = C.PRODUCTS.filter((p) => p.category === catId);
    const prods = C.sample(cr, pool, N, spec);
    const label = (C.PRODUCT_CATEGORIES.find((c) => c.id === catId) || { label: catId }).label;
    const used = new Set();
    const ratings = cr.sample(Array.from({ length: 20 }, (_, i) => 3 + i / 10), N);
    const delivery = cr.sample(Array.from({ length: 14 }, (_, i) => i + 1), N);
    const colours = cr.sample(COLOURS, N + 1);
    const items = prods.map((p, i) => {
      let price = Math.round(cr.float(p.priceMin, Math.max(p.priceMin + 1, p.priceMax))) - 0.01;
      price = Math.max(0.99, price);
      while (used.has(price)) price = Math.round((price + 1.01) * 100) / 100 - 0.01;
      price = Math.round(price * 100) / 100;
      used.add(price);
      return { name: p.name, price, rating: Math.round(ratings[i] * 10) / 10, delivery: delivery[i], colour: colours[i], warranty: cr.int(1, 5),
        blurb: C.paragraph(cr.fork(`b${i}`), 1, { domain: 'product' }) };
    });
    Object.assign(spec, { noun: 'product', nouns: 'products', title: `Compare ${label.toLowerCase()}`, items, listChoose: cr.bool(0.5), actLabel: cr.pick(ACT) });
    if (impossible) spec.ask = { mode: 'match', key: 'colour', val: colours[N], target: null };
    else {
      const asks = cmpAsks(spec);
      const mode = C.weighted(cr, [['price', 3], ['rating', 2], ['delivery', 2], ['colour', 3]]);
      const cands = asks.filter((a) => a.key === mode);
      spec.ask = cr.pick(cands);
    }
    spec.target = spec.ask.target;
  }

  function cmpApply(m, spec, act) {
    if (act.open !== undefined) {
      if (m.view !== 'list' || act.open < 0 || act.open >= spec.items.length) return m;
      const visited = m.visited.slice();
      visited[act.open] = true;
      return { ...m, view: 'detail', open: act.open, visited };
    }
    if (act.back) return m.view === 'detail' ? { ...m, view: 'list', open: null } : m;
    if (act.pick !== undefined) {
      const ok = m.view === 'detail' ? act.pick === m.open : spec.listChoose;
      return ok ? { ...m, picked: act.pick } : m;
    }
    return m;
  }

  function cmpError(m, spec) {
    return pickError(spec.items, spec, m.picked, m.visited.filter(Boolean).length / spec.items.length);
  }

  function cmpInit(spec, rng) {
    const N = spec.items.length;
    const m = { view: 'list', open: null, picked: null, visited: Array(N).fill(false) };
    if (spec.judge) return m;
    if (spec.startMode === 'partial') {
      const k = rng.int(1, Math.max(1, N - 2));
      rng.sample([...Array(N).keys()], k).forEach((i) => { m.visited[i] = true; });
    } else if (spec.startMode === 'wrong') {
      m.picked = rng.pick([...Array(N).keys()].filter((i) => i !== spec.target));
      m.visited = Array(N).fill(true);
    }
    return m;
  }

  function cmpPlan(m, spec) {
    if (spec.judge || m.picked === spec.target) return null;
    if (spec.ask.mode === 'best') {
      const next = m.visited.indexOf(false);
      if (next >= 0) return m.view === 'detail' ? { click: { nav: 'back' } } : { click: { open: next } };
    }
    if (m.view === 'detail') return m.open === spec.target ? { click: { chooseOpen: true } } : { click: { nav: 'back' } };
    return spec.listChoose ? { click: { choose: spec.target } } : { click: { open: spec.target } };
  }

  function cmpEffect(m, spec, step) {
    const t = step.click;
    if (t.open !== undefined) return cmpApply(m, spec, { open: t.open });
    if (t.nav) return cmpApply(m, spec, { back: true });
    if (t.choose !== undefined) return cmpApply(m, spec, { pick: t.choose });
    return cmpApply(m, spec, { pick: m.open });
  }

  const CMP_PHRASE = {
    price: ['the cheapest one', 'the one with the lowest price'],
    rating: ['the one with the best customer rating', 'the highest-rated one'],
    delivery: ['the one that arrives soonest', 'the one with the fastest delivery'],
  };
  function cmpInstruction(spec, rng) {
    const a = spec.ask;
    const act = spec.actLabel.toLowerCase();
    const phrase = a.mode === 'match' ? `the one in ${a.val}` : rng.pick(CMP_PHRASE[a.key]);
    const v = { act, p: phrase, n: spec.nouns };
    const core = I.fill(I.pick(rng, a.mode === 'match' ? [
      'Check the {n} and {act} {p}.',
      'Open the {n} one by one and {act} {p}.',
      'Find {p} among the {n} and {act} it.',
      'Inspect the {n} to find and {act} {p}.',
      '{act} {p} by checking the {n}.',
    ] : [
      'Look at each of the {n} and {act} {p}.',
      'Compare the {n} by opening each one, then {act} {p}.',
      'Open every product page and {act} {p}.',
      '{act} {p} among the {n}; the details are on each product page.',
      'Use the details on every product page to {act} {p}.',
      '{act} {p} once you have opened each of the {n}.',
      'Visit every product page before you {act} {p}.',
      'With all the {n} checked in detail, {act} {p}.',
    ], spec.isplit), v);
    return I.say(rng, I.ucFirst(core), { isplit: spec.isplit, terse: `${act} ${phrase}`,
      steps: [`open each of the ${spec.nouns}`, `${act} ${phrase}`] });
  }

  env.scenario('recall-info', {
    name: 'compare',
    sample: sampleCompare,
    init: cmpInit,
    error: cmpError,
    plan: cmpPlan,
    apply: cmpApply,
    effect: cmpEffect,
    instruction: cmpInstruction,
    asks: cmpAsks,
    solve(spec, model) {
      if (spec.judge) return model;
      return { ...model, view: 'list', open: null, picked: spec.target, visited: model.visited.map(() => true) };
    },
  });
})();
