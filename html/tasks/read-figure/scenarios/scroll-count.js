/*
 * read-figure / scroll-count: a list pane of rows (icon + label) that shows spec.view rows at a time.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const C = env.content;
  const I = env.instruct;
  const { clickByCount, factsCount, glyphAliases, glyphNames, planOption, selfCheckCounted, toleranceCounted,
    truthKey, wrongOption } = fam.lib;

  env.scenario('read-figure', {
    name: 'scroll-count',
    sample(rng, o) {
      const cr = rng.fork('content');
      const cs = { csplit: o.csplit };
      const n = o.ood ? rng.int(40, 60) : rng.int(18, 30);
      const view = rng.int(6, 8);
      const icons = rng.sample(glyphNames(o.glyphs), rng.int(3, 5));
      const colors = rng.sample(['red', 'green', 'blue', 'orange', 'purple'], rng.int(2, 3));
      const label = () => (rng.bool(0.5) ? C.fileName(cr, undefined, cs) : C.pick(cr, C.PRODUCTS, cs).name);
      const rows = Array.from({ length: n }, () => ({ icon: rng.pick(icons), color: rng.pick(colors), label: label(), meta: `${rng.int(1, 28)} ${rng.pick(['Mar', 'Apr', 'May', 'Jun', 'Jul'])}` }));
      if (o.glyphs === 'emoji') for (const r of rows) r.color = null;
      const pick = rng.pick(rows.slice(view)); // a row below the fold, so the whole list matters
      const desc = { icon: pick.icon, color: rng.bool(0.5) ? pick.color : null };
      const truth = rows.filter((r) => r.icon === desc.icon && (!desc.color || r.color === desc.color)).length;
      const answer = rng.bool(0.65) ? 'buttons' : 'typed';
      const spread = [...Array(Math.max(12, truth + 5)).keys()].filter((v) => v !== truth && Math.abs(v - truth) <= 6);
      const options = [...rng.sample(spread, 4), truth].sort((a, b) => a - b);
      return { rows, view, desc, truth, answer, options, route: rng.bool(0.5) ? 'wheel' : 'thumb' };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const rows = spec.rows.slice(0, spec.view + k(4, 8));
      const has = (x) => x.icon === spec.desc.icon && (!spec.desc.color || x.color === spec.desc.color);
      if (rows.length < spec.rows.length && rows.slice(spec.view).some(has)) {
        spec.rows = rows;
        spec.truth = rows.filter(has).length;
        const spread = [...Array(Math.max(12, spec.truth + 5)).keys()].filter((v) => v !== spec.truth && Math.abs(v - spec.truth) <= 6);
        spec.options = [...r.sample(spread, 4), spec.truth].sort((a, b) => a - b);
      }
    },
    clickError: clickByCount,
    correctKey: truthKey,
    wrongKey: wrongOption,
    tolerance: toleranceCounted,
    planStep: planOption,
    instruction(spec, rng, T, say) {
      const d = spec.desc;
      const word = I.alias(rng, d.text || d.icon, glyphAliases(spec.glyphs, d.icon), 0.3);
      const what = `${d.color ? `${d.color} ` : ''}${word} icon`;
      const steps = ['scroll through the whole list', `count the rows with a ${what}`, spec.answer === 'typed' ? 'type the count' : 'click the count'];
      return say(T(spec.answer === 'typed' ? [
        'How many rows in the list have a {w}? Type the number.',
        'Count the rows marked with a {w} (scroll the list to see them all) and enter the total.',
        'Type how many list entries show a {w}.',
        'Enter the number of items with a {w} in the list.',
        'Go through the whole list and type how many rows carry a {w}.',
        'Count every {w} in the list and write the total in the answer box.',
        'Check all list rows for a {w}. Type the row tally.',
        'A row counts if it has a {w}. Check them all and type the total.',
        'The list continues out of view. Type the total rows with a {w}.',
      ] : [
        'How many rows in the list have a {w}?',
        'Count the rows marked with a {w} (scroll the list to see them all) and click the total.',
        'Click how many list entries show a {w}.',
        'Pick the number of items with a {w} in the list.',
        'Go through the whole list and choose how many rows carry a {w}.',
        'Count every {w} in the list and select the total.',
        'Which number matches all list rows with a {w}?',
        'The answer to choose is the {w} row count for the full list.',
        'A {w} marks the rows to count. Check all rows and pick a total.',
        'What is the total for all rows with a {w}? Pick it.',
      ], { w: what }), `count ${what}s`, steps);
    },
    factRows: factsCount,
    retargetEdit(spec, model, rng, out) {
      let found = false;
      for (let k = 0; k < 40 && !found; k++) {
        const pick = rng.pick(spec.rows.slice(spec.view));
        const desc = { icon: pick.icon, color: rng.bool(0.5) ? pick.color : null };
        if (desc.icon === spec.desc.icon && desc.color === spec.desc.color) continue;
        const truth = spec.rows.filter((r) => r.icon === desc.icon && (!desc.color || r.color === desc.color)).length;
        const spread = [...Array(Math.max(12, truth + 5)).keys()].filter((x) => x !== truth && Math.abs(x - truth) <= 6);
        Object.assign(out, { desc, truth, options: [...rng.sample(spread, 4), truth].sort((a, b) => a - b) });
        found = true;
      }
      if (!found) return null;
    },
    selfCheck: selfCheckCounted,
  });
})();
