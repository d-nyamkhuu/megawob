/*
 * use-data-grid / edit a cell in place
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { editInit, editInstruction, editPlan, editRetarget, editSolve, lev, nameCol, newText, rowOf, valueOf } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'cellEdit',
    saves: true,
    inputs: ['pointer', 'keyboard'],
    rows: [[5, 9], [8, 12]],
    levelRows: { easy: [4, 6], medium: [5, 8] },
    goal(rng, spec, dom) {
    const f = rng.fork('cellEdit');
    const n = spec.rows.length;
    spec.pageSize = Math.max(n, 6);
    const editable = dom.cols.filter((c) => (c.type === 'text' || c.type === 'num') && !c.name && !c.key);
    const c = f.pick(editable);
    const row = f.pick(spec.rows);
    const cur = row.c[c.id];
    let text = null;
    for (let t = 0; t < 30 && !text; t++) {
      const cand = c.type === 'num' ? String(f.int(1, 99)) : newText(f, spec, c.id);
      if (cand !== String(cur) && cand.length <= 26) text = cand;
    }
    if (!text) return null;
    spec.goal = { row: row.id, col: c.id, text };
    return { need: [c.id, nameCol(dom).id] };
    },
    init(spec, m, mode, rng) {
      return editInit(spec, m, mode, rng);
    },
    fresh(m) {
      m.edits = {};
      m.editing = null;
    },
    solve(spec, m) {
      return editSolve(spec, m);
    },
    error(m, spec) {
      const g = spec.goal;
      const row = rowOf(spec, g.row);
      const cur = String(valueOf(m, spec, row, g.col));
      const others = Object.entries(m.edits || {}).some(([r, cs]) => Object.keys(cs).some((c) => !(r === g.row && c === g.col)));
      return Math.min(1, lev(cur, g.text) / Math.max(cur.length, g.text.length, 1) + (others ? 0.5 : 0));
    },
    plan(m, spec) {
      return editPlan(m, spec);
    },
    instruction(spec, rng) {
      return editInstruction(spec, rng);
    },
    retarget(s, spec, model) {
      return editRetarget(s, spec, model);
    },
  });
})();
