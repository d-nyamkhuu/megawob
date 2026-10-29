/* scroll-page/sample.js: sample(): the page, its target and its routes per scenario, and the scroll-container hosting. Attached
 * to the task's lib. */
(function () {
  'use strict';
  const lib = env.taskOf('scroll-page').lib;
  const C = env.content;
  const {
    CLASSIC, CODE_GEN, CONTAINERS, JUDGE_MODES, KINDS, MONTHS, PANE_KINDS, VALUES, SCENARIOS, countLabel, judgeOf,
    makeFaq, makeSections, makeTools, nextId, pageTitle, paneRows, personName
  } = lib;

  // opts.route (episode knob): override the routes drawn above (no extra draws, so the rest of the spec is
  // the same as without it). 'pointer': page route 'nav' (with a table of contents), pane route 'thumb', no
  // keyboard (copy keeps typing); 'keyboard': page route 'keys' (copy: unchanged, typing is its keyboard
  // route); 'wheel': page route 'wheel', pane route 'wheel'. spec.forcedRoute records the honoured value.
  function forceRoute(spec, route) {
    if (route !== 'pointer' && route !== 'keyboard' && route !== 'wheel') return;
    const copy = spec.scenario === 'copy';
    if (route === 'pointer') {
      spec.route = 'nav';
      spec.toc = true;
      spec.paneRoute = 'thumb';
      if (!copy) spec.keys = false;
    } else if (route === 'wheel') {
      spec.route = 'wheel';
      spec.paneRoute = 'wheel';
    } else if (!copy) {
      spec.keys = true;
      spec.route = 'keys';
    }
    spec.forcedRoute = route;
  }

  // Scroll containers: a pane of rows (spec.pane) hosted in section `at`, sized by level / ood.
  // pick(easy, medium, normal, ood) -> [lo, hi] for the level.
  function sampleContainer(rng, spec, scenario, lvl, late) {
    const rows = (e, m, n, o) => {
      const [lo, hi] = spec.ood ? o : lvl === 'easy' ? e : lvl === 'medium' ? m : n;
      return rng.int(lo, hi);
    };
    const kinds2 = Object.keys(PANE_KINDS).filter((k) => PANE_KINDS[k].hosts.includes(spec.kind));
    const pk = rng.pick(kinds2);
    const at = late(0.4);
    const pane = { id: 'p0', at, kind: pk, title: PANE_KINDS[pk].title };
    const tgt = (n, lo) => rng.int(Math.min(lo, n - 2), n - 1);
    let row;
    if (scenario === 'hscroll') {
      const n = rows([8, 11], [10, 14], [12, 20], [22, 32]);
      pane.rows = paneRows(rng, spec, pk, n);
      row = pane.rows[tgt(pane.rows.length, lvl === 'easy' ? 5 : lvl === 'medium' ? 6 : 8)];
    } else if (scenario === 'carousel') {
      const n = rows([3, 4], [4, 6], [5, 9], [10, 14]);
      pane.rows = paneRows(rng, spec, pk, n);
      row = pane.rows[tgt(pane.rows.length, lvl === 'easy' ? 1 : lvl === 'medium' ? 2 : 3)];
      spec.slideRoute = rng.pick(['arrows', 'swipe']);
    } else if (scenario === 'sticky') {
      const n = rows([8, 11], [9, 14], [10, 18], [26, 40]);
      pane.rows = paneRows(rng, spec, pk, n);
      pane.hh = lvl === 'easy' ? rng.int(36, 44) : rng.int(52, 70);
      row = pane.rows[tgt(pane.rows.length, 5)];
    } else if (scenario === 'lazy') {
      const total = rows([12, 16], [16, 22], [20, 32], [40, 60]);
      pane.rows = paneRows(rng, spec, pk, total);
      pane.initial = 8;
      pane.batch = lvl === 'easy' ? rng.pick([6, 8]) : rng.pick([5, 6]);
      const n = pane.rows.length;
      const lo = Math.min(pane.initial + (lvl === 'easy' ? 0 : pane.batch), n - 1);
      const hi = lvl === 'easy' ? Math.min(pane.initial + pane.batch - 1, n - 1) : lvl === 'medium'
        ? Math.min(pane.initial + 2 * pane.batch - 1, n - 1) : n - 1;
      row = pane.rows[rng.int(lo, Math.max(lo, hi))];
    } else {
      // siblings: a second pane of another kind, side by side; only p0 holds the target.
      const pk2 = rng.pick(kinds2.filter((k) => k !== pk));
      const n = rows([8, 10], [9, 13], [10, 16], [18, 26]);
      pane.rows = paneRows(rng, spec, pk, n);
      row = pane.rows[tgt(pane.rows.length, 5)];
      const rows2 = paneRows(rng, spec, pk2, rows([8, 10], [9, 13], [10, 16], [18, 26]));
      rows2.forEach((r, i) => { r.id = `d${i}`; });
      spec.pane2 = { id: 'p1', at, kind: pk2, title: PANE_KINDS[pk2].title, rows: rows2 };
      spec.first2 = rng.bool(0.5);
    }
    spec.pane = pane;
    spec.row = row.id;
    spec.target = rng.pick(row.actions).id;
    spec.targetSection = spec.sections[at].id;
  }

  function sample(rng, opts = {}) {
    const allowed = (opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS).filter((v) => SCENARIOS.includes(v));
    let scenario;
    if (opts.scenario && allowed.includes(opts.scenario)) scenario = opts.scenario;
    else {
      // The five original scenarios draw exactly as before; a container scenario replaces one half of the time.
      const classic = allowed.filter((v) => CLASSIC.includes(v));
      const cont = allowed.filter((v) => CONTAINERS.includes(v));
      scenario = rng.pick(classic.length ? classic : cont);
      if (classic.length && cont.length) {
        const vf = rng.fork('variant');
        if (vf.bool(0.5)) scenario = vf.pick(cont);
      }
    }
    const lvl = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    const ood = !!opts.ood;
    const spec = { scenario, startMode: opts.startMode, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood };
    const kinds = {
      link: ['article', 'docs', 'faq', 'product', 'terms'],
      accordion: ['faq', 'product', 'docs'],
      copy: ['faq', 'product', 'docs', 'article'],
      top: ['article', 'docs', 'faq', 'product', 'terms'],
      nested: Object.keys(KINDS),
      hscroll: Object.keys(KINDS),
      carousel: Object.keys(KINDS),
      sticky: Object.keys(KINDS),
      lazy: Object.keys(KINDS),
      siblings: ['docs', 'terms'],
    }[scenario];
    spec.kind = rng.pick(kinds);
    spec.recoverable = opts.recover === undefined || opts.recover === null ? rng.bool(0.5) : !!opts.recover;
    if (lvl === 'easy' && (opts.recover === undefined || opts.recover === null)) spec.recoverable = true;
    spec.keys = scenario === 'copy' ? true : rng.bool(0.25);
    spec.route = rng.pick(spec.keys && scenario !== 'copy' ? ['wheel', 'nav', 'keys'] : ['wheel', 'wheel', 'nav']);
    spec.toc = spec.route === 'nav' || rng.bool(0.4);
    spec.paneRoute = rng.pick(['wheel', 'thumb']);
    forceRoute(spec, opts.route);
    spec.title = pageTitle(rng, spec);
    spec.crumbs = [rng.pick(KINDS[spec.kind].crumbs)];
    const author = personName(rng, spec);
    spec.meta = {
      article: `By ${author} · ${rng.int(3, 14)} min read`,
      docs: `Last updated ${MONTHS[rng.int(0, 11)]} ${rng.int(1, 28)} · ${rng.int(4, 18)} min read`,
      faq: `${rng.int(12, 480)} people found this helpful`,
      product: `${(rng.int(36, 49) / 10).toFixed(1)} ★ · ${rng.int(12, 2400)} reviews`,
      terms: `Effective ${rng.int(1, 28)} ${MONTHS[rng.int(0, 11)]} ${rng.int(2022, 2025)}`,
    }[spec.kind];
    spec.author = author;

    const nSec = ood ? rng.int(10, 16) : lvl === 'easy' ? rng.int(3, 5) : lvl === 'medium' ? rng.int(4, 7) : rng.int(5, 9);
    spec.sections = makeSections(rng, spec, nSec);
    spec.tools = makeTools(rng, spec, KINDS[spec.kind].tools, rng.int(3, 4));
    const late = (lo = 0.5) => rng.int(Math.max(2, Math.floor(nSec * lo)), nSec - 1);

    if (scenario === 'link') {
      const s = spec.sections[late()];
      // Prefer a label that also appears elsewhere half of the time, so the section matters.
      const dup = s.actions.filter((a) => countLabel(spec, a.label) > 1);
      const a = dup.length && rng.bool(0.5) ? rng.pick(dup) : rng.pick(s.actions);
      spec.target = a.id;
      spec.targetSection = s.id;
      spec.refBy = countLabel(spec, a.label) > 1 ? rng.pick(['heading', 'heading', 'about']) : rng.pick(['heading', 'about', 'none']);
    } else if (scenario === 'accordion') {
      const n = ood ? rng.int(18, 28) : lvl === 'easy' ? rng.int(5, 8) : lvl === 'medium' ? rng.int(6, 11) : rng.int(8, 14);
      const at = Math.max(1, Math.floor(nSec * rng.float(0.35, 0.7)));
      spec.faq = { at, exclusive: rng.bool(0.4), items: makeFaq(rng, spec, n) };
      const items = spec.faq.items;
      const it = items[rng.int(Math.floor(items.length / 3), items.length - 1)];
      const a = it.actions[0];
      spec.item = it.id;
      spec.target = a.id;
      spec.targetSection = 'faq';
      spec.refBy = rng.pick(['question', 'question', 'about']);
    } else if (scenario === 'top') {
      spec.bottomTools = spec.tools.map((t) => ({ id: nextId(spec), label: t.label, kind: 'button' }));
      const t = rng.pick(spec.tools);
      spec.target = t.id;
      spec.targetSection = 'tools';
    } else if (scenario === 'nested') {
      const kinds2 = Object.keys(PANE_KINDS).filter((k) => PANE_KINDS[k].hosts.includes(spec.kind));
      const pk = rng.pick(kinds2);
      const at = late(0.4);
      const pane = { id: 'p0', at, kind: pk, title: PANE_KINDS[pk].title };
      if (ood) {
        const ng = rng.int(3, 5);
        const groupNames = pk === 'updates' ? ['Today', 'Yesterday', 'Earlier this week', 'Last week', 'Older']
          : pk === 'sellers' ? ['Ships from your country', 'Ships from the EU', 'International', 'Refurbished', 'Used']
            : pk === 'articles' ? ['Getting started', 'Billing', 'Troubleshooting', 'Account', 'Advanced']
              : ['2025', '2024', '2023', '2022', '2021'];
        let k = 0;
        pane.groups = groupNames.slice(0, ng).map((title, g) => {
          const rows = paneRows(rng, spec, pk, rng.int(7, 10), k);
          k += rows.length;
          return { id: `g${g}`, title, pane: { id: `p${g + 1}`, rows } };
        });
        const g = pane.groups[rng.int(1, pane.groups.length - 1)];
        const row = g.pane.rows[rng.int(2, g.pane.rows.length - 1)];
        spec.group = g.id;
        spec.row = row.id;
        spec.target = rng.pick(row.actions).id;
      } else {
        pane.rows = paneRows(rng, spec, pk, lvl === 'easy' ? rng.int(6, 10) : lvl === 'medium' ? rng.int(8, 14) : rng.int(10, 20));
        const row = pane.rows[rng.int(Math.min(6, pane.rows.length - 2), pane.rows.length - 1)];
        spec.row = row.id;
        spec.target = rng.pick(row.actions).id;
      }
      spec.pane = pane;
      spec.targetSection = spec.sections[at].id;
    } else if (CONTAINERS.includes(scenario)) {
      sampleContainer(rng, spec, scenario, lvl, late);
    } else if (scenario === 'copy') {
      const dir = rng.bool(0.65) ? 'down' : 'up';
      const kinds3 = rng.sample(VALUES, 3);
      const [vl, aliases, gen, fields] = kinds3[0];
      const value = CODE_GEN[gen](rng, C);
      const sec = spec.sections[dir === 'down' ? late() : late(0.6)];
      const decoys = kinds3.slice(1).map(([label, , g]) => ({ label, value: CODE_GEN[g](rng, C),
        section: rng.pick(spec.sections).id }));
      spec.copy = { dir, value, vlabel: vl, valiases: aliases, field: rng.pick(fields), section: sec.id, decoys };
      spec.targetSection = sec.id;
    }
    delete spec._aid;
    if (JUDGE_MODES.includes(opts.judge)) {
      const j = judgeOf(rng.fork('judge'), spec, opts.judge);
      if (j) spec.judge = j;
    }
    return spec;
  }

  Object.assign(lib, {
    sample,
  });
})();
