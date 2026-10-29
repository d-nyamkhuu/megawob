/*
 * use-data-grid / shared by select, bulk, multirow and colfilter: row selection and the bulk action goal
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { listText, changed, colOf, fill, isGood, pageRows, pick, pred, quote, runBulk, say, undo } = fam.lib;

  // Fix the selection on the current (only) page to equal `want`; returns a step or null when equal.
  function selectPlan(m, spec, want, mode) {
    const page = pageRows(m, spec).map((r) => r.id);
    const W = new Set(want);
    const S = new Set(m.selected);
    const bad = page.filter((id) => W.has(id) !== S.has(id));
    const offPage = m.selected.filter((id) => !page.includes(id) && !W.has(id));
    if (offPage.length) return { click: { clearSel: true } };
    if (!bad.length) return null;
    const allOn = page.every((id) => S.has(id));
    if (!allOn && want.length >= page.length - 2 && bad.length > 2) return { click: { all: true } };
    if (mode === 'range' && want.length >= 3) {
      const idx = page.map((id) => W.has(id));
      const first = idx.indexOf(true);
      const last = idx.lastIndexOf(true);
      const contiguous = idx.slice(first, last + 1).every(Boolean);
      const extras = m.selected.filter((id) => !W.has(id));
      if (contiguous && !extras.length) {
        const fid = page[first];
        const lid = page[last];
        if (!S.has(fid) && !page.slice(first, last + 1).some((id) => S.has(id))) return { click: { row: fid } };
        if (m.anchor === fid && S.has(fid) && !S.has(lid)) return { click: { row: lid }, modifiers: ['Shift'] };
      }
    }
    return { click: { row: bad[0] } };
  }

  function bulkData(m, spec) {
    const T = new Set(spec.target);
    let good = 0;
    const uni = new Set(spec.target);
    for (const r of spec.rows) {
      if (T.has(r.id) && isGood(m, spec, r.id)) good++;
      if (changed(m, r.id)) uni.add(r.id);
    }
    return 1 - good / uni.size;
  }

  function bulkError(m, spec) {
    const T = new Set(spec.target);
    const dataError = bulkData(m, spec);
    // Before any action has run, ticking the right rows is the only progress there can be, worth up to half; a wrong
    // row ticked costs twice a missing one, so ticking every row earns nothing.
    if (dataError < 1 || spec.judge || (m.history || []).length) return dataError;
    const hit = m.selected.filter((id) => T.has(id)).length;
    return 0.5 + 0.5 * Math.min(1, (T.size - hit + 2 * (m.selected.length - hit)) / T.size);
  }

  function bulkPlan(m, spec, pickRows = (remaining) => selectPlan(m, spec, remaining, 'set')) {
    const g = spec.goal;
    const T = new Set(spec.target);
    const bad = spec.rows.some((r) => changed(m, r.id) && !(T.has(r.id) && isGood(m, spec, r.id)));
    if (bad && m.history.length) {
      if (m.menu || m.markMenu) return { click: { blank: true } };
      return { click: { undo: true } };
    }
    if (m.confirm) return { click: { confirm: 'ok' } };
    const remaining = spec.target.filter((id) => !isGood(m, spec, id));
    if (m.markMenu && g.action === 'status' && m.selected.length && m.selected.every((id) => remaining.includes(id))
      && remaining.every((id) => m.selected.includes(id))) return { click: { statusOpt: g.value } };
    if (m.menu || m.markMenu) return { click: { blank: true } };
    const fix = pickRows(remaining);
    if (fix) return fix;
    return { click: { bulk: g.action } };
  }

  function bulkSolve(spec, m, model) {
    const g = spec.goal;
    while (m.history.length) m = undo(m, spec);
    m = runBulk({ ...m, selected: spec.target.slice() }, spec, g.action, g.value);
    return { ...m, wrongs: model.wrongs, toast: false };
  }

  function bulkInit(spec, m, mode, rng) {
    const g = spec.goal;
    const ids = spec.rows.map((r) => r.id);
    const T = spec.target;
    if (mode === 'partial') {
      const done = rng.sample(T, Math.max(1, T.length - 1 - rng.int(0, Math.max(0, T.length - 2))));
      const mm = runBulk({ ...m, selected: done }, spec, g.action, g.value);
      return { ...mm, wrongs: 0, toast: rng.bool(0.5) };
    }
    if (mode === 'wrong') {
      const non = ids.filter((x) => !T.includes(x));
      const pickIds = rng.sample(non, rng.int(1, 2));
      const st = spec.statuses.filter((s) => s !== g.value);
      const act = g.action === 'status' ? (rng.bool(0.5) ? 'status' : 'archive') : g.action;
      const val = act === 'status' ? (rng.bool(0.5) ? g.value : rng.pick(st)) : null;
      const mm = runBulk({ ...m, selected: pickIds }, spec, act, val);
      return { ...mm, wrongs: 0, toast: true };
    }
  }

  function bulkInstruction(spec, rng) {
    const g = spec.goal;
    const E = spec.entities;
    const who = g.how === 'match' ? pred(spec, g.col, g.values.map(quote)) : `for ${listText(g.names.map(quote))}`;
    const v = g.value ? quote(g.value) : '';
    const T = {
      status: ['Change the status of every {e} {who} to {v}.', 'Mark all {E} {who} as {v}.', 'Set the {E} {who} to {v}; leave the other records unchanged.',
        'Select the {E} {who} and mark them {v}.', 'Every {e} {who} should end up with status {v}.', 'All {E} {who} need to be marked as {v}.',
        '{v} is the required status for all {E} {who}.', 'Only the {E} {who} are to receive status {v}.',
        'Use {v} as the status for every {e} {who}.', 'Keep all others unchanged; give each {e} {who} status {v}.'],
      archive: ['Archive all {E} {who}.', 'Select the {E} {who} and archive them.', 'Move every {e} {who} to the archive.',
        'Archive the {E} {who}; leave the others as they are.', 'The {E} {who} should be archived.', 'Clean up: archive the {E} {who}.',
        'Include every {e} {who} in the archive.', 'Finish with all {E} {who} archived.',
        'Apply archiving to all {E} {who}.', '{E} {who}: archive them all.', 'All {E} {who} belong in the archive.'],
      delete: ['Delete all {E} {who}.', 'Remove every {e} {who} from the table.', 'Select the {E} {who} and delete them.',
        'The {E} {who} have to be deleted.', 'Get rid of the {E} {who} (delete them).', 'Bulk-delete the {E} {who}.',
        'Apply deletion to all {E} {who}.', 'Ensure every {e} {who} is deleted.', 'Deletion must cover all {E} {who}.',
        'Finish deleting each {e} {who}.'],
    }[g.action];
    const core = (spec.scenario === 'colfilter' ? `Leave only tickets with ${colOf(spec, g.col).label} ${g.values.map(quote).join(' or ')} in this view. ` : '') + fill(pick(rng, spec, T), { e: spec.entity, E, who, v });
    return say(rng, spec, core, {
      ...(spec.scenario === 'colfilter' ? { terse: `Filter ${colOf(spec, g.col).label}: ${g.values.join(' or ')}; mark those tickets ${g.value}` } : {}),
      steps: [...(spec.scenario === 'colfilter' ? [`Keep only tickets with ${colOf(spec, g.col).label} ${g.values.map(quote).join(' or ')} in this view`] : []),
        g.action === 'status' ? `Set the status of the ${E} ${who} to ${v}` : `${g.action === 'archive' ? 'Archive' : 'Delete'} the ${E} ${who}`, 'leave the other records unchanged'],
    });
  }

  Object.assign(fam.lib, { selectPlan, bulkData, bulkError, bulkPlan, bulkSolve, bulkInit, bulkInstruction });
})();
