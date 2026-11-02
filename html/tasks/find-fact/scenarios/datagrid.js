/*
 * find-fact / datagrid: a data table bigger than its view.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const { keepIdx } = env.util;
  const { askField, colNoun, DATASETS, dataTable, gridRows, normText, pickCols, say, textErr, VSCROLL_VIEW,
    wrongOf } = fam.lib;

  function sampleDatagrid(rng, spec, opts = {}) {
    const traits = opts.traits || {};
    // traits.gridModes: the modes a widget can draw (same single draw, so other widgets' seeds are unchanged).
    const mode = rng.pick(traits.gridModes ? [].concat(traits.gridModes) : ['sort', 'filter', 'pages', 'hscroll']);
    // traits.vscroll (hscroll only): a long table whose body also scrolls vertically under a sticky header.
    const vscroll = mode === 'hscroll' && !!traits.vscroll && !!rng.fork('vscroll').pick([].concat(traits.vscroll));
    const dataset = rng.pick(Object.keys(DATASETS));
    for (let tries = 0; ; tries++) {
      let names;
      let nRows;
      if (mode === 'hscroll') {
        const def = DATASETS[dataset];
        names = def.cols.map((c) => c.name).slice(0, spec.ood ? def.cols.length : Math.min(def.cols.length, rng.int(8, 10)));
        nRows = spec.ood ? rng.int(8, 10) : rng.int(5, 7);
        if (vscroll) nRows = spec.ood ? rng.int(28, 36) : rng.int(16, 24);
      } else {
        names = pickCols(rng, dataset, rng.int(4, 5), false);
        nRows = spec.ood ? rng.int(30, 48) : rng.int(12, 20);
      }
      const t = dataTable(rng, dataset, nRows, names, spec);
      const out = { mode, dataset, title: t.title, ref: t.ref, cols: t.cols, rows: t.rows, nums: t.nums,
        perPage: mode === 'hscroll' ? 0 : rng.pick([5, 6, 8]), filterable: mode === 'filter' || rng.bool(0.3) };
      if (mode === 'hscroll') out.filterable = false;
      const numCols = t.cols.map((c, i) => (c.num ? i : -1)).filter((i) => i > 0);
      if (mode === 'sort') {
        if (!numCols.length) continue;
        const sc = rng.pick(numCols);
        const dir = rng.pick(['asc', 'desc']);
        const vals = t.nums.map((r) => r[sc]);
        const best = dir === 'desc' ? Math.max(...vals) : Math.min(...vals);
        if (vals.filter((v) => v === best).length !== 1) continue;
        const target = vals.indexOf(best);
        if (target < out.perPage) continue; // not on the first page of the unsorted table
        const col = rng.pick(t.cols.map((_, i) => i).filter((i) => i !== sc));
        Object.assign(out, { sortCol: sc, dir, target, col });
      } else if (mode === 'hscroll') {
        const target = rng.int(0, t.rows.length - 1);
        const col = rng.int(Math.max(4, t.cols.length - 4), t.cols.length - 1);
        Object.assign(out, { target, col, route: rng.pick(['wheel', 'thumb']) });
        if (vscroll) {
          // The asked row starts below the fold (widgets show at most VSCROLL_VIEW rows at a time).
          out.vscroll = true;
          out.target = rng.int(VSCROLL_VIEW + 1, t.rows.length - 1);
        }
      } else {
        const target = rng.int(out.perPage, t.rows.length - 1);
        const col = rng.int(1, t.cols.length - 1);
        Object.assign(out, { target, col });
      }
      // The key column must identify the target (no other row's key contains it, for the filter).
      const key = t.rows[out.target][0].toLowerCase();
      if (t.rows.some((r, i) => i !== out.target && r[0].toLowerCase().includes(key))) continue;
      out.answer = t.rows[out.target][out.col];
      return out;
    }
  }

  const rowVisible = (model, spec) => !spec.vscroll || (!!model.rview && spec.target >= model.rview[0] && spec.target <= model.rview[1]);

  function gridVisible(model, spec) {
    if (spec.mode === 'hscroll') return !!model.view && spec.col >= model.view[0] && spec.col <= model.view[1] && rowVisible(model, spec);
    return gridRows(model, spec).rows.includes(spec.target);
  }

  env.scenario('find-fact', {
    name: 'datagrid',
    sample: sampleDatagrid,
    route(spec, r) {
            if (spec.mode === 'hscroll' && (r === 'wheel' || r === 'pointer')) {
              spec.route = r === 'wheel' ? 'wheel' : 'thumb';
              spec.forcedRoute = r;
      }
    },
    baseModel(spec) {
      return spec.vscroll ? { answers: [''], sort: null, filter: '', page: 0, hcol: 0, view: null, vrow: 0, rview: null }
      : { answers: [''], sort: null, filter: '', page: 0, hcol: 0, view: null };
    },
    typedStart(m, spec, mode) {
      if (mode !== 'partial') return;
      // Navigation already done, nothing typed yet.
      m.answers = [''];
      if (spec.mode === 'sort') m.sort = { col: spec.sortCol, dir: spec.dir };
      else if (spec.mode === 'filter') m.filter = spec.rows[spec.target][0];
      else if (spec.mode === 'pages') m.page = Math.floor(gridRows(m, spec).order.indexOf(spec.target) / spec.perPage);
      else {
        m.hcol = Math.max(1, spec.col - 1);
        if (spec.vscroll) m.vrow = Math.max(0, spec.target - 2);
      }
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (spec.vscroll) return;
      const per = spec.perPage || 0;
      const n = spec.rows.length;
      let keep;
      if (spec.mode === 'hscroll') keep = keepIdx(r, n, [spec.target], k(2, 3));
      else {
        // The target must stay off the first page of the unsorted table: perPage rows before it.
        const before = [...Array(spec.target).keys()];
        const after = [...Array(n - spec.target - 1).keys()].map((i) => spec.target + 1 + i);
        const kb = r.sample(before, Math.min(before.length, per + k(0, 2)));
        if (kb.length < per) return;
        keep = [...new Set([...kb, spec.target, ...r.sample(after, Math.min(after.length, k(1, 3)))])].sort((a, b) => a - b);
      }
      if (keep.length < n) {
        const t0 = keep.indexOf(spec.target);
        spec.rows = keep.map((i) => spec.rows[i]);
        spec.nums = keep.map((i) => spec.nums[i]);
        spec.target = t0;
      }
    },
    wrongAnswers: (spec, rng) => [wrongOf(rng, spec.answer, spec.rows.map((r) => r[spec.col]))],
    error(model, spec) {
      const d = textErr(model.answers[0], spec.answer);
      return d === 0 ? 0 : d * (gridVisible(model, spec) ? 0.8 : 1);
    },
    plan(model, spec) {
      if (!gridVisible(model, spec)) {
        if (spec.mode === 'sort') return { click: { sortBy: spec.sortCol } };
        if (spec.mode === 'filter') return { type: [{ filter: true }, spec.rows[spec.target][0]] };
        if (spec.mode === 'pages') {
          const g = gridRows(model, spec);
          const at = g.order.indexOf(spec.target);
          if (at < 0) return { type: [{ filter: true }, ''] };
          return { click: { gpage: Math.floor(at / spec.perPage) } };
        }
        if (spec.vscroll && !rowVisible(model, spec)) {
          // Rows first (the body scrolls under the sticky header), then columns.
          if (spec.route === 'wheel') return { wheel: [{ grid: true }, model.rview && spec.target < model.rview[0] ? -120 : 120, 0] };
          return { drag: [{ vthumb: true }, { vscrollTo: spec.target }] };
        }
        if (spec.route === 'wheel') {
          const v = model.view || [0, 0];
          return { wheel: [{ grid: true }, 0, spec.col > v[1] ? 260 : -260] };
        }
        return { drag: [{ hthumb: true }, { hscrollTo: spec.col }] };
      }
      if (spec.mode === 'sort') {
        // Sorted the wrong way round still shows the target only if it sits on the same page: re-sort.
        const g = gridRows(model, spec);
        if (!model.sort || model.sort.col !== spec.sortCol || model.sort.dir !== spec.dir) {
          if (g.rows.includes(spec.target) && normText(model.answers[0]) !== normText(spec.answer)) return { type: [{ field: 0 }, spec.answer] };
          return { click: { sortBy: spec.sortCol } };
        }
      }
      return { type: [{ field: 0 }, spec.answer] };
    },
    answers: (spec, one) => one(spec.cols[spec.col].noun, spec.answer, spec.cols[spec.col].aliases || []),
    instruction(spec, rng) {
      const col = colNoun(rng, spec.cols[spec.col]);
      if (spec.mode === 'sort') {
        const sc = spec.cols[spec.sortCol];
        const sup = spec.dir === 'desc' ? rng.pick(['highest', 'largest', 'greatest']) : rng.pick(['lowest', 'smallest']);
        const what = DATASETS[spec.dataset].keyNoun;
        return say(rng, spec, [
          'Type the {col} of the {what} with the {sup} {sc}.',
          'Which {what} has the {sup} {sc}? Enter its {col}.',
          'Find the {what} with the {sup} {sc} and type its {col}.',
          'Enter the {col} for the {what} whose {sc} is the {sup}.',
          'Sort out which {what} has the {sup} {sc}, then type that row’s {col}.',
          'Look for the {sup} {sc} in the table and report the {col} of that {what}.',
          'For the {what} whose {sc} is {sup}, fill in its {col}.',
          'Your answer is the {col} of the {what} with the {sup} {sc}.',
          'Take the {what} with the {sup} {sc} and copy its {col} into the field.',
        ], { col, sup, sc: colNoun(rng, sc), what }, { terse: `${what} with the ${sup} ${sc.noun}: ${col}?` });
      }
      const row = `${spec.ref}${spec.rows[spec.target][0]}`;
      return say(rng, spec, [
        'Enter the {col} of {row} into the answer field.',
        'Look up {row} in the table and type its {col}.',
        'What is the {col} for {row}? Type it.',
        'Find the row for {row} and enter the {col}.',
        'Type the {col} listed for {row}.',
        'Report the {col} of {row}.',
        'Read across {row} to its {col} and type it.',
      ], { col, row }, { terse: `${col} of ${row}` });
    },
    replyInstruction(spec, rng) {
      const col = colNoun(rng, spec.cols[spec.col]);
      if (spec.mode === 'sort') {
        const sc = spec.cols[spec.sortCol];
        const sup = spec.dir === 'desc' ? rng.pick(['highest', 'largest', 'greatest']) : rng.pick(['lowest', 'smallest']);
        const what = DATASETS[spec.dataset].keyNoun;
        return say(rng, spec, [
          'Which {what} has the {sup} {sc}? I need its {col}.',
          'Find the {what} with the {sup} {sc} and check its {col}.',
          'What is the {col} of the {what} whose {sc} is the {sup}?',
          'Look for the {sup} {sc} in the table and read the {col} of that {what}.',
          'Sort out which {what} has the {sup} {sc}, then read that row’s {col}.',
          'Tell me the {col} belonging to the {what} with the {sup} {sc}.',
          'I’m after the {col} for whichever {what} has the {sup} {sc}.',
          'Using {sc}, pick the {what} with the {sup} value. Give its {col}.',
        ], { col, sup, sc: colNoun(rng, sc), what }, { terse: `${what} with the ${sup} ${sc.noun}: ${col}?` });
      }
      const row = `${spec.ref}${spec.rows[spec.target][0]}`;
      return say(rng, spec, [
        'What is the {col} for {row}?',
        'Look up {row} in the table and check its {col}.',
        'Find the row for {row} and read the {col}.',
        'Check the {col} listed for {row}.',
        'I need the {col} of {row}.',
        'Tell me what {row} has under {col}.',
      ], { col, row }, { terse: `${col} of ${row}` });
    },
    judgeAsk: askField,
  });
})();
