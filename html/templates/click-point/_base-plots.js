/* click-point/_base-plots: reference drawing implementation; overridable units stay in reference.js. */
(function () {
  'use strict';
  function drawRuler(S, util, g, rng) {
    const s = S.spec.scale;
    const a = S.px(S.spec.from);
    const b = S.px(S.spec.to);
    const horiz = S.spec.orient === 'h';
    const bw = S.spec.band * S.scale;
    const pad = 16;
    const body = horiz
      ? { x: a[0] - pad, y: a[1] - bw, width: b[0] - a[0] + 2 * pad, height: 2 * bw }
      : { x: a[0] - bw, y: b[1] - pad, width: 2 * bw, height: a[1] - b[1] + 2 * pad };
    util.svg('rect', { ...body, rx: 4, fill: S.style.rulerFill, stroke: 'var(--fg)', 'stroke-width': 1.2, opacity: 0.95 }, g);
    const n = Math.round((s.max - s.min) / s.minor);
    const perMajor = Math.round(s.major / s.minor);
    for (let k = 0; k <= n; k++) {
      const v = s.min + k * s.minor;
      const p = S.px(S.F().helpers.axisPos(s, v, S.spec.from, S.spec.to));
      const isMajor = k % perMajor === 0;
      const isHalf = !isMajor && perMajor % 2 === 0 && k % (perMajor / 2) === 0;
      const L = bw * (isMajor ? 0.95 : isHalf ? 0.65 : 0.4);
      const sw = isMajor ? 1.6 : 1;
      if (horiz) util.svg('line', { x1: S.f1(p[0]), y1: S.f1(a[1] - bw), x2: S.f1(p[0]), y2: S.f1(a[1] - bw + L), stroke: '#222', 'stroke-width': sw }, g);
      else util.svg('line', { x1: S.f1(a[0] - bw), y1: S.f1(p[1]), x2: S.f1(a[0] - bw + L), y2: S.f1(p[1]), stroke: '#222', 'stroke-width': sw }, g);
      if (isMajor) {
        const txt = S.F().helpers.fmtNum(v, S.decOf(s.major));
        if (horiz) S.T(util, g, p[0], a[1] + bw * 0.45, txt, { class: 'cp-tick ruler' });
        else S.T(util, g, a[0] + bw * 0.45, p[1], txt, { class: 'cp-tick ruler' });
      }
    }
    if (s.unit.trim() || s.name !== 'x') {
      const cap = s.unit.trim() ? s.unit.trim() : s.name;
      if (horiz) S.T(util, g, b[0] + pad - 2, a[1] - bw - 12, cap, { 'text-anchor': 'end', class: 'cp-tick muted' });
      else S.T(util, g, a[0] + bw + 8, b[1] - pad + 4, cap, { 'text-anchor': 'start', class: 'cp-tick muted' });
    }
  }

  function drawChart(S, util, g, rng) {
    const { plot, xs, ys } = S.spec;
    const fam = S.F();
    const P = (x, y) => S.px(fam.helpers.chartXY(S.spec, x, y));
    const [l, t] = S.px([plot.x0, plot.y0]);
    const [r, b] = S.px([plot.x1, plot.y1]);
    util.svg('rect', { x: l, y: t, width: r - l, height: b - t, fill: 'var(--panel)', stroke: 'var(--line)' }, g);
    const ticks = (sc, step) => {
      const out = [];
      for (let k = 0; k <= Math.round((sc.max - sc.min) / step); k++) out.push(sc.min + k * step);
      return out;
    };
    if (S.style.minorGrid) {
      for (const x of ticks(xs, xs.minor)) {
        const [X] = P(x, ys.min);
        util.svg('line', { x1: S.f1(X), y1: t, x2: S.f1(X), y2: b, stroke: 'var(--line)', 'stroke-width': 0.6, opacity: 0.6 }, g);
      }
      for (const y of ticks(ys, ys.minor)) {
        const [, Y] = P(xs.min, y);
        util.svg('line', { x1: l, y1: S.f1(Y), x2: r, y2: S.f1(Y), stroke: 'var(--line)', 'stroke-width': 0.6, opacity: 0.6 }, g);
      }
    }
    for (const x of ticks(xs, xs.major)) {
      const [X] = P(x, ys.min);
      util.svg('line', { x1: S.f1(X), y1: t, x2: S.f1(X), y2: b, stroke: 'var(--muted)', 'stroke-width': 1, opacity: 0.45 }, g);
      S.T(util, g, X, b + 13, fam.helpers.fmtNum(x, S.decOf(xs.major)));
    }
    for (const y of ticks(ys, ys.major)) {
      const [, Y] = P(xs.min, y);
      util.svg('line', { x1: l, y1: S.f1(Y), x2: r, y2: S.f1(Y), stroke: 'var(--muted)', 'stroke-width': 1, opacity: 0.45 }, g);
      S.T(util, g, l - 8, Y, fam.helpers.fmtNum(y, S.decOf(ys.major)), { 'text-anchor': 'end' });
    }
    util.svg('line', { x1: l, y1: b, x2: r, y2: b, stroke: 'var(--fg)', 'stroke-width': 1.5 }, g);
    util.svg('line', { x1: l, y1: t, x2: l, y2: b, stroke: 'var(--fg)', 'stroke-width': 1.5 }, g);
    S.T(util, g, (l + r) / 2, b + 32, xs.label, { class: 'cp-tick axis' });
    const yl = S.T(util, g, Math.max(14, l - 48), (t + b) / 2, ys.label, { class: 'cp-tick axis' });
    yl.setAttribute('transform', `rotate(-90 ${S.f1(Math.max(14, l - 48))} ${S.f1((t + b) / 2)})`);
    S.T(util, g, (l + r) / 2, Math.max(12, t - 14), S.spec.title, { class: 'cp-tick axis' });
    const pts = S.spec.series.map(([x, y]) => P(x, y).map(S.f1).join(',')).join(' ');
    util.svg('polyline', { points: pts, fill: 'none', stroke: S.style.fill, 'stroke-width': S.spec.kind === 'line' ? 2.5 : 2, 'stroke-linejoin': 'round', opacity: S.spec.kind === 'line' ? 1 : 0.6 }, g);
    if (S.style.markers) for (const [x, y] of S.spec.series) {
      const [X, Y] = P(x, y);
      util.svg('circle', { cx: S.f1(X), cy: S.f1(Y), r: 3.5, fill: S.style.fill }, g);
    }
  }

  function drawAxis(S, util, g, rng) {
    if (S.spec.kind === 'ruler') S.drawRuler(util, g, rng);
    else S.drawChart(util, g, rng);
  }

  function drawMap(S, util, g, rng, W, H) {
    S.drawMapFigure(util, g, rng, W, H);
    if (S.style.flavor === 'tiles') S.drawTiles(util, g, rng, W, H);
  }

  function drawTiles(S, util, g, rng, W, H) {
    const tg = util.svg('g', { 'pointer-events': 'none' });
    const cols = 5;
    const tw = W / cols;
    const rows = Math.ceil(H / tw);
    const land = S.spec.mode === 'intersection';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tw;
        const y = r * tw;
        const w = Math.min(tw, W - x);
        const h = Math.min(tw, H - y);
        util.svg('rect', { x: S.f1(x), y: S.f1(y), width: S.f1(w), height: S.f1(h), fill: rng.bool(0.5) ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.035)' }, tg);
        if (land) {
          for (let k = 0, n = rng.int(3, 6); k < n; k++) {
            const bw = rng.float(18, 44);
            const bh = rng.float(12, 32);
            util.svg('rect', { x: S.f1(x + rng.float(4, Math.max(5, w - bw - 4))), y: S.f1(y + rng.float(4, Math.max(5, h - bh - 4))), width: S.f1(bw), height: S.f1(bh), rx: 2,
              fill: rng.pick(['#e1dccd', '#dad6c9', '#e6e0d1']), opacity: 0.8 }, tg);
          }
          if (rng.bool(0.3)) util.svg('ellipse', { cx: S.f1(x + rng.float(0.25, 0.75) * w), cy: S.f1(y + rng.float(0.25, 0.75) * h), rx: S.f1(rng.float(18, 36)), ry: S.f1(rng.float(12, 26)), fill: '#c9e0b9', opacity: 0.85 }, tg);
        }
      }
    }
    const seams = util.svg('g', { stroke: 'rgba(60,70,80,.16)', 'stroke-width': 1, fill: 'none' }, tg);
    for (let c = 1; c < cols; c++) util.svg('line', { x1: S.f1(c * tw), y1: 0, x2: S.f1(c * tw), y2: H }, seams);
    for (let r = 1; r < rows; r++) util.svg('line', { x1: 0, y1: S.f1(r * tw), x2: W, y2: S.f1(r * tw) }, seams);
    // Right after the base rectangle: below streets, coastline and labels.
    g.insertBefore(tg, g.children[1] || null);
  }

  function drawMapFigure(S, util, g, rng, W, H) {
    const fam = S.F();
    if (S.spec.mode === 'coord') {
      util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.style.water }, g);
      for (const [cx, cy, r] of S.spec.land) util.svg('circle', { cx: S.f1(cx * S.scale), cy: S.f1(cy * S.scale), r: S.f1(r * S.scale), fill: S.style.land }, g);
      const step = S.spec.step;
      for (let lat = S.spec.lat0; lat <= S.spec.lat1 + 1e-9; lat += step) {
        const [, y] = S.px(fam.helpers.mapXY(S.spec, lat, S.spec.lon0));
        util.svg('line', { x1: 0, y1: S.f1(y), x2: W, y2: S.f1(y), stroke: S.style.graticule, 'stroke-width': 1, 'stroke-dasharray': S.style.gratDash }, g);
        if (y > 10 && y < H - 22) S.T(util, g, 6, y - 9, fam.helpers.fmtLat(Number(lat.toFixed(4)), 'deg'), { 'text-anchor': 'start', class: 'cp-tick map' });
      }
      for (let lon = S.spec.lon0; lon <= S.spec.lon1 + 1e-9; lon += step) {
        const [x] = S.px(fam.helpers.mapXY(S.spec, S.spec.lat0, lon));
        util.svg('line', { x1: S.f1(x), y1: 0, x2: S.f1(x), y2: H, stroke: S.style.graticule, 'stroke-width': 1, 'stroke-dasharray': S.style.gratDash }, g);
        if (x > 30 && x < W - 30) S.T(util, g, x, H - 10, fam.helpers.fmtLon(Number(lon.toFixed(4)), 'deg'), { class: 'cp-tick map' });
      }
      return;
    }
    util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.style.land }, g);
    const lines = S.spec.streets.map((st) => {
      // Clip the infinite street to the board.
      const c = S.px(st.p);
      const d = st.d;
      const ts = [];
      if (Math.abs(d[0]) > 1e-9) ts.push(-c[0] / d[0], (W - c[0]) / d[0]);
      if (Math.abs(d[1]) > 1e-9) ts.push(-c[1] / d[1], (H - c[1]) / d[1]);
      const inside = ts.filter((tt) => {
        const q = [c[0] + d[0] * tt, c[1] + d[1] * tt];
        return q[0] >= -0.5 && q[0] <= W + 0.5 && q[1] >= -0.5 && q[1] <= H + 0.5;
      }).sort((x, y) => x - y);
      const t0 = inside[0];
      const t1 = inside[inside.length - 1];
      return { st, a: [c[0] + d[0] * t0, c[1] + d[1] * t0], b: [c[0] + d[0] * t1, c[1] + d[1] * t1] };
    });
    for (const { a, b } of lines) util.svg('line', { x1: S.f1(a[0]), y1: S.f1(a[1]), x2: S.f1(b[0]), y2: S.f1(b[1]), stroke: S.style.casing, 'stroke-width': S.style.road + 3 }, g);
    for (const { a, b } of lines) util.svg('line', { x1: S.f1(a[0]), y1: S.f1(a[1]), x2: S.f1(b[0]), y2: S.f1(b[1]), stroke: '#ffffff', 'stroke-width': S.style.road }, g);
    lines.forEach(({ st, a, b }, i) => {
      let ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      if (ang > 90) ang -= 180;
      if (ang <= -90) ang += 180;
      const f = [0.12, 0.85, 0.3, 0.68][i % 4];
      const q = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      const t = S.T(util, g, q[0], q[1], st.name, { class: 'cp-tick street' });
      t.setAttribute('transform', `rotate(${ang.toFixed(1)} ${S.f1(q[0])} ${S.f1(q[1])})`);
    });
  }

  function drawPath(S, util, g) {
    const pts = S.spec.pts.map((p) => S.px(p).map(S.f1).join(',')).join(' ');
    util.svg('polyline', { points: pts, fill: 'none', stroke: S.style.fill, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const a = S.spec.pts[0];
    const b = S.spec.pts[S.spec.pts.length - 1];
    S.point(util, g, a);
    S.point(util, g, b);
    const W = S.spec.board.w * S.scale;
    const H = S.spec.board.h * S.scale;
    // Put each end label on the first side (away from the path, then across it) where it fits unclamped.
    const side = (p, q) => {
      const th = Math.atan2(p[1] - q[1], p[0] - q[0]);
      for (const t of [th, th + Math.PI / 2, th - Math.PI / 2, th + Math.PI]) {
        const [x, y] = S.px(p);
        const lx = x + Math.cos(t) * 22;
        const ly = y + Math.sin(t) * 22;
        if (lx >= 14 && lx <= W - 14 && ly >= 14 && ly <= H - 12) return t;
      }
      return th;
    };
    S.label(util, g, a, side(a, S.spec.pts[1]), 'A');
    S.label(util, g, b, side(b, S.spec.pts[S.spec.pts.length - 2]), 'B');
  }

  function drawDense(S, util, g, rng) {
    const colors = S.F().helpers.DOT_COLORS;
    const R = Math.max(2.5, S.spec.r * S.scale);
    for (const d of S.spec.dots) {
      const [x, y] = S.px(d.p);
      const c = colors[d.color];
      if (d.kind === 'hollow') util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: S.f1(R - 0.8), fill: 'none', stroke: c, 'stroke-width': 1.6 }, g);
      else if (d.kind === 'square') util.svg('rect', { x: S.f1(x - R), y: S.f1(y - R), width: S.f1(2 * R), height: S.f1(2 * R), fill: c }, g);
      else util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: S.f1(R), fill: c }, g);
      if (S.spec.by === 'label') S.T(util, g, x + R + 2, y - R - 5, d.label, { 'text-anchor': 'start', class: 'cp-tick dense' });
    }
  }

  env.template('click-point/_base-plots', () => ({ drawRuler, drawChart, drawAxis, drawMap, drawTiles, drawMapFigure, drawPath, drawDense }));
})();
