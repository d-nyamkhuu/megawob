/*
 * read-figure / grid: grid-coordinate.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { GRID_CAP, gridKey } = fam.lib;

  const parseGrid = (k) => String(k).split(',').map(Number);

  env.scenario('read-figure', {
    name: 'grid',
    sample(rng, o) {
      const xr = o.ood ? rng.int(5, 6) : rng.int(2, 4);
      const yr = o.ood ? 4 : rng.int(2, 3);
      return { xr, yr, target: [rng.int(-xr, xr), rng.int(-yr, yr)] };
    },
    level(spec, lv) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const fx = Math.max(Math.abs(spec.target[0]), k(2, 3));
      const fy = Math.max(Math.abs(spec.target[1]), k(2, 2));
      spec.xr = Math.min(spec.xr, fx);
      spec.yr = Math.min(spec.yr, fy);
    },
    clickError(spec, key) {
      const [x, y] = parseGrid(key);
      return Math.min(GRID_CAP, Math.hypot(x - spec.target[0], y - spec.target[1]));
    },
    correctKey: (spec) => gridKey(spec.target),
    wrongKey(spec, rng) {
      const [x, y] = spec.target;
      const nb = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => Math.abs(a) <= spec.xr && Math.abs(b) <= spec.yr);
      return gridKey(rng.pick(nb));
    },
    tolerance() {
      return { tau: 0, sigma: 0.6, minInitialError: 1 };
    },
    planStep(model, spec) {
      return { click: { point: spec.target.slice() } };
    },
    instruction(spec, rng, T, say) {
      const [x, y] = spec.target;
      return say(T(['Click on the grid coordinate ({x},{y}).', 'Click the point ({x}, {y}).', 'Select the dot at x = {x}, y = {y}.',
        'Find ({x},{y}) on the plane and click it.', 'Click where x is {x} and y is {y}.', 'Pick the grid point at ({x}, {y}).',
        'Use a click to mark ({x}, {y}).', 'Make ({x},{y}) your selected point.',
        'For x = {x} and y = {y}, click the dot.', 'A click should land at ({x}, {y}).'], { x, y }), `(${x},${y})`);
    },
    judgeAsk(jr, spec, ph) {
      const x = spec.xr + jr.int(2, 4);
      const y = jr.int(-spec.yr, spec.yr);
      return ph(['Click the dot at ({x}, {y}).', 'Find the point ({x}, {y}) on the plane and click it.'], { x: String(x), y: String(y) }, `(${x}, ${y}) is outside the plane shown.`, [`(${x}, ${y})`, `point ${x} ${y}`]);
    },
    retargetEdit(spec, model, rng, out) {
      const all = [];
      for (let x = -spec.xr; x <= spec.xr; x++) for (let y = -spec.yr; y <= spec.yr; y++) if (x !== spec.target[0] || y !== spec.target[1]) all.push([x, y]);
      out.target = rng.pick(all);
    },
  });
})();
