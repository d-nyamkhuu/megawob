/*
 * draw / multi: draw several shapes at once, every stroke counts.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { addPath, circleError, circlePts, dist, EMPTY, errorOf, fin, ideal, len, lerp, lineError, pt, ptsTargets, r4,
    shift, solveOf, sub, T, TAU, tauK } = fam.lib;

  // Greedy one-to-one matching of strokes to multi targets by smallest error.
  function multiMatch(model, spec) {
    const strokes = (model.strokes || []).map((s, i) => [s, i]).filter(([s]) => s && s.length >= 2);
    const pairs = [];
    spec.targets.forEach((t, ti) => {
      for (const [s, si] of strokes) {
        const e = t.type === 'line' ? lineError(s, { mode: 'connect', a: t.a, b: t.b }) : circleError(s, t, tauK(spec));
        pairs.push([fin(e), ti, si]);
      }
    });
    pairs.sort((p, q) => p[0] - q[0] || p[1] - q[1] || p[2] - q[2]);
    const tOf = new Map();
    const sOf = new Map();
    for (const [e, ti, si] of pairs) {
      if (tOf.has(ti) || sOf.has(si)) continue;
      tOf.set(ti, [si, e]);
      sOf.set(si, ti);
    }
    const tauOf = (t) => (t.type === 'line' ? TAU.line : TAU.circle) * tauK(spec);
    const per = spec.targets.map((t, ti) => {
      const m = tOf.get(ti);
      if (!m) return EMPTY;
      return m[1] <= tauOf(t) ? 0 : m[1];
    });
    const unmatched = strokes.filter(([, si]) => !sOf.has(si)).map(([, si]) => si);
    const bad = strokes.filter(([, si]) => sOf.has(si) && per[sOf.get(si)] > 0).map(([, si]) => si);
    return { per, unmatched, bad, tOf };
  }

  function sampleMulti(rng, opts, F) {
    // Up to 3 x 2 cells of at least 0.32 board units (fewer on a narrow board or in a small area; at least 2).
    const cols = Math.min(3, Math.floor(F.w / 0.32 + 1e-9));
    const rows = Math.min(2, Math.floor(F.h / 0.32 + 1e-9));
    const n = Math.min(opts.level ? 2 : opts.ood ? rng.int(4, 5) : rng.int(2, 3), cols * rows);
    const cw = F.w / cols;
    const ch = F.h / rows;
    const cells = rng.sample([...Array(cols * rows).keys()], n);
    const letters = 'ABCDEFGHJK';
    let li = 0;
    const targets = cells.map((k) => {
      const c = k % cols;
      const r = Math.floor(k / cols);
      const x0 = F.x + c * cw + 0.06;
      const y0 = F.y + r * ch + 0.06;
      const x1 = F.x + (c + 1) * cw - 0.06;
      const y1 = F.y + (r + 1) * ch - 0.06;
      if (rng.bool(0.6)) {
        for (;;) {
          const a = [rng.float(x0, x1), rng.float(y0, y1)];
          const b = [rng.float(x0, x1), rng.float(y0, y1)];
          if (dist(a, b) >= 0.26) {
            const labels = [letters[li], letters[li + 1]];
            li += 2;
            return { type: 'line', a: pt(a), b: pt(b), labels };
          }
        }
      }
      const cap = Math.min(0.17, (x1 - x0) / 2 - 0.01, (y1 - y0) / 2 - 0.01);
      const rr = rng.float(Math.min(0.1, cap), cap);
      return { type: 'circle', c: pt([rng.float(x0 + rr, x1 - rr), rng.float(y0 + rr, y1 - rr)]), r: r4(rr) };
    });
    return { targets };
  }

  const TAU_MULTI = 0.005;

  env.scenario('draw-shape', {
    name: 'multi',
    placed: true,
    layered: true,
    easyPartial: true,
    sample(rng, { o, F }) {
      return sampleMulti(rng, o, F);
    },
    tolerance() {
      return { tau: TAU_MULTI, sigma: 0.3, minInitialError: 0.05 };
    },
    ideal(spec, target) {
      const t = spec.targets[target || 0];
      return t.type === 'line' ? Array.from({ length: 20 }, (_, i) => lerp(t.a, t.b, i / 19)) : circlePts(t.c, t.r);
    },
    init(spec, rng, mode) {
      if (mode === 'partial') return { strokes: [ideal(spec, 0).map(pt)] };
      if (mode === 'wrong') {
        const t = spec.targets[0];
        const s = ideal(spec, 0);
        const d = t.type === 'line' ? (() => { const u = sub(t.b, t.a); const l = len(u); return [(-u[1] / l) * 0.09, (u[0] / l) * 0.09]; })() : [0.09, 0];
        return { strokes: [shift(s, d, spec.board)] };
      }
      return { strokes: [] };
    },
    error(model, spec) {
      const m = multiMatch(model, spec);
      return m.per.reduce((a, b) => a + b, 0) / m.per.length + 0.1 * m.unmatched.length;
    },
    solve(spec) {
      return { strokes: spec.targets.map((_, i) => ideal(spec, i).map(pt)) };
    },
    plan(model, spec) {
      const m = multiMatch(model, spec);
      if (m.unmatched.length || m.bad.length) return { click: { control: 'undo' } };
      const ti = m.per.findIndex((e, i) => e > 0 || !m.tOf.has(i));
      return ti < 0 ? null : { path: ptsTargets(ideal(spec, ti)) };
    },
    figurePts(spec) {
      return spec.targets.flatMap((t) => (t.type === 'line' ? [t.a, t.b] : circlePts(t.c, t.r, null, 25)));
    },
    instruction(spec, rng, say, tolP) {
      const parts = spec.targets.map((t) => (t.type === 'line' ? `connect ${t.labels[0]} to ${t.labels[1]}` : 'trace the dashed circle'));
      const nCircles = spec.targets.filter((t) => t.type === 'circle').length;
      const lines = spec.targets.filter((t) => t.type === 'line').map((t) => `${t.labels[0]}-${t.labels[1]}`);
      const summary = [lines.length ? `lines ${lines.join(', ')}` : '', nCircles ? (nCircles === 1 ? 'the dashed circle' : nCircles === 2 ? 'both dashed circles' : `all ${nCircles} dashed circles`) : ''].filter(Boolean).join(' and ');
      const core = T(rng, spec, [
        'Draw every shape: {summary}. All strokes count.',
        'Complete the drawing: {list}.',
        'Do all of these, one stroke each: {list}.',
        'Draw {summary}. Keep the board free of stray marks.',
        'Make the drawing: {summary}, nothing else.',
        'Finish the sketch by drawing {summary}.',
        '{summary}: one stroke per shape, no extras.',
        'Only these belong in your drawing: {summary}.',
        'Carry out each item: {list}. No extra marks.',
        'Use a separate stroke for each item: {list}.',
        'Leave no stray marks as you draw {summary}.',
        'This task calls for {summary}.',
        'Reproduce {summary} without extra strokes.',
        'This board should contain only {summary}.',
        'Cover the full list with one stroke each: {list}.',
        'For each shape in {summary}, make one stroke.',
        'Let each stroke complete a shape: {list}.',
        'Draw just these shapes: {list}.',
        'No shape missing, no spare strokes: {list}.',
        'Keep to one stroke apiece: {list}.',
        'Render {summary} with single strokes only.',
      ], { summary, list: parts.join('; ') });
      return say(core, summary, parts);
    },
    facts(model, spec, out) {
      out.push({ label: 'Strokes', value: String((model.strokes || []).length), labels: ['Strokes drawn', 'Shapes drawn'] });
      for (const [type, label, alias] of [['circle', 'Circles', 'Dashed circles'], ['line', 'Lines', 'Straight lines']]) {
        const k = spec.targets.filter((t) => t.type === type).length;
        if (k) out.push({ label, value: String(k), labels: [alias] });
      }
    },
    simulate(m, spec, step) {
      if (step.path) addPath(m, step);
      else if (step.click.control === 'undo') m.strokes.pop();
      else if (step.click.control === 'clear') m.strokes = [];
      return m;
    },
    check(fails) {
      const ms = fam.sample(new env.Rng(5), { scenarios: fam.scenarios, scenario: 'multi' });
      const good = solveOf(ms, {});
      if (errorOf({ strokes: good.strokes.concat([[[0.01, 0.01], [0.05, 0.02]]]) }, ms) <= TAU_MULTI) fails.push('multi: stray stroke passes');
    },
  });
  Object.assign(fam.helpers, { multiMatch });
})();
