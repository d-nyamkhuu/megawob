/*
 * draw / circle: draw a circle (around a dot, over a dashed guide, or through a rim dot).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { circleError, circlePts, clampB, dist, EMPTY, errorOf, fin, hasGuide, ideal, inBoard, lastStroke, pt, ptsTargets,
    r4, strokeStart, T, TAU, tauK } = fam.lib;

  function sampleCircle(rng, ood, tr, F) {
    const cap = (Math.min(F.w, F.h) - 0.12) / 2 - 0.01; // largest radius that fits the frame
    const rr = (lo, hi) => rng.float(Math.min(lo, cap), Math.min(hi, cap));
    for (;;) {
      const r = ood ? (rng.bool() ? rr(0.07, 0.1) : rr(0.32, 0.4)) : rr(0.12, 0.3);
      const c = [F.x + rng.float(r + 0.06, F.w - r - 0.06), F.y + rng.float(r + 0.06, F.h - r - 0.06)];
      if (!inBoard(c, 0, F)) continue;
      const th = rng.float(0, 2 * Math.PI);
      const rim = [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th)];
      const out = { c: pt(c), r: r4(r), show: rng.bool() ? 'guide' : 'dot', rim: pt(rim) };
      if (hasGuide(tr, 'both')) Object.assign(out, { show: 'guide', rimDot: true, rim: pt([c[0], c[1] - r]) }); // rim dot at the top
      return out;
    }
  }

  env.scenario('draw-shape', {
    name: 'circle',
    placed: true,
    layered: true,
    sample(rng, { o, F, traits }) {
      return sampleCircle(rng, o.ood, traits, F);
    },
    tolerance() {
      return { tau: TAU.circle };
    },
    ideal(spec) {
      return circlePts(spec.c, spec.r, spec.rim);
    },
    init(spec, rng, mode) {
      const k = ideal(spec);
      return strokeStart(k, mode, () => {
        const dir = spec.c[0] > spec.board.w / 2 ? -1 : 1;
        return { strokes: [circlePts([spec.c[0] + dir * 0.12, spec.c[1]], spec.r).map((p) => pt(clampB(p, spec.board)))] };
      });
    },
    error(model, spec) {
      const k = lastStroke(model);
      if (!k) return EMPTY;
      return fin(circleError(k, spec, tauK(spec)));
    },
    solve(spec) {
      return { strokes: [ideal(spec).map(pt)] };
    },
    plan(model, spec) {
      return { path: ptsTargets(ideal(spec)) };
    },
    figurePts(spec) {
      return [...circlePts(spec.c, spec.r, null, 25), spec.rim];
    },
    instruction(spec, rng, say, tolP) {
      if (spec.show === 'guide') {
        return say(T(rng, spec, [
          'Draw a circle around the dot that follows the dashed guide.',
          'Trace the dashed circle around the center dot in one stroke.',
          'Go over the dashed circle with one round stroke.',
          'Draw a circle on top of the dashed outline.',
          'Follow the dashed ring with your pointer to draw a circle.',
          'Ink the dashed circle: one closed loop along it.',
          'Enclose the dot in one loop along the dashed circle.',
          'One closed circle: follow the dashes around the dot.',
          'Keep one round stroke on the dashed ring around the dot.',
          'Use the dashed ring around the dot for one closed loop.',
          'Close one stroke on the dashed circle around the dot.',
          'A dashed ring surrounds the dot. Trace it in one loop.',
          'Turn the dashed outline around the dot into one loop.',
          'Make one circular pass over the dashes around the dot.',
          'The dashed ring marks one loop to draw around the dot.',
          'Carry one stroke around the dot along the dashed ring.',
          'Cover the dashes around the dot with one closed circle.',
          'Make a round trip on the dashes around the dot.',
          'Let the dashes guide a circular stroke around the dot.',
          'Draw one full circle over the dashes around the dot.',
          'Circle the center dot without lifting off the dashed ring.',
          'Go all around the dashed ring and close the loop.',
        ]), 'circle along the dashed guide');
      }
      return say(T(rng, spec, [
        'Draw a circle centered on the filled dot that passes through the hollow dot.',
        'Draw a circle around the filled dot, with the hollow dot on its edge.',
        'Make a circle whose center is the solid dot and whose edge touches the hollow dot.',
        'Using the solid dot as the center, draw a circle through the open dot.',
        'Draw one round loop: center on the black dot, radius out to the ring dot.',
        'Sketch a circle with the filled dot in the middle and the hollow dot on the rim.',
        'Set a round loop so the filled dot is central and the hollow dot lies on it.',
        'The open dot goes on the rim of one round loop centered on the solid dot.',
        'The filled dot lies at the center of one round loop through the open dot.',
        'Let one circle have its center at the solid dot and the open dot on its rim.',
        'Keep the solid dot central as one circular stroke passes through the hollow dot.',
        'Draw one loop, equally far from the solid dot, that crosses the hollow dot.',
        'Give one circle a center at the filled dot and a rim through the open dot.',
        'For one circle, use the black dot to mark its center and the ring dot its rim.',
        'Complete one round stroke through the open dot with the solid dot at its center.',
      ]), 'circle: center filled dot, through hollow dot');
    },
    check(fails) {
      // a regular polygon is not a circle (hexagon, pentagon), but an octagon and anything rounder is, at every level
      for (const level of [undefined, 'medium', 'easy']) {
        for (let k = 0; k < 12; k++) {
          const cs = fam.sample(new env.Rng(8300 + k), { scenarios: fam.scenarios, scenario: 'circle', level });
          const a0 = Math.atan2(cs.rim[1] - cs.c[1], cs.rim[0] - cs.c[0]);
          const poly = (n) => Array.from({ length: n + 1 }, (_, i) => [cs.c[0] + cs.r * Math.cos(a0 + (2 * Math.PI * i) / n), cs.c[1] + cs.r * Math.sin(a0 + (2 * Math.PI * i) / n)]);
          const tauC = fam.tolerance(cs).tau;
          for (const n of [5, 6]) if (errorOf({ strokes: [poly(n)] }, cs) <= tauC) fails.push(`circle ${level || 'normal'} seed ${k}: ${n}-gon passes`);
          for (const n of [8, 10, 16]) if (errorOf({ strokes: [poly(n)] }, cs) > tauC) fails.push(`circle ${level || 'normal'} seed ${k}: ${n}-gon fails (${errorOf({ strokes: [poly(n)] }, cs)} > ${tauC})`);
        }
      }
      const o = { scenarios: fam.scenarios };
      for (let s = 0; s < 40; s++) {
        const ood = s % 5 === 4;
        if (JSON.stringify(fam.sample(new env.Rng(5500 + s), { ...o, ood, scenario: 'circle' })) !== JSON.stringify(fam.sample(new env.Rng(5500 + s), { ...o, ood, scenario: 'circle', traits: {} }))) fails.push(`circle/${s}: traits {} changed sampling`);
        const cb = fam.sample(new env.Rng(5500 + s), { ...o, ood, scenario: 'circle', traits: { guide: 'both' } });
        if (!cb.rimDot || cb.show !== 'guide' || Math.abs(dist(cb.c, cb.rim) - cb.r) > 1e-3) fails.push(`circle/${s}: both trait`);
      }
    },
  });
})();
