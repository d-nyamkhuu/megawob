/*
 * use-data-grid / select rows and run a toolbar bulk action
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { bulkError, bulkInit, bulkInstruction, bulkPlan, bulkSolve, catCols, nameCol, rowOf, STATUS } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'bulk',
    batch: true,
    saves: true,
    rows: [[6, 10], [11, 12]],
    levelRows: { easy: [5, 7], medium: [6, 8] },
    goal(rng, spec, dom, opts) {
    const n = spec.rows.length;
    spec.pageSize = Math.max(n, 6);
    const statusId = dom.cols.find((c) => c.status).id;
    let action = rng.pick(['status', 'status', 'archive', 'delete']);
    if (opts.level === 'easy' && action === 'delete') action = 'archive'; // no confirm dialog
    const how = rng.bool(0.7) ? 'match' : 'names';
    const g = { action, how };
    let target;
    if (how === 'match') {
      const c = rng.pick(catCols(dom));
      const vals = [...new Set(spec.rows.map((r) => r.c[c.id]))];
      g.col = c.id;
      g.values = [rng.pick(vals)];
      target = spec.rows.filter((r) => g.values.includes(r.c[c.id])).map((r) => r.id);
    } else {
      target = rng.sample(spec.rows, rng.int(2, 3)).map((r) => r.id);
      g.names = target.map((id) => rowOf(spec, id).c[nameCol(dom).id]);
    }
    if (target.length < 2 || target.length > Math.min(5, n - 2)) return null;
    if (action === 'status') {
      const cur = new Set(target.map((id) => rowOf(spec, id).c[statusId]));
      const options = STATUS[spec.domain].filter((s) => !cur.has(s));
      if (!options.length) return null;
      g.value = rng.pick(options);
    }
    spec.goal = g;
    spec.target = target.sort((a, b) => spec.rows.findIndex((r) => r.id === a) - spec.rows.findIndex((r) => r.id === b));
    return { need: [statusId, g.col, nameCol(dom).id] };
    },
    init(spec, m, mode, rng) {
      return bulkInit(spec, m, mode, rng);
    },
    solve(spec, m, model) {
      return bulkSolve(spec, m, model);
    },
    error(m, spec) {
      return bulkError(m, spec);
    },
    plan(m, spec) {
      return bulkPlan(m, spec);
    },
    instruction(spec, rng) {
      return bulkInstruction(spec, rng);
    },
    retarget(s, spec, model, rng) {
      const g = s.goal;
      if (g.action !== 'status') return false;
      const other = STATUS[s.domain].filter(v => v !== g.value && s.target.every(id => rowOf(s, id).c[s.statusCol] !== v));
      if (!other.length) return false; g.value = rng.pick(other);
      return true;
    },
    ended(m, spec) {
      return m.wrongs >= (spec.recoverable ? 2 : 1) ? 'wrong-bulk' : null;
    },
  });
})();
