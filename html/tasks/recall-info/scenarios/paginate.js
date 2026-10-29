/* recall-info/scenarios/paginate.js: sampling, model, scoring, instructions and oracle for paginate. */
(function () {
  'use strict';
  const { C, I, q, rowsOnPage, pickError } = env.taskOf('recall-info').lib;

  const PG_SETS = {
    shop: { noun: 'item', nouns: 'items', title: [
      'Search results', 'Catalog results', 'Matching items', 'Catalog entries', 'Item collection', 'Item directory'
    ], numCol: 'Price', numKind: 'usd', dir: 'min',
      catCol: 'Stock', cats: [
        'In stock', 'Low stock', 'Backordered', 'Pre-order', 'Discontinued', 'Accept', 'Retain'
      ], acts: ['Select', 'Choose', 'Pick'],
      numPh: ['the cheapest item', 'the item with the lowest price'], ratePh: ['the highest-rated item', 'the item with the best rating'] },
    jobs: { noun: 'job', nouns: 'jobs', title: [
      'Job search results', 'Open positions', 'Matching jobs', 'Current openings', 'Career listings',
      'Open vacancies'
    ], numCol: 'Salary', numKind: 'salary', dir: 'max',
      catCol: 'Work mode', cats: [
        'Remote', 'Hybrid', 'On-site', 'Contract', 'Relocation offered', 'Save', 'Bookmark', 'Favorite'
      ], acts: ['Shortlist', 'Select', 'Apply'],
      numPh: ['the highest-paying job', 'the job with the top salary'], ratePh: ['the job at the best-rated company', 'the job with the highest rating'] },
    flats: { noun: 'flat', nouns: 'flats', title: [
      'Available flats', 'Rental listings', 'Search results', 'Rentals offered', 'Rental housing'
    ], numCol: 'Rent', numKind: 'rent', dir: 'min',
      catCol: 'Type', cats: [
        'Studio', '1 bed', '2 bed', '3 bed', 'Loft', 'Save'
      ], acts: ['Select', 'Shortlist', 'Choose'],
      numPh: ['the cheapest flat', 'the flat with the lowest rent'], ratePh: ['the highest-rated flat', 'the flat with the best rating'] },
  };

  function pgAsks(spec) {
    const rows = spec.rows;
    const out = [];
    const best = (key, dir) => rows.reduce((b, r, i) => (b < 0 || (dir === 'min' ? r[key] < rows[b][key] : r[key] > rows[b][key]) ? i : b), -1);
    out.push({ mode: 'best', key: 'num', dir: spec.dir, target: best('num', spec.dir) });
    out.push({ mode: 'best', key: 'rate', dir: 'max', target: best('rate', 'max') });
    const counts = {};
    rows.forEach((r) => { counts[r.cat] = (counts[r.cat] || 0) + 1; });
    for (const [v, n] of Object.entries(counts)) if (n === 1) out.push({ mode: 'match', key: 'cat', val: v, target: rows.findIndex((r) => r.cat === v) });
    return out;
  }

  function samplePaginate(rng, spec, opts, impossible) {
    const cr = rng.fork('rows');
    const ds = cr.pick(Object.keys(PG_SETS));
    const set = PG_SETS[ds];
    const perPage = cr.pick([5, 6]);
    const pages = spec.ood ? cr.int(7, 9) : opts.level === 'easy' ? 3 : opts.level === 'medium' ? 4 : cr.int(4, 5);
    const total = pages * perPage - cr.int(0, perPage - 2);
    let names;
    if (ds === 'shop') names = [];
    else if (ds === 'jobs') {
      const titles = C.sample(cr, C.JOB_TITLES, total, spec).map((t) => (typeof t === 'string' ? t : t.label || t.name));
      const cos = C.sample(cr, C.COMPANIES, total, spec);
      names = titles.map((t, i) => `${t}, ${cos[i % cos.length]}`);
    } else names = Array.from({ length: total }, (_, i) => `${C.address(cr.fork(`a${i}`), 'en-US').line1}`);
    const grid = ds === 'shop' ? Array.from({ length: 115 }, (_, i) => 6 + i - 0.01) : ds === 'jobs' ? Array.from({ length: 137 }, (_, i) => 52 + i)
      : Array.from({ length: 277 }, (_, i) => 640 + i * 10);
    let nums = cr.sample(grid, total).map((v) => (ds === 'shop' ? Math.round(v * 100) / 100 : v));
    if (ds === 'shop') {
      // Prices that suit each product, all different.
      const prods = C.sample(cr.fork('p'), C.PRODUCTS, total, spec);
      const used = new Set();
      nums = prods.map((p) => {
        let price = Math.max(0.99, Math.round(cr.float(p.priceMin, Math.max(p.priceMin + 1, p.priceMax))) - 0.01);
        while (used.has(price)) price = Math.round((price + 1) * 100) / 100;
        used.add(price);
        return price;
      });
      names = prods.map((p) => p.name);
    }
    const rates = cr.sample(Array.from({ length: 200 }, (_, i) => 3 + i / 100), total).map((v) => Math.round(v * 100) / 100);
    const tvRow = cr.int(0, total - 1);
    const tv = cr.pick(set.cats);
    const others = set.cats.filter((c) => c !== tv);
    const rows = names.map((name, i) => ({ name, num: nums[i], rate: rates[i], cat: i === tvRow && !impossible ? tv : cr.pick(others) }));
    Object.assign(spec, { dataset: ds, noun: set.noun, nouns: set.nouns, title: cr.pick(set.title), cols: ['Name', set.numCol, 'Rating', set.catCol],
      rows, numCol: set.numCol, numKind: set.numKind, dir: set.dir, catCol: set.catCol, perPage, pages, pager: cr.pick(['numbers', 'arrows']),
      actLabel: cr.pick(set.acts) });
    if (impossible) spec.ask = { mode: 'match', key: 'cat', val: tv, target: null };
    else {
      const mode = C.weighted(cr, [['num', 3], ['rate', 3], ['match', 4]]);
      const asks = pgAsks(spec);
      spec.ask = mode === 'match' ? { mode: 'match', key: 'cat', val: tv, target: tvRow } : asks.find((a) => a.key === mode);
    }
    spec.target = spec.ask.target;
  }

  function pgApply(m, spec, act) {
    const P = spec.pages;
    const go = (p) => {
      if (p < 0 || p >= P || p === m.page) return m;
      const seen = m.seen.slice();
      seen[p] = true;
      return { ...m, page: p, seen };
    };
    if (act.goto !== undefined) return go(act.goto);
    if (act.next) return go(m.page + 1);
    if (act.prev) return go(m.page - 1);
    if (act.pick !== undefined) {
      if (!rowsOnPage(spec, m.page).includes(act.pick)) return m;
      return { ...m, picked: act.pick };
    }
    return m;
  }

  function pgError(m, spec) {
    return pickError(spec.rows, spec, m.picked, m.seen.filter(Boolean).length / spec.pages);
  }

  function pgInit(spec, rng) {
    const P = spec.pages;
    const m = { page: 0, picked: null, seen: Array.from({ length: P }, (_, i) => i === 0) };
    if (spec.judge) return m;
    if (spec.startMode === 'partial') {
      const k = rng.int(1, P - 1);
      m.page = k;
      m.seen = m.seen.map((_, i) => i <= k);
    } else if (spec.startMode === 'wrong') {
      const wrong = spec.rows.map((_, i) => i).filter((i) => i !== spec.target);
      m.picked = rng.pick(wrong);
      m.page = Math.floor(m.picked / spec.perPage);
      m.seen = m.seen.map(() => true);
    }
    return m;
  }

  function pgPlan(m, spec) {
    if (spec.judge || m.picked === spec.target) return null;
    const goTo = (p) => (spec.pager === 'numbers' ? { click: { page: p } } : { click: { pager: p > m.page ? 'next' : 'prev' } });
    if (spec.ask.mode === 'best') {
      const unseen = m.seen.indexOf(false);
      if (unseen >= 0) return goTo(unseen);
    }
    const tp = Math.floor(spec.target / spec.perPage);
    if (m.page !== tp) return goTo(tp);
    return { click: { pick: spec.target } };
  }

  function pgEffect(m, spec, step) {
    const t = step.click;
    if (t.page !== undefined) return pgApply(m, spec, { goto: t.page });
    if (t.pager) return pgApply(m, spec, { [t.pager]: true });
    return pgApply(m, spec, { pick: t.pick });
  }

  function pgPhrase(spec, rng) {
    const set = PG_SETS[spec.dataset];
    const a = spec.ask;
    if (a.mode === 'match') return `the ${spec.noun} whose ${spec.catCol.toLowerCase()} is ${q(a.val)}`;
    return rng.pick(a.key === 'num' ? set.numPh : set.ratePh);
  }

  function pgInstruction(spec, rng) {
    const act = spec.actLabel.toLowerCase();
    const phrase = pgPhrase(spec, rng);
    const v = { act, p: phrase, n: spec.nouns, pages: spec.pages };
    const core = I.fill(I.pick(rng, spec.ask.mode === 'match' ? [
      'Go through the result pages, find {p} and {act} it.',
      'Look through the {n} on every page for {p}, then {act} it.',
      'Find {p} in the results and {act} it.',
      'Once you locate {p} among the results, {act} it.',
      'Check every page of {n} for {p}, then {act} it.',
      'Use all the result pages to locate {p}, then {act} it.',
    ] : [
      'Go through all the result pages and {act} {p}.',
      'Look at every page of results, then {act} {p}.',
      'Across all {pages} pages of {n}, {act} {p}.',
      'Compare the {n} on every page and {act} {p}.',
      'Use all {pages} pages of {n} to {act} {p}.',
      'After comparing {n} on every page, {act} {p}.',
      'Consider {n} from every page, then {act} {p}.',
    ], spec.isplit), v);
    const steps = [`look through the pages of ${spec.nouns}`, `${act} ${phrase}`];
    return I.say(rng, core, { isplit: spec.isplit, terse: `${act} ${phrase}`, steps });
  }

  env.scenario('recall-info', {
    name: 'paginate',
    sample: samplePaginate,
    init: pgInit,
    error: pgError,
    plan: pgPlan,
    apply: pgApply,
    effect: pgEffect,
    instruction: pgInstruction,
    asks: pgAsks,
    solve(spec, model) {
      if (spec.judge) return model;
      return { ...model, picked: spec.target, page: Math.floor(spec.target / spec.perPage), seen: model.seen.map(() => true) };
    },
  });
})();
