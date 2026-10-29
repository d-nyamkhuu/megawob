/*
 * use-data-grid / sort by a column
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { colName, colOf, DIR_WORDS, domCol, fill, pick, say } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'sort',
    rows: [[8, 26], [30, 60]],
    levelRows: { easy: [6, 9], medium: [8, 16] },
    goal(rng, spec, dom) {
    const sortable = dom.cols.filter((c) => c.type !== 'email');
    const c = rng.pick(sortable);
    spec.goal = { col: c.id, dir: rng.bool(0.5) ? 'asc' : 'desc' };
    spec.pageSize = spec.rows.length <= 12 ? 12 : rng.int(8, 10);
    spec.keys = rng.bool(0.25);
    spec.route = spec.keys ? 'header' : rng.pick(['header', 'header', 'menu']);
    return { need: [c.id], finish: (s) => new Set(s.rows.map((r) => r.c[c.id])).size >= 3 };
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const others = spec.cols.filter((c) => c.id !== g.col && c.type !== 'email');
      if (mode === 'partial') m.sort = { col: g.col, dir: g.dir === 'asc' ? 'desc' : 'asc' };
      else if (mode === 'wrong' || rng.bool(0.4)) m.sort = { col: rng.pick(others).id, dir: rng.pick(['asc', 'desc']) };
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, sort: { col: g.col, dir: g.dir } };
    },
    error(m, spec) {
      const g = spec.goal;
      if (!m.sort || m.sort.col !== g.col) return 1;
      return m.sort.dir === g.dir ? 0 : 0.5;
    },
    plan(m, spec) {
      const g = spec.goal;
      if (spec.route === 'menu') {
        if (m.menu && m.menu.kind === 'col' && m.menu.col === g.col) return { click: { menuItem: g.dir } };
        if (m.menu || m.markMenu) return { click: { blank: true } };
        return { click: { menuBtn: g.col } };
      }
      if (m.menu || m.markMenu) return { click: { blank: true } };
      if (spec.keys && m.focus && m.focus.kind === 'header' && m.focus.col === g.col) return { key: 'Enter' };
      return { click: { header: g.col } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const E = spec.entities;
      const c = colOf(spec, g.col);
      const col = colName(rng, spec, g.col);
      const dir = rng.pick(DIR_WORDS[c.type === 'email' ? 'text' : c.type][g.dir]);
      const long = g.dir === 'asc' ? 'ascending' : 'descending';
      const d = domCol(spec, g.col);
      const ext = d.ext ? (g.dir === 'desc' ? d.ext[0] : d.ext[1]) : null;
      const T = [
        'Sort the {E} by {col}, {dir}.',
        'Sort the table by {col} in {long} order.',
        'Order the rows by {col} ({long}).',
        'Arrange the grid by {col}, {dir}.',
        'Re-sort the list so it goes by {col}, {dir}.',
        'Put the {E} in {long} order of {col}.',
        'I need this table sorted on the {col} column, {dir}.',
        'Set the row order to {long} by {col}.',
        'Show the {E} sorted on {col} ({long}).',
        'For {col}, I want the rows sorted {dir}.',
      ];
      if (ext) T.push('Sort the table so the {ext} {e} is at the top.', 'Show the {ext} {E} first.');
      const core = fill(pick(rng, spec, T), { E, e: spec.entity, col, dir, long, ext });
      return say(rng, spec, core, { terse: `${col} ${long}`, steps: [`Order the ${E} by ${col}`, `keep them in ${long} order`] });
    },
    parts(m, spec, out) {
      return out;
    },
    retarget(s) {
      const g = s.goal;
      g.dir = g.dir === 'asc' ? 'desc' : 'asc';
      return true;
    },
  });
})();
