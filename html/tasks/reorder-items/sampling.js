/* reorder-items/sampling.js: item banks, rules and board sampling; loaded through the task's files list. */
(function () {
  'use strict';
  const C = env.content;
  const lib = env.taskOf('reorder-items').lib;
  const { CATEGORIES, STAGING, SCENARIOS, sampleMove, goalOrder } = lib;

  // Product categories that do not overlap (at most one per confusable group).
  const CAT_GROUPS = [['electronics'], ['grocery'], ['clothing'], ['books'], ['toys'], ['pets'], ['auto'],
    ['music'], ['office'], ['sports'], ['baby'], ['home', 'kitchen', 'garden', 'tools'], ['health', 'beauty']];
  const MONTHS = C.MONTHS;
  const MON3 = MONTHS.map((m) => m.slice(0, 3));
  const PRIORITIES = [
    { tag: 'Critical', color: '#c92a2a' }, { tag: 'High', color: '#e8590c' },
    { tag: 'Medium', color: '#1971c2' }, { tag: 'Low', color: '#868e96' },
  ];
  const LEGEND_SETS = [
    { title: 'Packing order', tags: [
      'Fragile', 'Frozen', 'Standard', 'Bulky', 'Oversize', 'Liquids', 'Upright', 'Padded', 'Sealed', 'Magnetic',
      'Scented', 'Vented', 'Nestable', 'Rolled', 'Bundled', 'Powdered', 'Hanging', 'Reusable', 'Crated', 'Waxed'
    ] },
    { title: 'Release order', tags: [
      'Team Falcon', 'Team Otter', 'Team Heron', 'Team Lynx', 'Team Wren', 'Team Hare', 'Team Wolf', 'Team Seal',
      'Team Carp', 'Team Dove', 'Team Mole', 'Team Lark', 'Team Tern', 'Team Boar', 'Team Newt', 'Team Badger',
      'Team Finch', 'Team Wasp', 'Team Ibex', 'Team Elk'
    ] },
    { title: 'Review order', tags: [
      'Legal', 'Design', 'Finance', 'Security', 'Marketing', 'Support', 'Product', 'Research', 'Sales', 'Quality',
      'Sourcing', 'Payroll', 'Admin', 'Events', 'Content', 'Planning', 'Training', 'Logistics', 'Intake'
    ] },
    { title: 'Route', tags: [
      'North depot', 'Harbor', 'Old town', 'Airport', 'University', 'Mill Road', 'Maple Row', 'Cedar Row',
      'East Gate', 'Lake Path', 'West End', 'Stone Way', 'Oak Lane', 'Elm Walk', 'Parkside', 'Town Hall', 'Market Sq',
      'Creekway', 'Pine Court', 'Theater'
    ] },
    { title: 'Key', tags: ['Red', 'Blue', 'Green', 'Orange', 'Purple', 'Yellow', 'Pink', 'Teal', 'Brown', 'Gray'] },
    { title: 'Stockroom', tags: ['Canvas', 'Cork', 'Felt', 'Glass', 'Rubber'] },
    { title: 'Art queue', tags: ['Ink study', 'Mosaic', 'Clay bust', 'Collage', 'Etching'] },
    { title: 'Garden beds', tags: ['Fern patch', 'Clover', 'Heather', 'Moss bank', 'Ivy wall'] },
    { title: 'Music lineup', tags: ['Cello duo', 'Flute trio', 'Drum solo', 'Harp', 'Oboe solo'] },
    { title: 'Snack trays', tags: ['Pretzel', 'Muffin', 'Cracker', 'Waffle', 'Biscuit'] },
    { title: 'Game tables', tags: ['Chess', 'Dominoes', 'Darts', 'Marbles', 'Checkers'] },
    { title: 'Cargo bays', tags: ['Anchor', 'Compass', 'Lantern', 'Paddle', 'Rope'] },
    { title: 'Study rooms', tags: ['Comet room', 'Meteor den', 'Nebula lab', 'Orbit hall', 'Quasar wing'] },
    { title: 'Craft queue', tags: ['Weaving', 'Stitching', 'Carving', 'Welding', 'Folding'] },
    { title: 'Booth map', tags: ['Kite hut', 'Mask', 'Puppet', 'Ribbon', 'Bell'] },
    { title: 'Sky motifs', tags: ['Drizzle', 'Snowfall', 'Breeze', 'Thunder', 'Sunburst'] },
    { title: 'Rock shelf', tags: ['Granite', 'Basalt', 'Limestone', 'Pumice', 'Obsidian'] },
    { title: 'Prop racks', tags: ['Goblet', 'Stage fan', 'Crown', 'Scepter', 'Hourglass'] },
    { title: 'Trail map', tags: ['Canyon', 'Waterfall', 'Footbridge', 'Cavern', 'Wetland'] },
    { title: 'Pattern bin', tags: ['Chevron', 'Paisley', 'Zigzag', 'Stripes', 'Lattice'] },
  ];
  const TAG_COLORS = ['#e03131', '#1c7ed6', '#2f9e44', '#f76707', '#7048e8', '#0c8599', '#d6336c'];
  const asciiOnly = (s) => /^[A-Za-z][A-Za-z' -]*$/.test(s);

  // ---------------------------------------------------------------- dates

  function isoDate(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    const d = rng.int(1, 28);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  function fmtDate(iso, style, locale) {
    return C.formatDate(iso, locale, style);
  }

  // File sizes as text -> bytes.
  function sizeBytes(s) {
    const m = /([\d.]+)\s*(KB|MB|GB)/.exec(s);
    if (!m) return 0;
    return Number(m[1]) * { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }[m[2]];
  }

  // ---------------------------------------------------------------- items

  const ids = (n) => Array.from({ length: n }, (_, i) => `r${i}`);

  // Distinct titles drawn from a bank (string list or mapper), filtered.
  function distinct(rng, list, n, cs, map = (x) => x, ok = () => true) {
    const pool = C.split(list, cs).map(map).filter(ok);
    const seen = new Set();
    const out = [];
    for (const t of rng.shuffle(pool)) {
      const k = String(t && typeof t === 'object' ? t.name : t).toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(t);
      if (out.length === n) break;
    }
    return out;
  }

  // Items for a sort rule: labels { id: {...} } and numeric keys { id: key } (ties only for priority/legend).
  function sampleRuleItems(rng, kind, n, cs, scenario) {
    const id = ids(n);
    const labels = {};
    const key = {};
    const extra = {};
    if (kind === 'number') {
      const s = new Set();
      const hi = rng.pick([99, 99, 999, 9999]);
      while (s.size < n) s.add(rng.int(1, hi));
      [...s].forEach((v, i) => { labels[id[i]] = { title: hi > 999 ? v.toLocaleString('en-US') : String(v) }; key[id[i]] = v; });
    } else if (kind === 'month') {
      const ms = rng.sample(MONTHS, n);
      const short = rng.bool(0.3);
      ms.forEach((m, i) => { labels[id[i]] = { title: short ? m.slice(0, 3) : m }; key[id[i]] = MONTHS.indexOf(m); });
    } else if (kind === 'alpha') {
      const src = rng.pick(['first', 'city', 'last']);
      const bank = src === 'city' ? C.CITIES.map((c) => c.city) : src === 'last' ? C.LAST_NAMES : C.FIRST_NAMES;
      // Distinct first letters keep the order unambiguous under any collation.
      const names = [];
      const letters = new Set();
      for (const t of rng.shuffle(C.split(bank, cs))) {
        if (!asciiOnly(t) || t.length > 14 || letters.has(t[0].toUpperCase())) continue;
        letters.add(t[0].toUpperCase());
        names.push(t);
        if (names.length === n) break;
      }
      names.forEach((t, i) => { labels[id[i]] = { title: t }; key[id[i]] = t.toUpperCase().charCodeAt(0); });
      extra.alphaSrc = src;
    } else if (kind === 'price') {
      const prods = distinct(rng, C.PRODUCTS, 4 * n, cs, (p) => p, (p) => p.name.length <= (scenario === 'grid' ? 40 : 34));
      const seen = new Set();
      let i = 0;
      for (const p of prods) {
        const pr = C.price(rng, p);
        if (seen.has(pr.amount)) continue;
        seen.add(pr.amount);
        labels[id[i]] = { title: p.name, value: pr.text.startsWith('$') ? pr.text : `$${pr.amount.toFixed(2)}` };
        key[id[i]] = pr.amount;
        if (++i === n) break;
      }
    } else if (kind === 'date') {
      const style = rng.pick(['medium', 'medium', 'long', 'iso']);
      const locale = rng.pick(['en-US', 'en-US', 'en-GB']);
      const what = rng.pick(['invoice', 'event', 'order']);
      const seen = new Set();
      let i = 0;
      const y0 = rng.int(2023, 2026);
      const span = rng.bool(0.6) ? 0 : 1;
      while (i < n) {
        const iso = isoDate(rng, y0, y0 + span);
        if (seen.has(iso)) continue;
        seen.add(iso);
        let title;
        if (what === 'invoice') title = `Invoice ${C.invoiceId(rng)}`;
        else if (what === 'order') title = `Order ${C.orderId(rng)}`;
        else title = C.pick(rng, ['Team offsite', 'Quarterly review', 'Dentist', 'Product launch', 'Board meeting',
          'Tax deadline', 'Lease renewal', 'Flight to Lisbon', 'Kickoff call', 'Training day', 'Site visit',
          'Contract signing', 'Audit', 'Workshop', 'Webinar', 'Inventory count', 'Open house', 'Recital',
          'Gallery opening', 'Garden tour', 'Photo session', 'New hire welcome', 'Safety briefing', 'Book club',
          'Studio recording', 'Permit pickup', 'Science fair', 'Craft market', 'Family reunion', 'Equipment demo',
          'Poetry reading', 'Cooking class', 'River cruise', 'Costume fitting', 'Museum visit', 'Charity auction',
          'Choir practice', 'Moving day', 'Park concert', 'Farmers market', 'Portrait sitting', 'Ceramics lesson',
          'Pet adoption day', 'Choir audition', 'Roof inspection', 'Story hour', 'Map workshop', 'Garden planting',
          'Budget planning', 'Chess tournament', 'Studio tour', 'Piano lesson', 'Bike fitting', 'Puzzle night',
          'Bread tasting', 'Pottery glazing', 'Resume review', 'Mentor session', 'Design critique', 'Project handoff',
          'Data migration', 'Network upgrade', 'Fire drill', 'Baby shower', 'Recipe swap', 'Seed exchange',
          'Trail hike', 'Stargazing night', 'Lighthouse visit', 'Ferry departure', 'Harbor cleanup',
          'Volunteer signup', 'Orchard harvest', 'Candle making', 'Sewing circle', 'Film screening', 'Dance rehearsal',
          'Band practice', 'Book fair', 'Trailhead meetup', 'Kayak lesson', 'Sailing lesson', 'Bicycle repair',
          'Car inspection', 'Tree planting', 'Compost workshop', 'Quilt display', 'Flower arranging', 'Tea tasting',
          'Cheese making', 'Soup supper', 'Cider pressing', 'Harvest supper', 'Lantern walk', 'Moonlight paddle'], cs);
        labels[id[i]] = { title, value: fmtDate(iso, style, locale) };
        key[id[i]] = Number(iso.replace(/-/g, ''));
        i++;
      }
      // Event titles may repeat; make them unique with a counter.
      const seenT = {};
      for (const k of id) {
        const t = labels[k].title;
        seenT[t] = (seenT[t] || 0) + 1;
        if (seenT[t] > 1) labels[k].title = `${t} ${seenT[t]}`;
      }
      extra.dateWhat = what;
    } else if (kind === 'size') {
      const seen = new Set();
      let i = 0;
      for (let guard = 0; i < n && guard < 400; guard++) {
        const ext = C.pick(rng, C.FILE_EXTENSIONS, { csplit: cs });
        const name = C.fileName(rng, ext.ext, { csplit: cs });
        const size = C.fileSize(rng, ext.kind);
        const b = sizeBytes(size);
        if (!b || seen.has(b) || name.length > 34) continue;
        seen.add(b);
        labels[id[i]] = { title: name, value: size };
        key[id[i]] = b;
        i++;
      }
    } else if (kind === 'priority') {
      const subjects = distinct(rng, C.EMAIL_SUBJECTS, n, cs, (s) => s.replace(/^(Re|Fwd): /i, ''), (s) => s.length <= 40);
      // Every level used at most n - 1 times and at least two levels present.
      let tags;
      do tags = id.map(() => rng.int(0, 3)); while (new Set(tags).size < Math.min(3, n - 1));
      id.forEach((k, i) => {
        labels[k] = { title: subjects[i % subjects.length], tag: PRIORITIES[tags[i]].tag, color: PRIORITIES[tags[i]].color };
        key[k] = tags[i];
      });
    } else if (kind === 'legend') {
      const set = rng.pick(LEGEND_SETS);
      const m = rng.int(3, Math.min(4, n - 1));
      const tagNames = rng.sample(set.tags, m);
      const colors = rng.sample(TAG_COLORS, m);
      const legend = tagNames.map((tag, i) => ({ tag, color: set.title === 'Key' ? C.COLORS[tag.toLowerCase()] || colors[i] : colors[i] }));
      let tags;
      do tags = id.map(() => rng.int(0, m - 1)); while (new Set(tags).size < m);
      const titles = rng.bool(0.5)
        ? distinct(rng, C.PRODUCTS, n, cs, (p) => p.name, (s) => s.length <= 30)
        : id.map(() => `Order ${C.orderId(rng)}`);
      id.forEach((k, i) => {
        labels[k] = { title: titles[i % titles.length], tag: legend[tags[i]].tag, color: legend[tags[i]].color };
        key[k] = tags[i];
      });
      extra.legend = legend;
      extra.legendTitle = set.title;
    }
    return { items: id.slice(0, Object.keys(labels).length), labels, key, ...extra };
  }

  // Items for a move goal: short titles of one kind.
  function sampleMoveItems(rng, n, cs) {
    const src = rng.pick(['fruit', 'first', 'city', 'product', 'file', 'task']);
    let titles;
    if (src === 'fruit') titles = rng.sample([...CATEGORIES.Fruit, ...CATEGORIES.Animal, ...CATEGORIES.Tool].map(C.cap), n);
    else if (src === 'first') titles = distinct(rng, C.FIRST_NAMES, n, cs, (x) => x, asciiOnly);
    else if (src === 'city') titles = distinct(rng, C.CITIES, n, cs, (c) => c.city, (s) => s.length <= 16);
    else if (src === 'product') titles = distinct(rng, C.PRODUCTS, n, cs, (p) => p.name, (s) => s.length <= 26 && !/"/.test(s));
    else if (src === 'file') titles = Array.from({ length: n }, () => C.fileName(rng, undefined, { csplit: cs })).filter((s) => s.length <= 30);
    else titles = distinct(rng, C.EMAIL_SUBJECTS, n, cs, (s) => s.replace(/^(Re|Fwd): /i, ''), (s) => s.length <= 32 && !/"/.test(s));
    titles = [...new Set(titles)];
    while (titles.length < n) titles.push(`${C.cap(rng.pick(C.WORDS))} ${titles.length + 1}`);
    const id = ids(n);
    const labels = {};
    id.forEach((k, i) => { labels[k] = { title: titles[i] }; });
    return { items: id, labels, src };
  }

  // opts.route (episode knob): 'keyboard' turns the keyboard route on (list, grid, move; pinned items are not
  // sampled then), 'pointer' turns keyboard input off. Applied after the unforced draws.
  function forceRoute(spec, opts) {
    if (opts.route === 'keyboard') { spec.keys = true; spec.route = 'keys'; }
    else if (opts.route === 'pointer') { spec.keys = false; spec.route = 'drag'; }
    return spec;
  }

  // ---------------------------------------------------------------- kanban

  function sampleKanban(rng, opts, spec) {
    const cs = spec.csplit;
    const ood = spec.ood;
    // opts.route 'wheel' forces a scrolling board (draws stay aligned with the unforced sampling).
    const wide = ood || rng.bool(0.45) || opts.route === 'wheel';
    const k0 = ood ? rng.int(5, 6) : wide ? rng.int(4, 5) : rng.int(2, 3);
    const bs = (opts.traits && opts.traits.boardSize) || {};
    const lv = spec.level;
    const k = bs.columns || (lv ? (lv === 'easy' ? 2 : 3) : k0);
    const pane = k >= 4;
    const perColumn = bs.perColumn ? bs.perColumn : lv ? 2 : ood ? rng.int(2, 3) : pane ? 2 : rng.int(2, 3);
    const useProducts = rng.bool(0.75);
    const columns = [];
    const colLabels = {};
    const member = {};
    const labels = {};
    const keyOf = {};
    let n = 0;
    if (useProducts) {
      const groups = rng.sample(CAT_GROUPS, k);
      for (const g of groups) {
        const cat = rng.pick(g);
        const label = C.PRODUCT_CATEGORIES.find((c) => c.id === cat).label;
        columns.push(cat);
        colLabels[cat] = label;
        const prods = distinct(rng, C.PRODUCTS.filter((p) => p.category === cat), perColumn, cs, (p) => p, (p) => p.name.length <= 30);
        const seen = new Set();
        for (const p of prods) {
          const id = `k${n++}`;
          let pr = C.price(rng, p);
          while (seen.has(pr.amount)) pr = { ...pr, amount: pr.amount + 1, text: `$${(pr.amount + 1).toFixed(2)}` };
          seen.add(pr.amount);
          labels[id] = { title: p.name, value: pr.text.startsWith('$') ? pr.text : `$${pr.amount.toFixed(2)}` };
          keyOf[id] = pr.amount;
          member[id] = cat;
        }
      }
    } else {
      for (const c of rng.sample(Object.keys(CATEGORIES), Math.min(k, 4))) {
        columns.push(c);
        colLabels[c] = c;
        for (const w of rng.sample(CATEGORIES[c], perColumn)) {
          const id = `k${n++}`;
          labels[id] = { title: C.cap(w) };
          keyOf[id] = w;
          member[id] = c;
        }
      }
    }
    const ordered = rng.bool(ood ? 0.6 : 0.4) && !lv;
    const orderRule = useProducts ? rng.pick(['price-asc', 'price-desc', 'alpha']) : 'alpha';
    const colGoal = {};
    if (ordered) {
      for (const c of columns) {
        const its = Object.keys(member).filter((id) => member[id] === c);
        colGoal[c] = its.slice().sort((a, b) => (orderRule === 'alpha'
          ? labels[a].title.localeCompare(labels[b].title, 'en')
          : orderRule === 'price-asc' ? keyOf[a] - keyOf[b] : keyOf[b] - keyOf[a]));
      }
    }
    const out = { ...spec, columns, colLabels, member, labels, items: rng.shuffle(Object.keys(member)), ordered,
      orderRule: ordered ? orderRule : null, colGoal: ordered ? colGoal : null, pane,
      route: rng.bool(0.5) ? 'wheel' : 'thumb', keys: false, dragScroll: !!(opts.traits && opts.traits.dragScroll) };
    if (opts.route === 'wheel') out.route = 'wheel';
    else if (opts.route === 'pointer') out.route = 'thumb';
    if (opts.traits && opts.traits.wheelPane) out.route = 'wheel';
    if (opts.traits && opts.traits.cardMeta) addCardMeta(rng.fork('meta'), out, useProducts);
    if (opts.traits && opts.traits.staging) out.staging = STAGING;
    return out;
  }

  // Multi-line card content for widgets with traits.cardMeta (own rng stream, so other draws do not move):
  // labels[id].meta = [line, line] (reference code, stock or due date, owner), labels[id].badges =
  // [{ text, color }] (status labels that never name a category), labels[id].who = initials. None of it
  // hints at the card's column or at the in-column order (prices stay in labels[id].value only).
  const BADGES = [['New', '#2f9e44'], ['Restock', '#1971c2'], ['Low stock', '#e8590c'], ['Backorder', '#c92a2a'],
    ['Review', '#7048e8'], ['Bundle', '#0c8599'], ['Gift', '#d6336c'], ['Clearance', '#868e96']];
  function addCardMeta(rng, spec, products) {
    const cs = { csplit: spec.csplit };
    for (const id of spec.items) {
      const lab = spec.labels[id];
      const p = C.personName(rng, cs);
      const due = `${MON3[rng.int(0, 11)]} ${rng.int(1, 28)}`;
      const ref = products ? `SKU ${C.sku(rng)}` : `#${rng.int(100, 999)}`;
      const second = products
        ? rng.pick([`${rng.int(0, 48)} in stock`, `Ships ${due}`, `Supplier: ${C.pick(rng, C.COMPANIES, cs)}`])
        : rng.pick([`Added ${due}`, `${rng.int(1, 9)} comments`, `Due ${due}`]);
      lab.meta = [ref, `${second} · ${p.first} ${p.last[0]}.`];
      lab.badges = rng.sample(BADGES, rng.int(0, 2)).map(([text, color]) => ({ text, color }));
      lab.who = (p.first[0] + p.last[0]).toUpperCase();
    }
  }

  function sampleSpec(rng, opts) {
    const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS);
    const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode };
    const lv = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
    if (lv) base.level = lv;
    const cs = { csplit: base.csplit };
    if (scenario === 'kanban') return sampleKanban(rng, opts, base);
    if (scenario === 'move') {
      let n = base.ood ? rng.int(8, 10) : rng.int(5, 7);
      if (lv) n = lv === 'easy' ? 5 : rng.fork('level').int(5, 6);
      const it = sampleMoveItems(rng.fork('items'), n, cs);
      const start = rng.shuffle(it.items);
      const { mv, goal } = sampleMove(rng, start, lv ? ['top', 'bottom', 'after', 'before'] : null);
      const rank = Object.fromEntries(goal.map((id, i) => [id, i]));
      const keys = rng.bool(0.25);
      const spec = { ...base, items: it.items, labels: it.labels, src: it.src, rule: { kind: 'move' }, rank, goal, start, move: mv,
        locked: null, legend: null, cols: 1, keys, route: keys && rng.bool(0.6) ? 'keys' : 'drag' };
      return forceRoute(spec, opts);
    }
    const grid = scenario === 'grid';
    let n = grid ? (base.ood ? rng.int(10, 15) : rng.int(6, 9)) : (base.ood ? rng.int(8, 11) : rng.int(4, 7));
    // The keyboard route moves one place per key press: keep the board small enough for the action budget.
    if (opts.route === 'keyboard') n = Math.min(n, base.ood ? 8 : 7);
    if (lv) n = grid ? (lv === 'easy' ? 6 : 7) : (lv === 'easy' ? 4 : rng.fork('level').int(4, 5));
    const kinds = grid
      ? [['number', 2], ['month', 1.5], ['alpha', 1.5], ['price', 1.5], ['date', 1.5], ['size', 1]]
      : [['number', 1], ['month', 1], ['alpha', 1.2], ['price', 1.6], ['date', 1.6], ['size', 1.2], ['priority', 1.2], ['legend', 1.2]];
    const kind = C.weighted(rng, kinds);
    const it = sampleRuleItems(rng.fork('items'), kind, n, cs, scenario);
    const dir = kind === 'legend' ? 'asc' : rng.bool(kind === 'alpha' || kind === 'month' ? 0.75 : 0.55) ? 'asc' : 'desc';
    const rank = {};
    for (const id of it.items) rank[id] = dir === 'asc' ? it.key[id] : -it.key[id];
    if (kind === 'priority') for (const id of it.items) rank[id] = dir === 'asc' ? it.key[id] : -it.key[id];
    const spec = { ...base, items: it.items, labels: it.labels, rule: { kind, dir }, rank, legend: it.legend || null,
      legendTitle: it.legendTitle || null, alphaSrc: it.alphaSrc || null, dateWhat: it.dateWhat || null, locked: null,
      cols: grid ? (base.ood ? rng.pick([4, 5]) : n <= 6 ? 3 : rng.pick([3, 4])) : 1 };
    if (!grid && rng.bool(0.3) && opts.route !== 'keyboard' && !lv) {
      const k = rng.int(1, it.items.length >= 6 ? 2 : 1);
      const pinned = rng.sample(it.items, k);
      const idx = rng.sample(it.items.map((_, i) => i), k);
      spec.locked = Object.fromEntries(pinned.map((id, i) => [id, idx[i]]));
    }
    spec.keys = !spec.locked && n <= 7 && rng.bool(0.25);
    spec.route = spec.keys && rng.bool(0.6) ? 'keys' : 'drag';
    forceRoute(spec, opts);
    spec.goal = goalOrder(spec);
    return spec;
  }

  Object.assign(lib, { sampleSpec });
})();
