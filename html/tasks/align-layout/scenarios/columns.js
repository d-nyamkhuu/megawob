/*
 * layout / columns: sampling, start states, scoring and oracle geometry.
 * Spec, model and targets are documented in logic.js; shared geometry is on the task's lib.
 */
(function () {
  'use strict';

  const { MIN_COL, baseSpec, fitTarget, placedCount, sum } = env.taskOf('align-layout').lib;

  const COLUMNS = [
    'Name', 'Email', 'Status', 'Role', 'Plan', 'Joined', 'Amount', 'City', 'Phone', 'Owner', 'Type', 'Region', 'Team',
    'Score', 'Source', 'Weight', 'Color', 'Shape', 'Fabric', 'Model', 'Batch', 'Stock', 'Unit', 'Depot', 'Aisle',
    'Shelf', 'Floor', 'Room', 'Route', 'Method', 'Speed', 'Power', 'Fuel', 'Noise', 'Expiry', 'Time', 'Year',
    'Season', 'Notes', 'Topic', 'Access', 'Errors', 'Views', 'Likes', 'Files', 'Tags', 'Link', 'Host', 'Port',
    'Device', 'Length', 'Code', 'Task', 'Depth', 'Angle', 'Tax', 'Age', 'Skill', 'Shift', 'Demand', 'Risk', 'Effort',
    'Cycles', 'Torque', 'Signal', 'Uptime', 'Build', 'Cache', 'Pixels', 'Border', 'Queue', 'Review'
  ];

  function sampleColumns(rng, opts) {
    const spec = baseSpec('columns', rng, opts);
    spec.W = 600;
    spec.H = 190;
    const n = spec.level === 'easy' ? 3 : spec.level === 'medium' ? rng.int(3, 4) : rng.int(4, 5);
    spec.goal = rng.pick(['widths', 'fit']);
    spec.pad = rng.pick([8, 10, 12, 16]);
    for (let attempt = 0; attempt < 40; attempt++) {
      spec.names = rng.sample(COLUMNS, n);
      const rows = 3;
      if (spec.goal === 'widths') {
        spec.target = spec.names.map(() => rng.int(8, 20) * 10);
        spec.cells = Array.from({ length: rows }, () => spec.names.map(() => rng.int(44, 130)));
      } else {
        spec.cells = Array.from({ length: rows }, () => spec.names.map(() => rng.int(44, 130)));
        spec.target = fitTarget(spec);
      }
      if (sum(spec.target) > spec.W - 30 || Math.min(...spec.target) < 84) continue;
      return spec;
    }
    throw new Error('layout columns: no fit');
  }

  function initColumns(spec, rng) {
    const n = spec.names.length;
    const mode = spec.startMode;
    const t = spec.target;
    const rr = rng.fork('init');
    const lv = rng.fork('level');
    const limit = spec.W - 8;
    if (mode === 'solved') return { r: [], cols: t.slice(), z: [] };
    if (mode === 'wrong') {
      const cols = t.map((v) => v + (rr.bool() ? 1 : -1) * rr.int(10, 22));
      return { r: [], cols: cols.map((v) => Math.max(MIN_COL + 10, v)), z: [] };
    }
    const k = mode === 'partial' ? rr.int(1, n - 1) : placedCount(spec, n, lv);
    const cols = t.slice();
    // Left to right, a divider must stay on the table at the time the plan reaches it.
    for (let c = k; c < n; c++) {
      const room = limit - sum(t.slice(0, c));
      let w = t[c];
      for (let a = 0; a < 20; a++) {
        const cand = rr.int(60, Math.min(220, room));
        if (Math.abs(cand - t[c]) >= 16) { w = cand; break; }
      }
      cols[c] = w === t[c] ? Math.min(room, t[c] + 20) : w;
    }
    const tail = cols.slice(k);
    if (tail.length && tail.every((v, j) => Math.abs(v - t[k + j]) < 16)) cols[k] = Math.min(limit - sum(t.slice(0, k)), t[k] + 24);
    return { r: [], cols, z: [] };
  }

  env.scenario('align-layout', {
    name: 'columns',
    sample: sampleColumns,
    init: initColumns,
    error(model, spec) {
      return Math.max(...model.cols.map((w, c) => Math.abs(w - spec.target[c])));
    },
    plan(model, spec) {
      // Narrow columns first: widening one pushes the later dividers right, and while the table is wider than
      // the canvas the last of them is off the canvas (a switched target from a mid-way table hits this).
      const shrink = model.cols.findIndex((w, c) => w > spec.target[c]);
      const c = shrink >= 0 ? shrink : model.cols.findIndex((w, c) => w !== spec.target[c]);
      return c < 0 ? null : { drag: [{ div: c }, { div: c, dx: spec.target[c] - model.cols[c] }] };
    },
    solve(spec, model) {
      return { ...model, cols: spec.target.slice() };
    },
  });
})();
