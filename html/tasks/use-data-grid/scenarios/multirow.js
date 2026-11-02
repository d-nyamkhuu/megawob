/*
 * use-data-grid / pick rows by clicking them, then one bulk action
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { listText, bulkError, bulkPlan, bulkSolve, clone, fill, nameCol, pick, quote, rowLabel, rowOf, say, STATUS } = fam.lib;

  // multirow: make the selection equal `want` with row clicks (a plain click replaces the selection).
  function rowPick(m, spec, want, kind) {
    const S = new Set(m.selected);
    if (want.length === S.size && want.every((x) => S.has(x))) return null;
    const extras = m.selected.filter((x) => !want.includes(x));
    if (!m.selected.length || extras.length) return { click: { rowBody: want[0] } };
    if (kind === 'range' && want.length >= 3 && S.size === 1 && m.anchor === want[0] && S.has(want[0])) {
      return { click: { rowBody: want[want.length - 1] }, modifiers: ['Shift'] };
    }
    return { click: { rowBody: want.find((x) => !S.has(x)) }, modifiers: ['Control'] };
  }

  env.scenario('use-data-grid', {
    name: 'multirow',
    batch: true,
    saves: true,
    rows: [[8, 12], [11, 12]],
    levelRows: { easy: [6, 8], medium: [7, 10] },
    goal(rng, spec, dom) {
    const f = rng.fork('multirow');
    const n = spec.rows.length;
    spec.pageSize = Math.max(n, 6);
    const statusId = dom.cols.find((c) => c.status).id;
    const ids = spec.rows.map((r) => r.id);
    const k = spec.level ? 3 : f.int(3, Math.min(5, n - 3));
    const kind = spec.level === 'easy' ? 'range' : f.pick(['range', 'scatter']);
    let target;
    if (kind === 'range') {
      const a = f.int(0, n - k);
      target = ids.slice(a, a + k);
    } else {
      target = f.sample(ids, k).sort((x, y) => ids.indexOf(x) - ids.indexOf(y));
      if (ids.indexOf(target[k - 1]) - ids.indexOf(target[0]) + 1 === k) return null;
    }
    const action = f.pick(spec.level === 'easy' ? ['status', 'archive'] : ['status', 'status', 'archive', 'delete']);
    const g = { action, how: 'rows', kind, names: target.map((id) => rowOf(spec, id).c[nameCol(dom).id]) };
    if (action === 'status') {
      const cur = new Set(target.map((id) => rowOf(spec, id).c[statusId]));
      const options = STATUS[spec.domain].filter((x) => !cur.has(x));
      if (!options.length) return null;
      g.value = f.pick(options);
    }
    spec.goal = g;
    spec.target = target;
    return { need: [statusId, nameCol(dom).id] };
    },
    init(spec, m, mode, rng) {
      const ids = spec.rows.map((r) => r.id);
      // partial: half of the rows are selected; wrong: other rows are selected too (no bulk action yet)
      const T = spec.target;
      if (mode === 'partial') m.selected = rng.sample(T, Math.max(1, Math.floor(T.length / 2)));
      else if (mode === 'wrong') {
        const non = ids.filter((x) => !T.includes(x));
        m.selected = rng.sample(T, Math.floor(T.length / 3)).concat(rng.sample(non, Math.min(non.length, rng.int(1, 2))));
      }
      m.selected = ids.filter((x) => m.selected.includes(x));
    },
    solve(spec, m, model) {
      return bulkSolve(spec, m, model);
    },
    error(m, spec) {
      return bulkError(m, spec);
    },
    plan(m, spec) {
      return bulkPlan(m, spec, (remaining) => rowPick(m, spec, remaining, spec.goal.kind));
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const E = spec.entities;
      const lab = (id) => quote(rowLabel(spec, id));
      const who = g.kind === 'range'
        ? `from ${lab(spec.target[0])} down to ${lab(spec.target[spec.target.length - 1])} (${spec.target.length} rows, as listed)`
        : `for ${listText(g.names.map(quote))}`;
      const v = g.value ? quote(g.value) : '';
      const T = {
        status: ['Mark the {E} {who} as {v}.', 'Change the status of the {E} {who} to {v} together in one batch.', 'Set the {E} {who} to {v}.',
          'Select the {E} {who} and mark them {v}.',
          'Give the {E} {who} status {v} in bulk.',
          'The {E} {who} need a bulk change to {v}.',
          'Use {v} for the {E} {who} in bulk.'],
        archive: [
          'Archive the {E} {who}.', 'Select the {E} {who} and archive them.',
          'Archive the {E} {who}; leave the others as they are.', 'Move the {E} {who} over to the archive.',
          'The {E} {who} must all be archived.', 'Apply archiving only to the {E} {who}.'
        ],
        delete: [
          'Delete the {E} {who}.', 'Select the {E} {who} and delete them.', 'Bulk-delete the {E} {who}.',
          'The {E} {who} need deleting.', 'Apply deletion to {E} {who}.'
        ],
      }[g.action];
      const tail = pick(rng, spec, [' Handle this set together in a single batch.', ' Do it in one bulk action.', ' These records should be handled together in a single batch.']);
      const core = fill(pick(rng, spec, T), { E, who, v }) + tail;
      return say(rng, spec, core, { terse: `${g.action}${g.value ? ' ' + v : ''}: ${g.kind === 'range' ? who : g.names.join(', ')}` });
    },
    retarget(s, spec, model, rng) {
      const g = s.goal;
      if (g.action !== 'status') return false;
      const other = STATUS[s.domain].filter(v => v !== g.value && s.target.every(id => rowOf(s, id).c[s.statusCol] !== v));
      if (!other.length) return false; g.value = rng.pick(other);
      return true;
    },
    ended(m, spec) {
      if (m.wrongs >= (spec.recoverable ? 2 : 1)) return 'wrong-bulk';
      if (m.history.length > 1) return 'one-batch'; // a second bulk operation, the first not undone
      return null;
    },
    unsave(m, prev) {
      // A retry of multirow must still be its first batch; the failed save did not count.
      m.history = clone(prev.history);
      m.selected = [];
    },
  });
})();
