/*
 * use-data-grid / drag a column edge to a width
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { clamp, colName, colOf, fill, MAXW, MINW, needW, pick, say, setWidth } = fam.lib;

  function finishResize(rng, spec) {
    const cols = spec.cols;
    const total = cols.reduce((a, c) => a + c.w, 0);
    const c = rng.pick(cols);
    const mode = rng.pick(['px', 'px', 'px', 'match', 'double', 'half']);
    let width;
    let ref = null;
    if (mode === 'px') {
      const lo = Math.ceil(Math.max(MINW + 24, needW(c)) / 10);
      const hi = Math.floor(Math.min(320, c.w + 730 - total) / 10);
      if (lo > hi) return false;
      width = 10 * rng.int(lo, hi);
    }
    else if (mode === 'match') {
      const others = cols.filter((o) => o.id !== c.id && Math.abs(o.w - c.w) >= 40);
      if (!others.length) return false;
      ref = rng.pick(others).id;
      width = colOf(spec, ref).w;
    } else if (mode === 'double') width = c.w * 2;
    else width = Math.round(c.w / 2);
    if (!(width >= MINW + 10 && width <= MAXW - 20)) return false;
    if (total - c.w + width > 740) return false;
    if (Math.abs(width - c.w) < 40) return false;
    if (spec.keys && Math.abs(width - c.w) > 220) return false;
    spec.goal = { col: c.id, width, mode, ref };
    return true;
  }

  env.scenario('use-data-grid', {
    name: 'resize',
    rows: [[6, 10], [8, 12]],
    levelRows: { easy: [5, 7], medium: [6, 8] },
    goal(rng, spec, dom) {
    spec.pageSize = Math.max(spec.rows.length, 6);
    spec.keys = rng.bool(0.25);
    return { need: [], finish: (s) => finishResize(rng, s) };
    },
    init(spec, m, mode, rng) {
      const g = spec.goal;
      const c = g.col;
      const w0 = m.widths[c];
      if (mode === 'partial') m.widths[c] = Math.round(w0 + (g.width - w0) / 2);
      else if (mode === 'wrong') m.widths[c] = Math.round(clamp(w0 - (g.width - w0) / 2, MINW, MAXW));
    },
    solve(spec, m) {
      const g = spec.goal;
      return setWidth(m, g.col, g.width);
    },
    tolerance(spec) {
      const f = spec.level === 'easy' ? 2 : spec.level === 'medium' ? 1.5 : 1; // levels: looser width tolerance
      const tau = Math.round((spec.goal.mode === 'px' ? 6 : Math.max(6, Math.round(spec.goal.width * 0.08))) * f);
      return { tau, sigma: 30, minInitialError: Math.max(3 * tau, 30) };
    },
    error(m, spec) {
      const g = spec.goal;
      return Math.abs((m.widths[g.col] || 0) - g.width);
    },
    plan(m, spec) {
      const g = spec.goal;
      if (m.menu || m.markMenu) return { click: { blank: true } };
      const w = m.widths[g.col];
      if (spec.keys) {
        if (!(m.focus && m.focus.kind === 'edge' && m.focus.col === g.col)) return { click: { edge: g.col } };
        if (Math.abs(w - g.width) > 5) return { key: g.width > w ? 'ArrowRight' : 'ArrowLeft' };
      }
      return { drag: [{ edge: g.col }, { edgeAt: [g.col, g.width] }] };
    },
    instruction(spec, rng) {
      const g = spec.goal;
      const col = colName(rng, spec, g.col);
      const tol = env.instruct.tol(rng, g.mode === 'px' ? ' (±6 px)' : '', 0.4);
      let T;
      const vars = { col, w: g.width, tol };
      if (g.mode === 'px') {
        const verb = g.width > colOf(spec, g.col).w ? 'Widen' : 'Narrow';
        T = ['Resize the {col} column to {w} px wide{tol}.', 'Make the {col} column {w} pixels wide{tol}.', 'The {col} column should be {w} pixels wide{tol}.',
          'Set the width of the {col} column to about {w} px.', `${verb} the {col} column to {w} px{tol}.`, "Change the {col} column's width to {w}px{tol}."];
      } else if (g.mode === 'match') {
        vars.ref = colName(rng, spec, g.ref);
        T = ['Make the {col} column as wide as the {ref} column.', 'Resize {col} so it matches the width of {ref}.', 'Give the {col} column the same width as {ref}.',
          'The {col} and {ref} columns need equal widths.', '{col} and {ref} should be the same width; resize {col}.', 'Match the width of the {col} column to the {ref} column.',
          'Use {ref} as the width target for the {col} column.', 'Leave {ref} as is and resize {col} to its width.'];
      } else if (g.mode === 'double') {
        T = [
          'Make the {col} column twice as wide as it is now.', 'Double the width of the {col} column.',
          'Resize {col} to double its current width.', 'The target for {col} is twice its current width.'
        ];
      } else {
        T = [
          'Halve the width of the {col} column.', 'Make the {col} column half as wide as it is now.',
          'Resize {col} to half its current width.', 'Remove half the width of the {col} column.'
        ];
      }
      const core = fill(pick(rng, spec, T), vars);
      return say(rng, spec, core, { terse: g.mode === 'px' ? `${col}: ${g.width}px` : undefined });
    },
    parts(m, spec, out) {
      return out.concat(spec.cols.map((c) => ({ name: c.label, value: m.widths[c.id] })));
    },
  });
})();
