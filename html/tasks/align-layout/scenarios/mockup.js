/*
 * layout / mockup: sampling, start states, scoring and oracle geometry.
 * Spec, model and targets are documented in logic.js; shared geometry is on the task's lib.
 */
(function () {
  'use strict';

  const { clamp } = env.util;
  const { MIN_BOX, baseSpec, bbox, clear, even, iou, moveRect, placedCount, snapTo, targetRect } = env.taskOf('align-layout').lib;

  const BOXES = ['Header', 'Sidebar', 'Hero image', 'Button', 'Chart', 'Footer', 'Menu', 'Banner', 'Photo', 'Text block',
    'Search', 'Gallery', 'Form', 'Card', 'Avatar', 'Badge', 'Tooltip', 'Dialog', 'Tabs', 'Accordion', 'Calendar',
    'Checklist', 'Timeline', 'Progress', 'Audio', 'Code block', 'File list', 'Chat', 'Comments', 'FAQ', 'Profile',
    'Settings', 'Activity', 'Alert', 'Score', 'Timer', 'Weather', 'Poll', 'Cart', 'Product', 'Tags', 'Filters',
    'Pagination', 'Checkbox', 'Toggle', 'Slider', 'Color well', 'Tree view', 'Data table', 'Keypad', 'Breadcrumb',
    'Credits', 'License', 'Captcha', 'Upload', 'Canvas', 'Toolbar', 'Link', 'Password', 'Receipt', 'Coupon',
    'Bookmarks', 'Inbox', 'Recipe', 'Event', 'Legend', 'Transcript', 'Footnote', 'Animation', 'Texture', 'Terminal',
    'Clipboard'];

  // Split [x, y, w, h] into n regions with 12 px between them (guillotine cuts), each at least minW x minH.
  function splitRegions(rng, area, n, minW, minH) {
    const regs = [area];
    for (let guard = 0; regs.length < n && guard < 60; guard++) {
      regs.sort((a, b) => b.w * b.h - a.w * a.h);
      const r = regs[0];
      const vertical = r.w * 0.8 >= r.h ? true : r.h > r.w * 1.4 ? false : rng.bool();
      const f = rng.float(0.35, 0.65);
      if (vertical) {
        const w1 = even(r.w * f - 6);
        const w2 = r.w - w1 - 12;
        if (w1 < minW || w2 < minW) { regs.push(regs.shift()); continue; }
        regs.shift();
        regs.push({ x: r.x, y: r.y, w: w1, h: r.h }, { x: r.x + w1 + 12, y: r.y, w: w2, h: r.h });
      } else {
        const h1 = even(r.h * f - 6);
        const h2 = r.h - h1 - 12;
        if (h1 < minH || h2 < minH) { regs.push(regs.shift()); continue; }
        regs.shift();
        regs.push({ x: r.x, y: r.y, w: r.w, h: h1 }, { x: r.x, y: r.y + h1 + 12, w: r.w, h: h2 });
      }
    }
    return regs.length === n ? regs : null;
  }

  // traits.noOverlap: mockup starts with every box inside its own target region (the regions are disjoint, so no two
  // boxes ever overlap), smaller than the target and at a random place in it: 'off' and 'partial' 40-70% of each side,
  // 'wrong' 65-85%. The plan then moves a box to its place first and grows it there.
  function initMockupPacked(spec, rng) {
    const q = spec.cell || 1;
    const n = spec.boxes.length;
    const mode = spec.startMode;
    const rr = rng.fork('init');
    const lv = rng.fork('level');
    const tgt = spec.boxes.map(targetRect);
    if (mode === 'solved') return { r: tgt.map((r) => ({ ...r })), cols: [], z: [] };
    const frac = mode === 'wrong' ? [0.65, 0.85] : [0.4, 0.7];
    const thr = 1 - (spec.tau * 1.6) / 100;
    const inside = (t) => {
      for (let a = 0; a < 20; a++) {
        const w = Math.min(t.w, Math.max(3 * q, snapTo(t.w * rr.float(frac[0], frac[1]), q)));
        const h = Math.min(t.h, Math.max(3 * q, snapTo(t.h * rr.float(frac[0], frac[1]), q)));
        const c = { x: t.x + q * rr.int(0, Math.floor((t.w - w) / q)), y: t.y + q * rr.int(0, Math.floor((t.h - h) / q)), w, h };
        if (iou(c, t) < thr) return c;
      }
      return { x: t.x, y: t.y, w: Math.max(3 * q, snapTo(t.w * 0.5, q)), h: Math.max(3 * q, snapTo(t.h * 0.5, q)) };
    };
    const k = mode === 'partial' ? rr.int(1, n - 1) : mode === 'off' ? placedCount(spec, n, lv) : 0;
    const placed = new Set(rr.shuffle(tgt.map((_, i) => i)).slice(0, k));
    return { r: tgt.map((t, i) => (placed.has(i) ? { ...t } : inside(t))), cols: [], z: [] };
  }

  // Packed starts: move a box to its place first (straight, or along one axis at a time), then resize it in place;
  // every step goes through free space only. null when blocked.
  function freeMockupStep(model, spec) {
    const order = model.r.map((r, i) => [iou(r, targetRect(spec.boxes[i])), i]).filter(([v]) => v < 1).sort((a, b) => a[0] - b[0]);
    for (const [, i] of order) {
      const r = model.r[i];
      const t = targetRect(spec.boxes[i]);
      const tries = [];
      if (r.x !== t.x && r.y !== t.y) tries.push([t.x - r.x, t.y - r.y]);
      if (r.x !== t.x) tries.push([t.x - r.x, 0]);
      if (r.y !== t.y) tries.push([0, t.y - r.y]);
      for (const [dx, dy] of tries) {
        const dest = { x: r.x + dx, y: r.y + dy, w: r.w, h: r.h };
        if (clear(model, i, bbox(r, dest))) return { drag: [{ grab: i }, { grab: i, dx, dy }] };
      }
      if (!tries.length && (r.w !== t.w || r.h !== t.h) && r.x + t.w <= spec.W && r.y + t.h <= spec.H) {
        const dest = { x: r.x, y: r.y, w: t.w, h: t.h };
        if (clear(model, i, bbox(r, dest))) return { drag: [{ handle: i, h: 'se' }, { handle: i, h: 'se', dx: t.w - r.w, dy: t.h - r.h }] };
      }
    }
    return null;
  }

  function sampleMockup(rng, opts) {
    const spec = baseSpec('mockup', rng, opts);
    spec.W = 400;
    spec.H = 260;
    spec.scale = 0.5;
    const n = spec.level === 'easy' ? 2 : spec.level === 'medium' ? 3 : rng.int(3, 4);
    for (let attempt = 0; attempt < 40; attempt++) {
      const regs = splitRegions(rng, { x: 12, y: 12, w: spec.W - 24, h: spec.H - 24 }, n, 64, 44);
      if (!regs) continue;
      const labels = rng.sample(BOXES, n);
      const hue0 = rng.int(0, 359);
      spec.boxes = rng.shuffle(regs).map((g, i) => {
        const ix = even(rng.int(0, 8));
        const iy = even(rng.int(0, 8));
        return { label: labels[i], hue: (hue0 + i * 83) % 360, tx: g.x + ix, ty: g.y + iy, tw: even(g.w - 2 * ix), th: even(g.h - 2 * iy) };
      });
      spec.items = spec.boxes.map((b) => ({ label: b.label, hue: b.hue, fix: null }));
      return spec;
    }
    throw new Error('layout mockup: no regions');
  }

  function initMockup(spec, rng) {
    const n = spec.boxes.length;
    const mode = spec.startMode;
    const rr = rng.fork('init');
    const lv = rng.fork('level');
    const tgt = spec.boxes.map(targetRect);
    if (mode === 'solved') return { r: tgt.map((r) => ({ ...r })), cols: [], z: [] };
    const thr = 1 - (spec.tau * 1.6) / 100;
    const nearMiss = () => tgt.map((t) => {
      let r = t;
      for (let k = 0; k < 30; k++) {
        const f = 1 + k * 0.25;
        const dx = (rr.bool() ? 1 : -1) * Math.round(rr.int(8, 18) * f);
        const dy = (rr.bool() ? 1 : -1) * Math.round(rr.int(6, 16) * f);
        const dw = Math.round(rr.int(-14, 14) * f);
        const dh = Math.round(rr.int(-10, 10) * f);
        r = moveRect(spec, { x: t.x, y: t.y, w: clamp(t.w + dw, MIN_BOX, spec.W), h: clamp(t.h + dh, MIN_BOX, spec.H) }, dx, dy);
        if (iou(r, t) < thr) break;
      }
      return r;
    });
    if (mode === 'wrong') return { r: nearMiss(), cols: [], z: [] };
    const placed = new Set();
    const k = mode === 'partial' ? rr.int(1, n - 1) : mode === 'off' ? placedCount(spec, n, lv) : 0;
    rr.shuffle(tgt.map((_, i) => i)).slice(0, k).forEach((i) => placed.add(i));
    // no box (nearly) inside another or holding one: a box covered but for a sliver under 24 px could not be grabbed
    const M = 24;
    const inside = (a, b) => a.x >= b.x - M && a.y >= b.y - M && a.x + a.w <= b.x + b.w + M && a.y + a.h <= b.y + b.h + M;
    const r = [];
    tgt.forEach((t, i) => {
      if (placed.has(i)) { r.push({ ...t }); return; }
      const others = [...r, ...tgt.filter((_, j) => j > i && placed.has(j))];
      for (let a = 0; a < 40; a++) {
        const w = clamp(even(t.w * rr.float(0.55, 1.6)), 40, spec.W - 8);
        const h = clamp(even(t.h * rr.float(0.55, 1.6)), 30, spec.H - 8);
        const cand = { x: rr.int(0, spec.W - w), y: rr.int(0, spec.H - h), w, h };
        if (iou(cand, t) < 0.5 && !others.some((o) => inside(o, cand) || inside(cand, o))) { r.push(cand); return; }
      }
      r.push(moveRect(spec, { x: 0, y: 0, w: Math.max(40, t.w - 24), h: t.h }, spec.W - 100, spec.H - 80));
    });
    return { r, cols: [], z: [] };
  }

  env.scenario('align-layout', {
    name: 'mockup',
    sample: sampleMockup,
    init: (spec, rng) => spec.noOverlap ? initMockupPacked(spec, rng) : initMockup(spec, rng),
    error(model, spec) {
      return Math.round(100 * (1 - Math.min(...model.r.map((r, i) => iou(r, targetRect(spec.boxes[i]))))) * 100) / 100;
    },
    plan(model, spec) {
      if (spec.noOverlap) {
        const st = freeMockupStep(model, spec);
        if (st) return st;
      }
      // Worst box first, but not a step that leaves another misplaced box wholly under the moved one (it could no
      // longer be grabbed; a switched mockup that swaps two boxes hits this).
      const step = (i) => {
        const r = model.r[i];
        const t = targetRect(spec.boxes[i]);
        const sizeDiff = r.w !== t.w || r.h !== t.h;
        const posDiff = r.x !== t.x || r.y !== t.y;
        if (posDiff && !(sizeDiff && r.x + t.w <= spec.W && r.y + t.h <= spec.H)) {
          const nx = clamp(t.x, 0, spec.W - r.w);
          const ny = clamp(t.y, 0, spec.H - r.h);
          return { dest: { x: nx, y: ny, w: r.w, h: r.h }, plan: { drag: [{ grab: i }, { grab: i, dx: nx - r.x, dy: ny - r.y }] } };
        }
        return { dest: { x: r.x, y: r.y, w: t.w, h: t.h }, plan: { drag: [{ handle: i, h: 'se' }, { handle: i, h: 'se', dx: t.w - r.w, dy: t.h - r.h }] } };
      };
      const off = model.r.map((r, i) => [iou(r, targetRect(spec.boxes[i])), i]).filter(([v]) => v < 1).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
      if (!off.length) return null;
      const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
      const buries = (i, dest) => off.some((k) => k !== i && inside(model.r[k], dest));
      const pick = off.find((i) => !buries(i, step(i).dest));
      return step(pick !== undefined ? pick : off[0]).plan;
    },
    solve(spec, model) {
      return { ...model, r: spec.boxes.map(targetRect) };
    },
  });
})();
