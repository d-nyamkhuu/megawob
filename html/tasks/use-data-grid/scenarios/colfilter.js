/*
 * use-data-grid / filter by a header value, then a bulk action on exactly those records
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { bulkData, bulkInit, bulkInstruction, bulkPlan, bulkSolve, jaccard, planOf, rowOf, sampleAdmin, STATUS } = fam.lib;

  env.scenario('use-data-grid', {
    name: 'colfilter',
    batch: true,
    saves: true,
    sample(rng, opts) {
      return sampleAdmin(rng, opts);
    },
    init(spec, m, mode, rng) {
      return bulkInit(spec, m, mode, rng);
    },
    solve(spec, m, model) {
      const g = spec.goal;
      return { ...bulkSolve(spec, m, model), query: '', filters: { [g.col]: g.values.slice() } };
    },
    error(m, spec) {
      const g = spec.goal;
      if (spec.scenario === 'colfilter') return bulkData(m, spec) + (jaccard(m.filters[g.col] || [], g.values) === 1 && !m.query ? 0 : 0.25);
    },
    plan(m, spec) {
      const g = spec.goal;
      if (jaccard(m.filters[g.col] || [], g.values) !== 1 || m.query || Object.keys(m.filters).some(c => c !== g.col)) {
        if (m.query || Object.keys(m.filters).some(c => c !== g.col)) return { click: { clearFilters: true } };
        // a wrong start can leave only target rows visible with no filter set: the filter planner then has nothing
        // to do, and the bulk plan's Undo comes first
        return planOf(m, { ...spec, scenario: 'filter', route: 'menu' }) || bulkPlan(m, spec);
      }
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
