/*
 * use-data-grid / show only the rows matching a predicate
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { catCols, cmp, colName, distinct, fill, filteredRows, jaccard, orList, pick, pred, quote, say } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'filter',
    rows: [[10, 30], [30, 60]],
    levelRows: { easy: [8, 12], medium: [10, 20] },
    goal(rng, spec, dom, opts) {
    const c = rng.pick(catCols(dom));
    const vals = [...new Set(spec.rows.map((r) => r.c[c.id]))].sort(cmp);
    if (vals.length < 3) return null;
    let k = rng.bool(0.3) ? 2 : 1;
    if (opts.level === 'easy') k = 1;
    const values = rng.sample(vals, k).sort(cmp);
    const target = spec.rows.filter((r) => values.includes(r.c[c.id])).map((r) => r.id);
    if (target.length < 1 || target.length > spec.rows.length * 0.6) return null;
    spec.goal = { col: c.id, values };
    spec.target = target;
    spec.pageSize = spec.rows.length <= 12 ? 12 : rng.int(8, 10);
    spec.keys = true;
    spec.route = k === 1 && rng.bool(0.5) ? 'search' : 'menu';
    return {
      need: [c.id],
      // The search route must reach exactly the goal rows: the value occurs in no other column.
      finish: (s) => {
        if (k !== 1) return true;
        const m0 = { status: {}, removed: {}, filters: {}, query: values[0], sort: null };
        const hit = filteredRows(m0, s).map((r) => r.id);
        if (!(hit.length === target.length && hit.every((id) => target.includes(id)))) s.route = 'menu';
        return true;
      },
    };
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const all = distinct(spec, g.col, m);
      const extra = all.filter((v) => !g.values.includes(v));
      if (mode === 'partial') {
        if (spec.route === 'search' && rng.bool(0.5)) m.query = g.values[0].slice(0, 1);
        else m.filters[g.col] = g.values.concat([rng.pick(extra)]).sort(cmp);
      } else if (mode === 'wrong') {
        m.filters[g.col] = [rng.pick(extra)];
      }
    },
    solve(spec, m) {
      const g = spec.goal;
      return { ...m, query: '', filters: { [g.col]: g.values.slice() }, page: 0 };
    },
    error(m, spec) {
      return 1 - jaccard(filteredRows(m, spec).map((r) => r.id), spec.target);
    },
    plan(m, spec) {
      const g = spec.goal;
      const otherFilters = Object.keys(m.filters).filter((c) => c !== g.col);
      if (spec.route === 'search') {
        if (otherFilters.length || m.filters[g.col]) {
          if (m.menu || m.markMenu) return { click: { blank: true } };
          return { click: { clearFilters: true } };
        }
        if (m.menu || m.markMenu) return { click: { blank: true } };
        return { type: [{ search: true }, g.values[0]] };
      }
      if ((m.query || otherFilters.length) && !(m.menu && m.menu.kind === 'filter' && m.menu.col === g.col)) {
        if (m.menu || m.markMenu) return { click: { blank: true } };
        return { click: { clearFilters: true } };
      }
      if (!(m.menu && m.menu.kind === 'filter' && m.menu.col === g.col)) {
        if (m.menu || m.markMenu) return { click: { blank: true } };
        return { click: { funnel: g.col } };
      }
      const all = distinct(spec, g.col, m);
      const d = new Set(m.menu.draft);
      const wrong = all.filter((x) => d.has(x) !== g.values.includes(x));
      if (!wrong.length) return { click: { filterApply: true } };
      if (d.size === all.length && wrong.length > 2) return { click: { filterAll: true } };
      return { click: { filterOpt: wrong[0] } };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const E = spec.entities;
      const col = colName(rng, spec, g.col);
      const vals = orList(g.values.map(quote));
      const p = pred(spec, g.col, g.values.map(quote));
      const T = [
        'Filter the table to show only {E} {p}.',
        'Show only the {E} {p}.',
        'Narrow the list down to {E} {p}.',
        'Hide every row except the {E} {p}.',
        'Use the filters so that only {E} {p} are listed.',
        'Limit the grid to {E} whose {col} is {vals}.',
        'I only want to see {E} {p}.',
        'Only {E} {p} should be visible.',
        'Make this a view of just {E} {p}.',
        'Include all {E} {p} and no others.',
        'I need a table with just {E} {p}.',
        'Display {E} only if their {col} is {vals}.',
        'Let me view {E} {p} without other rows.',
        'The table should be just {E} {p}.',
      ];
      const core = fill(pick(rng, spec, T), { E, p, col, vals });
      return say(rng, spec, core, { terse: `${col}: ${g.values.join(' / ')}`,
        steps: [`Keep only ${E} ${p}`, 'leave the other records out of this view'] });
    },
    parts(m, spec, out) {
      return out;
    },
    retarget(s, spec, model, rng) {
      const g = s.goal;
      g.values = [rng.pick(distinct(s, g.col).filter((v) => !g.values.includes(v)))];
      s.target = s.rows.filter((r) => g.values.includes(r.c[g.col])).map((r) => r.id);
      return true;
    },
  });
})();
