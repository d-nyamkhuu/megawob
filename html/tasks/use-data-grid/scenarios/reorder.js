/*
 * use-data-grid / drag a column header to a new position
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { colName, fill, pick, say } = fam.lib;

  function kendall(order, target) {
    const pos = new Map(target.map((c, i) => [c, i]));
    let bad = 0;
    let n = 0;
    for (let i = 0; i < order.length; i++) {
      for (let j = i + 1; j < order.length; j++) {
        n++;
        if (pos.get(order[i]) > pos.get(order[j])) bad++;
      }
    }
    return n ? bad / n : 0;
  }

  function finishReorder(rng, spec) {
    const ids = spec.cols.map((c) => c.id);
    const mode = rng.pick(['first', 'last', 'after', 'before']);
    const col = rng.pick(ids);
    const others = ids.filter((x) => x !== col);
    let order;
    let ref = null;
    if (mode === 'first') order = [col, ...others];
    else if (mode === 'last') order = [...others, col];
    else {
      ref = rng.pick(others);
      const i = others.indexOf(ref) + (mode === 'after' ? 1 : 0);
      order = others.slice(0, i).concat([col], others.slice(i));
    }
    if (order.join() === ids.join()) return false;
    spec.goal = { col, mode, ref };
    spec.order = order;
    return true;
  }

  env.scenario('use-data-grid', {
    name: 'reorder',
    rows: [[6, 10], [8, 12]],
    levelRows: { easy: [5, 7], medium: [6, 8] },
    goal(rng, spec) {
    spec.pageSize = Math.max(spec.rows.length, 6);
    return { need: [], finish: (s) => finishReorder(rng, s) };
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      if (mode === 'partial') {
        const cur = m.order.indexOf(g.col);
        const want = spec.order.indexOf(g.col);
        const others = m.order.filter((x) => x !== g.col);
        const mid = Math.round((cur + want) / 2);
        const k = mid === cur ? want : mid;
        m.order = others.slice(0, k).concat([g.col], others.slice(k));
      } else if (mode === 'wrong') {
        const other = rng.pick(m.order.filter((x) => x !== g.col));
        const rest = m.order.filter((x) => x !== other);
        const k = rng.int(0, rest.length);
        m.order = rest.slice(0, k).concat([other], rest.slice(k));
      }
    },
    solve(spec, m) {
      return { ...m, order: spec.order.slice() };
    },
    tolerance() {
      return { tau: 0, sigma: 0.15, minInitialError: 0.01 };
    },
    error(m, spec) {
      return kendall(m.order, spec.order);
    },
    plan(m, spec) {
      if (m.menu || m.markMenu) return { click: { blank: true } };
      const want = spec.order;
      // Move the first column (in target order) that is out of place: insert it after its target predecessor.
      for (let i = 0; i < want.length; i++) {
        if (m.order[i] !== want[i]) {
          const col = want[i];
          const others = m.order.filter((c) => c !== col);
          const k = i === 0 ? 0 : others.indexOf(want[i - 1]) + 1;
          return { drag: [{ header: col }, { slot: k, col }] };
        }
      }
      return null;
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const col = colName(rng, spec, g.col);
      const ref = g.ref ? colName(rng, spec, g.ref) : '';
      const T = {
        first: ['Move the {col} column so it is the first column.', 'I want {col} at the beginning of the table.', 'Make {col} the first column in the grid.',
          'Reorder the columns so {col} comes first.', 'The {col} column should be leftmost; move it there.', 'Put {col} at the start of the table.',
          'Drag {col} all the way left in the column row.'],
        last: ['Move the {col} column to the end.', 'I want {col} at the end of the table.', 'Make {col} the last column.',
          'Reorder the columns so {col} comes last.', 'The {col} column should be rightmost; move it there.', 'Put {col} at the end of the table.',
          'End the column order with {col}.', '{col} belongs in the final column slot.',
          'Drag {col} to the far right of the table.'],
        after: ['Place the {col} column right after {ref}.', 'Reorder the columns so {col} comes directly after {ref}.', 'The column immediately after {ref} should be {col}.',
          'Move {col} so that it follows {ref}.', '{col} should sit immediately to the right of {ref}.', 'Put the {col} column just after the {ref} column.',
          'Drag {col} to the next column slot after {ref}.', 'I want {ref} followed immediately by {col}.',
          '{col} belongs in the column slot just after {ref}.'],
        before: ['Place the {col} column right before {ref}.', 'Reorder the columns so {col} comes directly before {ref}.', 'The column immediately before {ref} should be {col}.',
          'Move {col} so that it precedes {ref}.', '{col} should sit immediately to the left of {ref}.', 'Put the {col} column just before the {ref} column.',
          'Drag {col} to the column slot just ahead of {ref}.', 'I want {col} immediately followed by {ref}.',
          '{col} belongs in the slot one column before {ref}.'],
      }[g.mode];
      const core = fill(pick(rng, spec, T), { col, ref });
      return say(rng, spec, core, {});
    },
    parts(m, spec, out) {
      return out.concat(spec.cols.map((c) => ({ name: c.label, value: m.order.indexOf(c.id) })));
    },
  });
})();
