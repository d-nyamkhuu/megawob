/*
 * layout / spacing: sampling, start states, scoring and oracle geometry.
 * Spec, model and targets are documented in logic.js; shared geometry is on the task's lib.
 */
(function () {
  'use strict';

  const { LABELS, MARGIN, baseSpec, bbox, clear, even, gapsOf, locked, placedCount, rectAt, startOf, sum } = env.taskOf('align-layout').lib;

  // Adjust gaps so they sum to nGaps * g (equal mode, ends locked), changing the last one.
  function fixSum(gaps, g, nGaps) {
    const out = gaps.slice();
    out[nGaps - 1] = nGaps * g - sum(out.slice(0, nGaps - 1));
    return out;
  }

  // Drag a card straight to its final place when nothing sits on the way (outermost cards first).
  function freeSpacingStep(model, spec) {
    let p = spec.p0;
    const tgt = spec.items.map((it) => { const v = p; p += it.s + spec.g; return v; });
    let best = null;
    spec.items.forEach((it, i) => {
      if (locked(spec, i)) return;
      const cur = startOf(spec, model.r[i]);
      const d = tgt[i] - cur;
      if (!d) return;
      const dest = rectAt(spec, i, tgt[i]);
      if (!clear(model, i, bbox(model.r[i], dest))) return;
      if (!best || Math.abs(d) > Math.abs(best.d)) best = { i, d };
    });
    if (!best) return null;
    const to = spec.axis === 'x' ? { grab: best.i, dx: best.d, dy: 0 } : { grab: best.i, dx: 0, dy: best.d };
    return { drag: [{ grab: best.i }, to] };
  }

  function sampleSpacing(rng, opts) {
    const spec = baseSpec('spacing', rng, opts);
    spec.axis = rng.pick(['x', 'y']);
    spec.W = 520;
    spec.H = spec.axis === 'x' ? 240 : 280;
    const L = spec.axis === 'x' ? spec.W : spec.H;
    spec.mode = spec.level === 'easy' ? 'equal' : rng.pick(['equal', 'equal', 'gap']);
    let n;
    if (spec.mode === 'equal') n = spec.level === 'easy' ? 3 : spec.level === 'medium' ? 4 : rng.int(4, spec.axis === 'x' ? 5 : 5);
    else n = spec.level === 'medium' ? rng.int(3, 4) : rng.int(3, 5);
    const crossLen = spec.axis === 'x' ? spec.H : spec.W;
    const centre = Math.round(crossLen / 2) + rng.int(-20, 20);
    const sizeLo = spec.axis === 'x' ? 50 : 30;
    const sizeHi = spec.axis === 'x' ? 100 : 48;
    const hue0 = rng.int(0, 359);
    const labels = rng.sample(LABELS, n);
    for (let attempt = 0; attempt < 40; attempt++) {
      const items = labels.map((label, i) => {
        const cs = even(rng.int(spec.axis === 'x' ? 40 : 70, spec.axis === 'x' ? 56 : 110));
        return { label, hue: (hue0 + i * 61) % 360, s: even(rng.int(sizeLo, sizeHi)), cs, c: centre - cs / 2, fix: null };
      });
      const total = sum(items.map((it) => it.s));
      const gMax = Math.floor((L - 2 * MARGIN - total) / (n - 1));
      if (gMax < 24) continue;
      spec.g = spec.mode === 'equal' ? rng.int(24, Math.min(40, gMax)) : [12, 16, 20, 24, 30, 36].filter((v) => v <= gMax)[rng.int(0, Math.max(0, [12, 16, 20, 24, 30, 36].filter((v) => v <= gMax).length - 1))];
      spec.items = items;
      const span = total + (n - 1) * spec.g;
      spec.p0 = rng.int(MARGIN, L - MARGIN - span);
      // the locked cards sit at their solved positions
      let p = spec.p0;
      items.forEach((it, i) => {
        if (i === 0 || (spec.mode === 'equal' && i === n - 1)) it.fix = rectAt(spec, i, p);
        p += it.s + spec.g;
      });
      return spec;
    }
    throw new Error('layout spacing: no fit');
  }

  function initSpacing(spec, rng) {
    const n = spec.items.length;
    const mode = spec.startMode;
    const g = spec.g;
    const rr = rng.fork('init');
    const lv = rng.fork('level');
    const nGaps = n - 1;
    const solvedGaps = new Array(nGaps).fill(g);
    const free = (gaps) => {
      let p = spec.p0;
      return spec.items.map((it, i) => { const rect = it.fix && spec.mode === 'equal' ? { ...it.fix } : rectAt(spec, i, p); p += it.s + (gaps[i] === undefined ? 0 : gaps[i]); return rect; });
    };
    const build = (gaps) => ({ r: free(gaps), cols: [], z: [] });
    if (mode === 'solved') return build(solvedGaps);
    const k = mode === 'partial' ? rr.int(0, Math.max(0, spec.mode === 'equal' ? n - 3 : n - 2))
      : mode === 'off' ? (spec.mode === 'equal' ? Math.min(placedCount(spec, n - 2, lv), n - 3) : placedCount(spec, n - 1, lv)) : 0;
    const gaps = solvedGaps.slice();
    if (spec.mode === 'gap') {
      const L = spec.axis === 'x' ? spec.W : spec.H;
      const maxG = Math.floor((L - 8 - spec.p0 - sum(spec.items.map((it) => it.s))) / nGaps);
      if (mode === 'wrong') {
        const d = rr.int(10, 14);
        const wg = g + d <= maxG && (rr.bool() || g - d < 4) ? g + d : Math.max(4, g - d);
        return build(new Array(nGaps).fill(wg));
      }
      for (let tries = 0; tries < 60; tries++) {
        const cand = solvedGaps.map((v, j) => (j < k ? v : rr.int(4, 56)));
        const span = sum(spec.items.map((it) => it.s)) + sum(cand);
        if (spec.p0 + span > L - 8) continue;
        if (Math.max(...cand.map((v) => Math.abs(v - g))) >= 14) return build(cand);
      }
      return build(solvedGaps.map((v, j) => (j < k ? v : g + 16 <= maxG ? v + 16 : Math.max(4, v - 16))));
    }
    // equal: the gaps always sum to (n - 1) g (the ends are locked)
    if (mode === 'wrong') {
      const d = rr.int(7, 10);
      const wrong = solvedGaps.map((v, j) => v + (j % 2 === 0 ? d : -d));
      return build(fixSum(wrong, g, nGaps));
    }
    for (let tries = 0; tries < 80; tries++) {
      const rest = nGaps - k;
      const e = [];
      for (let j = 0; j < rest - 1; j++) e.push(rr.int(-(g - 6), g - 6));
      e.push(-sum(e));
      if (Math.abs(e[e.length - 1]) > g - 6) continue;
      if (Math.max(...e.map(Math.abs)) < 12) continue;
      for (let j = 0; j < rest; j++) gaps[k + j] = g + e[j];
      return build(gaps);
    }
    const base = solvedGaps.slice();
    base[k] += 14;
    base[nGaps - 1] -= 14;
    return build(base);
  }

  env.scenario('align-layout', {
    name: 'spacing',
    sample: sampleSpacing,
    init: initSpacing,
    error(model, spec) {
      const worst = Math.max(...gapsOf(spec, model).map((g) => Math.abs(g - spec.g)));
      if (worst <= spec.tau) return worst; // solved test unchanged: every gap within tau
      // Outside tau: 2 x the largest offset of a card from its place in the solved layout (p0, then size + g). Placing a
      // card fully never raises it, where the largest gap error moved onto the next gap; each gap error is at most
      // twice the larger offset of its two cards, so this is never below the gap error and stays above tau.
      let p = spec.p0;
      let dev = 0;
      spec.items.forEach((it, i) => { dev = Math.max(dev, Math.abs(startOf(spec, model.r[i]) - p)); p += it.s + spec.g; });
      return 2 * dev;
    },
    plan(model, spec) {
      if (spec.noOverlap) {
        const st = freeSpacingStep(model, spec);
        if (st) return st;
      }
      const gs = gapsOf(spec, model);
      for (let j = 0; j < gs.length; j++) {
        const i = j + 1;
        if (gs[j] === spec.g || locked(spec, i)) continue;
        const d = spec.g - gs[j];
        return { drag: [{ grab: i }, spec.axis === 'x' ? { grab: i, dx: d, dy: 0 } : { grab: i, dx: 0, dy: d }] };
      }
      return null;
    },
    solve(spec, model) {
      let p = spec.p0;
      const r = spec.items.map((it, i) => { const rect = rectAt(spec, i, p); p += it.s + spec.g; return rect; });
      return { ...model, r };
    },
  });
})();
