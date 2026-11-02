/*
 * use-shop / search: type the query, search, open the result asked for (pages or infinite scroll).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { C, days, fmtDate, fmtMoney, fromDays, levelOf, listStep, loadingTick, norm, ORD, reveal, sayIt, shelfPrice, USD } = fam.lib;
  const { clamp, hash32, quote } = env.util;

  const ENGINES = ['Searchly', 'Findr', 'Lookabout', 'Quarry', 'Seekwell', 'Pathfinder', 'Wayseek', 'Scoutly',
    'Questa', 'Huntr', 'Qalvori', 'Yuvanto', 'Caudren', 'Rixando', 'Neskaro', 'Orvaska', 'Varquent'];
  const TLDS = [
    'com', 'net', 'org', 'io', 'co', 'info', 'us', 'ca', 'eu', 'tv', 'app', 'dev', 'me', 'shop', 'news', 'uk', 'de',
    'fr', 'es', 'it', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi', 'ie', 'au', 'nz', 'jp', 'in', 'br', 'mx', 'biz',
    'xyz', 'pro', 'name', 'mobi', 'blog', 'club', 'art', 'tech', 'wiki', 'link', 'live', 'team', 'work', 'cafe',
    'cool', 'fun', 'guru', 'ink', 'help', 'pt', 'pl', 'cz', 'sk', 'hu', 'ro', 'gr', 'is', 'ee', 'lv', 'lt', 'si',
    'hr', 'sg', 'kr', 'id', 'my', 'th', 'vn', 'za', 'page', 'pet', 'bike', 'farm', 'eco', 'city', 'tips', 'camp',
    'blue', 'ai', 'hk', 'tw', 'ph', 'ar', 'cl', 'pe', 'uy', 'lu', 'mt', 'run', 'surf', 'toys', 'menu', 'golf', 'fish',
    'chat', 'auto', 'band'
  ];
  const SUFFIX = /,?\s+(LLP|LLC|GmbH|Inc\.?|Ltd\.?|Co\.|AG|SA|BV|Oy|AB|Group)$/;
  const siteName = (company) => company.replace(SUFFIX, '').replace(/\s+&\s+Sons$/, '');

  function makeResults(rng, query, n, csplit, corpus) {
    const cs = { csplit };
    const out = [];
    const seen = new Set();
    const Q = C.titleCase(query);
    const qslug = C.slug(query) || 'search';
    const links = C.LINK_TEXTS;
    for (let guard = 0; out.length < n && guard < 800; guard++) {
      const site = siteName(C.pick(rng, C.COMPANIES, cs));
      const base = C.slug(site, rng.bool(0.35) ? '-' : '');
      if (!base || base.length < 3 || base.length > 26) continue;
      const host = `${rng.bool(0.2) ? rng.pick(['www.', 'blog.', 'shop.', 'help.', 'news.']) : ''}${base}.${rng.pick(TLDS)}`;
      if (seen.has(host)) continue;
      seen.add(host);
      const link = C.pick(rng, links, cs);
      const product = C.PRODUCTS.some((p) => norm(p.name).startsWith(norm(query)));
      const person = /^[A-ZÀ-ÖØ-Þ]/u.test(query);
      const title = rng.pick(person ? [
        () => `${Q} | Profile and biography`,
        () => `${Q}: recent work and publications`,
        () => `Meet ${Q} - ${site}`,
        () => `${Q} | ${site} team directory`,
      ] : product ? [
        () => `${Q} - specifications and reviews | ${site}`,
        () => `Compare ${query}: features, prices and availability`,
        () => `${Q} buying guide | ${site}`,
        () => `${Q}: owner reviews and product details`,
      ] : [
        () => `${Q} - ${site}`,
        () => `${Q}: practical advice and common questions`,
        () => `${Q} explained | ${site}`,
        () => `${Q}: useful resources and expert perspectives`,
        () => `Everything you need to know about ${query} - ${site}`,
        () => `A guide to ${query} - ${site}`,
        () => `${Q} | ${site}`,
      ])();
      const path = rng.pick([qslug, `${C.slug(link)}/${qslug}`, C.slug(link) || 'page', `p/${rng.int(100, 9999)}`,
        `${rng.int(2019, 2026)}/${qslug}`]);
      const desc = person
        ? `Learn about ${Q}'s background, professional experience and recent work. Browse the profile, publications and related updates from ${site}.`
        : product ? `Explore ${query} with detailed specifications, owner feedback and practical buying advice. Compare features and find the right option for your needs.`
        : `An introduction to ${query}, with practical examples, background information and answers to common questions. Read the latest guide from ${site}.`;
      const r = { title, host, path, desc };
      // Corpus results (traits.corpus) rewrite the title / snippet and add r.meta from a stream seeded by the host and
      // the query: the draws above are the same with or without a corpus, and hosts stay unique.
      if (corpus) decorate(corpus, new env.Rng(hash32(`corpus|${corpus}|${host}|${norm(query)}`)), r, { query, site, cs });
      out.push(r);
    }
    return out;
  }

  // ---- result corpora (widget trait corpus: 'products' | 'people' | 'apps' | 'any' = one of the three per episode):
  // the same search task over results that carry commerce / people / app metadata. r.meta = { kind, ... }:
  //   products { brand, price (USD minor units), rating (x10), reviews, date (ISO listed) }
  //   people   { name, email, location, job, company, date (ISO last active) }
  //   apps     { type, publisher, version, size (MB), rating (x10), date (ISO updated) }
  // resultMeta(spec, r) -> [[label, text], ...] formats them for a widget (prices through spec.money).
  const CORPORA = ['products', 'people', 'apps'];
  const APP_QUERIES = [['photo editor', 'Photo & Video'], ['video trimmer', 'Photo & Video'], ['habit tracker', 'Productivity'],
    ['budget planner', 'Finance'], ['expense tracker', 'Finance'], ['meditation timer', 'Health & Fitness'],
    ['step counter', 'Health & Fitness'], ['language flashcards', 'Education'], ['pdf scanner', 'Productivity'],
    ['recipe organizer', 'Food & Drink'], ['trail map', 'Travel'], ['sky guide', 'Education'], ['password vault', 'Utilities'],
    ['unit converter', 'Utilities'], ['podcast player', 'Music & Audio'], ['guitar tuner', 'Music & Audio'],
    ['sleep sounds', 'Health & Fitness'], ['to-do list', 'Productivity'], ['flight tracker', 'Travel'],
    ['bird identifier', 'Education']];
  const APP_TYPES = ['Productivity', 'Photo & Video', 'Finance', 'Health & Fitness', 'Education', 'Utilities', 'Travel',
    'Music & Audio', 'Food & Drink', 'Social', 'Games', 'Shopping', 'Weather', 'Sports', 'Entertainment',
    'News & Magazines', 'Lifestyle'];
  const APP_STEMS = ['Lumio', 'Pixa', 'Tallymate', 'Orbit', 'Zenly', 'Cobble', 'Nimbus', 'Fable', 'Quillo', 'Brisk', 'Kindle Leaf',
    'Mosaic', 'Tidal', 'Pocketly', 'Sparrow', 'Wander', 'Hearth', 'Ember', 'Glimmer', 'Plume', 'Lattice', 'Marlin',
    'Sundial', 'Tangent', 'Bramble', 'Cedar', 'Drift', 'Echo', 'Foxglove', 'Harbor'];
  const SIZES = [8, 12, 19, 24, 31, 47, 58, 76, 92, 120, 164];

  // A search query typed for a corpus, drawn from its own stream (spec.query becomes this, not the web query).
  function corpusQuery(rng, corpus, cs) {
    if (corpus === 'people') return C.personName(rng, cs).full;
    if (corpus === 'apps') return rng.pick(APP_QUERIES)[0];
    return C.pick(rng, C.PRODUCTS, cs).name.split(',')[0].replace(/\s*\(.*\)/, '').toLowerCase();
  }
  // USD price range of the catalog product a query names (a generic range for any other text).
  function productRange(query) {
    const q = norm(query);
    const p = C.PRODUCTS.find((x) => x.name.split(',')[0].replace(/\s*\(.*\)/, '').toLowerCase() === q);
    return p ? [Math.max(2, Math.floor(p.priceMin)), Math.max(3, Math.ceil(p.priceMax))] : [12, 220];
  }
  function randomDate(rng, from, to) {
    return fromDays(days(from) + rng.int(0, days(to) - days(from)));
  }
  const PRODUCT_SENTENCES = () => C.SENTENCE_GROUPS.product;

  function decorate(corpus, d, r, x) {
    const { query, site, cs } = x;
    const Q = C.titleCase(query);
    if (corpus === 'products') {
      const [lo, hi] = productRange(query);
      const scenario = d.pick([
        '', '', ' Pro', ' Classic', ' (2-pack)', ', Black', ', Large', ' - Value Pack', ' Plus', '(Mk III)',
        ', Type B', '- Series A'
      ]);
      r.title = `${site} ${Q}${scenario}`;
      r.desc = C.sample(d, PRODUCT_SENTENCES(), 1, cs).join(' ');
      r.meta = { kind: 'products', brand: site, price: shelfPrice(d, d.int(lo, hi), USD), rating: d.int(28, 50),
        reviews: d.pick([d.int(4, 90), d.int(40, 900), d.int(200, 9800)]), date: randomDate(d, '2024-01-10', '2026-09-30') };
    } else if (corpus === 'people') {
      const words = Q.split(' ');
      const last = words[words.length - 1];
      const first = words.length > 1 && d.bool(0.5) ? words[0] : C.personName(d, cs).first;
      const company = site;
      const domain = r.host.replace(/^(www|blog|shop|help|news)\./, '');
      const job = C.pick(d, C.JOB_TITLES, cs);
      const city = C.pick(d, C.CITIES, cs);
      const location = `${city.city}, ${city.region || city.countryCode}`;
      const handle = C.slug(`${first}.${last}`, '.') || 'contact';
      r.title = `${first} ${last}`;
      r.desc = `${job} at ${company}. Based in ${location}.`;
      r.meta = { kind: 'people', name: r.title, email: `${handle}@${domain}`, location, job, company,
        date: randomDate(d, '2025-06-01', '2026-10-01') };
    } else {
      const hit = APP_QUERIES.find((a) => a[0] === norm(query));
      const type = hit && d.bool(0.9) ? hit[1] : d.pick(APP_TYPES);
      const name = d.pick(APP_STEMS);
      r.title = `${name}: ${Q}`;
      r.desc = C.sample(d, PRODUCT_SENTENCES(), 1, cs).join(' ');
      r.meta = { kind: 'apps', type, publisher: site, version: `${d.int(1, 9)}.${d.int(0, 12)}.${d.int(0, 9)}`,
        size: d.pick(SIZES), rating: d.int(30, 49), date: randomDate(d, '2025-02-01', '2026-10-01') };
    }
  }
  function resultMeta(spec, r) {
    const m = r && r.meta;
    if (!m) return [];
    const stars = (x) => `${(x / 10).toFixed(1)}/5`;
    if (m.kind === 'products') return [['Brand', m.brand], ['Price', fmtMoney(m.price, spec.money)],
      ['Rating', `${stars(m.rating)} (${m.reviews.toLocaleString('en-US')})`]];
    if (m.kind === 'people') return [['Role', m.job], ['Location', m.location], ['Email', m.email],
      ['Last active', fmtDate(m.date, 'mdy')]];
    return [['Type', m.type], ['Publisher', m.publisher], ['Updated', fmtDate(m.date, 'mdy')], ['Rating', stars(m.rating)],
      ['Size', `${m.size} MB`]];
  }

  function sampleSearch(rng, opts) {
    const cs = { csplit: opts.csplit };
    const lv = levelOf(opts);
    const mode0 = rng.pick(['rank', 'rank', 'url']);
    const mode = lv === 'easy' ? 'rank' : mode0;
    const perPage = rng.int(3, 4);
    const pages = lv === 'easy' ? 2 : lv === 'medium' ? 3 : opts.ood ? rng.int(5, 7) : perPage === 4 ? 3 : rng.int(3, 4);
    const kind = rng.pick(['person', 'person', 'topic', 'product']);
    let query;
    if (kind === 'person') query = C.personName(rng, cs).full;
    else if (kind === 'topic') query = C.pick(rng, C.TOPICS, cs).toLowerCase();
    else query = C.pick(rng, C.PRODUCTS, cs).name.split(',')[0].replace(/\s*\(.*\)/, '').toLowerCase();
    const results = makeResults(rng, query, perPage * pages, opts.csplit);
    const target = lv === 'easy' ? rng.int(0, perPage - 1) : lv === 'medium' ? rng.int(0, 2 * perPage - 1) : rng.int(0, results.length - 1);
    const spec = { mode, engine: rng.pick(ENGINES), query, perPage, pages: Math.ceil(results.length / perPage), results,
      target, salt: rng.int(1, 1e9), enter: rng.bool(0.35) };
    if (opts.traits && opts.traits.corpus) {
      // The query and results come from a separate stream; counts, target, mode and the other draws stay.
      const cr = rng.fork('corpus');
      const c = CORPORA.includes(opts.traits.corpus) ? opts.traits.corpus : cr.pick(CORPORA);
      spec.corpus = c;
      spec.query = corpusQuery(cr.fork('query'), c, cs);
      spec.results = makeResults(cr.fork('results'), spec.query, results.length, opts.csplit, c);
    }
    if (opts.traits && opts.traits.infinite) infinitize(spec, rng.fork('infinite'), opts);
    return spec;
  }

  // Infinite scroll (widgets with traits.infinite): one scrolling list of rows rows; scrolling until the last
  // loaded result is fully in view starts a load of spec.infinite.beat ms on the kit clock, then the next
  // batch of spec.perPage results appears. spec.pages is the number of batches; the target may be anywhere.
  function infinitize(spec, rng, opts) {
    const rows = spec.perPage;
    const batch = rows + rng.int(1, 2);
    const batches = opts.ood ? rng.int(4, 6) : rng.int(3, 4);
    spec.results = makeResults(rng, spec.query, batch * batches, opts.csplit, spec.corpus);
    Object.assign(spec, { rows, perPage: batch, pages: batches, route: rng.bool(0.5) ? 'wheel' : 'thumb',
      infinite: { rows, batch, beat: rng.pick(opts.ood ? [1200, 1800, 2400] : [600, 900, 1300]) } });
    spec.target = rng.int(0, spec.results.length - 1);
    if (spec.mode === 'url') {
      const hosts = spec.results.map((r) => r.host);
      if (hosts.filter((h) => h === hosts[spec.target]).length !== 1) spec.mode = 'rank';
    }
  }
  // The load the kit clock would start (and finish) once the last loaded result is in view.
  const infAtBottom = (m, spec) => m.loaded > spec.rows && m.scroll >= m.loaded - spec.rows - 0.02;
  function infMore(m, spec) {
    if (m.query !== null && !m.pick && !(m.loading > 0) && m.loaded < spec.results.length && infAtBottom(m, spec)) m.loading = spec.infinite.beat;
    return m;
  }
  function infFinish(m, spec) {
    m.loading = 0;
    m.loaded = Math.min(spec.results.length, m.loaded + spec.infinite.batch);
    return m;
  }
  const searchGo = (m, spec) => ({ ...m, query: m.text, page: 0, pick: null,
    ...(spec.infinite ? { loaded: spec.infinite.batch, loading: 0, scroll: 0 } : {}) });

  const isRealQuery = (spec, q) => q !== null && q !== undefined && norm(q) === norm(spec.query);
  function resultsFor(spec, query) {
    if (isRealQuery(spec, query)) return spec.results;
    const rng = new env.Rng(hash32(`${spec.salt}|${norm(query)}`));
    return makeResults(rng, String(query).trim() || 'search', spec.perPage * spec.pages, spec.csplit, spec.corpus);
  }
  const searchRight = (spec, pick) => !!pick && pick.real && pick.index === spec.target;

  const SEARCH_RANK = [
    'Search for {q} and open the {pos} result.',
    'I need the {pos} search result for {q}.',
    'Look up {q} and open result number {n}.',
    'Look up {q}; the {pos} result is the one I want.',
    'Find the {pos} result overall for {q}.',
    'Run a search for {q}; I need the {pos} result opened.',
    'Search {q}, then open whichever result comes {pos}.',
    'For {q}, open the result ranked {pos}.',
    'Use {q} as the query. Open the {pos} match.',
    'Search {q}. Result {n} overall is my choice.',
    'Open entry {n} in the full search list for {q}.',
    'Please search {q}; take me to the {pos} match.',
    'With query {q}, open match {n} overall.',
    'Search {q}; count from the top to open result {n}.',
    'After searching {q}, open the {pos} hit.',
    'Search {q}. Open the result at position {n}.',
    'Please open what comes {pos} in a {q} search.',
    '{q} is my query; open its {pos} result.',
    'From a {q} search, bring up hit {n} overall.',
  ];
  const SEARCH_URL = [
    'Find the {host} page about {q}.',
    'Look up {q} and open the page hosted on {host}.',
    'Look up {q} and open the link that points to {host}.',
    'Search {q} and go to the {host} result.',
    'Among the results for {q}, open the one hosted on {host}.',
    'Search the web for {q}. I want the page from {host}.',
    'Find the {host} page in the results for {q} and open it.',
    'Search {q}. The result to open has host {host}.',
    'Start a search for {q}, then follow a {host} link.',
    'Open a search match for {q} whose host is {host}.',
    'Open a {host} page returned by a {q} search.',
    'Search {q}. A {host} result is what I want opened.',
    'I want to visit {host} through a search for {q}.',
    'Once {q} is searched, open a result from {host}.',
    'Bring up a {host} result by searching for {q}.',
    'The host should be {host} for the {q} result you open.',
  ];

  const ABSENT_HOSTS = ['zephyrnotes.org', 'brightharbor.net', 'quillandcrow.com', 'tallowmill.io', 'northgatelabs.co'];
  const hostLabel = (h) => { const parts = h.replace(/^www\./, '').split('.'); return parts[Math.max(0, parts.length - 2)]; };

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { resultsFor, resultMeta });

  const INFINITE = { more: infMore, finish: infFinish };

  env.scenario('use-shop', {
    name: 'search',
    sample: sampleSearch,
    sigma: 0.5,
    init(spec, r) {
      const mode = spec.startMode;
      const m = { text: '', query: null, page: 0, pick: null, wrongs: 0 };
      if (spec.infinite) Object.assign(m, { loaded: spec.infinite.batch, loading: 0, scroll: 0 });
      const tp = Math.floor(spec.target / spec.perPage);
      if (mode === 'partial') {
        m.text = spec.query;
        if (spec.pages > 1 && r.bool(0.5)) {
          m.query = spec.query;
          if (!spec.infinite) m.page = (tp + r.int(1, spec.pages - 1)) % spec.pages;
        }
      } else if (mode === 'scene') {
        // The reference screen: the query submitted, its results listed (the target's page), nothing picked.
        m.text = m.query = spec.query;
        if (!spec.infinite) m.page = tp;
      } else if (mode === 'wrong') {
        if (spec.recoverable && r.bool(0.5)) {
          const onPage = [...Array(spec.perPage).keys()].map((k) => (spec.infinite ? 0 : tp) * spec.perPage + k).filter((i) => i !== spec.target && i < spec.results.length);
          const idx = onPage.length ? r.pick(onPage) : (spec.target + 1) % spec.results.length;
          Object.assign(m, { text: spec.query, query: spec.query, page: spec.infinite ? 0 : Math.floor(idx / spec.perPage), pick: { real: true, index: idx }, wrongs: 1 });
        } else {
          const words = spec.query.split(' ');
          const wrong = words.length > 1 ? words.slice(0, -1).join(' ') : `${spec.query} ${r.pick([
            'reviews', 'near me', 'price', 'manuals', 'images', 'videos', 'history', 'support', 'online', 'deals',
            'meaning', 'forums'
          ])}`;
          Object.assign(m, { text: wrong, query: wrong });
        }
      }
      return m;
    },
    error(m, spec) {
      if (m.pick) return searchRight(spec, m.pick) ? 0 : 1;
      let e = 1;
      if (norm(m.text) === norm(spec.query)) e -= 0.15;
      if (isRealQuery(spec, m.query)) {
        e -= 0.25;
        if (spec.infinite ? m.loaded > spec.target : Math.floor(spec.target / spec.perPage) === m.page) e -= 0.2;
      }
      return e;
    },
    purchased: (m) => !!m.pick,
    prepared: (m, spec, e) => (m.pick ? e : Math.max(0, e - 0.4)),
    ended: (m, spec, last) => (m.pick && !searchRight(spec, m.pick) && last ? 'wrong-choice' : null),
    plan(m, spec) {
      if (m.pick) return { click: { back: true } };
      if (!isRealQuery(spec, m.query)) {
        if (norm(m.text) !== norm(spec.query)) return { type: [{ field: 'search' }, spec.query] };
        return spec.enter && m.focus === 'search' ? { key: 'Enter', on: 'search' } : { click: { button: 'search' } };
      }
      if (spec.infinite) {
        // Scroll to the last loaded result (the next batch loads once it is in view), until the target is loaded.
        if (spec.target >= m.loaded) return m.loading > 0 ? { wait: true } : reveal(m, spec, m.loaded - 1, m.loaded, spec.rows) || { wait: true };
        return reveal(m, spec, spec.target, m.loaded, spec.rows) || { click: { result: spec.target } };
      }
      const p = Math.floor(spec.target / spec.perPage);
      if (m.page !== p) return { click: { page: p } };
      return { click: { result: spec.target } };
    },
    apply(m, spec, step) {
      const done = listStep(m, spec, step, (mm) => mm.loaded || 0, spec.infinite ? INFINITE : null);
      if (done) return done;
      if (step.type) {
        m.text = step.type[1];
        return m;
      }
      if (step.key === 'Enter') return m.text.trim() ? searchGo(m, spec) : m;
      const t = step.click;
      if (!t) return m;
      if (t.button) return m.text.trim() ? searchGo(m, spec) : m;
      if (t.back) return { ...m, pick: null };
      if (t.page !== undefined) return { ...m, page: t.page };
      if (t.pager) return { ...m, page: clamp(m.page + (t.pager === 'next' ? 1 : -1), 0, spec.pages - 1) };
      if (t.result !== undefined) {
        const pick = { real: isRealQuery(spec, m.query), index: t.result };
        return { ...m, pick, wrongs: m.wrongs + (searchRight(spec, pick) ? 0 : 1) };
      }
      return m;
    },
    tick(m, spec, dt) {
      if (spec.infinite) {
        if (m.loading > 0) return m.loading > dt ? { ...m, loading: m.loading - dt } : infFinish({ ...m }, spec);
        const n = infMore({ ...m }, spec);
        return n.loading > 0 ? n : m;
      }
      return loadingTick(m, dt);
    },
    instruction(spec, rng) {
      const q = quote(spec.query);
      if (spec.mode === 'url') {
        const host = spec.results[spec.target].host;
        return sayIt(spec, rng, SEARCH_URL, { q, host }, { terse: `${q}: open ${host}`,
          steps: [`search for ${q}`, `open the result from ${host}`] });
      }
      const pos = ORD(spec.target + 1);
      const rank = spec.infinite ? SEARCH_RANK.filter((t) => !/across pages/.test(t)) : SEARCH_RANK;
      return sayIt(spec, rng, rank, { q, pos, n: spec.target + 1 }, { terse: `${q}, result #${spec.target + 1}`,
        steps: [`search for ${q}`, 'run the search', `open the ${pos} result`] });
    },
    confirmVerb: 'open the result',
    confirmAsk: 'open that result',
    ambiguous(jr, spec) {
      const t = spec.results[spec.target];
      const others = spec.results.filter((r, i) => i !== spec.target && r.host !== t.host);
      const u = jr.pick(others);
      u.title = t.title;
      const words = (r) => [r.host.replace(/^www\./, ''), hostLabel(r.host)];
      const taken = new Set([...words(t), ...words(u)].map((x) => x.toLowerCase()));
      const rest = spec.results.filter((r) => r !== t && r !== u).map(words).filter((w) => !w.some((x) => taken.has(x.toLowerCase())));
      return { mode: 'ambiguous', cands: [words(t), words(u)], others: rest,
        message: `Two results are titled "${t.title}": one from ${t.host.replace(/^www\./, '')} and one from ${u.host.replace(/^www\./, '')}. Which one should I open?`,
        templates: ['Search for {q} and open the result titled {title}.', 'Look up {q} and open the result called {title}.',
          'Find the result titled {title} for {q}.',
          '{title} is the result to open after searching {q}.',
          'Search {q}. The title to open is {title}.',
          'Open a match for {q} with the title {title}.',
          'I want {title} opened from a search for {q}.',
          'Run a {q} search. Open a match named {title}.'],
        vars: { q: quote(spec.query), title: quote(t.title) }, terse: `${quote(spec.query)}: open ${quote(t.title)}` };
    },
    impossible(jr, spec) {
      const have = new Set(spec.results.map((r) => r.host.replace(/^www\./, '')));
      const host = jr.pick(ABSENT_HOSTS.filter((h) => !have.has(h)));
      return { mode: 'impossible', what: [host, hostLabel(host)], message: `I can't do that: none of the results for ${quote(spec.query)} is hosted on ${host}.`,
        templates: SEARCH_URL, vars: { q: quote(spec.query), host }, terse: `${quote(spec.query)}: open ${host}` };
    },
    parts: (m) => [{ name: 'Search box', value: m.text }, { name: 'Search results', value: [m.query, m.page, m.loaded ?? null] },
      { name: 'Opened result', value: m.pick }],
    // selfTest: every other search is an infinite-scroll widget, two thirds have a corpus
    testTraits: (seed) => ({ ...(seed % 2 === 1 ? { infinite: true } : {}),
      ...(seed % 3 !== 2 ? { corpus: ['products', 'people', 'apps', 'any'][seed % 4] } : {}) }),
    checkSpec(spec, traits, tag, fails) {
      if (traits.corpus) {
        if (!spec.corpus || spec.results.some((r) => !r.meta || r.meta.kind !== spec.corpus)) fails.push(`${tag}: corpus meta missing`);
        else if (!resultMeta(spec, spec.results[0]).every(([a, b]) => a && String(b) && !/undefined|NaN/.test(b))) fails.push(`${tag}: bad corpus meta`);
        if (new Set(spec.results.map((r) => r.host)).size !== spec.results.length) fails.push(`${tag}: corpus hosts not unique`);
      }
      if (spec.mode === 'url') {
        const h = spec.results[spec.target].host;
        if (spec.results.filter((r) => r.host === h).length !== 1) fails.push(`${tag}: host not unique`);
      }
    },
  });
})();
