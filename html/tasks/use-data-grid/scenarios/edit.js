/*
 * use-data-grid / shared by cellEdit, crm and virtual: the cell-edit goal, start, solve, plan and wording
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { changed, colName, colOf, commitEdit, fill, inPage, lev, pick, quote, rowLabel, rowOf, say, valueOf, visibleRows } = fam.lib;

  function ticketError(m, spec) {
    const g = spec.goal;
    let errors = 0;
    for (const row of spec.rows) {
      let e = 0;
      for (const c of spec.cols) {
        const want = row.id === g.row && c.id === g.col ? g.text : String(row.c[c.id]);
        const cur = String(valueOf(m, spec, row, c.id));
        e += lev(cur, want) / Math.max(1, cur.length, want.length);
      }
      if (m.removed[row.id]) e += 1;
      errors += Math.min(1, e);
    }
    return errors;
  }

  function editInit(spec, m, mode, rng) {
    const g = spec.goal;
    const orig = rowOf(spec, g.row).c[g.col];
    if (mode === 'partial') m.edits = { [g.row]: { [g.col]: g.text.slice(0, Math.max(1, Math.ceil(g.text.length / 2))) } };
    else if (mode === 'wrong') {
      const o = rng.pick(spec.rows.filter((r) => r.id !== g.row));
      m.edits = { [o.id]: { [g.col]: String(g.text) } };
    }
    void orig;
  }

  function editPlan(m, spec) {
    const v = spec.scenario;
    const g = spec.goal;
    if (['crm', 'virtual'].includes(v) && m.history.length && spec.rows.some(r => changed(m, r.id))) {
      if (m.menu || m.markMenu) return { click: { blank: true } };
      return { click: { undo: true } };
    }
    if (m.editing) {
      const e = m.editing;
      const want = e.row === g.row && e.col === g.col ? g.text : String(rowOf(spec, e.row).c[e.col]);
      return e.draft !== want ? { type: [{ cellInput: true }, want] } : { key: 'Enter' };
    }
    let target = [g.row, g.col];
    for (const [r, cs] of Object.entries(m.edits || {})) {
      for (const c of Object.keys(cs)) if (!(r === g.row && c === g.col)) target = [r, c];
    }
    if (spec.scenario === 'virtual' && !inPage(m, spec, target[0])) {
      const idx = visibleRows(m, spec).findIndex(r => r.id === target[0]);
      return { wheel: [{ viewport: true }, Math.max(-420, Math.min(420, (idx - (m.virtualTop || 0) - 2) * 22))] };
    }
    return { dblclick: { cell: target } };
  }

  function editInstruction(spec, rng) {
    const g = spec.goal;
    const col = colName(rng, spec, g.col);
    const who = quote(rowLabel(spec, g.row));
    const T = ['Change {col} for {who} to {text}; leave the other records unchanged.', 'The {col} for {who} needs to be {text}.',
      'Set {col} to {text} for {who}, keeping the rest of the list as it is.', 'Update {who}: {col} should read {text}.',
      'Correct {who} so their {col} is {text}.',
      '{who} needs {text} in {col}; change nothing else.',
      'Enter {text} as {col} for {who}; keep all else as is.',
      '{who}: replace just the {col} value with {text}.',
      'Limit the edit to {col} for {who}: use {text}.',
      'All cells stay as they are except {col} for {who}: {text}.'];
    const core = fill(pick(rng, spec, T), { col, who, text: quote(g.text) });
    return say(rng, spec, core, { terse: `${who} ${col} = ${g.text}` });
  }

  function editSolve(spec, m) {
    const g = spec.goal;
    return commitEdit({ ...m, ...(spec.scenario === 'cellEdit' ? {} : { status: {}, removed: {}, virtualTop: Math.min(spec.rows.length - 6, Math.max(0, spec.rows.findIndex(r => r.id === g.row) - 2)) }), edits: { [g.row]: { [g.col]: /^\d+$/.test(g.text) && colOf(spec, g.col).type === 'num' ? Number(g.text) : g.text } }, editing: null }, spec);
  }

  function editRetarget(s, spec, model) {
    const g = s.goal;
    g.text = String(rowOf(spec, g.row).c[g.col]);
    if (String(valueOf(model, spec, rowOf(spec, g.row), g.col)) === g.text) g.text = spec.goal.text + (colOf(spec, g.col).type === 'num' ? '1' : ' II');
    return true;
  }

  Object.assign(fam.lib, { ticketError, editInit, editPlan, editInstruction, editSolve, editRetarget });
})();
