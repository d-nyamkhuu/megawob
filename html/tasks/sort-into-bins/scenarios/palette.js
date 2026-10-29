/* sort-into-bins/scenarios/palette.js: palette sampling, drops, starts and oracle. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- palette

  function paletteSpec(rng, base) {
    const lv = base.level;
    let nT = base.ood ? rng.int(5, 6) : rng.int(3, 5);
    if (lv) nT = 3;
    const shapes = rng.sample(lib.SHAPES, Math.min(nT, lib.SHAPES.length));
    const colorBy = rng.bool(0.5);
    const templates = shapes.map((shape) => ({ shape, color: colorBy ? rng.pick(lib.COLOR_NAMES) : rng.pick(lib.COLOR_NAMES) }));
    let s = base.ood ? rng.float(0.075, 0.09) : rng.float(0.09, 0.11);
    if (lv) s = 0.11;
    const item = { w: s / lib.ASPECT, h: s };
    const palW = (s * 1.7) / lib.ASPECT;
    const pal = { x: 0.015, y: 0.03, w: palW, h: 0.94 };
    const canvas = { x: pal.x + palW + 0.03, y: 0.03, w: 1 - (pal.x + palW + 0.03) - 0.015, h: 0.94 };
    let nW = rng.int(1, Math.min(3, nT));
    if (lv) nW = lv === 'easy' ? 1 : 2;
    const want = {};
    for (const t of rng.sample(templates.map((_, i) => i), nW)) want[t] = lv ? (lv === 'easy' ? 2 : rng.fork('level').int(1, 2)) : rng.int(1, base.ood ? 4 : 3);
    const total = Object.values(want).reduce((a, b) => a + b, 0);
    const cols = Math.max(2, Math.ceil(Math.sqrt(total + 1)));
    const rows = Math.ceil((total + 1) / cols);
    const fw = Math.min(canvas.w * 0.75, (cols * 1.5 * s) / lib.ASPECT + rng.float(0.02, 0.08));
    const fh = Math.min(canvas.h * 0.75, rows * 1.5 * s + rng.float(0.02, 0.08));
    const frame = { x: canvas.x + rng.float(0.03, canvas.w - fw - 0.03), y: canvas.y + rng.float(0.03, canvas.h - fh - 0.03), w: fw, h: fh };
    return { ...base, scenario: 'palette', aspect: lib.ASPECT, item, templates, pal, canvas, frame, want,
      rule: { mode: 'palette', byColor: colorBy } };
  }

  function palSlot(spec, t) {
    const n = spec.templates.length;
    const P = spec.pal;
    const step = Math.min(P.h / n, spec.item.h * 1.6);
    const top = P.y + (P.h - step * n) / 2;
    return [P.x + P.w / 2, top + step * (t + 0.5)];
  }

  function frameCounts(model, spec) {
    const F = lib.boxRect(spec.frame);
    const counts = {};
    let partial = 0;
    for (const p of model.placed) {
      const r = lib.itemRect(spec, p.pos);
      if (lib.within(r, F)) counts[p.t] = (counts[p.t] || 0) + 1;
      else if (lib.overlap(r, F)) partial++;
    }
    return { counts, partial };
  }

  function paletteError(model, spec) {
    const { counts, partial } = frameCounts(model, spec);
    let wrong = partial;
    for (let t = 0; t < spec.templates.length; t++) wrong += Math.abs((counts[t] || 0) - (spec.want[t] || 0));
    const total = Object.values(spec.want).reduce((a, b) => a + b, 0);
    return wrong / total;
  }

  // Drop of a template copy (src { template }) or a placed copy (src { item }) with its center at `center`.
  function paletteDrop(spec, model, src, center) {
    const m = { placed: model.placed.map((p) => ({ ...p, pos: p.pos.slice() })), next: model.next };
    const onPal = lib.inPt(center, lib.boxRect(spec.pal));
    const inCanvas = lib.inPt(center, lib.boxRect(spec.canvas));
    const { w, h } = spec.item;
    const C0 = spec.canvas;
    const clampC = (p) => [Math.min(C0.x + C0.w - w / 2, Math.max(C0.x + w / 2, p[0])), Math.min(C0.y + C0.h - h / 2, Math.max(C0.y + h / 2, p[1]))];
    if (src.template !== undefined) {
      if (inCanvas) m.placed.push({ id: `p${m.next++}`, t: src.template, pos: clampC(center) });
      return m;
    }
    const k = m.placed.findIndex((p) => p.id === src.item);
    if (k < 0) return m;
    if (onPal) m.placed.splice(k, 1);
    else m.placed[k].pos = clampC(center);
    return m;
  }

  function freeFrame(spec, model) {
    const F = spec.frame;
    const region = [F.x, F.y, F.x + F.w, F.y + F.h];
    const others = model.placed.map((p) => lib.itemRect(spec, p.pos, 0.06));
    return lib.gridPoints(spec, 0.25, region).find((p) => lib.within(lib.itemRect(spec, p), region) && !others.some((o) => lib.overlap(lib.itemRect(spec, p), o))) || null;
  }

  function freeCanvasOutside(spec, model, id) {
    const F = lib.growBox(lib.boxRect(spec.frame), spec.item.w * 0.3, spec.item.h * 0.3);
    const C0 = spec.canvas;
    const others = model.placed.filter((p) => p.id !== id).map((p) => lib.itemRect(spec, p.pos, 0.06));
    return lib.gridPoints(spec, 0.25, [C0.x, C0.y, C0.x + C0.w, C0.y + C0.h])
      .find((p) => !lib.overlap(lib.itemRect(spec, p), F) && !others.some((o) => lib.overlap(lib.itemRect(spec, p), o))) || null;
  }

  function palettePlan(model, spec) {
    const F = lib.boxRect(spec.frame);
    const { counts } = frameCounts(model, spec);
    const partial = model.placed.find((p) => { const r = lib.itemRect(spec, p.pos); return !lib.within(r, F) && lib.overlap(r, F); });
    if (partial) return { drag: [{ item: partial.id }, { trash: true }] };
    for (let t = 0; t < spec.templates.length; t++) {
      if ((counts[t] || 0) > (spec.want[t] || 0)) {
        const p = model.placed.find((q) => q.t === t && lib.within(lib.itemRect(spec, q.pos), F));
        return { drag: [{ item: p.id }, { trash: true }] };
      }
    }
    for (let t = 0; t < spec.templates.length; t++) {
      if ((counts[t] || 0) < (spec.want[t] || 0)) {
        const to = freeFrame(spec, model);
        if (!to) return null;
        return { drag: [{ template: t }, { point: to }] };
      }
    }
    return null;
  }


  function initPalette(spec, rng) {
    const m = { placed: [], next: 0 };
    const mode = lib.levelMode(spec);
    if (spec.level && spec.startMode === 'off') {
      // One copy of a wanted shape per three wanted copies (easy: always one), the rest left to place.
      const total = Object.values(spec.want).reduce((a, b) => a + b, 0);
      const t = Number(Object.keys(spec.want)[0]);
      for (let i = 0; i < (spec.level === 'easy' ? 1 : Math.floor(total / 3)); i++) {
        const to = freeFrame(spec, m);
        if (to) m.placed.push({ id: `p${m.next++}`, t, pos: to });
      }
    } else if (mode === 'partial') {
      const [t] = Object.keys(spec.want);
      const to = freeFrame(spec, m);
      if (to) m.placed.push({ id: `p${m.next++}`, t: Number(t), pos: to });
    } else if (mode === 'wrong') {
      const bad = spec.templates.map((_, i) => i).filter((i) => !spec.want[i]);
      const t = bad.length ? rng.pick(bad) : Number(Object.keys(spec.want)[0]);
      for (let k = 0; k < (bad.length ? 2 : spec.want[t] + 1); k++) {
        const to = freeFrame(spec, m);
        if (to) m.placed.push({ id: `p${m.next++}`, t, pos: to });
      }
    } else if (rng.bool(0.3)) {
      // A stray copy left on the canvas outside the frame (ignored by the goal).
      const to = freeCanvasOutside(spec, m, null);
      if (to) m.placed.push({ id: `p${m.next++}`, t: rng.int(0, spec.templates.length - 1), pos: to });
    }
    return m;
  }

  Object.assign(lib, { frameCounts, palSlot, paletteDrop, paletteError, palettePlan });
  env.scenario('sort-into-bins', { name: 'palette', sample: (rng, base) => paletteSpec(rng.fork('palette'), base),
    init: initPalette, error: paletteError, plan: palettePlan });
})();
