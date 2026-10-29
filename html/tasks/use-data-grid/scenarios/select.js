/*
 * use-data-grid / select a set of rows with the checkboxes
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { listText, catCols, fill, jaccard, pick, pred, quote, rowLabel, say, selectPlan } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'select',
    rows: [[6, 10], [11, 12]],
    levelRows: { easy: [5, 7], medium: [6, 8] },
    goal(rng, spec, dom) {
    const n = spec.rows.length;
    spec.pageSize = Math.max(n, 6);
    const mode = rng.pick(['range', 'range', 'allbut', 'match', 'all']);
    const ids = spec.rows.map((r) => r.id);
    let target;
    const g = { mode };
    if (mode === 'range') {
      const len = rng.int(3, Math.min(6, n - 2));
      const a = rng.int(0, n - len);
      target = ids.slice(a, a + len);
      g.from = target[0];
      g.to = target[len - 1];
    } else if (mode === 'allbut') {
      const ex = rng.sample(ids, rng.int(1, 2));
      target = ids.filter((x) => !ex.includes(x));
      g.except = ex;
    } else if (mode === 'match') {
      const c = rng.pick(catCols(dom));
      const vals = [...new Set(spec.rows.map((r) => r.c[c.id]))];
      const v = rng.pick(vals);
      target = spec.rows.filter((r) => r.c[c.id] === v).map((r) => r.id);
      if (target.length < 2 || target.length > n - 2) return null;
      g.col = c.id;
      g.value = v;
    } else target = ids.slice();
    spec.goal = g;
    spec.target = target;
    return { need: [g.col] };
    },
    init(spec, m, mode, rng) {
      const ids = spec.rows.map((r) => r.id);
      const T = spec.target;
      if (mode === 'partial') m.selected = rng.sample(T, Math.max(1, Math.floor(T.length / 2)));
      else if (mode === 'wrong') {
        const non = ids.filter((x) => !T.includes(x));
        m.selected = rng.sample(T, Math.floor(T.length / 3)).concat(rng.sample(non, Math.min(non.length, rng.int(1, 2))));
      }
      m.selected = ids.filter((x) => m.selected.includes(x));
    },
    solve(spec, m) {
      return { ...m, selected: spec.target.slice() };
    },
    error(m, spec) {
      if (spec.target.length < spec.rows.length && spec.rows.every((r) => m.selected.includes(r.id))) return 1;
      return 1 - jaccard(m.selected, spec.target);
    },
    plan(m, spec) {
      const g = spec.goal;
      if (m.menu || m.markMenu) return { click: { blank: true } };
      return selectPlan(m, spec, spec.target, g.mode);
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const E = spec.entities;
      const lab = (id) => quote(rowLabel(spec, id));
      let T;
      let vars;
      if (g.mode === 'range') {
        T = ['Select the rows from {a} to {b}.', 'Select every row between {a} and {b}, inclusive.', 'Select {a}, {b} and all rows in between.',
          'Check the rows starting at {a} and ending at {b}.', 'Mark the block of rows from {a} down to {b} as selected.',
          'Select the consecutive rows {a} through {b}.',
          'Only rows from {a} through {b} belong in the selection.',
          'The selected span must run from {a} to {b}.',
          'Check each row in the {a} to {b} range.',
          'I need {a} through {b} selected in a single block.'];
        vars = { a: lab(g.from), b: lab(g.to) };
      } else if (g.mode === 'allbut') {
        T = ['Select all rows except {x}.', 'Select every row but {x}.', 'Select everything apart from {x}.', 'Check all the {E} other than {x}.',
          'Select every row; leave {x} unselected.', 'All {E} should be selected, except {x}.',
          'Everything but {x} needs selection.', 'I need all {E} checked except for {x}.'];
        vars = { x: listText(g.except.map(lab)), E };
      } else if (g.mode === 'match') {
        const p = pred(spec, g.col, [quote(g.value)]);
        T = ['Select every {e} {p}.', 'Select each {e} {p}.', 'Select all {E} {p}, and nothing else.', 'Check the {E} {p}.',
          'Mark every row {p} as selected.', 'I need all the {E} {p} selected.', 'Select all and only {E} {p}.',
          'Only rows {p} get ticked.'];
        vars = { p, e: spec.entity, E };
      } else {
        T = [
          'Select all the rows.', 'Select every record in the table.', 'Select all {E}.',
          'Leave no records unselected.', 'All {E} need selecting.'
        ];
        vars = { E };
      }
      const core = fill(pick(rng, spec, T), vars);
      return say(rng, spec, core, {});
    },
  });
})();
