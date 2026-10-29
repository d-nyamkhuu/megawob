/*
 * draw / trace: trace a path through dots (or a wave guide) in one stroke.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { BOARD, EMPTY, errorOf, fin, frameOf, hasGuide, ideal, inBoard, initOf, lastStroke, pathPts, pt, ptsTargets,
    samplePath, solveOf, strokeStart, T, traceError } = fam.lib;

  // A wide, smooth, horizontal wave from the left to the right: sampled densely so the polyline is the curve.
  function sampleWave(rng, ood, F, lv) {
    const x0 = F.x + rng.float(0.1, 0.16);
    const x1 = F.x + F.w - rng.float(0.1, 0.16);
    const cy = F.y + F.h * rng.float(0.42, 0.58);
    const amp = (ood ? rng.float(0.08, 0.14) : rng.float(0.12, 0.22)) * (rng.bool() ? 1 : -1) * Math.min(1, F.h);
    let cycles = ood ? rng.pick([2.5, 3, 3.5]) : rng.pick([1, 1.5, 2]);
    if (lv) cycles = lv === 'easy' ? 1 : 1.5;
    const n = 48;
    return { guide: 'wave', path: Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      return pt([x0 + (x1 - x0) * t, cy + amp * Math.sin(2 * Math.PI * cycles * t)]);
    }) };
  }

  function sampleTrace(rng, ood, tr, F, lv) {
    if (hasGuide(tr, 'wave')) return sampleWave(rng.fork('guide'), ood, F, lv);
    const segs = ood ? rng.int(5, 6) : rng.int(2, 4);
    return { path: ood ? samplePath(rng, segs, F, 0.18, 0.34) : samplePath(rng, lv ? (lv === 'easy' ? 2 : 3) : segs, F) };
  }

  const TAU_TRACE = 0.025;

  env.scenario('draw-shape', {
    name: 'trace',
    placed: true,
    layered: true,
    sample(rng, { o, F, traits, lv }) {
      return sampleTrace(rng, o.ood, traits, F, lv);
    },
    tolerance() {
      return { tau: TAU_TRACE };
    },
    ideal(spec) {
      return spec.guide === 'wave' ? spec.path.slice() : pathPts(spec.path);
    },
    init(spec, rng, mode) {
      const k = ideal(spec);
      return strokeStart(k, mode, () => ({ strokes: [k.slice().reverse().map(pt)] }));
    },
    error(model, spec) {
      const k = lastStroke(model);
      if (!k) return EMPTY;
      return fin(traceError(k, spec.path));
    },
    solve(spec) {
      return { strokes: [ideal(spec).map(pt)] };
    },
    plan(model, spec) {
      return { path: ptsTargets(ideal(spec)) };
    },
    figurePts(spec) {
      return spec.path;
    },
    instruction(spec, rng, say, tolP) {
      return say(T(rng, spec, [
        'Trace the arrow path from the start dot to the arrowhead in one stroke.',
        'Follow the path with your mouse from start to the arrow tip.',
        'Draw along the dashed route, starting at the dot and ending at the arrow.',
        'Go over the path in one stroke, from "start" to the arrowhead.',
        'Trace the route from beginning to end without lifting the pointer.',
        'Ink the dashed path, start dot first, finishing on the arrow tip.',
        'From start dot to arrowhead, stay on the dashes without lifting.',
        'Cover the dashes in a single stroke from start dot to arrowhead.',
        'Use one stroke to connect dot to arrowhead along the dashed guide.',
        'Hold the mouse down at the start dot, tracing dashes to the arrow.',
        'Let the dashes guide one continuous stroke from dot to arrowhead.',
        'Keep drawing along the dashes from dot to arrowhead in one stroke.',
      ]), 'trace the path start to arrow');
    },
    check(fails) {
      for (let s = 0; s < 40; s++) {
        const o = { scenarios: fam.scenarios, ood: s % 5 === 4 };
        if (JSON.stringify(fam.sample(new env.Rng(5500 + s), { ...o, scenario: 'trace' })) !== JSON.stringify(fam.sample(new env.Rng(5500 + s), { ...o, scenario: 'trace', traits: {} }))) fails.push(`trace/${s}: traits {} changed sampling`);
        const w = fam.sample(new env.Rng(5500 + s), { ...o, scenario: 'trace', startMode: 'off', traits: { guide: ['wave', 'both'] } });
        const xs = w.path.map((p) => p[0]);
        if (w.guide !== 'wave' || w.path.length < 40 || w.path[0][0] > 0.2 || w.path[w.path.length - 1][0] < BOARD.w - 0.2 || xs.some((x, i) => i && x <= xs[i - 1])) fails.push(`trace/${s}: wave path shape`);
        if (w.path.some((p) => !inBoard(p, 0.04, frameOf(w.board)))) fails.push(`trace/${s}: wave leaves the board`);
        if (errorOf(solveOf(w, initOf(w, new env.Rng(s))), w) > TAU_TRACE * 0.5) fails.push(`trace/${s}: wave solve() error`);
      }
    },
  });
})();
