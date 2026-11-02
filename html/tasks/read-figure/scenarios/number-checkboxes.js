/*
 * read-figure / number-checkboxes: copy a digit (7x4) or a random pattern into a grid of checkboxes
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { DIGIT_PATTERNS, silentToggle, toleranceSet } = fam.lib;

  function patternOn(spec) {
    const out = [];
    spec.pattern.forEach((row, r) => row.forEach((v, c) => { if (v) out.push(r * spec.cols + c); }));
    return out;
  }

  env.scenario('read-figure', {
    name: 'number-checkboxes',
    sample(rng, o) {
      if (!o.ood && rng.bool(0.7)) {
        const digit = rng.int(0, 9);
        return { mode: 'digit', digit, rows: 7, cols: 4, pattern: DIGIT_PATTERNS[digit].map((r) => r.slice()) };
      }
      const rows = o.ood ? rng.int(7, 8) : rng.int(4, 6);
      const cols = o.ood ? 6 : rng.int(4, 5);
      for (;;) {
        const pattern = [...Array(rows)].map(() => [...Array(cols)].map(() => (rng.bool(0.42) ? 1 : 0)));
        const ones = pattern.flat().filter(Boolean).length;
        if (ones >= 5 && ones <= rows * cols - 4) return { mode: 'pattern', rows, cols, pattern };
      }
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      if (easy) {
        const rows = 4;
        const cols = 4;
        const on = r.sample([...Array(rows * cols).keys()], 5);
        spec.mode = 'pattern';
        delete spec.digit;
        Object.assign(spec, { rows, cols, pattern: [...Array(rows)].map((_, y) => [...Array(cols)].map((__, x) => (on.includes(y * cols + x) ? 1 : 0))) });
      } else if (spec.mode === 'pattern') {
        const ones = [];
        spec.pattern.forEach((row, y) => row.forEach((v, x) => { if (v) ones.push([y, x]); }));
        const keepN = Math.max(5, Math.ceil((ones.length + 5) / 2));
        for (const [y, x] of r.sample(ones, ones.length - keepN)) spec.pattern[y][x] = 0;
      }
    },
    start(spec, rng, mode, half) {
      const on = patternOn(spec);
      if (mode === 'partial') return { on: half(on) };
      if (mode === 'wrong') {
        // The pattern shifted one column to the right (wrapping), a typical copy slip.
        const sh = on.map((i) => Math.floor(i / spec.cols) * spec.cols + ((i % spec.cols) + 1) % spec.cols).sort((a, b) => a - b);
        return { on: sh };
      }
      return { on: [] };
    },
    error(model, spec) {
      const want = new Set(patternOn(spec));
      const on = new Set(model.on);
      let bad = 0;
      for (let i = 0; i < spec.rows * spec.cols; i++) if (want.has(i) !== on.has(i)) bad++;
      return bad / want.size;
    },
    tolerance: toleranceSet,
    planStep(model, spec) {
      const want = new Set(patternOn(spec));
      for (let i = 0; i < spec.rows * spec.cols; i++) if (want.has(i) !== model.on.includes(i)) return { click: { cell: i } };
      return null;
    },
    solve(spec) {
      return { on: patternOn(spec) };
    },
    instruction(spec, rng, T, say) {
      return spec.mode === 'digit'
        ? say(T(['Draw the number "{d}" in the checkboxes using the example.', 'Check the boxes so they form the digit {d}, like the example.',
          'Copy the example digit {d} into the checkbox grid.', 'Tick the checkboxes that make up the "{d}" shown in the example.',
          'Use the example as a guide to set the boxes for "{d}".',
          'For digit {d}, match each checkbox exactly to the example.',
          'The checkbox grid should show "{d}" exactly as in the example.',
          'Match the checked and empty boxes to the example digit {d}.'], { d: spec.digit }), `digit ${spec.digit}`)
        : say(T(['Copy the example pattern into the checkboxes.', 'Check the boxes so the grid matches the example.',
          'Reproduce the example pattern in the checkbox grid.', 'Make the checkboxes look exactly like the example.',
          'Use the example to set every box in the grid.', 'The grid must have the same filled cells as shown.',
          'Match both filled and empty cells in the example.']), 'copy the pattern');
    },
    judgeAsk(jr, spec, ph) {
      return ph([
        'Copy the second example into the checkboxes.', 'Check the boxes to match the example on the right.',
        'The second example is what the boxes must show.'
      ], {}, 'there is only one example on the page.', ['second example', 'right example', 'example on the right']);
    },
    factRows(model) {
      return model.on.length ? [{ label: 'Checked boxes', value: String(model.on.length), labels: ['Boxes checked', 'Checked'] }] : [];
    },
    silentEdit: silentToggle,
    retargetEdit(spec, model, rng, out) {
      if (spec.mode === 'digit') {
        const digit = rng.pick([...Array(10).keys()].filter((d) => d !== spec.digit));
        Object.assign(out, { digit, pattern: DIGIT_PATTERNS[digit].map((r) => r.slice()) });
      } else {
        for (let k = 0; k < 50; k++) {
          const pattern = [...Array(spec.rows)].map(() => [...Array(spec.cols)].map(() => (rng.bool(0.42) ? 1 : 0)));
          const ones = pattern.flat().filter(Boolean).length;
          if (ones >= 5 && ones <= spec.rows * spec.cols - 4 && JSON.stringify(pattern) !== JSON.stringify(spec.pattern)) {
            out.pattern = pattern;
            break;
          }
        }
        if (out.pattern === spec.pattern) return null;
      }
    },
  });
})();
