/* sort-into-bins/sampling.js: box task sampling and layout geometry. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- sampling (single / collect / sort)

  // Container sizes in board-height units (u); x is later divided by the aspect ratio.
  function boxDims(rng, s, capacity, labeled) {
    const cell = s * rng.float(1.22, 1.38);
    const pad = 0.15 * s;
    const head = labeled ? 0.065 : 0;
    const cols = capacity <= 1 ? 1 : Math.min(capacity, capacity > 6 ? rng.int(3, 4) : rng.int(2, 3));
    const rows = Math.ceil(Math.max(1, capacity) / cols);
    let w = cols * cell + 2 * pad + rng.float(0, 0.7) * s;
    const h = head + rows * cell + 2 * pad + rng.float(0, 0.5) * s;
    if (labeled) w = Math.max(w, 0.26);
    return { w, h, head };
  }

  function placeBoxes(rng, dims, spatial) {
    const out = [];
    const gx = 0.1 / lib.ASPECT;
    const gy = 0.1;
    const m = 0.03;
    for (let i = 0; i < dims.length; i++) {
      const d = dims[i];
      const w = d.w / lib.ASPECT;
      const h = d.h;
      let ok = null;
      for (let t = 0; t < 200 && !ok; t++) {
        let x = rng.float(m / lib.ASPECT, 1 - w - m / lib.ASPECT);
        let y = rng.float(m, 1 - h - m);
        if (spatial === 'h') x = i === 0 ? rng.float(m / lib.ASPECT, Math.max(m / lib.ASPECT, 0.46 - w)) : rng.float(Math.min(0.54, 1 - w - m / lib.ASPECT), 1 - w - m / lib.ASPECT);
        if (spatial === 'v') y = i === 0 ? rng.float(m, Math.max(m, 0.46 - h)) : rng.float(Math.min(0.54, 1 - h - m), 1 - h - m);
        const b = [x, y, x + w, y + h];
        if (b[2] > 1 || b[3] > 1) continue;
        if (spatial === 'h' && i === 1 && x < out[0].x + out[0].w + 0.03) continue;
        if (spatial === 'v' && i === 1 && y < out[0].y + out[0].h + 0.03) continue;
        if (!out.some((o) => lib.overlap(lib.growBox(b, gx, gy), lib.boxRect(o)))) ok = { x, y, w, h, head: d.head };
      }
      if (!ok) return null;
      out.push(ok);
    }
    if (spatial) {
      out[0].side = spatial === 'h' ? 'left' : 'top';
      out[1].side = spatial === 'h' ? 'right' : 'bottom';
    }
    return out;
  }

  function pickOther(rng, pool, not) {
    return rng.pick(pool.filter((v) => v !== not));
  }

  // Items and goals for each scenario (no geometry yet). Returns { items, labels[], goalIndex[], rule }.
  // goalIndex: container index, -1 = out, -2 = any (count mode).
  function sampleTask(rng, scenario, ood, ctl) {
    const mk = (shape, color) => ({ shape, color });
    const lv = ctl && ctl.level;
    const rl = lv ? rng.fork('level') : null;
    if (scenario === 'single') {
      return { items: [mk(rng.pick(lib.SHAPES), rng.pick(lib.COLOR_NAMES))], labels: [null], goalIndex: [0], rule: { mode: 'single' } };
    }
    const kind = rng.pick(['color', 'shape']);
    const pool = kind === 'color' ? lib.COLOR_NAMES : lib.SHAPES;
    const otherPool = kind === 'color' ? lib.SHAPES : lib.COLOR_NAMES;
    const make = (v) => (kind === 'color' ? mk(rng.pick(otherPool), v) : mk(v, rng.pick(otherPool)));
    if (scenario === 'collect') {
      // ctl (traits.layout / itemCount / containers): { single } one container whatever the draw, { count } total
      // items, { boxes } the number of bins the widget declared (2 = the two-box rule, which has no 'remove' mode).
      const boxes = ctl && ctl.boxes;
      let mode = lib.C.weighted(rng, boxes === 2 ? [['in', 3], ['count', 2]] : [['in', 3], ['remove', 2], ['count', 2]]);
      if (lv && (lv === 'easy' || mode === 'count')) mode = 'in';
      const spatial = boxes ? boxes === 2 : rng.bool(mode === 'remove' ? 0 : 0.4) && !(ctl && ctl.single) && !lv;
      const value = rng.pick(pool);
      const big = ood ? 2 : 0;
      let nT = mode === 'count' ? rng.int(3, 5) + big : rng.int(2, 4) + big;
      let nO = rng.int(2, 4) + big;
      if (lv) { nT = lv === 'easy' ? 2 : rl.int(2, 3); nO = lv === 'easy' ? 2 : rl.int(2, 3); }
      if (ctl && ctl.count) {
        nT = Math.max(2, Math.min(ctl.count - 1, Math.round(ctl.count * ctl.frac)));
        nO = Math.max(1, ctl.count - nT);
      }
      const k = mode === 'count' ? rng.int(1, nT - 1) : undefined;
      const items = [];
      const goalIndex = [];
      for (let i = 0; i < nT; i++) { items.push(make(value)); goalIndex.push(mode === 'count' ? -2 : mode === 'remove' ? -1 : 0); }
      for (let i = 0; i < nO; i++) { items.push(make(pickOther(rng, pool, value))); goalIndex.push(mode === 'remove' ? 0 : -1); }
      const target = spatial ? rng.int(0, 1) : 0;
      if (spatial) for (let i = 0; i < goalIndex.length; i++) if (goalIndex[i] === 0) goalIndex[i] = target;
      return { items, labels: spatial ? [null, null] : [null], goalIndex, rule: { kind, value, mode, k, target }, spatial };
    }
    // sort
    // ctl.boxes (traits.containers): 2 bins = any mode, 3-4 bins = 'each' with that many categories.
    const nbox = ctl && ctl.boxes;
    let mode = nbox > 2 ? 'each' : lib.C.weighted(rng, [['each', 2], ['split', 1], ['spatial', 1.2]]);
    if (lv && !(nbox > 2) && (lv === 'easy' || mode === 'spatial')) mode = 'each';
    const items = [];
    const goalIndex = [];
    if (mode === 'split' || mode === 'spatial') {
      const value = rng.pick(pool);
      let nV = rng.int(2, 3) + (ood ? 1 : 0);
      let nO = rng.int(2, 4) + (ood ? 1 : 0);
      if (lv) { nV = 2; nO = rl.int(2, 3); }
      for (let i = 0; i < nV; i++) { items.push(make(value)); goalIndex.push(0); }
      const others = rng.shuffle(pool.filter((v) => v !== value));
      for (let i = 0; i < nO; i++) { items.push(make(others[i % others.length])); goalIndex.push(1); }
      if (mode === 'spatial') {
        // Which box gets the value is random (left or right, top or bottom).
        const flip = rng.bool(0.5);
        if (flip) for (let i = 0; i < goalIndex.length; i++) goalIndex[i] = 1 - goalIndex[i];
        return { items, labels: [null, null], goalIndex, rule: { kind, value, mode, target: flip ? 1 : 0 }, spatial: true };
      }
      const label = kind === 'color' ? lib.cap(value) : lib.cap(lib.plural(value));
      return { items, labels: [label, 'Other'], goalIndex, rule: { kind, value, mode } };
    }
    const k = nbox || (ood ? 4 : lv ? 2 : rng.int(2, 3));
    const values = rng.sample(pool, k);
    const counts = values.map(() => (k === 2 ? rng.int(2, 4) : rng.int(1, 3)));
    if (lv && k === 2) counts.forEach((_, i) => { counts[i] = lv === 'easy' ? 2 : rl.int(2, 3); });
    while (counts.reduce((a, b) => a + b, 0) < 4) counts[rng.int(0, k - 1)]++;
    values.forEach((v, ci) => { for (let i = 0; i < counts[ci]; i++) { items.push(make(v)); goalIndex.push(ci); } });
    const labels = values.map((v) => (kind === 'color' ? lib.cap(v) : lib.cap(lib.plural(v))));
    return { items, labels, goalIndex, rule: { kind, values, mode } };
  }

  // ---- reference-style layouts (traits.layout)

  // Points of a tidy grid of n items centered on (cx, cy), `cols` per row (the last row centered), pitch (px, py).
  function tidyGrid(cx, cy, n, cols, px, py) {
    const rows = Math.ceil(n / cols);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, n - row * cols);
      pts.push([cx + (i - row * cols - (inRow - 1) / 2) * px, cy + (row - (rows - 1) / 2) * py]);
    }
    return pts;
  }

  // Bins and start points for traits.layout 'central' | 'rows' (board units; the item is s high, s / ASPECT wide).
  //   central  single: a wide bin at one side, vertically centered, with a large item at the other side.
  //            collect: one large bin in the middle (about 30-40% of the width, 55-68% of the height) with the
  //            items in tidy columns of up to three rows on either side.
  //   rows     the bins side by side (equal, wide), the items in tidy rows below them (traits.itemsAt 'above':
  //            above them). single: one wide bin with the item below.
  // Returns { boxes, pts } (pts: the start centers, any order) or null when it does not fit (the caller retries
  // with a smaller scale).
  function layoutGeometry(r, tr, scenario, task, caps, n, s) {
    const w = s / lib.ASPECT;
    const h = s;
    const nb = task.labels.length;
    const labeled = task.labels.map((l) => l !== null);
    const head = (ci) => (labeled[ci] ? 0.065 : 0);
    if (scenario === 'single') {
      const bh = s * r.float(1.7, 2.2);
      const bw = (bh * r.float(1.4, 1.8)) / lib.ASPECT;
      if (tr.layout === 'central') {
        const right = r.bool(0.5);
        const by = 0.5 - bh / 2 + r.float(-0.04, 0.04);
        const bx = right ? r.float(0.58, 0.98 - bw) : r.float(0.02, 0.42 - bw);
        if (bx < 0.02 || bx + bw > 0.98) return null;
        const ix = right ? r.float(0.18, 0.4) : r.float(0.6, 0.82);
        return { boxes: [{ x: bx, y: by, w: bw, h: bh, head: 0 }], pts: [[ix, 0.5 + r.float(-0.05, 0.05)]] };
      }
      const bx = 0.5 - bw / 2 + r.float(-0.12, 0.12);
      const by = r.float(0.06, 0.2);
      return { boxes: [{ x: bx, y: by, w: bw, h: bh, head: 0 }], pts: [[r.float(0.3, 0.7), Math.min(0.88, by + bh + 0.14 + r.float(0, 0.1))]] };
    }
    if (tr.layout === 'central') {
      const bw = r.float(0.3, 0.4);
      const bh = r.float(0.55, 0.68);
      const bx = 0.5 - bw / 2 + r.float(-0.02, 0.02);
      const by = 0.5 - bh / 2 + r.float(-0.03, 0.03);
      const sideW = [bx - 0.03, 1 - bx - bw - 0.03];
      const nSide = [Math.ceil(n / 2), Math.floor(n / 2)];
      const pts = [];
      for (let k = 0; k < 2; k++) {
        if (!nSide[k]) continue;
        const colsFit = Math.floor(sideW[k] / (1.4 * w));
        const cols = Math.min(colsFit, Math.ceil(nSide[k] / 3));
        if (cols < 1) return null;
        const rows = Math.ceil(nSide[k] / cols);
        const py = Math.min(1.5 * h, 0.92 / rows);
        if (py < 1.2 * h) return null;
        const px = Math.min(1.6 * w, sideW[k] / cols);
        const cx = k === 0 ? 0.015 + sideW[k] / 2 + 0.015 : bx + bw + 0.03 + sideW[k] / 2 - 0.015;
        pts.push(...tidyGrid(cx, 0.5, nSide[k], cols, px, py));
      }
      return { boxes: [{ x: bx, y: by, w: bw, h: bh, head: head(0) }], pts };
    }
    // rows
    const gap = 0.04;
    const bw = (0.9 - gap * (nb - 1)) / nb;
    const capMax = Math.max(...caps, 1);
    const padX = Math.min(0.15 * w, (bw - w) / 2);
    const cols = Math.max(1, Math.floor((bw - 2 * padX) / (1.15 * w)));
    const bh = Math.max(0.22, Math.max(...labeled.map((l, ci) => head(ci))) + 2 * 0.15 * h + Math.ceil(capMax / cols) * 1.2 * h + 0.02) + r.float(0, 0.04);
    const perRow = Math.floor(0.92 / (1.4 * w));
    const irows = Math.ceil(n / perRow);
    const cols2 = Math.ceil(n / irows);
    const block = irows * 1.45 * h;
    if (bh + block + 0.1 > 0.96) return null;
    const slack = 0.96 - bh - block - 0.1;
    const top = 0.03 + r.float(0, slack / 2);
    const above = tr.itemsAt === 'above';
    const by = above ? 1 - 0.03 - bh - r.float(0, slack / 2) : top;
    const iy = above ? top + block / 2 : by + bh + 0.1 + block / 2;
    const boxes = Array.from({ length: nb }, (_, ci) => ({ x: 0.05 + ci * (bw + gap), y: by, w: bw, h: bh, head: head(ci) }));
    if (task.spatial) { boxes[0].side = 'left'; boxes[1].side = 'right'; }
    return { boxes, pts: tidyGrid(0.5, iy, n, cols2, Math.min(1.6 * w, 0.92 / cols2), 1.45 * h) };
  }

  // ---- task-area geometry traits (itemsAt, orient, containers)

  const ITEMS_AT = ['below', 'above', 'left', 'right'];
  const ORIENTS = ['row', 'column', 'grid'];
  const RECT_COUNTS = { single: [1, 1], collect: [1, 2], sort: [2, 4] };
  const MIN_DECLARED_ITEM = 0.06; // smallest item height (board-height units) the declared rects may force

  // Throws on malformed geometry traits; returns nothing. Runs before any draw, for every scenario.
  function checkGeometry(tr) {
    const bad = (msg) => { throw new Error(`bins: traits.${msg}`); };
    if (tr.layout !== undefined && tr.layout !== 'central' && tr.layout !== 'rows') bad(`layout must be 'central' or 'rows', got ${JSON.stringify(tr.layout)}`);
    if (tr.itemsAt !== undefined && !ITEMS_AT.includes(tr.itemsAt)) bad(`itemsAt must be one of ${ITEMS_AT.join(', ')}, got ${JSON.stringify(tr.itemsAt)}`);
    if (tr.orient !== undefined && !ORIENTS.includes(tr.orient)) bad(`orient must be one of ${ORIENTS.join(', ')}, got ${JSON.stringify(tr.orient)}`);
    if (tr.layout === 'central' && (tr.itemsAt !== undefined || tr.orient !== undefined)) bad(`itemsAt / orient need layout 'rows', not 'central'`);
    if (tr.containers === undefined) return;
    const lists = Array.isArray(tr.containers) ? { single: tr.containers, collect: tr.containers, sort: tr.containers } : tr.containers;
    if (!lists || typeof lists !== 'object') bad(`containers must be an array of { x, y, w, h } or an object of such arrays keyed by variant`);
    for (const [v, rects] of Object.entries(lists)) {
      if (!RECT_COUNTS[v]) bad(`containers: unknown variant key ${JSON.stringify(v)} (single, collect, sort)`);
      if (!Array.isArray(rects)) bad(`containers.${v} must be an array of { x, y, w, h }`);
      rects.forEach((q, i) => {
        const ok = q && ['x', 'y', 'w', 'h'].every((k) => typeof q[k] === 'number' && Number.isFinite(q[k]));
        if (!ok) bad(`containers[${i}] must be { x, y, w, h } with finite numbers, got ${JSON.stringify(q)}`);
        if (q.w <= 0 || q.h <= 0) bad(`containers[${i}] has a non-positive size: ${JSON.stringify(q)}`);
        if (q.x < -lib.EPS || q.y < -lib.EPS || q.x + q.w > 1 + lib.EPS || q.y + q.h > 1 + lib.EPS) bad(`containers[${i}] is off the board (fractions 0..1): ${JSON.stringify(q)}`);
        rects.forEach((o, j) => { if (j < i && lib.overlap(lib.boxRect(q), lib.boxRect(o))) bad(`containers[${j}] and containers[${i}] overlap`); });
      });
    }
  }

  // The declared rects for this scenario (validated by checkGeometry), or null.
  function declaredRects(tr, scenario) {
    if (tr.containers === undefined) return null;
    const rects = Array.isArray(tr.containers) ? tr.containers : tr.containers[scenario];
    if (!rects) return null;
    const [lo, hi] = RECT_COUNTS[scenario];
    if (rects.length < lo || rects.length > hi) {
      throw new Error(`bins: traits.containers: ${scenario} needs ${lo === hi ? lo : `${lo}-${hi}`} rects, got ${rects.length}`
        + (Array.isArray(tr.containers) ? ' (give per-variant lists as { single, collect, sort } when the skin has several variants)' : ''));
    }
    return rects.map((q) => ({ x: q.x, y: q.y, w: q.w, h: q.h }));
  }

  // Positional names for two bins: left / right when one lies wholly left of the other, else top / bottom (two
  // rects that do not overlap are always apart on one axis; null only for overlapping ones).
  function sidesOf(a, b) {
    if (a.x + a.w <= b.x + lib.EPS) return ['left', 'right'];
    if (b.x + b.w <= a.x + lib.EPS) return ['right', 'left'];
    if (a.y + a.h <= b.y + lib.EPS) return ['top', 'bottom'];
    if (b.y + b.h <= a.y + lib.EPS) return ['bottom', 'top'];
    return null;
  }

  // A tidy block of n item centers inside region [x0, y0, x1, y1] (item w x h); null when they do not fit. Wide
  // regions fill rows first, tall ones columns first.
  function tidyIn(region, n, w, h) {
    const [x0, y0, x1, y1] = region;
    const rw = x1 - x0;
    const rh = y1 - y0;
    const colsMax = Math.floor(rw / (1.4 * w));
    const rowsMax = Math.floor(rh / (1.45 * h));
    if (colsMax < 1 || rowsMax < 1 || colsMax * rowsMax < n) return null;
    let cols;
    if (rw * lib.ASPECT >= rh) cols = Math.ceil(n / Math.ceil(n / colsMax));
    else cols = Math.ceil(n / Math.min(rowsMax, n));
    const rows = Math.ceil(n / cols);
    if (cols > colsMax || rows > rowsMax) return null;
    return tidyGrid((x0 + x1) / 2, (y0 + y1) / 2, n, cols, Math.min(1.6 * w, rw / cols), Math.min(1.5 * h, rh / rows));
  }

  // Bins in a band, arranged by orient, and the items in a tidy block on the itemsAt side (layout 'rows' with
  // itemsAt left / right or an explicit orient). Returns { boxes, pts } or null when it does not fit.
  function bandGeometry(r, at, orient, scenario, task, caps, n, s) {
    const w = s / lib.ASPECT;
    const h = s;
    const nb = task.labels.length;
    const head = (ci) => (task.labels[ci] !== null ? 0.065 : 0);
    const side = at === 'left' || at === 'right';
    const ccols = orient === 'column' ? 1 : orient === 'grid' ? Math.ceil(Math.sqrt(nb)) : nb;
    const crows = Math.ceil(nb / ccols);
    const gx = 0.04;
    const gy = crows > 2 ? 0.035 : 0.05;
    // The items' block: columns beside the bins, or rows above / below them.
    let itemW = 0.9;
    let itemH = 0.92;
    if (side) {
      const perCol = Math.floor(0.88 / (1.45 * h));
      if (perCol < 1) return null;
      itemW = Math.ceil(n / perCol) * 1.5 * w;
    } else {
      const perRow = Math.floor(0.9 / (1.4 * w));
      if (perRow < 1) return null;
      itemH = Math.ceil(n / perRow) * 1.45 * h;
    }
    const bandW = side ? 0.9 - itemW - 0.06 : 0.9;
    const bandH = side ? 0.88 : 0.92 - itemH - 0.08;
    let bw;
    let bh;
    if (scenario === 'single') {
      bh = s * r.float(1.7, 2.2);
      bw = (bh * r.float(1.4, 1.8)) / lib.ASPECT;
    } else {
      bw = Math.min((bandW - gx * (ccols - 1)) / ccols, 0.6);
      const labeled = task.labels.some((l) => l !== null);
      if (bw < 1.6 * w || (labeled && bw < 0.26 / lib.ASPECT)) return null;
      const padX = Math.min(0.15 * w, (bw - w) / 2);
      const cols = Math.max(1, Math.floor((bw - 2 * padX) / (1.15 * w)));
      const capMax = Math.max(...caps, 1);
      const maxHead = Math.max(...task.labels.map((_, ci) => head(ci)));
      bh = Math.max(crows > 1 ? 0.15 : 0.2, maxHead + 2 * 0.15 * h + Math.ceil(capMax / cols) * 1.2 * h + 0.02);
      const room = (bandH - crows * bh - gy * (crows - 1)) / crows;
      bh += Math.max(0, Math.min(r.float(0, 0.04), room));
    }
    const totW = ccols * bw + gx * (ccols - 1);
    const totH = crows * bh + gy * (crows - 1);
    if (totW > bandW + lib.EPS || totH > bandH + lib.EPS) return null;
    // Place the band and the item block with seeded slack.
    let bx0;
    let by0;
    let region;
    if (side) {
      const slack = 0.9 - itemW - 0.06 - totW;
      const off = r.float(0, slack);
      const ix0 = at === 'left' ? 0.05 : 0.95 - itemW;
      bx0 = at === 'left' ? ix0 + itemW + 0.06 + off : 0.05 + slack - off;
      by0 = 0.5 - totH / 2 + r.float(-1, 1) * Math.min(0.04, (0.88 - totH) / 2);
      region = [ix0, 0.06, ix0 + itemW, 0.94];
    } else {
      const slack = 0.92 - itemH - 0.08 - totH;
      const top = 0.04 + r.float(0, slack / 2);
      bx0 = 0.5 - totW / 2 + r.float(-1, 1) * Math.min(0.04, (0.9 - totW) / 2);
      if (at === 'above') {
        by0 = 1 - 0.04 - totH - r.float(0, slack / 2);
        region = [0.05, top, 0.95, top + itemH];
      } else {
        by0 = top;
        region = [0.05, by0 + totH + 0.08, 0.95, by0 + totH + 0.08 + itemH];
      }
    }
    const centers = tidyGrid(bx0 + totW / 2, by0 + totH / 2, nb, ccols, bw + gx, bh + gy);
    const boxes = centers.map((c, ci) => ({ x: c[0] - bw / 2, y: c[1] - bh / 2, w: bw, h: bh, head: head(ci) }));
    if (task.spatial) {
      const sd = sidesOf(boxes[0], boxes[1]);
      if (!sd) return null;
      [boxes[0].side, boxes[1].side] = sd;
    }
    const pts = tidyIn(region, n, w, h);
    return pts ? { boxes, pts } : null;
  }

  // Start points for explicit rects (traits.containers with a layout): a tidy block in the free band on the
  // itemsAt side of the rects' bounding box (or the first side with room). null when none fits.
  function rectsStart(rects, at, n, s) {
    const w = s / lib.ASPECT;
    const h = s;
    const bb = [Math.min(...rects.map((q) => q.x)), Math.min(...rects.map((q) => q.y)),
      Math.max(...rects.map((q) => q.x + q.w)), Math.max(...rects.map((q) => q.y + q.h))];
    const gapX = 0.2 * w + 0.01;
    const gapY = 0.2 * h + 0.01;
    const bands = {
      below: [0.02, bb[3] + gapY, 0.98, 0.98], above: [0.02, 0.02, 0.98, bb[1] - gapY],
      right: [bb[2] + gapX, 0.02, 0.98, 0.98], left: [0.02, 0.02, bb[0] - gapX, 0.98],
    };
    for (const k of at ? [at] : ['below', 'right', 'left', 'above']) {
      const pts = tidyIn(bands[k], n, w, h);
      if (pts) return pts;
    }
    return null;
  }

  // traits.palette (collect): recolor the sampled task in place. The matching items (those the rule names) become
  // `target`-colored; the others become distractors dealt from `distractors` ('black' | 'outline' | a color name).
  // Returns the spec.palette record. All draws come from `rng` (a fork), so nothing else moves.
  function applyPalette(rng, task, pal) {
    const target = pal.target || 'blue';
    if (!lib.C.COLORS[target]) throw new Error(`bins: palette target ${target} is not a color`);
    const kinds = (pal.distractors && pal.distractors.length ? pal.distractors : ['black', 'outline']).slice();
    for (const d of kinds) if (d !== 'black' && d !== 'outline' && (!lib.C.COLORS[d] || d === target)) throw new Error(`bins: bad palette distractor ${d}`);
    const byShape = task.rule.kind === 'shape';
    const hit = task.items.map((it) => (byShape ? it.shape : it.color) === task.rule.value);
    const deal = rng.shuffle(kinds);
    let n = 0;
    task.items.forEach((it, i) => {
      if (hit[i]) {
        if (byShape) it.shape = rng.pick(lib.SHAPES);
        it.color = target;
        it.fill = 'solid';
        return;
      }
      const d = deal[n++ % deal.length];
      it.color = d === 'outline' ? 'black' : d;
      it.fill = d === 'outline' ? 'outline' : 'solid';
    });
    task.rule = { ...task.rule, kind: 'color', value: target };
    return { target, distractors: kinds };
  }

  function buildSpec(rng, scenario, base, tr = {}) {
    // Layout traits: collect and single take 'central' | 'rows', sort only 'rows' (it needs several bins).
    // itemsAt / orient without a layout imply 'rows'.
    const layoutT = tr.layout || (tr.itemsAt !== undefined || tr.orient !== undefined ? 'rows' : undefined);
    const layout = layoutT && (layoutT === 'rows' || scenario !== 'sort') ? layoutT : null;
    // Geometry traits beyond the code's rows skeleton: items beside the bins, a column / grid of bins.
    const band = layout === 'rows' && (tr.itemsAt === 'left' || tr.itemsAt === 'right' || tr.orient === 'column' || tr.orient === 'grid'
      || (scenario === 'single' && tr.itemsAt === 'above'));
    const at = tr.itemsAt || 'below';
    const orient = tr.orient || (at === 'left' || at === 'right' ? 'column' : 'row');
    const declared = declaredRects(tr, scenario);
    const ctl = {};
    if (declared) ctl.boxes = declared.length;
    if (layout === 'central' && scenario === 'collect' && !declared) ctl.single = true;
    if (tr.itemCount && scenario === 'collect') {
      const cr = rng.fork('count');
      ctl.count = Array.isArray(tr.itemCount) ? cr.int(tr.itemCount[0], tr.itemCount[1]) : tr.itemCount;
      ctl.frac = cr.float(0.35, 0.55);
    }
    if (base.level) ctl.level = base.level;
    const task = sampleTask(rng.fork('task'), scenario, base.ood, ctl);
    const palette = tr.palette && scenario === 'collect' ? applyPalette(rng.fork('palette'), task, tr.palette) : null;
    const nItems = task.items.length;
    const remove = task.rule.mode === 'remove';
    const caps = task.labels.map((_, ci) => (remove ? nItems
      : task.goalIndex.filter((g) => g === ci || (g === -2 && ci === task.rule.target)).length));
    const spatialAxis = task.spatial ? (layout === 'rows' ? 'h' : rng.fork('axis').pick(['h', 'h', 'v'])) : null;
    const sizeRange = tr.itemSize ? (Array.isArray(tr.itemSize) ? tr.itemSize : [tr.itemSize, tr.itemSize]) : null;
    for (let attempt = 0; attempt < 60; attempt++) {
      const r = rng.fork(`layout#${attempt}`);
      const shrink = 1 - 0.012 * attempt;
      let s = (scenario === 'single' ? r.float(0.085, 0.125) : nItems > 8 ? r.float(0.07, 0.09) : r.float(0.085, 0.11)) * shrink;
      let boxes;
      let startPts = null;
      if (declared) {
        // The widget's rects; a layout lines the items up beside them, otherwise they are scattered.
        if (layout) {
          const lr = r.fork('layout');
          s = (sizeRange ? lr.float(sizeRange[0], sizeRange[1])
            : scenario === 'single' ? lr.float(0.15, 0.2) : layout === 'rows' ? lr.float(0.1, 0.125) : lr.float(0.095, 0.115)) * shrink;
        }
        if (s < MIN_DECLARED_ITEM) break;
        if (layout && !(startPts = rectsStart(declared, tr.itemsAt, nItems, s))) continue;
        boxes = declared.map((q, ci) => ({ ...q, head: task.labels[ci] !== null ? 0.065 : 0 }));
        if (task.spatial) [boxes[0].side, boxes[1].side] = sidesOf(boxes[0], boxes[1]);
      } else if (layout) {
        const lr = r.fork('layout');
        s = (sizeRange ? lr.float(sizeRange[0], sizeRange[1])
          : scenario === 'single' ? lr.float(0.15, 0.2) : layout === 'rows' ? lr.float(0.1, 0.125) : lr.float(0.095, 0.115)) * shrink;
        const lay = band ? bandGeometry(lr, at, orient, scenario, task, caps, nItems, s)
          : layoutGeometry(lr, { layout, itemsAt: tr.itemsAt }, scenario, task, caps, nItems, s);
        if (!lay) continue;
        boxes = lay.boxes;
        startPts = lay.pts;
      } else {
        const dims = scenario === 'single'
          ? [{ w: s * r.float(base.level ? 2.6 : 1.4, 3.4), h: s * r.float(base.level ? 2.6 : 1.4, 3.4), head: 0 }]
          : task.labels.map((label, ci) => boxDims(r, s, Math.max(caps[ci], task.spatial ? 2 : 1), label !== null));
        boxes = placeBoxes(r, dims, spatialAxis);
      }
      if (!boxes) continue;
      const order = r.shuffle(task.items.map((_, i) => i));
      const spec = {
        ...base,
        scenario,
        aspect: lib.ASPECT,
        item: { w: s / lib.ASPECT, h: s },
        items: order.map((i, k) => ({ id: `i${k}`, ...task.items[i] })),
        containers: boxes.map((b, ci) => ({ id: `c${ci}`, label: task.labels[ci], ...b })),
        goal: {},
        rule: task.rule,
        pile: scenario !== 'single' && !remove && r.bool(0.3) && !base.level,
        ...(palette ? { palette } : {}),
      };
      if (layout) {
        spec.layout = layout;
        spec.pile = false;
      }
      if (layout === 'rows' && (tr.itemsAt !== undefined || tr.orient !== undefined)) Object.assign(spec, { itemsAt: at, orient });
      order.forEach((i, k) => {
        const g = task.goalIndex[i];
        spec.goal[`i${k}`] = g === -1 ? 'out' : g === -2 ? 'any' : `c${g}`;
      });
      // Every goal container must have a slot per item, and the start scatter must fit.
      const need = (c) => (remove ? nItems : Object.values(spec.goal).filter((g) => g === c.id || (g === 'any' && c.id === `c${task.rule.target}`)).length);
      let fits = spec.containers.every((c) => lib.slots(spec, c).length >= need(c));
      // Declared rects may be too small for even one slot (slots() always returns one): every slot must fit.
      if (declared && fits) fits = spec.containers.every((c) => lib.slots(spec, c).every((q) => lib.within(lib.itemRect(spec, q), [c.x, c.y + c.head, c.x + c.w, c.y + c.h])));
      if (layout) {
        // The start is the layout's tidy points, shuffled over the items; they must lie on the board, clear of the bins.
        if (!fits || startPts.length !== nItems) continue;
        const grown = spec.containers.map((c) => lib.growBox(lib.boxRect(c), 0.1 * spec.item.w, 0.1 * spec.item.h));
        const rects = startPts.map((p) => lib.itemRect(spec, p));
        const ok = rects.every((q, i) => q[0] >= 0 && q[1] >= 0 && q[2] <= 1 && q[3] <= 1 && !grown.some((b) => lib.overlap(q, b))
          && rects.every((q2, j) => j <= i || !lib.overlap(q, q2)));
        if (!ok) continue;
        const perm = r.fork('start').shuffle(startPts.map((_, i) => i));
        spec.startPos = Object.fromEntries(spec.items.map((it, k) => [it.id, startPts[perm[k]]]));
        return spec;
      }
      if (fits && lib.scatter(r.fork('probe'), spec, spec.items.length)) return spec;
    }
    if (declared) {
      throw new Error(`bins: traits.containers: the ${scenario} rects ${JSON.stringify(declared)} cannot hold their items (${caps.join(', ')})`
        + ` at an item height of at least ${MIN_DECLARED_ITEM}, or leave no room on the board for the ${nItems} items outside them`
        + (layout ? ` on the ${tr.itemsAt || 'below / right / left / above'} side` : ''));
    }
    throw new Error(`bins: could not lay out a ${scenario} board`);
  }

  // Widget traits (opts.traits) for single / collect / sort, drawn from their own rng stream: noPile (items never
  // start stacked), snap (spec.snap 'none' | 'slot' | 'arrange': what the widget does with a dropped item),
  // tall (a board taller than its pane: spec.tall = visible fraction of the board height, spec.route
  // 'wheel' | 'thumb' = how the oracle scrolls; opts.route 'wheel' / 'pointer' force it).
  function addTraits(rng, spec, opts) {
    const t = opts.traits || {};
    if (t.noPile) spec.pile = false;
    if (t.snap) spec.snap = lib.C.weighted(rng.fork('snap'), [['none', 0.45], ['slot', 0.3], ['arrange', 0.25]]);
    if (t.tall) {
      const r = rng.fork('tall');
      spec.tall = r.float(0.55, 0.7);
      spec.route = opts.route === 'wheel' ? 'wheel' : opts.route === 'pointer' ? 'thumb' : r.bool(0.5) ? 'wheel' : 'thumb';
    }
    return spec;
  }

  Object.assign(lib, { ITEMS_AT, ORIENTS, addTraits, buildSpec, checkGeometry, sidesOf });
})();
