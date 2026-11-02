/*
 * solve-puzzle / hot-cold: find a hidden spot by clicking a board.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { along, dist, lockedOf, round, say } = fam.lib;

  function sampleHotCold(rng, spec) {
    const W = 100;
    const H = rng.pick([50, 55, 60, 65, 70, 75]);
    const radius = spec.ood ? 3 : rng.pick([4, 5]);
    const m = radius + 2;
    const target = [round(rng.float(m, W - m), 10), round(rng.float(m, H - m), 10)];
    return { W, H, radius, target, budget: rng.int(20, 24) + (spec.ood ? 4 : 0) };
  }

  const BAND_LABEL = { hot: 'HOT', warm: 'WARM', cold: 'COLD', ice: 'ICE COLD' };

  function bandOf(spec, d) {
    if (d <= spec.radius) return 'hot';
    if (d < 2.5 * spec.radius) return 'warm';
    if (d < 8 * spec.radius) return 'cold';
    return 'ice';
  }

  function feedback(spec, probes, i) {
    const d = dist(probes[i], spec.target);
    const band = bandOf(spec, d);
    let trend = null;
    if (i > 0) {
      const d0 = dist(probes[i - 1], spec.target);
      trend = Math.abs(d - d0) < 1e-9 ? 'same' : d < d0 ? 'warmer' : 'colder';
    }
    return { band, label: BAND_LABEL[band], trend, dist: d };
  }

  function probe(model, spec, p) {
    if (lockedOf(model, spec)) return model;
    const q = [round(Math.min(spec.W, Math.max(0, p[0]))), round(Math.min(spec.H, Math.max(0, p[1])))];
    return { probes: model.probes.concat([q]) };
  }

  const hotNow = (model, spec) => model.probes.length > 0 && dist(model.probes[model.probes.length - 1], spec.target) <= spec.radius;

  // Convex polygon helpers (vertices [[x, y], ...]).
  function clipHalf(poly, n, c) { // keep n . p >= c
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const dp = n[0] * p[0] + n[1] * p[1] - c;
      const dq = n[0] * q[0] + n[1] * q[1] - c;
      if (dp >= 0) out.push(p);
      if ((dp >= 0) !== (dq >= 0)) {
        const t = dp / (dp - dq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    return out;
  }

  function areaCentroid(poly) {
    let a = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < poly.length; i++) {
      const [x0, y0] = poly[i];
      const [x1, y1] = poly[(i + 1) % poly.length];
      const cr = x0 * y1 - x1 * y0;
      a += cr;
      cx += (x0 + x1) * cr;
      cy += (y0 + y1) * cr;
    }
    a /= 2;
    if (Math.abs(a) < 1e-9) {
      const n = poly.length || 1;
      return { area: 0, c: [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n] };
    }
    return { area: Math.abs(a), c: [cx / (6 * a), cy / (6 * a)] };
  }

  // Where the spot can still be, given every warmer/colder answer so far. Each answer keeps the half-plane
  // on the warmer click's side of the two clicks' perpendicular bisector ('same': a thin strip along it).
  function region(spec, probes) {
    let poly = [[0, 0], [spec.W, 0], [spec.W, spec.H], [0, spec.H]];
    for (let i = 1; i < probes.length && poly.length; i++) {
      const fb = feedback(spec, probes, i);
      const a = probes[i - 1];
      const b = probes[i];
      if (dist(a, b) < 1e-9) continue;
      const n = [b[0] - a[0], b[1] - a[1]];
      const c = (b[0] * b[0] + b[1] * b[1] - a[0] * a[0] - a[1] * a[1]) / 2;
      if (fb.trend === 'warmer') poly = clipHalf(poly, n, c);
      else if (fb.trend === 'colder') poly = clipHalf(poly, [-n[0], -n[1]], -c);
      else {
        const e = 0.01 * Math.hypot(n[0], n[1]);
        poly = clipHalf(clipHalf(poly, n, c - e), [-n[0], -n[1]], -c - e);
      }
    }
    return poly;
  }

  const HOT_MARGIN = 0.35;

  const MIN_STEP = 1.2; // units between consecutive clicks

  // Fraction of the region's area on the smaller side of the bisector of clicks a and b.
  function balance(poly, area, a, b) {
    const n = [b[0] - a[0], b[1] - a[1]];
    const c = (b[0] * b[0] + b[1] * b[1] - a[0] * a[0] - a[1] * a[1]) / 2;
    const a1 = areaCentroid(clipHalf(poly, n, c)).area;
    return Math.min(a1, area - a1) / area;
  }

  function nextProbe(spec, probes) {
    const poly = region(spec, probes);
    if (poly.length < 3) return null;
    const { area, c } = areaCentroid(poly);
    const rad = Math.max(...poly.map((v) => dist(v, c)));
    if (rad < spec.radius - HOT_MARGIN || area < 1e-9) return c;
    if (!probes.length) return [spec.W / 2, spec.H / 2];
    const a = probes[probes.length - 1];
    const onBoard = (b) => b[0] >= 1 && b[0] <= spec.W - 1 && b[1] >= 1 && b[1] <= spec.H - 1;
    const dirs = [];
    let maxExt = 0;
    for (let k = 0; k < 36; k++) {
      const th = (k * Math.PI) / 36;
      const n = [Math.cos(th), Math.sin(th)];
      const proj = poly.map((v) => v[0] * n[0] + v[1] * n[1]);
      const lo = Math.min(...proj);
      const hi = Math.max(...proj);
      dirs.push({ n, lo, hi });
      maxExt = Math.max(maxExt, hi - lo);
    }
    // Prefer even splits across the widest direction, made from a click that stays near the region
    // (so the following mirror clicks still fit on the board).
    const near = (b) => 1 / (1 + Math.max(0, dist(b, c) - rad) / 15);
    let best = null;
    const consider = (b, ext) => {
      if (!onBoard(b) || dist(a, b) < MIN_STEP) return;
      const score = balance(poly, area, a, b) * (0.3 + 0.7 * ext / maxExt) * near(b);
      if (!best || score > best.score + 1e-12) best = { score, b };
    };
    for (const { n, lo, hi } of dirs) {
      for (const f of [0.5, 0.43, 0.57, 0.36, 0.64, 0.29, 0.71]) {
        const s = lo + f * (hi - lo);
        const t = a[0] * n[0] + a[1] * n[1] - s;
        consider([a[0] - 2 * t * n[0], a[1] - 2 * t * n[1]], hi - lo);
      }
    }
    // Jumping into the region also cuts it (along the bisector of the jump).
    const u = [c[0] - a[0], c[1] - a[1]];
    const ul = Math.hypot(u[0], u[1]) || 1;
    const proj = poly.map((v) => (v[0] * u[0] + v[1] * u[1]) / ul);
    consider(c, Math.max(...proj) - Math.min(...proj));
    if (best && best.score > 0.02) return best.b;
    return dist(a, c) >= MIN_STEP ? c : [Math.min(spec.W - 1, Math.max(1, c[0] + 3)), c[1]];
  }

  function farCorner(spec) {
    const t = spec.target;
    return Math.max(...[[0, 0], [spec.W, 0], [0, spec.H], [spec.W, spec.H]].map((q) => dist(q, t)));
  }

  env.scenario('solve-puzzle', {
    name: 'hot-cold',
    sample: sampleHotCold,
    level(spec, r, { lv, k }) {
      spec.radius = round(spec.radius * (1 + 0.5 * lv), 10);
      const m = spec.radius + 2;
      spec.target = [round(Math.min(Math.max(spec.target[0], m), spec.W - m), 10), round(Math.min(Math.max(spec.target[1], m), spec.H - m), 10)];
      spec.budget += k(6, 3);
    },
    judge(jr, spec, ph) {
      return ph(['Find the hidden spot on the second board.', 'Click the hot spot of the second board.'], {}, 'there is only one board on the page.', ['second board']);
    },
    base(spec) {
      return { probes: [] };
    },
    start(spec, m, mode, rng) {
      return along(m, spec, mode === 'partial' ? 3 : 2);
    },
    tolerance(spec) {
      return { tau: spec.radius, sigma: 2 * spec.radius };
    },
    error(model, spec) {
      const p = model.probes;
      return p.length ? dist(p[p.length - 1], spec.target) : farCorner(spec);
    },
    locked(model, spec) {
      return model.probes.length >= spec.budget;
    },
    left(model, spec) {
      return spec.budget - model.probes.length;
    },
    ended(model, spec) {
      return model.probes.length >= spec.budget && !hotNow(model, spec) ? 'out-of-clicks' : null;
    },
    instruction(spec, rng) {
      return say(rng, spec, ['Find the HOT spot: click the board and follow the hints.', 'Click around to find the hidden hot spot until a click is HOT.',
        'Use the warmer/colder hints to click the HOT area.', 'Locate the hidden spot on the board; stop once a click reads HOT.',
        'Play hot or cold: click until you hit the HOT spot.', 'Hunt for the hot spot using the temperature hints.',
        'Let the heat hints guide your board clicks; finish on HOT.',
        'Each board click gives a clue; keep going until HOT.',
        'Use board clicks to test guesses; follow hints to HOT.',
        'Track the spot with board clicks and hints; end on HOT.'], {}, { terse: 'find the HOT spot' });
    },
    plan(model, spec) {
      if (lockedOf(model, spec)) return null;
      const p = nextProbe(spec, model.probes);
      return p ? { click: { point: p } } : null;
    },
    simulate(model, spec, step) {
      if (step.click.point) return probe(model, spec, step.click.point);
    },
    target(spec) {
      return { probes: [spec.target.slice()] };
    },
    facts(model, spec) {
      const n = model.probes.length;
      if (!n) return [];
      return [{ label: 'Temperature', value: feedback(spec, model.probes, n - 1).label, labels: ['Last click', 'Result', 'Heat'] },
        { label: 'Clicks left', value: String(spec.budget - n), labels: ['Clicks remaining'] }];
    },
    silent(next, prev, spec, rng, pick) {
      return next.probes.length > prev.probes.length ? pick({ ...next, probes: prev.probes }) : null;
    },
    retarget(spec, model, rng) {
      let out = null;
      const m = spec.radius + 2;
      for (let k = 0; k < 40 && !out; k++) {
        const target = [round(rng.float(m, spec.W - m), 10), round(rng.float(m, spec.H - m), 10)];
        if (dist(target, spec.target) > 4 * spec.radius) out = { ...spec, target, budget: Math.max(spec.budget, model.probes.length + 20) };
      }
      return out;
    },
  });
  Object.assign(fam.helpers, { probe, feedback });
})();
