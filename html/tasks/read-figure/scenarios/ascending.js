/*
 * read-figure / ascending: click number tiles in ascending order (mode 'hide'.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { prefix, toleranceOrdered, wrongLimit } = fam.lib;

  env.scenario('read-figure', {
    name: 'ascending',
    sample(rng, o) {
      const mode = rng.bool(0.5) ? 'hide' : 'show';
      const n = o.ood ? rng.int(8, 10) : mode === 'hide' ? rng.int(4, 6) : rng.int(4, 7);
      let values;
      if (mode === 'hide') values = rng.shuffle([...Array(n).keys()].map((i) => i + 1));
      else {
        const s = new Set();
        while (s.size < n) s.add(rng.int(1, o.ood ? 999 : 99));
        values = [...s];
      }
      const gw = o.ood ? 8 : 7;
      const gh = o.ood ? 5 : 4;
      const all = [];
      for (let r = 0; r < gh; r++) for (let c = 0; c < gw; c++) all.push({ c, r });
      const cells = rng.sample(all, n).map((p) => ({ ...p, jx: +rng.float(0, 1).toFixed(3), jy: +rng.float(0, 1).toFixed(3) }));
      const order = values.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]).map(([, i]) => i);
      return { mode, values, cells, gw, gh, order };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = keepIdx(r, spec.values.length, [], k(3, 4));
      const vals = keep.map((i) => spec.values[i]);
      const order = vals.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]).map(([, i]) => i);
      spec.cells = keep.map((i) => spec.cells[i]);
      // 'hide' mode numbers are 1..n: renumber by rank.
      spec.values = spec.mode === 'hide' ? vals.map((v) => order.indexOf(vals.indexOf(v)) + 1) : vals;
      spec.order = order;
    },
    start(spec, rng, mode) {
      // (hide mode has no partial start: the remaining numbers would be hidden before the agent saw them)
      if (mode === 'partial' && spec.mode === 'show') return { clicks: spec.order.slice(0, Math.max(1, Math.floor(spec.order.length / 2) - 1)), wrong: 0 };
      if (mode === 'wrong') return { clicks: [spec.order[spec.order.length - 1]], wrong: 1 };
      return { clicks: [], wrong: 0 };
    },
    error(model, spec) {
      const k = prefix(model, spec);
      const n = spec.order.length;
      return 1 - k / n + (model.clicks.length > k ? 0.5 / n : 0);
    },
    tolerance: toleranceOrdered,
    planStep(model, spec) {
      if (model.wrong >= wrongLimit(spec)) return null;
      if (model.clicks.length > prefix(model, spec)) return spec.recoverable ? { click: { undo: true } } : null;
      return { click: { number: spec.order[model.clicks.length] } };
    },
    solve(spec, model, m) {
      return { clicks: spec.order.slice(), wrong: m.wrong || 0 };
    },
    instruction(spec, rng, T, say) {
      return say(T(spec.mode === 'hide'
        ? ['Click on the numbers in ascending order.', 'Click the numbers from smallest to largest; they hide after your first click.',
          'Click 1, then 2, and so on up to the highest number.', 'Tap the numbers in increasing order.',
          'Your click order follows the count from 1 to the largest number.',
          'After one click, the rest hide; click all numbers in rising order.']
        : ['Click the numbers from smallest to largest.', 'Click on the numbers in ascending order.',
          'Select the numbers in increasing order.', 'Go through the numbers from the lowest to the highest, clicking each.',
          'Before clicking a number, click all smaller ones.', 'Let the value set your click order, lowest first.',
          'Pick the next smallest tile with every click.', 'Each tile needs a click, going from low to high.']), 'ascending order');
    },
    judgeAsk(jr, spec, ph) {
      const have = new Set(spec.values);
      let n;
      do n = jr.int(1, 150); while (have.has(n));
      return ph(['Click the tile numbered {n} first, then the rest in ascending order.', 'Start with the tile numbered {n}, then go up in order.'], { n: String(n) }, `there is no tile numbered ${n}.`, [`tile ${n}`, `tile numbered ${n}`, String(n)]);
    },
    silentEdit(next, prev, spec, rng, wrong) {
      if (next.clicks.length <= prev.clicks.length) return null;
      const out = { ...next, clicks: prev.clicks.slice() };
      return wrong(out) ? out : null;
    },
  });
})();
