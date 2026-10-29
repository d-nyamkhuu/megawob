/*
 * layout / align: sampling, start states, scoring and oracle geometry.
 * Spec, model and targets are documented in logic.js; shared geometry is on the task's lib.
 */
(function () {
  'use strict';

  const { clamp } = env.util;
  const { LABELS, MARGIN, alongPos, baseSpec, edgeOf, even, locked, placedCount, rectAt } = env.taskOf('align-layout').lib;

  function sampleAlign(rng, opts) {
    const spec = baseSpec('align', rng, opts);
    const W = 520;
    const H = 280;
    const n = spec.level === 'easy' ? 3 : spec.level === 'medium' ? rng.int(3, 4) : rng.int(3, 5);
    spec.W = W;
    spec.H = H;
    spec.axis = rng.pick(['x', 'y']);
    spec.edge = rng.pick(['min', 'max', 'mid']);
    spec.anchor = spec.level === 'easy' ? 'guide' : rng.pick(['guide', 'guide', 'card']);
    const L = spec.axis === 'x' ? W : H;
    const crossLen = spec.axis === 'x' ? H : W;
    const pitch = Math.floor((crossLen - 2 * MARGIN) / n);
    const labels = rng.sample(LABELS, n);
    const hue0 = rng.int(0, 359);
    spec.items = labels.map((label, i) => {
      const s = spec.axis === 'x' ? even(rng.int(90, 150)) : even(rng.int(44, 80));
      const cs = spec.axis === 'x' ? even(rng.int(26, Math.min(44, pitch - 10))) : even(rng.int(56, Math.min(100, pitch - 12)));
      return { label, hue: (hue0 + i * 67) % 360, s, cs, c: MARGIN + i * pitch + Math.floor((pitch - cs) / 2), fix: null };
    });
    const maxs = Math.max(...spec.items.map((it) => it.s));
    const lo = spec.edge === 'min' ? MARGIN : spec.edge === 'max' ? maxs + MARGIN : maxs / 2 + MARGIN;
    const hi = spec.edge === 'min' ? L - maxs - MARGIN : spec.edge === 'max' ? L - MARGIN : L - maxs / 2 - MARGIN;
    spec.t = rng.int(Math.ceil(lo), Math.floor(hi));
    if (spec.anchor === 'card') {
      spec.ref = rng.int(0, n - 1);
      const it = spec.items[spec.ref];
      it.fix = rectAt(spec, spec.ref, alongPos(spec, spec.t, it.s));
    }
    return spec;
  }

  function initAlign(spec, rng) {
    const n = spec.items.length;
    const mode = spec.startMode;
    const L = spec.axis === 'x' ? spec.W : spec.H;
    const mov = spec.items.map((_, i) => i).filter((i) => !locked(spec, i));
    const place = (i, val) => rectAt(spec, i, clamp(alongPos(spec, val, spec.items[i].s), 0, L - spec.items[i].s));
    const r = new Array(n);
    spec.items.forEach((it, i) => { if (it.fix) r[i] = { ...it.fix }; });
    if (mode === 'solved') { for (const i of mov) r[i] = place(i, spec.t); return { r, cols: [], z: [] }; }
    const rr = rng.fork('init');
    const lv = rng.fork('level');
    let placed = mode === 'partial' ? rr.int(1, Math.max(1, mov.length - 1)) : mode === 'off' ? placedCount(spec, mov.length, lv) : 0;
    if (mode === 'wrong') {
      // All cards on one common coordinate that is not the target (they agree with each other), or near misses.
      const common = rr.bool(0.6);
      const off = (rr.bool() ? 1 : -1) * rr.int(common ? 24 : 8, common ? 60 : 20);
      for (const i of mov) {
        const d = common ? off : (rr.bool() ? 1 : -1) * rr.int(8, 20);
        const rect = place(i, spec.t + d);
        r[i] = rect;
      }
      if (Math.max(...mov.map((i) => Math.abs(edgeOf(spec, r[i]) - spec.t))) <= spec.tau * 2) r[mov[0]] = place(mov[0], spec.t + 30 < L - 20 ? spec.t + 30 : spec.t - 30);
      return { r, cols: [], z: [] };
    }
    for (const i of rr.shuffle(mov)) {
      if (placed > 0) { r[i] = place(i, spec.t); placed--; continue; }
      const s = spec.items[i].s;
      let rect = null;
      for (let t = 0; t < 30 && !rect; t++) {
        const cand = rectAt(spec, i, rr.int(0, L - s));
        if (Math.abs(edgeOf(spec, cand) - spec.t) >= 16) rect = cand;
      }
      r[i] = rect || place(i, spec.t + (spec.t < L / 2 ? 40 : -40));
    }
    return { r, cols: [], z: [] };
  }

  env.scenario('align-layout', {
    name: 'align',
    sample: sampleAlign,
    init: initAlign,
    error(model, spec) {
      let e = 0;
      model.r.forEach((r, i) => { if (!locked(spec, i)) e = Math.max(e, Math.abs(edgeOf(spec, r) - spec.t)); });
      return e;
    },
    plan(model, spec) {
      let best = -1;
      let dev = 0;
      model.r.forEach((r, i) => {
        if (locked(spec, i)) return;
        const d = Math.abs(edgeOf(spec, r) - spec.t);
        if (d > dev) { dev = d; best = i; }
      });
      if (best < 0) return null;
      const d = spec.t - edgeOf(spec, model.r[best]);
      return { drag: [{ grab: best }, spec.axis === 'x' ? { grab: best, dx: d, dy: 0 } : { grab: best, dx: 0, dy: d }] };
    },
    solve(spec, model) {
      return { ...model, r: model.r.map((r, i) => (locked(spec, i) ? r : rectAt(spec, i, clamp(alongPos(spec, spec.t, spec.items[i].s), 0, (spec.axis === 'x' ? spec.W : spec.H) - spec.items[i].s)))) };
    },
  });
})();
