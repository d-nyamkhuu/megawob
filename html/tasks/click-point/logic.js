/*
 * click-point: click one precise point on a drawn figure, scale, chart or map. MiniWoB counterparts:
 * circle-center, find-midpoint, bisect-angle, right-angle. Pointer only; scoring is graded (near misses earn
 * partial credit through sigma).
 *
 * Board coordinates: x in [0, spec.board.w], y in [0, spec.board.h] with h = 1 and w = 1.5 (the widget trait
 * aspect sets w to 1.0-2.2). One board unit = the board height; y grows downward. Widgets must draw the board
 * with one isotropic scale (px per unit) from spec.board, never from a fixed 1.5. The reference board is
 * 440-600 px tall (less on wide boards at small viewports), so 0.01 unit is about 4.4-6 px.
 *
 * Scenarios
 *   center       the center of a circle / ring / filled disc, or of the circle an arc belongs to
 *   midpoint     the midpoint of two marked points (A and B when labeled)
 *   bisect       a point on the internal bisector of an angle, outside a dotted circle around the vertex
 *   right-angle  a point C making angle ABC 90 degrees, outside a dotted circle around B
 *   axis         read a scale: a value on a ruler / number line ("where x = 37.5"; kind 'ruler'), the point
 *                on a line chart's series at an x value (kind 'line'), or a data coordinate (x, y) on a chart
 *                (kind 'coord')
 *   map          a map position: a latitude/longitude read off a labeled graticule (mode 'coord'), or the
 *                intersection of two named streets (mode 'intersection')
 *   path-mid     the point halfway along a grid-aligned path from A to B, measured along the path
 *   dense        one small dot among many (30-60, ood 90-140), named by its label or by being the odd one
 *                (hollow / square / other color); tau is the dot radius
 *
 * spec   { scenario, board: { w, h }, area? { x, y, w, h } (board units; only with traits.placement), labels (bool),
 *          isplit, csplit, ood, startMode, ... }
 *   center:      c: [x, y], r, shape: 'circle' | 'ring' (ringWidth) | 'disc' | 'arc' (arc: { start, span } radians,
 *                clockwise on screen from start). The whole circle lies inside the board.
 *   midpoint:    a, b: [x, y]
 *   bisect:      v: [x, y] vertex, rays: [{ angle, len }, { angle, len }] (screen radians), minLen, bisector
 *   right-angle: a: [x, y] (point A), b: [x, y] (vertex B), minLen (dotted circle around B)
 *   axis:        kind; ruler: { orient: 'h' | 'v', from: [x, y], to: [x, y] (board points of min and max), scale:
 *                { min, max, major, minor, dec, unit, name }, value, band }; line / coord: plot: { x0, y0, x1,
 *                y1 } (board rect), xs / ys: scales (as above), series: [[x, y], ...] data (line), value (x),
 *                yvalue (coord), title
 *   map:         mode; coord: { lat0, lat1, lon0, lon1, step, lat, lon, land: [[cx, cy, r], ...] }, intersection:
 *                { streets: [{ name, p: [x, y], d: [dx, dy] }], pair: [i, j] }
 *   path-mid:    pts: [[x, y], ...] (grid points), grid (cell size), cells (path length in cells)
 *   dense:       dots: [{ p: [x, y], label, kind: 'dot' | 'hollow' | 'square', color }], target (index), r, by:
 *                'label' | 'odd', odd (the odd feature: 'hollow' | 'square' | 'color')
 * model  { point: null | [x, y] }  the last clicked board point (null at an 'off' start). Each click on the
 *        board replaces it; clicks outside the board are ignored.
 * error
 *   center, midpoint, map, path-mid, dense, axis line/coord: distance from the click to the ideal point (board
 *                units), capped at EMPTY_DIST = 0.3
 *   axis ruler:  distance along the ruler to the value's position, plus how far the click is outside the
 *                ruler's band across it, capped at 0.3
 *   bisect:      angle in degrees between the direction vertex -> click and the internal bisector
 *                (0..180, capped at 90). A click closer than minLen to the vertex scores at least
 *                tau + 45 * shortfall / minLen, so it can never pass.
 *   right-angle: |angle ABC - 90| in degrees (0..90), same minLen rule for |BC|.
 *   No click yet: the cap (0.3 units, or 90 degrees), so progress = 1 - error / cap is 0 at the start
 *   and grows as the click gets closer.
 * tau    center / midpoint / axis ruler 0.008 units, axis line / coord, map 0.01, path-mid 0.012, dense the dot
 *        radius (0.006-0.011); sigma about 3 tau. bisect / right-angle 2.5 degrees, sigma 7 degrees.
 *
 * Levels (opts.level easy | medium; normal is unchanged; spec.level records it): tau x2 / x1.5 on every scenario but dense
 * (bisect / right-angle degrees too); dense has fewer dots (12-20 / 20-32 instead of 30-60) with bigger dots
 * (radius x1.6 / x1.3, which is its tau).
 *
 * Start modes: off (no click), solved, partial (a near miss 3-5 tau from the ideal point), wrong (a plausible
 * wrong click: a point on the rim / the chord, point A, a point on a ray, the extension of AB, a misread scale
 * value (digits swapped), the straight-line midpoint of the path, another street corner, a neighbouring dot).
 * Input routes: pointer only (single clicks; nothing natural to type or scroll). opts.route is ignored (no keyboard or wheel route).
 *
 * Widget traits (opts.traits, all optional, drawn from rng.fork streams: widgets without them sample exactly as before)
 *   shapes: ['arc', ...]     center: restrict the figure to these shapes (e.g. ['arc'] for arc-only episodes)
 *   orient: 'horizontal'     midpoint: A left of B on one horizontal line, length 0.6-1.2 (wide); right-angle: A left
 *                            of B on one horizontal line, |AB| 0.5-0.9 (ood 0.3-0.45)
 *   exclusion: 7 | [lo, hi]  right-angle / bisect: the dotted circle's radius is |AB| (right-angle) or the mean ray
 *                            length (bisect) divided by this ratio, so the circle stays small next to the figure
 *   aspect: 1.8 | [lo, hi]   every scenario: the board's width / height ratio (spec.board.w; h stays 1), fixed or drawn
 *                            per episode from [lo, hi]; allowed 1.0-2.2 (default 1.5). Figure sizes and tau stay in
 *                            board units (long midpoint / horizontal |AB| lengths shrink only where a narrow board
 *                            cannot hold them); rulers, charts, maps, street grids, paths and dot fields stretch across
 *                            the new width (map coord: about one 0.25-unit graticule cell per longitude step, 4-9 steps)
 *   placement: 'left' | 'right' | 'top' | 'bottom' | 'center' | { x, y, w, h }
 *                            center, midpoint, bisect, right-angle, path-mid, dense: where the figure sits on the board.
 *                            The figure's points, circles, rays and path, the dotted circle and the target stay inside
 *                            that area, published as spec.area { x, y, w, h } in board units; the rest of the board is
 *                            free for the widget (a side panel, legend or toolbox drawn on the board). left / right: the
 *                            left / right 60% of the width; top / bottom: the top / bottom 60% of the height; center:
 *                            the middle 60% x 60%; a rect is in board fractions with w, h >= 0.4 and inside 0..1.
 *                            Figures shrink to fit a small area (lengths scale by min(1, area w, area h); dense
 *                            boards get fewer dots, path-mid a finer grid). axis and map ignore it (rulers and charts
 *                            span the board, maps fill it; spec.area is absent): reshape those with aspect instead.
 *                            Combines with aspect (the fractions apply to the drawn width) and shapes / orient / exclusion
 *   Malformed aspect / placement values (unknown name, NaN, out of range, a rect outside 0..1 or smaller than 0.4) throw.
 *
 * plan   { click: { point: [x, y] } }: the ideal point. Target vocabulary: { point: [bx, by] } only.
 * Helpers (widget API, env.taskDef.helpers):
 *   target(spec) -> [x, y]: ideal point used by plan/solve.
 *   axisPos(scale, value, from, to) -> [x, y]: point along a scale.
 *   chartXY(spec, x, y) -> [x, y]: data point in board units.
 *   mapXY(spec, lat, lon) -> [x, y]: map position in board units.
 *   fmtNum(value, dec) -> string: formatted scale value.
 *   fmtLat(lat, style) -> string: formatted latitude.
 *   fmtLon(lon, style) -> string: formatted longitude.
 *   DOT_COLORS: dot color names to CSS colors.
 * Self-test: selftest.js (loaded only by the checker and node tests).
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       "Marker x" and "Marker y" in board units, 3 decimals: the marker's board point, which the
 *                            base widgets print (board / tiles: next to the hint, "Marker: (x, y)" / "Pin: ..."; cad:
 *                            the command line "Point: x, y"). [] before any click. Label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: the one "Marker" (value: its board point, null before a click).
 *   silent(next, prev, spec, rng)   the click landed off: the marker snaps to a coarse grid (0.025 / 0.05 / 0.1 board
 *                            units) or, when that stays within tau, is shifted 0.02-0.08 units in a random direction; kept
 *                            inside the board; null before a click or in a judge episode.
 *   retarget(spec, model, rng)   a new reading on the same figure: axis a new ruler / x (and y) value on the chart, map
 *                            a new latitude / longitude on the graticule or another street corner, dense (by label) another
 *                            dot. null for center, midpoint, bisect, right-angle, path-mid and dense-by-odd: the goal is
 *                            the figure itself (nothing else to ask for on the same drawing).
 *   judgeModes impossible only: the named target is not on the board (every scenario, spec.judge = { mode, templates, vars,
 *                            message, what }; the reply is status impossible naming what, the missing thing as the instruction
 *                            says it, then alternates):
 *                            a shape that is not drawn (center), points / angle letters the board lacks (midpoint, bisect,
 *                            right-angle, path-mid), a value past the scale or chart (axis), coordinates outside the
 *                            graticule or a street that is not on the map (map), a dot label or marker kind that is not
 *                            there (dense). No ambiguous mode (one figure per board, nothing to be unsure between) and no
 *                            confirm (a click is not irreversible).
 *
 * Deviations from MiniWoB: the four MiniWoB figures plus scales, charts, maps, paths and dense boards; graded
 * error instead of a pass/fail radius.
 */
(function () {
  'use strict';

  const BOARD = { w: 1.5, h: 1 };
  const EMPTY_DIST = 0.3; // error cap (about 130-180 px), so progress tracks the miss distance
  const EMPTY_DEG = { bisect: 90, 'right-angle': 90 }; // error caps in degrees
  const TAU = { center: 0.008, midpoint: 0.008, bisect: 2.5, 'right-angle': 2.5, map: 0.01, 'path-mid': 0.012 };
  const SHORT_DEG = 45; // penalty slope for clicks inside the minimum-distance circle
  const DEG = 180 / Math.PI;
  const SCENARIOS = ['center', 'midpoint', 'bisect', 'right-angle', 'axis', 'map', 'path-mid', 'dense'];
  const ANGULAR = new Set(['bisect', 'right-angle']);

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const len = (a) => Math.hypot(a[0], a[1]);
  const { dist, lerp } = env.util;
  const dir = (th) => [Math.cos(th), Math.sin(th)];
  const r4 = (v) => Math.round(v * 1e4) / 1e4;
  const pt = (p) => [r4(p[0]), r4(p[1])];
  const roundTo = (v, step) => Number((Math.round(v / step) * step).toFixed(6));

  // A is an area { x0, y0, x1, y1 } in board units: the whole board, or the placement area (see area / geometry).
  function inBoard(p, m, A) {
    return p[0] >= A.x0 + m && p[0] <= A.x1 - m && p[1] >= A.y0 + m && p[1] <= A.y1 - m;
  }

  // Largest t >= 0 with p + t * d inside the area shrunk by margin m (p must be inside it).
  function room(p, d, m, A) {
    let t = Infinity;
    if (d[0] > 1e-9) t = Math.min(t, (A.x1 - m - p[0]) / d[0]);
    if (d[0] < -1e-9) t = Math.min(t, (A.x0 + m - p[0]) / d[0]);
    if (d[1] > 1e-9) t = Math.min(t, (A.y1 - m - p[1]) / d[1]);
    if (d[1] < -1e-9) t = Math.min(t, (A.y0 + m - p[1]) / d[1]);
    return Math.max(0, t);
  }

  // ---------------------------------------------------------------- board geometry (widget traits aspect / placement)

  const ASPECT = [1, 2.2]; // allowed traits.aspect (board width / height)
  const ANCHORS = {
    left: { x: 0, y: 0, w: 0.6, h: 1 }, right: { x: 0.4, y: 0, w: 0.6, h: 1 },
    top: { x: 0, y: 0, w: 1, h: 0.6 }, bottom: { x: 0, y: 0.4, w: 1, h: 0.6 }, center: { x: 0.2, y: 0.2, w: 0.6, h: 0.6 },
  };
  const MIN_PLACEMENT = 0.4; // smallest placement rect side (board fractions)
  const PLACED = new Set(['center', 'midpoint', 'bisect', 'right-angle', 'path-mid', 'dense']);
  const fail = (msg) => { throw new Error(`click-point: ${msg}`); };
  const show = (v) => (typeof v === 'number' ? String(v) : JSON.stringify(v));
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

  function aspectRange(a) {
    const ok = (v) => isNum(v) && v >= ASPECT[0] && v <= ASPECT[1];
    if (ok(a)) return [a, a];
    if (Array.isArray(a) && a.length === 2 && ok(a[0]) && ok(a[1]) && a[0] <= a[1]) return a;
    return fail(`traits.aspect must be a number or [lo, hi] with lo <= hi, within ${ASPECT[0]}-${ASPECT[1]} (board width / height); got ${show(a)}`);
  }

  function placementRect(a) {
    if (typeof a === 'string' && Object.prototype.hasOwnProperty.call(ANCHORS, a)) return ANCHORS[a];
    if (a && typeof a === 'object' && !Array.isArray(a)) {
      const { x, y, w, h } = a;
      if ([x, y, w, h].every(isNum) && x >= 0 && y >= 0 && w >= MIN_PLACEMENT && h >= MIN_PLACEMENT && x + w <= 1 + 1e-9 && y + h <= 1 + 1e-9) return { x, y, w, h };
    }
    return fail(`traits.placement must be one of ${Object.keys(ANCHORS).map((k) => `'${k}'`).join(' | ')} or a rect { x, y, w, h } in board fractions `
      + `with x, y >= 0, w, h >= ${MIN_PLACEMENT}, x + w <= 1 and y + h <= 1; got ${show(a)}`);
  }

  // The board width and the sampling area for one episode. Without aspect / placement traits this is the fixed
  // 1.5 x 1 board with no draws (custom false keeps every sampler on its original expressions). The aspect draw
  // comes from rng.fork('aspect'); the placement applies only to PLACED scenarios.
  function geometry(rng, tr, scenario) {
    const has = (k) => !!tr && tr[k] !== undefined;
    const fr = has('placement') ? placementRect(tr.placement) : null;
    let W = BOARD.w;
    if (has('aspect')) {
      const [lo, hi] = aspectRange(tr.aspect);
      W = lo === hi ? lo : r4(rng.fork('aspect').float(lo, hi));
    }
    const H = BOARD.h;
    const g = { W, H, x0: 0, y0: 0, x1: W, y1: H, custom: has('aspect'), area: null };
    if (fr && PLACED.has(scenario)) {
      g.custom = true;
      g.x0 = r4(fr.x * W);
      g.x1 = Math.min(W, r4((fr.x + fr.w) * W));
      g.y0 = r4(fr.y * H);
      g.y1 = Math.min(H, r4((fr.y + fr.h) * H));
      g.area = { x: g.x0, y: g.y0, w: r4(g.x1 - g.x0), h: r4(g.y1 - g.y0) };
    }
    g.k = Math.min(1, g.x1 - g.x0, g.y1 - g.y0); // figure length scale (1 unless the area is small)
    return g;
  }

  // The area the figure lives in: spec.area (traits.placement) or the whole board.
  function area(spec) {
    const r = spec.area;
    return r ? { x0: r.x, y0: r.y, x1: r.x + r.w, y1: r.y + r.h } : { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h };
  }

  // [lo, hi] shrunk so hi <= max (lo kept below hi); unchanged when it already fits.
  const fitRange = ([lo, hi], max) => (hi <= max ? [lo, hi] : [Math.min(lo, max * 0.6), max]);

  // Unsigned angle between two vectors, degrees in [0, 180].
  function angleBetween(u, w) {
    const lu = len(u);
    const lw = len(w);
    if (lu < 1e-9 || lw < 1e-9) return 180;
    const c = Math.max(-1, Math.min(1, dot(u, w) / (lu * lw)));
    return Math.acos(c) * DEG;
  }

  // Penalty for clicks closer than minLen to the vertex: always above tau.
  function shortfall(d, spec) {
    if (d >= spec.minLen) return 0;
    return tauOf(spec) + (SHORT_DEG * (spec.minLen - d)) / spec.minLen;
  }

  // Shortest decimal form with at most dec decimals ('37.5', '0.37', '1390').
  const fmtNum = (v, dec) => String(Number(Number(v).toFixed(dec)) || 0);

  // ---------------------------------------------------------------- shared sampling helpers

  // Widget trait orient: 'horizontal' for midpoint / right-angle: A left of B on one horizontal line, long and wide.
  const horizontal = (tr) => !!tr && tr.orient === 'horizontal';

  // Widget trait exclusion: ratio (number, or [lo, hi] drawn per episode): the dotted circle's radius is
  // (reference length) / ratio, with the reference length |AB| (right-angle) or the mean ray length (bisect).
  function exclusionRatio(tr) {
    const e = tr && tr.exclusion;
    if (Array.isArray(e)) return e;
    return Number.isFinite(e) && e > 0 ? [e, e] : null;
  }

  // ---------------------------------------------------------------- scales and charts

  // Position of a value along a scale drawn from `from` (min) to `to` (max).
  function axisPos(scale, value, from, to) {
    return lerp(from, to, (value - scale.min) / (scale.max - scale.min));
  }

  // A target value on the scale's q grid that is not on a minor tick, away from the ends.
  function scaleValue(rng, s) {
    for (let k = 0; k < 200; k++) {
      const f = rng.float(0.06, 0.94);
      const v = roundTo(s.min + f * (s.max - s.min), s.q);
      const onMinor = Math.abs(v / s.minor - Math.round(v / s.minor)) < 1e-6;
      if (!onMinor || k > 150) return v;
    }
    return roundTo((s.min + s.max) / 2, s.q);
  }

  function seriesAt(spec, x) {
    const s = spec.series;
    for (let k = 1; k < s.length; k++) {
      if (x <= s[k][0] + 1e-9) {
        const t = (x - s[k - 1][0]) / (s[k][0] - s[k - 1][0]);
        return s[k - 1][1] + t * (s[k][1] - s[k - 1][1]);
      }
    }
    return s[s.length - 1][1];
  }

  // Board point of a data point (chart).
  function chartXY(spec, x, y) {
    const { plot, xs, ys } = spec;
    return [plot.x0 + ((x - xs.min) / (xs.max - xs.min)) * (plot.x1 - plot.x0),
      plot.y1 - ((y - ys.min) / (ys.max - ys.min)) * (plot.y1 - plot.y0)];
  }

  // ---------------------------------------------------------------- maps

  const fmtLat = (lat, style = 'deg') => fmtCoord(lat, 'N', 'S', style);
  const fmtLon = (lon, style = 'deg') => fmtCoord(lon, 'E', 'W', style);
  function fmtCoord(v, pos, neg, style) {
    const h = v < 0 ? neg : pos;
    const a = Math.abs(v);
    if (style === 'dm') {
      const d = Math.floor(a + 1e-9);
      const m = Math.round((a - d) * 60);
      return `${d}°${String(m).padStart(2, '0')}′ ${h}`;
    }
    if (style === 'signed') return `${v < 0 ? '-' : ''}${Number(a.toFixed(3))}`;
    return `${Number(a.toFixed(3))}° ${h}`;
  }

  function mapXY(spec, lat, lon) {
    return [((lon - spec.lon0) / (spec.lon1 - spec.lon0)) * spec.board.w, ((spec.lat1 - lat) / (spec.lat1 - spec.lat0)) * spec.board.h];
  }

  function cross(s, t) {
    const den = s.d[0] * t.d[1] - s.d[1] * t.d[0];
    if (Math.abs(den) < 1e-6) return null;
    const w = sub(t.p, s.p);
    const u = (w[0] * t.d[1] - w[1] * t.d[0]) / den;
    return [s.p[0] + u * s.d[0], s.p[1] + u * s.d[1]];
  }

  // ---------------------------------------------------------------- paths and dense boards

  function pathPoint(spec, frac) {
    const pts = spec.pts;
    let total = 0;
    for (let k = 1; k < pts.length; k++) total += dist(pts[k - 1], pts[k]);
    let left = frac * total;
    for (let k = 1; k < pts.length; k++) {
      const L = dist(pts[k - 1], pts[k]);
      if (left <= L + 1e-12) return lerp(pts[k - 1], pts[k], L ? left / L : 0);
      left -= L;
    }
    return pts[pts.length - 1].slice();
  }

  const DOT_COLORS = { blue: '#1c7ed6', green: '#2f9e44', orange: '#f76707', purple: '#7048e8', red: '#e03131', teal: '#0c8599' };

  // ---------------------------------------------------------------- the ideal point

  function target(spec) {
    const v = spec.scenario;
    if (v === 'center') return spec.c.slice();
    if (v === 'midpoint') return pt([(spec.a[0] + spec.b[0]) / 2, (spec.a[1] + spec.b[1]) / 2]);
    if (v === 'bisect') {
      const d = dir(spec.bisector);
      const t = Math.max(spec.minLen + 0.06, Math.min(0.3, room(spec.v, d, 0.03, area(spec)) - 0.02));
      return [spec.v[0] + d[0] * t, spec.v[1] + d[1] * t];
    }
    if (v === 'right-angle') {
      const u = sub(spec.a, spec.b);
      const l = len(u);
      let n = [-u[1] / l, u[0] / l];
      const A = area(spec);
      if (room(spec.b, [-n[0], -n[1]], 0.03, A) > room(spec.b, n, 0.03, A)) n = [-n[0], -n[1]];
      const t = Math.max(spec.minLen + 0.06, Math.min(0.32, room(spec.b, n, 0.03, A) - 0.02));
      return [spec.b[0] + n[0] * t, spec.b[1] + n[1] * t];
    }
    if (v === 'axis') {
      if (spec.kind === 'ruler') return pt(axisPos(spec.scale, spec.value, spec.from, spec.to));
      if (spec.kind === 'line') return pt(chartXY(spec, spec.value, seriesAt(spec, spec.value)));
      return pt(chartXY(spec, spec.value, spec.yvalue));
    }
    if (v === 'map') {
      if (spec.mode === 'coord') return pt(mapXY(spec, spec.lat, spec.lon));
      return pt(cross(spec.streets[spec.pair[0]], spec.streets[spec.pair[1]]));
    }
    if (v === 'path-mid') return pt(pathPoint(spec, 0.5));
    return spec.dots[spec.target].p.slice();
  }

  // Bounding box of what the figure occupies in board units: points, circles (with ring width), ray ends, the
  // dotted min circle, ruler ends (with the band), the chart's plot rect, path corners, dots and the target.
  // Maps fill the board. Always inside area(spec).
  function figureBounds(spec) {
    const v = spec.scenario;
    const pts = [target(spec)];
    const disc = (c, r) => pts.push([c[0] - r, c[1] - r], [c[0] + r, c[1] + r]);
    if (v === 'center') disc(spec.c, spec.r + (spec.ringWidth || 0) / 2);
    else if (v === 'midpoint') pts.push(spec.a, spec.b);
    else if (v === 'bisect') {
      disc(spec.v, spec.minLen);
      for (const ray of spec.rays) pts.push([spec.v[0] + Math.cos(ray.angle) * ray.len, spec.v[1] + Math.sin(ray.angle) * ray.len]);
    } else if (v === 'right-angle') {
      pts.push(spec.a);
      disc(spec.b, spec.minLen);
    } else if (v === 'axis') {
      if (spec.kind === 'ruler') {
        const across = spec.orient === 'h' ? [0, spec.band] : [spec.band, 0];
        for (const q of [spec.from, spec.to]) pts.push([q[0] - across[0], q[1] - across[1]], [q[0] + across[0], q[1] + across[1]]);
      } else pts.push([spec.plot.x0, spec.plot.y0], [spec.plot.x1, spec.plot.y1]);
    } else if (v === 'map') pts.push([0, 0], [spec.board.w, spec.board.h]);
    else if (v === 'path-mid') pts.push(...spec.pts);
    else for (const d of spec.dots) disc(d.p, spec.r);
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  }

  function errorOf(p, spec) {
    const v = spec.scenario;
    if (!p) return ANGULAR.has(v) ? EMPTY_DEG[v] : EMPTY_DIST;
    if (v === 'bisect') {
      const w = sub(p, spec.v);
      return Math.min(EMPTY_DEG.bisect, Math.max(angleBetween(w, dir(spec.bisector)), shortfall(len(w), spec)));
    }
    if (v === 'right-angle') {
      const w = sub(p, spec.b);
      const ang = angleBetween(sub(spec.a, spec.b), w);
      return Math.min(EMPTY_DEG['right-angle'], Math.max(Math.abs(ang - 90), shortfall(len(w), spec)));
    }
    const t = target(spec);
    if (v === 'axis' && spec.kind === 'ruler') {
      const u = sub(spec.to, spec.from);
      const l = len(u);
      const e = [u[0] / l, u[1] / l];
      const d = sub(p, t);
      const along = Math.abs(dot(d, e));
      const across = Math.abs(d[0] * -e[1] + d[1] * e[0]);
      return Math.min(EMPTY_DIST, Math.hypot(along, Math.max(0, across - spec.band)));
    }
    return Math.min(EMPTY_DIST, dist(p, t));
  }

  const LEVEL_TAU = { easy: 2, medium: 1.5 };
  function tauOf(spec) {
    const v = spec.scenario;
    if (v === 'dense') return spec.r;
    const f = LEVEL_TAU[spec.level] || 1;
    if (v === 'axis') return (spec.kind === 'ruler' ? 0.008 : 0.01) * f;
    return TAU[v] * f;
  }

  // A near miss (partial) or a plausible wrong click, always off target.
  function startPoint(spec, rng, mode) {
    const v = spec.scenario;
    const t = target(spec);
    const tau = tauOf(spec);
    if (mode === 'partial') {
      // On an aspect / placement geometry a near miss that would leave the board goes the other way (the default
      // board keeps its original draws and results).
      const custom = !!spec.area || spec.board.w !== BOARD.w;
      const inside = (q, alt) => (custom && !inBoard(q, 0, { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h }) ? alt() : q);
      if (ANGULAR.has(v)) {
        const vtx = v === 'bisect' ? spec.v : spec.b;
        const w = sub(t, vtx);
        const a = (rng.bool() ? 1 : -1) * rng.float(3, 5) * tau / DEG;
        const turn = (b) => pt([vtx[0] + w[0] * Math.cos(b) - w[1] * Math.sin(b), vtx[1] + w[0] * Math.sin(b) + w[1] * Math.cos(b)]);
        return inside(turn(a), () => turn(-a));
      }
      const k = rng.float(3, 5) * tau;
      if (v === 'axis' && spec.kind === 'ruler') {
        // Along the ruler (a miss across it, inside the ruler's band, would not count).
        const u = sub(spec.to, spec.from);
        const l = len(u);
        const sg = rng.bool() ? 1 : -1;
        const along = (g) => pt([t[0] + (g * k * u[0]) / l, t[1] + (g * k * u[1]) / l]);
        return inside(along(sg), () => along(-sg));
      }
      const th = rng.float(0, 2 * Math.PI);
      const off = (a) => pt([t[0] + Math.cos(a) * k, t[1] + Math.sin(a) * k]);
      return inside(off(th), () => off(th + Math.PI));
    }
    switch (v) {
      case 'center': {
        // A point on the rim, or for an arc the middle of its chord when that is clearly off the center.
        const a = spec.shape === 'arc' ? spec.arc.start + spec.arc.span / 2 : rng.float(0, 2 * Math.PI);
        const chord = spec.shape === 'arc' ? Math.cos(spec.arc.span / 2) : 1;
        const k = chord * spec.r > 4 * tau ? chord : 1;
        return pt([spec.c[0] + Math.cos(a) * spec.r * k, spec.c[1] + Math.sin(a) * spec.r * k]);
      }
      case 'midpoint': return pt(lerp(spec.a, spec.b, rng.pick([0, 1 / 3, 2 / 3])));
      case 'bisect': {
        const ray = rng.pick(spec.rays);
        return pt([spec.v[0] + Math.cos(ray.angle) * ray.len * 0.8, spec.v[1] + Math.sin(ray.angle) * ray.len * 0.8]);
      }
      case 'right-angle': {
        const u = sub(spec.b, spec.a);
        const l = len(u);
        const k = Math.min(room(spec.b, [u[0] / l, u[1] / l], 0.03, area(spec)), spec.minLen + 0.08);
        return pt([spec.b[0] + (u[0] / l) * k, spec.b[1] + (u[1] / l) * k]);
      }
      case 'axis': {
        const s = spec.kind === 'ruler' ? spec.scale : spec.xs;
        const txt = fmtNum(spec.value, s.dec).replace('-', '').replace('.', '');
        let w = NaN;
        if (txt.length >= 2) {
          const sw = txt.slice(0, -2) + txt.slice(-1) + txt.slice(-2, -1);
          const raw = fmtNum(spec.value, s.dec);
          const dotAt = raw.replace('-', '').indexOf('.');
          w = Number(dotAt < 0 ? sw : sw.slice(0, dotAt) + '.' + sw.slice(dotAt)) * (spec.value < 0 ? -1 : 1);
        }
        if (!(w >= s.min && w <= s.max) || Math.abs(w - spec.value) < 2 * s.minor) w = spec.value + (spec.value < (s.min + s.max) / 2 ? 1 : -1) * s.major;
        if (spec.kind === 'ruler') return pt(axisPos(spec.scale, w, spec.from, spec.to));
        if (spec.kind === 'line') return pt(chartXY(spec, w, seriesAt(spec, w)));
        return pt(chartXY(spec, w, spec.yvalue));
      }
      case 'map': {
        if (spec.mode === 'coord') {
          // Off by one grid cell in one coordinate (a misread label).
          const dLat = rng.bool() ? spec.step : 0;
          return pt(mapXY(spec, spec.lat + (dLat ? (spec.lat + dLat < spec.lat1 ? dLat : -dLat) : 0), spec.lon + (dLat ? 0 : (spec.lon + spec.step < spec.lon1 ? spec.step : -spec.step))));
        }
        const others = spec.corners.filter((c) => c.join() !== spec.pair.join());
        const c = others.length ? rng.pick(others) : spec.pair;
        const x = cross(spec.streets[c[0]], spec.streets[c[1]]);
        return pt(others.length ? x : [x[0] + 0.1, x[1]]);
      }
      case 'path-mid': {
        const a = spec.pts[0];
        const b = spec.pts[spec.pts.length - 1];
        const m = lerp(a, b, 0.5);
        return pt(dist(m, t) > 3 * tau ? m : pathPoint(spec, 0.3));
      }
      default: {
        let best = null;
        spec.dots.forEach((d, i) => {
          if (i === spec.target) return;
          const e = dist(d.p, t);
          if (!best || e < best.e) best = { p: d.p, e };
        });
        return best.p.slice();
      }
    }
  }

  // ---------------------------------------------------------------- round 2: judge modes, silent, retarget

  // Snap or shift the clicked point so that it is clearly off; null when no candidate leaves it outside tau.
  function slip(point, spec, rng) {
    const tau = tauOf(spec);
    const { w, h } = spec.board;
    const clampP = (q) => pt([Math.min(w, Math.max(0, q[0])), Math.min(h, Math.max(0, q[1]))]);
    const first = rng.int(0, 2);
    const th = rng.float(0, 2 * Math.PI);
    const cands = [];
    for (let k = 0; k < 3; k++) {
      const g = [0.05, 0.1, 0.025][(first + k) % 3];
      cands.push([roundTo(point[0], g), roundTo(point[1], g)]);
    }
    for (const d of [0.02, 0.03, 0.05, 0.08]) cands.push([point[0] + Math.cos(th) * d, point[1] + Math.sin(th) * d]);
    for (const c of cands) {
      const q = clampP(c);
      if (dist(q, point) > 1e-4 && errorOf(q, spec) > tau) return q;
    }
    return null;
  }

  // A new value on a scale that is clearly away from the old one.
  function otherScaleValue(rng, s, old) {
    for (let k = 0; k < 40; k++) {
      const v = scaleValue(rng, s);
      if (Math.abs(v - old) >= 0.15 * (s.max - s.min)) return v;
    }
    return null;
  }

  // ---------------------------------------------------------------- task

  const lib = {
    fitRange, pt, r4, DEG, horizontal, dist, exclusionRatio, inBoard, room, dir, scaleValue, roundTo,
    cross, BOARD, DOT_COLORS, fmtNum, fmtLat, fmtLon, angleBetween, sub, target, ANGULAR, len, EMPTY_DEG,
    show, aspectRange, PLACED, area, figureBounds,
  };

  const task = {
    name: 'click-point',
    scenarios: SCENARIOS,
    files: [
      'instructions.js', 'judge.js',
      'scenarios/center.js', 'scenarios/midpoint.js', 'scenarios/bisect.js', 'scenarios/right-angle.js',
      'scenarios/axis.js', 'scenarios/map.js', 'scenarios/path-mid.js', 'scenarios/dense.js',
    ],
    lib,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],
    inputs: ['pointer'],
    helpers: { target, figureBounds, axisPos, chartXY, mapXY, fmtNum, fmtLat, fmtLon, DOT_COLORS },

    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS);
      const ood = !!opts.ood;
      const tr = opts.traits;
      const g = geometry(rng, tr, scenario); // validates traits.aspect / traits.placement; no draws without them
      const base = { scenario, board: { w: g.W, h: g.H }, labels: rng.bool(0.5), isplit: opts.isplit || 'train',
        csplit: opts.csplit || 'train', ood, startMode: opts.startMode || 'off' };
      if (g.area) base.area = g.area;
      const cs = { csplit: opts.csplit };
      let part = env.scenariosOf('click-point')[scenario].sample(rng, ood, tr, g, cs, opts.level);
      if (scenario === 'center') part = { ...part, labels: false };
      else if (scenario === 'path-mid') part = { ...part, labels: true };
      if (LEVEL_TAU[opts.level]) base.level = opts.level;
      const out = { ...base, ...part };
      if (task.judgeModes.includes(opts.judge)) out.judge = lib.judgeOf(rng.fork('judge'), out);
      return out;
    },

    init(spec, rng) {
      if (spec.judge) return task.solve(spec); // nothing to click on
      if (spec.startMode === 'partial' || spec.startMode === 'wrong') return { point: startPoint(spec, rng, spec.startMode) };
      return { point: null };
    },

    error(model, spec) {
      const p = model && model.point;
      const e = errorOf(p && p.length === 2 ? p : null, spec);
      return Number.isFinite(e) ? e : errorOf(null, spec);
    },

    tolerance(spec) {
      const tau = tauOf(spec);
      return { tau, sigma: ANGULAR.has(spec.scenario) ? 7 : Math.max(0.025, 3 * tau) };
    },

    facts(model, spec) {
      const p = model && model.point;
      if (!p || p.length !== 2) return [];
      const a = p[0].toFixed(3);
      const b = p[1].toFixed(3);
      // one number per fact: a value with ', ' in it would split in a free-text reply (reply.freeShare clauses)
      return [{ label: 'Marker x', value: a, labels: ['X', 'Marker X', 'Pin x', 'x coordinate'] },
        { label: 'Marker y', value: b, labels: ['Y', 'Marker Y', 'Pin y', 'y coordinate'] }];
    },

    // preempt=cancel: the one marker the click placed
    parts(model) {
      const p = model && model.point;
      return [{ name: 'Marker', value: p && p.length === 2 ? [Number(p[0].toFixed(3)), Number(p[1].toFixed(3))] : null, aliases: ['Pin', 'Point'] }];
    },

    silent(next, prev, spec, rng) {
      if (spec.judge || !next || !next.point) return null;
      const q = slip(next.point, spec, rng);
      return q ? { ...next, point: q } : null;
    },

    retarget(spec, model, rng) {
      if (spec.judge) return null;
      const out = { ...spec };
      const v = spec.scenario;
      if (v === 'axis') {
        if (spec.kind === 'ruler') {
          out.value = otherScaleValue(rng, spec.scale, spec.value);
        } else {
          out.value = otherScaleValue(rng, spec.xs, spec.value);
          if (spec.kind === 'coord') out.yvalue = otherScaleValue(rng, spec.ys, spec.yvalue);
        }
        if (out.value === null || out.yvalue === null) return null;
      } else if (v === 'map' && spec.mode === 'coord') {
        const nLat = Math.round((spec.lat1 - spec.lat0) / spec.step);
        const nLon = Math.round((spec.lon1 - spec.lon0) / spec.step);
        const fracs = spec.ood ? [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9] : [0.25, 0.5, 0.75];
        for (let k = 0; k < 20; k++) {
          out.lat = roundTo(spec.lat0 + (rng.int(0, nLat - 1) + rng.pick(fracs)) * spec.step, 0.0001);
          out.lon = roundTo(spec.lon0 + (rng.int(1, nLon - 2) + rng.pick(fracs)) * spec.step, 0.0001);
          if (Math.abs(out.lat - spec.lat) + Math.abs(out.lon - spec.lon) >= 0.8 * spec.step) break;
        }
      } else if (v === 'map') {
        const others = spec.corners.filter((c) => c[0] !== spec.pair[0] || c[1] !== spec.pair[1]);
        if (!others.length) return null;
        out.pair = rng.pick(others);
      } else if (v === 'dense' && spec.by === 'label') {
        const others = spec.dots.map((d, i) => i).filter((i) => i !== spec.target);
        out.target = rng.pick(others);
      } else return null;
      return errorOf(model && model.point, out) > tauOf(out) ? out : null;
    },

    instruction(spec, rng) {
      return lib.instruction(spec, rng);
    },

    plan(model, spec) {
      return { click: { point: pt(target(spec)) } };
    },

    solve(spec) {
      return { point: pt(target(spec)) };
    },

  };

  env.task(task);
})();
