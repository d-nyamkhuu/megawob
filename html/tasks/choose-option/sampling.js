/* choose-option/sampling.js: shared sampling and difficulty helpers. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { splitPool, pre2, alpha, CATEGORIES, aliasesFor, lc, MAX_SUGGEST, C, suggest, SCENARIO_CATS } = lib;

  function sampleOptions(rng, cat, n, k, csplit) {
    const pool = splitPool(cat.pool, csplit);
    n = Math.min(n, pool.length);
    k = Math.max(1, Math.min(k, n - 2));
    if (cat.ordered) {
      const opts = rng.sample(pool, n).sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
      return { options: opts, targets: rng.sample(opts, k) };
    }
    const social = pool.filter((p) => pool.some((q) => q !== p && pre2(q) === pre2(p)));
    const targets = [];
    while (targets.length < k) {
      const from = rng.bool(0.85) && social.length ? social : pool;
      const t = rng.pick(from);
      if (!targets.includes(t)) targets.push(t);
    }
    const nb = rng.shuffle(pool.filter((p) => !targets.includes(p) && targets.some((t) => pre2(t) === pre2(p))));
    const nNb = Math.min(nb.length, Math.max(1, Math.round((n - k) * rng.float(0.3, 0.6))));
    const chosen = targets.concat(nb.slice(0, nNb));
    const rest = rng.shuffle(pool.filter((p) => !chosen.includes(p)));
    const options = chosen.concat(rest.slice(0, n - chosen.length)).sort(alpha);
    return { options, targets };
  }

  function baseSpec(rng, scenario, catKey) {
    const cat = CATEGORIES[catKey];
    const label = rng.pick(cat.label);
    return { scenario, category: catKey, label, labelAliases: aliasesFor(label), noun: cat.noun, plural: cat.plural,
      title: rng.pick(cat.titles), note: rng.pick(cat.notes) };
  }

  function prefixFor(pool, t) {
    for (const lo of [3, 2]) {
      for (let L = 2; L <= 4; L++) {
        const p = t.slice(0, L);
        if (p.length < L || /\s$/.test(p)) continue;
        const m = pool.filter((o) => lc(o).startsWith(lc(p))).length;
        if (m >= lo && m <= MAX_SUGGEST) return p;
      }
    }
    return null;
  }

  function suffixFor(pool, t, p) {
    const rivals = pool.filter((o) => o !== t && lc(o).startsWith(lc(p)));
    for (let L = 2; L < t.length; L++) {
      const s = t.slice(-L);
      if (/^\s/.test(s)) continue;
      if (!rivals.some((o) => lc(o).endsWith(lc(s)))) return s;
    }
    return null;
  }

  function sampleChips(rng, spec, opts, big) {
    const n = big ? (opts.ood ? rng.int(30, 40) : rng.int(14, 24)) : opts.ood ? rng.int(18, 26) : rng.int(8, 14);
    const k = opts.ood ? rng.int(4, 6) : rng.int(2, 4);
    if (spec.category === 'person') {
      const names = [];
      for (let t = 0; names.length < n && t < 200; t++) {
        const p = C.personName(rng, { csplit: spec.csplit });
        if (/^[A-Za-z' -]+$/.test(p.full) && !names.includes(p.full)) names.push(p.full);
      }
      const options = names.sort(alpha);
      Object.assign(spec, { label: rng.pick([
        'Attendees', 'Participants', 'Members', 'Coworkers', 'Volunteers', 'Delegates'
      ]), noun: 'person', plural: 'people',
        title: rng.pick([
          'New meeting', 'Share folder', 'Create a group chat', 'Project team', 'Planning session',
          'Shared workspace', 'Project circle', 'Team roster'
        ]), note: rng.pick(['Everyone listed gets an invite.', 'People you add can edit.']) });
      spec.labelAliases = aliasesFor(spec.label);
      const picked = rng.sample(options, k);
      return Object.assign(spec, { options, targets: options.filter((o) => picked.includes(o)) });
    }
    const { options, targets } = sampleOptions(rng, CATEGORIES[spec.category], n, k, spec.csplit);
    return Object.assign(spec, { options, targets: options.filter((o) => targets.includes(o)) });
  }

  function tagQuery(spec, x) {
    for (let L = 2; L <= x.length; L++) {
      const p = x.slice(0, L);
      if (/\s$/.test(p)) continue;
      if (spec.options.filter((o) => lc(o).startsWith(lc(p))).length <= 5) return p;
    }
    return x;
  }

  function keepSome(list, must, n) {
    if (list.length <= n) return list;
    const keep = new Set(must);
    const others = list.filter((x) => !keep.has(x));
    const take = Math.max(0, n - keep.size);
    for (let i = 0; i < take; i++) keep.add(others[Math.floor((i * others.length) / take)]);
    return list.filter((x) => keep.has(x));
  }

  function applyLevel(spec, level) {
    const easy = level === 'easy';
    if (!easy && level !== 'medium') return spec;
    const pick = (a, b) => (easy ? a : b);
    const v = spec.scenario;
    spec.level = level;
    if (v === 'dropdown') spec.options = keepSome(spec.options, [spec.target], pick(6, 9));
    else if (v === 'radio') {
      if (!spec.criterion) spec.options = keepSome(spec.options, [spec.target], pick(3, 4));
    } else if (v === 'checkbox' || v === 'chips' || v === 'tags') {
      spec.targets = spec.targets.slice(0, pick(2, 3));
      spec.options = keepSome(spec.options, spec.targets, v === 'checkbox' ? pick(6, 8) : v === 'chips' ? pick(7, 10) : pick(10, 14));
      if (v === 'tags') {
        spec.queries = Object.fromEntries(spec.targets.map((t) => [t, tagQuery(spec, t)]));
        if (easy) spec.maxShow = Math.max(spec.maxShow, spec.targets.length);
      }
    } else if (v === 'combobox') spec.options = keepSome(spec.options, [spec.target], pick(12, 18));
    else if (v === 'dependent') spec.options = keepSome(spec.options, [spec.target.country], pick(5, 7));
    else if (v === 'listbox') {
      let targets = spec.targets;
      if (easy) {
        const t = targets.find((x) => spec.options.indexOf(x) >= spec.rows) || targets[0];
        targets = [t];
        spec.multi = false;
        spec.target = t;
      }
      // The first `rows` other options stay (they precede the target, which still has to be scrolled to).
      const others = spec.options.filter((o) => !targets.includes(o));
      const total = spec.rows + pick(6, 10);
      const fill = keepSome(others.slice(spec.rows), [], Math.max(0, total - targets.length - spec.rows));
      const keep = new Set([...targets, ...others.slice(0, spec.rows), ...fill]);
      const options = spec.options.filter((o) => keep.has(o));
      if (targets.some((t) => options.indexOf(t) >= spec.rows)) {
        spec.options = options;
        spec.targets = targets;
      } else if (easy) spec.targets = targets;
    } else if (v === 'autocomplete') {
      if (easy) spec.latency = 0;
      // A longer typed prefix: fewer suggestions (2-4 on easy, at most 5 on medium), the target among them.
      const cap = pick(4, 5);
      let typed = spec.typed;
      for (let L = typed.length; L < spec.target.length; L++) {
        const cand = spec.target.slice(0, L);
        const n = suggest(spec, cand).length;
        if (/\s$/.test(cand) || n < 2) continue;
        typed = cand;
        if (n <= cap) break;
      }
      spec.typed = typed;
    } else if (v === 'toggles') {
      const k = pick(1, 2);
      const said = spec.said.slice(0, k);
      const idx = spec.items.map((_, i) => i);
      const keepIdx = keepSome(idx, said, pick(4, 6));
      const remap = (i) => keepIdx.indexOf(i);
      const want = spec.base.slice();
      said.forEach((i, j) => { want[i] = spec.items[i].neg ? !spec.effect[j] : spec.effect[j]; });
      spec.items = keepIdx.map((i) => spec.items[i]);
      spec.base = keepIdx.map((i) => spec.base[i]);
      spec.want = keepIdx.map((i) => want[i]);
      spec.effect = spec.effect.slice(0, k);
      spec.said = said.map(remap);
      spec.options = spec.items.map((it) => it.label);
    } else if (v === 'tree') {
      const groups = spec.groups.slice(0, easy ? 1 : 2).map((g) => ({ ...g, options: keepSome(g.options, g.goal.list, pick(4, 5)) }));
      const targets = groups.flatMap((g) => g.options.filter((o) => {
        const { kind, list } = g.goal;
        return kind === 'all' || (kind === 'except' && !list.includes(o)) || (kind === 'only' && list.includes(o));
      }));
      Object.assign(spec, { groups, options: groups.flatMap((g) => g.options), targets, label: groups[0].name });
    }
    return spec;
  }

  function sampleSpec(rng, scenario, opts) {
    const base = { isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
    const tr = opts.traits || {};
    let catKey = SCENARIO_CATS[scenario] ? rng.pick(SCENARIO_CATS[scenario]) : scenario;
    // Trait topic 'topics' | 'amenities': a checkbox group of that content (the draw above is kept, so seeds elsewhere hold).
    if (scenario === 'checkbox' && tr.topic) catKey = tr.topic === 'amenities' ? 'amenity' : 'topic';
    const cat = CATEGORIES[catKey];
    const spec = { ...(cat ? baseSpec(rng, scenario, catKey) : { scenario, category: catKey }), ...base };
    return env.scenariosOf('choose-option')[scenario].sample(rng, spec, opts, { base, cat, tr });
  }

  Object.assign(lib, { sampleOptions, baseSpec, prefixFor, suffixFor, sampleChips, tagQuery, keepSome, applyLevel, sampleSpec });
})();
