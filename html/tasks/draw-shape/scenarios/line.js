/*
 * draw / line: draw a straight line (connect two dots, or through a point along a direction or a guide).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { EMPTY, fin, frameOf, ideal, inBoard, lastStroke, len, lerp, lineError, pt, ptsTargets, r4, sampleConnect, shift,
    strokeStart, sub, T, TAU } = fam.lib;

  const REACH = 0.3; // half-length of the oracle's 'through' stroke

  function sampleLine(rng, ood, F) {
    if (rng.bool(0.55)) return { mode: 'connect', ...sampleConnect(rng, ood, F) };
    const dir = rng.pick(['horizontal', 'vertical', 'guide', 'guide']);
    // A small placement area shortens the oracle stroke (and the guide's distance from the dot).
    const h = Math.min(REACH, (Math.min(F.w, F.h) - 0.1) / 2 - 0.05);
    const sep = Math.min(0.4, 0.6 * Math.min(F.w, F.h));
    for (;;) {
      let angle = dir === 'horizontal' ? 0 : dir === 'vertical' ? Math.PI / 2 : rng.float(0.26, 1.31) * (rng.bool() ? 1 : -1);
      angle = r4(angle);
      const p = [F.x + rng.float(0.12, F.w - 0.12), F.y + rng.float(0.12, F.h - 0.12)];
      const d = [Math.cos(angle), Math.sin(angle)];
      if (!inBoard([p[0] - d[0] * h, p[1] - d[1] * h], 0.05, F) || !inBoard([p[0] + d[0] * h, p[1] + d[1] * h], 0.05, F)) continue;
      const out = { mode: 'through', p: pt(p), dir, angle };
      if (h < REACH) out.reach = r4(h);
      if (dir !== 'guide') return out;
      // A short reference segment with the wanted angle, well away from the dot and its line.
      const glen = 0.26;
      const c = [F.x + rng.float(0.16, F.w - 0.16), F.y + rng.float(0.16, F.h - 0.16)];
      const v = sub(c, p);
      if (len(v) < sep || Math.abs(v[0] * d[1] - v[1] * d[0]) < 0.18) continue;
      return { ...out, guide: { c: pt(c), len: glen } };
    }
  }

  env.scenario('draw-shape', {
    name: 'line',
    placed: true,
    layered: true,
    sample(rng, { o, F }) {
      return sampleLine(rng, o.ood, F);
    },
    tolerance() {
      return { tau: TAU.line };
    },
    ideal(spec) {
      if (spec.mode === 'connect') return Array.from({ length: 24 }, (_, i) => lerp(spec.a, spec.b, i / 23));
      const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
      const h = spec.reach || REACH;
      const a = [spec.p[0] - d[0] * h, spec.p[1] - d[1] * h];
      const b = [spec.p[0] + d[0] * h, spec.p[1] + d[1] * h];
      return Array.from({ length: 24 }, (_, i) => lerp(a, b, i / 23));
    },
    init(spec, rng, mode) {
      const k = ideal(spec);
      return strokeStart(k, mode, () => {
        const u = sub(k[k.length - 1], k[0]);
        const ul = len(u) || 1;
        const s = rng.bool() ? 1 : -1;
        return { strokes: [shift(k, [(-u[1] / ul) * 0.12 * s, (u[0] / ul) * 0.12 * s], spec.board)] };
      });
    },
    error(model, spec) {
      const k = lastStroke(model);
      if (!k) return EMPTY;
      return fin(lineError(k, spec));
    },
    solve(spec) {
      return { strokes: [ideal(spec).map(pt)] };
    },
    plan(model, spec) {
      return { path: ptsTargets(ideal(spec)) };
    },
    figurePts(spec) {
      const pts = spec.mode === 'connect' ? [spec.a, spec.b] : [spec.p, ...ideal(spec)];
      if (spec.guide) {
        const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
        const h = spec.guide.len / 2;
        pts.push([spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h], [spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h]);
      }
      return pts;
    },
    instruction(spec, rng, say, tolP) {
      if (spec.mode === 'connect') {
        return say(T(rng, spec, [
          'Draw a straight line connecting dot A and dot B.',
          'Draw a straight line from dot A to dot B.',
          'Connect the two dots with one straight line.',
          'Join A and B with a single straight stroke.',
          'Link point A to point B with a straight line.',
          'Make a straight line that runs between the dots labelled A and B.',
          'Rule a line from A over to B.',
          'Put one straight line between A and B, ending on both dots.',
          'Use A and B as the ends of one straight stroke.',
          'The dots A and B must be joined by one straight line.',
          'With one straight stroke, go from A to B.',
          'Let one straight line span the dots labelled A and B.',
          'Keep the stroke straight, with ends at A and B.',
          'Draw a straight segment with endpoints A and B.',
          'Start on A, draw straight to B and stop there.',
          'One stroke, straight and ending at A and B.',
          'Cover the gap from A to B with one straight stroke.',
          'Draw once from A to B, keeping the line straight.',
          'A and B mark where one straight line must end.',
          'Follow only the straight path from dot A to dot B.',
        ]), 'line A to B');
      }
      if (spec.dir === 'guide') {
        return say(T(rng, spec, [
          'Draw a straight line through the dot, parallel to the gray guide line, extending well past it on both sides.',
          'Through the dot, draw a line parallel to the gray guide, extending well past it on both sides.',
          'Copy the angle of the gray guide: draw a long straight line through the marked dot.',
          'Draw a line through the dot that runs in the same direction as the short gray segment{tol}.',
          'Make a straight line through the dot, parallel to the guide, reaching past the dot on both ends.',
          'Draw a parallel to the gray guide line that passes through the dot.',
          'Set a straight line parallel to the gray guide through the dot and past it on both sides.',
          'The dot must lie on a straight line parallel to the gray guide, with both ends past the dot.',
          'Draw a straight line through and beyond the dot both ways, parallel to the gray guide.',
          'A straight stroke should cross the dot and continue each way, parallel to the gray guide.',
          'With the gray guide as a reference, run a straight line through the dot and past it both ways.',
          'Place a straight stroke across the dot, reaching both ways parallel to the gray guide.',
          'The gray guide sets the angle: a straight line must cross the dot and continue on both sides.',
          'Carry a straight line past the dot in each direction, at the angle of the gray guide.',
        ], { tol: tolP(' (go past the dot on both sides)') }), 'line through the dot, parallel to the guide');
      }
      const dir = spec.dir;
      return say(T(rng, spec, [
        `Draw a ${dir} line through the dot, extending well past it on both sides.`,
        `Draw a straight ${dir} line through the marked dot, extending well past it on both sides.`,
        `Put a ${dir} line through the dot so it sticks out on both sides.`,
        `Make a long ${dir} stroke that crosses the dot.`,
        `Through the marked dot, draw a straight line that is perfectly ${dir}.`,
        `Draw a ${dir} line centered roughly on the dot{tol}.`,
      ], { tol: tolP(', reaching past it on both ends') }), `${dir} line through the dot`);
    },
    retarget(spec, model, rng, ok) {
      if (spec.mode !== 'through' || spec.dir === 'guide') return null;
      const dir = spec.dir === 'horizontal' ? 'vertical' : 'horizontal';
      const angle = dir === 'horizontal' ? 0 : r4(Math.PI / 2);
      const F = spec.area || frameOf(spec.board);
      const h = spec.reach || REACH;
      const d = [Math.cos(angle), Math.sin(angle)];
      const q = spec.p;
      if (!inBoard([q[0] - d[0] * h, q[1] - d[1] * h], 0.05, F) || !inBoard([q[0] + d[0] * h, q[1] + d[1] * h], 0.05, F)) return null;
      return ok({ ...spec, dir, angle });
    },
  });
})();
