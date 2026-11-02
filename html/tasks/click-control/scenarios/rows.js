/*
 * click-control / rows: hover-reveal row actions. row-reveal: row actions that appear only on row hover.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { cap, quote: q } = env.util;
  const C = env.content;
  const { fileName, fileSize, partialPatch, personName, pickIn, rowCorrect, rowFacts, rowKey, rowRetarget,
    rrActions, settledHover, T, VERB } = fam.lib;

  const PEOPLE_ACTIONS = [['Edit', 'pencil'], ['Message', 'mail'], ['Archive', 'archive'], ['Delete', 'trash'],
    ['Remove', 'trash'], ['Share', 'share'], ['Pin', 'pin'], ['Flag', 'flag']];
  const FILE_ACTIONS = [['Rename', 'pencil'], ['Download', 'download'], ['Share', 'share'], ['Delete', 'trash'],
    ['Duplicate', 'copy'], ['Archive', 'archive'], ['Preview', 'eye'], ['Copy link', 'link']];

  function sampleRows(rng, ctx) {
    const { o, ood } = ctx;
    const n = ood ? rng.int(9, 10) : rng.int(5, 7);
    const kind = rng.bool(0.5) ? 'people' : 'files';
    const rows = [];
    const seen = new Set();
    let columns;
    if (kind === 'people') {
      columns = ['Name', 'Role', 'Team'];
      const roles = C.JOB_TITLES.filter((r) => r.length <= 24);
      const teams = C.DEPARTMENTS.filter((r) => r.length <= 18);
      while (rows.length < n) {
        const name = personName(rng, o);
        if (seen.has(name)) continue;
        seen.add(name);
        rows.push({ key: `r${rows.length}`, cells: [name, C.pick(rng, roles, o), C.pick(rng, teams, o)] });
      }
    } else {
      columns = ['Name', 'Size', 'Modified'];
      const months = C.MONTHS;
      while (rows.length < n) {
        const name = fileName(rng, o);
        if (seen.has(name) || name.length > 40) continue;
        seen.add(name);
        rows.push({ key: `r${rows.length}`, cells: [name, fileSize(rng), `${months[rng.int(0, 11)].slice(0, 3)} ${rng.int(1, 28)}`] });
      }
    }
    const pool = kind === 'people' ? PEOPLE_ACTIONS : FILE_ACTIONS;
    const acts = rng.sample(pool, rng.int(2, ood ? 4 : 3)).filter((a, i, arr) => arr.findIndex((b) => b[1] === a[1]) === i);
    const actions = acts.map(([label, icon]) => ({ key: label.toLowerCase().replace(/\s+/g, '-'), label, icon }));
    const target = { row: rng.pick(rows).key, action: rng.pick(actions).key };
    return { kind, columns, rows, actions, style: rng.pick(['icons', 'text']), target };
  }

  // Row overflow ("⋯") menus: extra actions per kind; the quick (always-on-hover) icons come from PEOPLE_ / FILE_ACTIONS.
  const MORE_PEOPLE = [
    'View profile', 'Copy email', 'Change role', 'Reset password', 'Move to team…', 'Suspend', 'Remove from team',
    'Subscribe to', 'Disconnect from', 'Approve', 'Copy name of', 'View activity of', 'Unmute', 'Export data for'
  ];
  const MORE_FILES = [
    'Open in new tab', 'Make a copy', 'Move to…', 'Version history', 'Add to starred', 'Move to trash', 'Get link',
    'Show details of', 'Copy text from', 'Stop syncing', 'Clear cache for', 'Remove lock on'
  ];

  function sampleRowReveal(rng, ctx) {
    const base = sampleRows(rng, ctx);
    const pool = base.kind === 'people' ? MORE_PEOPLE : MORE_FILES;
    const quick = base.actions.slice(0, rng.int(1, 2));
    const used = new Set(quick.map((a) => a.label.toLowerCase()));
    const more = rng.sample(pool, ctx.ood ? rng.int(5, 6) : rng.int(3, 5)).filter((l) => !used.has(l.toLowerCase()))
      .map((label) => ({ key: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''), label }));
    // Two thirds of the targets hide in the overflow menu.
    const inMore = rng.bool(0.67);
    const target = { row: rng.pick(base.rows).key, action: inMore ? rng.pick(more).key : rng.pick(quick).key };
    return { kind: base.kind, columns: base.columns, rows: base.rows, quick, more, style: base.style, target,
      moreLabel: rng.pick(['More', 'More actions', 'Options', 'Actions', 'Manage', 'Item tools']) };
  }

  const rrInMore = (spec, a) => spec.more.some((x) => x.key === a);

  env.scenario('click-control', {
    name: 'rows',
    sample: sampleRows,
    baseModel(spec, c) {
      return { hover: null, ...c };
    },
    correct: rowCorrect,
    result(spec, key) {
      const [r, a] = key.split('|');
      const row = spec.rows.find((x) => x.key === r);
      const act = spec.actions.find((x) => x.key === a);
      return `${act ? act.label : a}: ${row ? row.cells[0] : r}`;
    },
    wrongFinal(spec, rng) {
      const ks = [];
      for (const r of spec.rows) for (const a of spec.actions) if (!(r.key === spec.target.row && a.key === spec.target.action)) {
        if (a.key === spec.target.action || r.key === spec.target.row) ks.push(rowKey(r.key, a.key));
      }
      return ks.length ? { key: rng.pick(ks) } : null;
    },
    planStep(model, spec) {
      if (model.hover !== spec.target.row) return { move: { row: spec.target.row } };
      return { click: { action: [spec.target.row, spec.target.action] } };
    },
    settled: settledHover,
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.rows = pickIn(r, spec.rows, (x) => x.key === spec.target.row, k(2, 3));
      spec.actions = pickIn(r, spec.actions, (a) => a.key === spec.target.action, k(1, 2));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const row = spec.rows.find((r) => r.key === spec.target.row);
      const act = spec.actions.find((a) => a.key === spec.target.action);
      const [verb, done] = VERB[act.label] || [act.label.toLowerCase(), `${act.label.toLowerCase()}ed`];
      const name = spec.kind === 'files' ? q(row.cells[0]) : row.cells[0];
      core = P(T.rows, { A: cap(verb), a: verb, act: q(act.label), name, qname: q(row.cells[0]), done });
      terse = `${act.label} ${q(row.cells[0])}`;
      steps = [`hover over ${q(row.cells[0])}`, `click ${q(act.label)}`];
      return { core, terse, steps };
    },
    phKind: () => 'row',
    facts: rowFacts,
    retarget: rowRetarget,
  });

  env.scenario('click-control', {
    name: 'row-reveal',
    sample: sampleRowReveal,
    baseModel(spec, c) {
      return { hover: null, menuFor: null, ...c };
    },
    progress: (model, spec) => model.menuFor === spec.target.row && rrInMore(spec, spec.target.action) ? 0.5 : 1,
    correct: rowCorrect,
    result(spec, key) {
      const [r, a] = key.split('|');
      const row = spec.rows.find((x) => x.key === r);
      const act = rrActions(spec).find((x) => x.key === a);
      return `${act ? act.label.replace(/…$/, '') : a}: ${row ? row.cells[0] : r}`;
    },
    wrongFinal(spec, rng) {
      const ks = [];
      for (const r of spec.rows) for (const a of rrActions(spec)) if (!(r.key === spec.target.row && a.key === spec.target.action)) {
        if (a.key === spec.target.action || r.key === spec.target.row) ks.push(rowKey(r.key, a.key));
      }
      return ks.length ? { key: rng.pick(ks), patch: { menuFor: null } } : null;
    },
    wrongNav(spec, rng) {
      const ks = spec.rows.map((x) => x.key).filter((k) => k !== spec.target.row);
      return { menuFor: rng.pick(ks) };
    },
    partial: (spec) => rrInMore(spec, spec.target.action) ? { menuFor: spec.target.row } : null,
    scene: (spec) => partialPatch(spec),
    planStep(model, spec) {
      const { row, action } = spec.target;
      const more = rrInMore(spec, action);
      if (more && model.menuFor === row) return { click: { mentry: action } };
      // An overflow menu open on another row (or any open menu when the target is a quick action) covers rows.
      if (model.menuFor !== null) return { click: { blank: true } };
      if (model.hover !== row) return { move: { row } };
      return more ? { click: { more: row } } : { click: { action: [row, action] } };
    },
    settled: settledHover,
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.rows = pickIn(r, spec.rows, (x) => x.key === spec.target.row, k(2, 3));
      spec.more = pickIn(r, spec.more, (a) => a.key === spec.target.action, k(2, 3));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const row = spec.rows.find((r) => r.key === spec.target.row);
      const act = rrActions(spec).find((a) => a.key === spec.target.action);
      const more = rrInMore(spec, act.key);
      const label = act.label.replace(/…$/, '');
      const [verb] = VERB[act.label] || [label.toLowerCase()];
      const name = spec.kind === 'files' ? q(row.cells[0]) : row.cells[0];
      core = P(more ? T.rowMore : T.rowQuick, { A: cap(verb), a: verb, act: q(label), name, qname: q(row.cells[0]), more: q(spec.moreLabel) });
      terse = `${label} ${q(row.cells[0])}`;
      steps = more ? [`hover over ${q(row.cells[0])}`, `open its ${spec.moreLabel} menu`, `click ${q(label)}`]
        : [`hover over ${q(row.cells[0])}`, `click ${q(label)}`];
      return { core, terse, steps };
    },
    phKind: () => 'row',
    facts: rowFacts,
    retarget: rowRetarget,
  });
})();
