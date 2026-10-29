/*
 * draw-shape: draw a line, shape, path or signature on a board.
 * Drawing on a board. MiniWoB counterparts: draw-line, draw-circle. Real-world additions: a drawing
 * app toolbar (pick the right tool first), an e-signature pad with Accept, a node diagram (port-to-port
 * drag), erasing strokes, multi-stroke drawings and a map polygon / outline.
 *
 * Board coordinates: x in [0, spec.board.w], y in [0, spec.board.h] with h = 1 and w = 1.5 (w = the
 * aspect when the widget declares traits.aspect). One board unit = the board height; y grows downward. Every
 * distance and tau below is in board units, and widgets must draw the board with one isotropic scale (px per
 * unit) from spec.board.
 *
 * scenarios (spec fields beyond { scenario, board, isplit, csplit, ood, startMode })
 *   line       mode 'connect' -> a, b: [x, y]  the two dots (labelled A and B)
 *              mode 'through' -> p: [x, y], dir: 'horizontal' | 'vertical' | 'guide', angle (rad),
 *                                guide: { c: [x, y], len } (dir 'guide' only: segment to copy the angle of),
 *                                reach (only with traits.placement in a small area: the oracle stroke's half-length)
 *   circle     c: [x, y], r, show: 'guide' (dashed circle) | 'dot' (second dot on the circumference),
 *              rim: [x, y] (the circumference dot; also where the oracle starts), rimDot (bool, only with
 *              traits.guide 'both': show is then 'guide', the rim dot sits at the top of the circle and is
 *              drawn as well)
 *   trace      path: [[x, y], ...] (3-5 vertices; ood 6-7: start dot, corners, arrow tip); guide: 'wave'
 *              (only with traits.guide 'wave': path is a dense sampled smooth sine, left to right, 49 points,
 *              spanning most of the board width; scorer and oracle use those points as they are)
 *   tool       a drawing app: toolbar with pen / line / rectangle / ellipse tools, Undo. target (the tool
 *              the goal needs), start (the tool selected at first, never the target), keys (shortcut
 *              keys P L R O and Ctrl+Z allowed), keyRoute (the oracle uses them), and the target geometry:
 *              line: a, b (dots A, B); rect: a, b (opposite corners), show 'dots' | 'outline';
 *              ellipse: a, b (corners of the dashed bounding box); pen: path (a route to trace)
 *   signature  an e-signature pad on a document: box { x, y, w, h } (the "sign here" field), signer
 *              (person name printed under the line), doc { title, lines[] }, sig (shape of the oracle's
 *              signature: loops, slant, phase). Accept (in-app) sets model.accepted and locks the pad;
 *              Clear wipes the ink and the acceptance
 *   connect    a node diagram: nodes [{ label, x, y }] (centers; node w NODE.w x h NODE.h), keep [[i, j]]
 *              (edges drawn at the start that must stay), want [[i, j]] (edges to add, i -> j), mode
 *              'named' | 'orphan' (want = one edge to or from the only unconnected node), theme
 *   erase      doodles on a whiteboard: strokes [{ shape, color, pts, grab }] (grab = a point on the stroke
 *              far from the others), targets [indices], desc { color?, shape?, all }, keys, keyRoute.
 *              Tools pen / eraser (an eraser press or scrub over a stroke deletes it), Undo
 *   multi      several shapes at once, every stroke counts: targets [{ type: 'line', a, b, labels } |
 *              { type: 'circle', c, r }] (2-3; ood 4-5); Undo removes the last stroke, Clear all
 *   polygon    a map. mode 'pins': pins [[x, y], ...] (numbered 1..k, a simple polygon in that order),
 *              close 'first' (click pin 1 again) | 'dblclick' (double-click the last pin) | 'enter',
 *              keys, keyRoute; a "Draw area" button starts drawing, Undo point, Clear.
 *              mode 'outline': region (closed polygon of a lake or park), regionKind, name: outline it
 *              freehand. Both: streets [{ name, a, b }], river (null | { y0, amp, phase }) for the map
 *
 * guide (opt-in widget trait traits.guide: 'wave' | 'both' | ['wave', 'both']; draws come from rng.fork('guide'),
 *   widgets without it sample exactly as before)
 *   'wave'  trace: the path is a wide, smooth, horizontal wave (spec.guide = 'wave'); scoring is unchanged
 *   'both'  circle: dashed guide and hollow rim dot together (spec.show = 'guide' plus spec.rimDot = true; widgets that
 *           ignore rimDot still show the dashed guide, the instruction names the guide)
 *
 * layers (opt-in: only when the widget declares traits.layers = true, for line, circle, trace, tool and multi)
 *   spec.layers { names: [3 layer names], goal (the layer the drawing must be on; the instruction names it),
 *   locked (index of a layer that refuses ink, -1 none), startHidden (the goal layer starts hidden), startOn
 *   (the layer active at an off / wrong start) }; model.layer (active layer), model.hide [bool x 3] (visibility,
 *   unscored). The widget only passes strokes / items to the model while the goal layer is active, visible and
 *   unlocked. Plan: { click: { eye: i } } shows a hidden goal layer, { click: { layer: i } } selects a layer.
 *
 * board geometry (opt-in widget traits, every scenario unless noted; checked before any draw: a malformed value
 *   throws an Error, nothing is clamped; widgets without them sample exactly as before)
 *   aspect     number | [lo, hi]: the board's width / height, 0.8..2.4 (default 1.5). spec.board = { w: aspect,
 *              h: 1 }; a [lo, hi] range is drawn per episode from rng.fork('aspect') (4 decimals). Everything is
 *              laid out on spec.board: connect and erase use fewer grid columns on narrow boards, multi uses
 *              fewer cells (and drops targets that do not fit), circle / pin / region radii shrink to fit.
 *   placement  'left' | 'right' | 'top' | 'bottom' | 'center' | { x, y, w, h } (board fractions): the part of
 *              the board the figure lies in (line dots, dot and guide, and the oracle stroke; the circle; the
 *              trace path or wave; the tool shape or route; the signature box; every multi target; polygon pins
 *              or region, while the map's streets and river still span the board). spec.area = that part in
 *              board units { x, y, w, h }. Anchors: left / right = 55% of the width at that side, top / bottom
 *              = 60% of the height, center = the middle 60% x 60%; an anchor narrower than 0.64 board units is
 *              widened to 0.64 (kept at its side). A rect must lie in 0..1 with w, h > 0 and span at least 0.64
 *              x 0.6 board units at the smallest aspect. In a small area line 'through' episodes get a shorter
 *              oracle stroke (spec.reach = its half-length, set only when below the usual 0.3) and sizes shrink
 *              to fit. connect and erase ignore it (their layouts fill the board; no spec.area).
 *
 * model
 *   line, circle, trace  { strokes: [[[x, y], ...], ...] } pointer samples per stroke. Only the LAST stroke
 *              is scored (and drawn): a new pointerdown starts a fresh attempt.
 *   tool       { tool, items: [{ kind: 'pen' | 'line' | 'rect' | 'ellipse', pts }] } (line/rect/ellipse
 *              pts = [press, release]; pen = samples)
 *   signature  { strokes, accepted }        every stroke is ink
 *   connect    { edges: [[i, j], ...] }
 *   erase      { tool: 'pen' | 'eraser', erased: [indices], drawn: [strokes], ops: [['e', i] | ['d']] }
 *   multi      { strokes }                  every stroke counts
 *   polygon    pins: { drawing, pts: [[x, y], ...], closed }   outline: { strokes } (last stroke scored)
 *
 * error  (EMPTY = 1)
 *   line connect: max(endpoint miss (best pairing of stroke ends to A, B), distance of A and B to the
 *                 fitted stroke segment, straightness)
 *   line through: max(distance of P to the fitted line, 0.25 * sin(angle error), overshoot shortfall
 *                 (P must lie >= 0.1 inside both ends), straightness)
 *   circle: max(hypot(center error, radius error), rms radial residual, coverage shortfall, roundness) (Kasa fit of the
 *           stroke resampled every 0.01, so a polygon is judged by its sides, not its corners; shortfall = r * max(0,
 *           300 deg - angular coverage); roundness = tau * (largest radial deviation / radius) / 0.055, so a hexagon
 *           (0.054 after the fit) fails at every level while an octagon (0.03) and anything rounder passes)
 *   trace:  max(Chamfer distance, start miss, end miss)
 *   tool:   best geometric error among items of the target kind (line: endpoint pairing; rect/ellipse:
 *           max corner coordinate error of the normalized box; pen: the trace error), or 0.85 when the
 *           target tool is selected but nothing of that kind is drawn, else 1; plus 0.3 per other item
 *   signature: 0.6 * max(shortfall, outside) + 0.4 * (accepted ? 0 : 1). shortfall = 1 - ink * span *
 *           turns * loops (ink inside the box / 0.6 box width, x extent / 0.4 box width, y reversals / 3, self-crossings
 *           of the line / 2, each capped at 1: a zigzag never crosses itself, so it fails; the instruction asks for at
 *           least two loops, and the oracle's signature always has them); outside = ink outside the box / 0.15 box width (capped at 1)
 *   connect: |edges symmetric-difference (keep + want)| / |want|
 *   erase:  (targets not erased + non-targets erased + 0.5 * strokes drawn) / |targets|
 *   multi:  mean over targets of the matched stroke's error (strokes matched greedily one-to-one; a
 *           target within its own tau counts 0), + 0.1 per unmatched stroke
 *   polygon pins: closed: 1 - IoU(drawn polygon, pin polygon); open: 1 - 0.5 * pins hit / k
 *           outline: 1 - IoU(last stroke closed, region)  (IoU by rasterizing at 0.008)
 * tau    line 0.025, circle 0.03, trace 0.025, tool 0.025, signature 0.05, connect 0, erase 0,
 *        multi 0.005 (per-target tau 0.025 / 0.03 inside), polygon pins 0.04, outline 0.08
 *
 * plan targets (widgets map them to viewport px)
 *   { point: [bx, by] }   a board point            { tool: name }   a toolbar tool ('pen', 'line', 'rect',
 *   { control: 'undo' | 'clear' | 'accept' }       'ellipse', 'eraser', 'polygon' (= "Draw area"))
 *   { port: [i, 'out' | 'in'] }  a node port         { edgeDel: [i, j] }  the remove handle of an edge
 *   { grab: i }  erase: the grab point of stroke i   { pin: i }  polygon pin i
 * plan steps: { path } (strokes), { drag } (line/rect/ellipse items, edges), { click }, { dblclick: pin }
 *   (dblclick close), { key: 'p' | 'l' | 'r' | 'o' | 'e' | 'Control+z' | 'Enter' | 'Backspace' } (key routes)
 *
 * Start modes: off, partial (half a stroke; the right tool selected; a signature not yet accepted; one of
 * several edges / targets / pins done), wrong (a shifted / reversed stroke; a shape drawn with the wrong
 * tool; an accepted signature that leaves the box; a wrong edge; a non-target erased; a stray stroke; a
 * closed polygon with a misplaced vertex), solved. Nothing ends the episode early (no recoverable mode).
 * Inputs: pointer; keyboard in the tool, erase and polygon-pins episodes with spec.keys (about 25%).
 * opts.route: 'keyboard' forces spec.keys + keyRoute in those three, 'pointer' forces pointer only; other
 * scenarios (no keyboard or wheel route) ignore it.
 *
 * Levels (opts.level; spec.level is set for easy / medium only, normal is the task as it always was):
 *   tolerance  every tau (and the inner thresholds that follow it: multi's per-target tau, the pin hit radius, the tool
 *              plan's redo test) is scaled x2.5 easy / x1.6 medium (tolerance(spec) and sigma follow; connect and erase,
 *              tau 0, stay exact)
 *   easy       trace: 2 segments (wave: one cycle). tool: never the pen (a line instead), the pen route has 2 segments,
 *              the target tool is selected at the start. multi: 2 targets, one already drawn. connect: 4 nodes, one
 *              edge to add, never the orphan mode. erase: 4 strokes, one target (no color / shape group). polygon:
 *              4 pins (closed by clicking pin 1), the first two already placed. signature: the stroke is drawn, only
 *              Accept is left.
 *   medium     trace: 3 segments (wave: 1.5 cycles). tool: the pen route has 2 segments. multi: 2 targets. connect:
 *              5 nodes. erase: 5 strokes. polygon: 5 pins.
 *   Only the 'off' start changes; the other start modes build what they always built.
 *
 * Optional hooks (round 2 contract; pure):
 *   facts     connect: connections, links into / out of a wanted link's nodes; erase: strokes and colors left; tool:
 *             selected tool, shapes on the canvas; multi: strokes, circles, lines; signature: signer, document; polygon
 *             pins: corners, streets; [] for line, circle, trace and outline (nothing to read beyond the figure).
 *   parts     preempt=cancel: connect: each node by label (value: its links); erase: each look-alike group of strokes by
 *             "color shape" (value: which are erased) and "New strokes"; tool: "Selected tool" and "Canvas"; signature:
 *             "Signature" and "Accept"; pins: "Area" and "Pin k"; the one-board scenarios: "Drawing" (one part only).
 *             Label paraphrases of facts go in labels.
 *   silent    a stroke / shape / pin that did not save or was cut short, a link or erase that did not stick (or a
 *             removed link back), Accept or the polygon close not registered, a tool switch that did not take.
 *   retarget  line 'through' horizontal <-> vertical; tool rectangle <-> ellipse on the same outline; connect other
 *             links / the orphan to another node; erase another stroke; else null (the page draws the whole goal).
 *   judgeModes none: ambiguous / impossible need a phantom or doubled target in every scenario (a route, a dashed
 *             circle or a signature box has no natural missing or doubled twin), and no draw step is irreversible
 *             (Undo / Clear / remove handles undo everything), so confirm does not apply.
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('draw', {...}) per scenario with
 * its sampler, scoring, oracle, instruction and round-2 hooks (hook list above the dispatch section). This file holds the
 * header, the board and stroke geometry and scoring primitives the scenarios share (lib), and the dispatch.
 *
 * Deviations from MiniWoB: board units instead of px, graded errors, the scenarios beyond line/circle.
 * Self-tests live in selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   BOARD                         default board dimensions (width 1.5, height 1)
 *   INKS                          color name -> hex
 *   NODE                          node dimensions
 *   TOOL_KEYS                     tool name -> shortcut key
 *   sigQuality(strokes, box)      signature quality inside the signing box
 *   ideal(spec)                   the oracle's stroke
 *   itemFromStroke(tool, pts)     a tool item made from pointer samples
 *   polyIoU(a, b)                 polygon intersection over union
 *   multiMatch(model, spec)       matching of strokes to multi targets
 *   figurePts(spec)               sample points of the dots, guides, strokes, shapes, targets and pins
 */
(function () {
  'use strict';

  const BOARD = { w: 1.5, h: 1 };
  const EMPTY = 1;
  // Level scale of every tolerance (see Levels in the header).
  const tauK = (spec) => (spec.level === 'easy' ? 2.5 : spec.level === 'medium' ? 1.6 : 1);
  const TAU = { line: 0.025, circle: 0.03 }; // the two stroke shapes the scoring primitives share; each scenario sets its own tolerance
  const OVERSHOOT = 0.1; // 'through' lines must extend this far past the dot on both sides
  const MIN_COVERAGE = (300 * Math.PI) / 180;
  const NODE = { w: 0.27, h: 0.11 };
  const TOOL_KEYS = { pen: 'p', line: 'l', rect: 'r', ellipse: 'o', eraser: 'e' };
  const INKS = { red: '#e03131', blue: '#1c63d6', green: '#2b8a3e', orange: '#e8590c', purple: '#7b2fd9', black: '#25262b' };
  const LAYER_NAMES = ['Sketch', 'Annotations', 'Markup', 'Drafts', 'Notes', 'Overlay', 'Ink', 'Review', 'Background', 'Guides'];
  // Board geometry traits (traits.aspect, traits.placement).
  const ASPECT = [0.8, 2.4];
  const MIN_AREA = { w: 0.64, h: 0.6 }; // smallest placement area, board units
  const ANCHORS = { left: { x: 0, y: 0, w: 0.55, h: 1 }, right: { x: 0.45, y: 0, w: 0.55, h: 1 }, top: { x: 0, y: 0, w: 1, h: 0.6 },
    bottom: { x: 0, y: 0.4, w: 1, h: 0.6 }, center: { x: 0.2, y: 0.2, w: 0.6, h: 0.6 } };

  // opts.route forces the keyboard route ('keyboard') or pointer only ('pointer'); the draws are made either way.
  function keyRoute(rng, route, p = 0.7) {
    const k = rng.bool(0.25);
    const r = k && rng.bool(p);
    const keys = route === 'keyboard' ? true : route === 'pointer' ? false : k;
    return { keys, keyRoute: keys && (route === 'keyboard' || r) };
  }

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const len = (a) => Math.hypot(a[0], a[1]);
  const { dist, lerp } = env.util;
  const r4 = (v) => Math.round(v * 1e4) / 1e4;
  const pt = (p) => [r4(p[0]), r4(p[1])];
  const clampB = (p, bd) => [Math.min(bd.w, Math.max(0, p[0])), Math.min(bd.h, Math.max(0, p[1]))];
  const copy = (x) => JSON.parse(JSON.stringify(x));
  const C = env.content;

  // F: the frame a figure is sampled in, { x, y, w, h } in board units (the whole board, or spec.area).
  function inBoard(p, m, F) {
    return p[0] >= F.x + m && p[0] <= F.x + F.w - m && p[1] >= F.y + m && p[1] <= F.y + F.h - m;
  }
  const frameOf = (bd) => ({ x: 0, y: 0, w: bd.w, h: bd.h });

  // traits.aspect / traits.placement -> { board, area } (area null without placement). Throws on malformed values.
  function boardGeometry(tr, rng) {
    const bad = (msg) => { throw new Error(`draw: traits.${msg}`); };
    const num = (v) => typeof v === 'number' && Number.isFinite(v);
    let lo = BOARD.w;
    let hi = BOARD.w;
    if (tr.aspect !== undefined) {
      const a = tr.aspect;
      const want = `aspect must be a number or [lo, hi] (lo <= hi) between ${ASPECT[0]} and ${ASPECT[1]} (board width / height)`;
      if (num(a)) lo = hi = a;
      else if (Array.isArray(a) && a.length === 2 && a.every(num) && a[0] <= a[1]) [lo, hi] = a;
      else bad(`${want}, got ${JSON.stringify(a)}`);
      if (lo < ASPECT[0] || hi > ASPECT[1]) bad(`${want}, got ${JSON.stringify(a)}`);
    }
    let rect = null;
    let anchor = false;
    if (tr.placement !== undefined) {
      const p = tr.placement;
      const want = `placement must be one of ${Object.keys(ANCHORS).join(', ')} or a { x, y, w, h } rect in board fractions`;
      if (typeof p === 'string') {
        if (!Object.prototype.hasOwnProperty.call(ANCHORS, p)) bad(`${want}, got ${JSON.stringify(p)}`);
        rect = ANCHORS[p];
        anchor = true;
      } else if (p && typeof p === 'object' && !Array.isArray(p)) {
        if (!['x', 'y', 'w', 'h'].every((k) => num(p[k]))) bad(`${want} with finite numbers, got ${JSON.stringify(p)}`);
        if (p.w <= 0 || p.h <= 0) bad(`placement has a non-positive size: ${JSON.stringify(p)}`);
        if (p.x < 0 || p.y < 0 || p.x + p.w > 1 + 1e-9 || p.y + p.h > 1 + 1e-9) bad(`placement must lie on the board (fractions 0..1): ${JSON.stringify(p)}`);
        if (p.w * lo < MIN_AREA.w - 1e-9 || p.h < MIN_AREA.h - 1e-9) {
          bad(`placement ${JSON.stringify(p)} is too small: it must span at least ${MIN_AREA.w} x ${MIN_AREA.h} board units (w * aspect >= ${MIN_AREA.w} at aspect ${lo}, h >= ${MIN_AREA.h})`);
        }
        rect = p;
      } else bad(`${want}, got ${JSON.stringify(p)}`);
    }
    const w = lo === hi ? lo : r4(rng.fork('aspect').float(lo, hi));
    const board = { w, h: BOARD.h };
    if (!rect) return { board, area: null };
    let ax = rect.x * w;
    let aw = rect.w * w;
    if (anchor && aw < MIN_AREA.w) {
      ax = rect.x <= 0 ? 0 : rect.x + rect.w >= 1 ? w - MIN_AREA.w : ax - (MIN_AREA.w - aw) / 2;
      aw = MIN_AREA.w;
    }
    const x = r4(ax);
    return { board, area: { x, y: r4(rect.y), w: Math.min(r4(aw), r4(w - x)), h: Math.min(r4(rect.h), r4(1 - rect.y)) } };
  }

  function segDist(p, a, b) {
    const ab = sub(b, a);
    const l2 = dot(ab, ab);
    const t = l2 ? Math.max(0, Math.min(1, dot(sub(p, a), ab) / l2)) : 0;
    return dist(p, lerp(a, b, t));
  }

  function polyDist(p, poly) {
    let best = Infinity;
    for (let i = 1; i < poly.length; i++) best = Math.min(best, segDist(p, poly[i - 1], poly[i]));
    return poly.length === 1 ? dist(p, poly[0]) : best;
  }

  function polyLength(poly) {
    let s = 0;
    for (let i = 1; i < poly.length; i++) s += dist(poly[i - 1], poly[i]);
    return s;
  }

  // Points every `step` along a polyline (both ends included).
  function resample(poly, step) {
    if (poly.length < 2) return poly.slice();
    const out = [poly[0]];
    let carry = 0;
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1];
      const L = dist(a, poly[i]);
      if (!L) continue;
      let t = step - carry;
      while (t <= L) {
        out.push(lerp(a, poly[i], t / L));
        t += step;
      }
      carry = L - (t - step);
    }
    out.push(poly[poly.length - 1]);
    return out;
  }

  // Principal axis of the points: { c, d (unit), lo, hi (projected extent), dev (max off-axis distance) }.
  function fitLine(pts) {
    const n = pts.length;
    const c = [0, 0];
    for (const p of pts) { c[0] += p[0] / n; c[1] += p[1] / n; }
    let sxx = 0;
    let sxy = 0;
    let syy = 0;
    for (const p of pts) {
      const x = p[0] - c[0];
      const y = p[1] - c[1];
      sxx += x * x; sxy += x * y; syy += y * y;
    }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    const d = [Math.cos(th), Math.sin(th)];
    const nrm = [-d[1], d[0]];
    let lo = Infinity;
    let hi = -Infinity;
    let dev = 0;
    for (const p of pts) {
      const v = sub(p, c);
      const t = dot(v, d);
      lo = Math.min(lo, t); hi = Math.max(hi, t);
      dev = Math.max(dev, Math.abs(dot(v, nrm)));
    }
    return { c, d, lo, hi, dev, a: [c[0] + d[0] * lo, c[1] + d[1] * lo], b: [c[0] + d[0] * hi, c[1] + d[1] * hi] };
  }

  // Algebraic circle fit (Kasa): least squares on x^2 + y^2 + D x + E y + F = 0, centered for stability.
  function fitCircle(pts) {
    const n = pts.length;
    const m = [0, 0];
    for (const p of pts) { m[0] += p[0] / n; m[1] += p[1] / n; }
    let suu = 0, suv = 0, svv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0;
    for (const p of pts) {
      const u = p[0] - m[0];
      const v = p[1] - m[1];
      suu += u * u; suv += u * v; svv += v * v;
      suuu += u * u * u; svvv += v * v * v; suvv += u * v * v; svuu += v * u * u;
    }
    const det = suu * svv - suv * suv;
    if (!(Math.abs(det) > 1e-12)) return null;
    const bu = 0.5 * (suuu + suvv);
    const bv = 0.5 * (svvv + svuu);
    const uc = (bu * svv - bv * suv) / det;
    const vc = (suu * bv - suv * bu) / det;
    const c = [uc + m[0], vc + m[1]];
    const r = Math.sqrt(uc * uc + vc * vc + (suu + svv) / n);
    return { c, r };
  }

  function pointInPoly(p, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i];
      const b = poly[j];
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }

  // IoU of two closed polygons by sampling a grid (cell centers) over their joint bounding box.
  function polyIoU(A, B, step = 0.008) {
    if (!A || !B || A.length < 3 || B.length < 3) return 0;
    const xs = A.concat(B).map((p) => p[0]);
    const ys = A.concat(B).map((p) => p[1]);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    let inter = 0;
    let uni = 0;
    for (let y = y0 + step / 2; y < y1; y += step) {
      for (let x = x0 + step / 2; x < x1; x += step) {
        const a = pointInPoly([x, y], A);
        const b = pointInPoly([x, y], B);
        if (a && b) inter++;
        if (a || b) uni++;
      }
    }
    return uni ? inter / uni : 0;
  }

  function lastStroke(model) {
    const s = model && model.strokes;
    const k = s && s.length ? s[s.length - 1] : null;
    return k && k.length >= 2 ? k : null;
  }

  // ---------------------------------------------------------------- geometric errors

  function lineError(k, g) {
    const f = fitLine(k);
    if (g.mode === 'connect') {
      const s0 = k[0];
      const s1 = k[k.length - 1];
      const ends = Math.min(Math.max(dist(s0, g.a), dist(s1, g.b)), Math.max(dist(s0, g.b), dist(s1, g.a)));
      return Math.max(ends, segDist(g.a, f.a, f.b), segDist(g.b, f.a, f.b), f.dev);
    }
    const v = sub(g.p, f.c);
    const off = Math.abs(dot(v, [-f.d[1], f.d[0]]));
    const t = dot(v, f.d);
    const short = Math.max(0, OVERSHOOT - Math.min(t - f.lo, f.hi - t));
    const want = [Math.cos(g.angle), Math.sin(g.angle)];
    const sinErr = Math.abs(want[0] * f.d[1] - want[1] * f.d[0]);
    return Math.max(off, 0.25 * sinErr, short, f.dev);
  }

  // Roundness: the largest distance of the drawn line from the fitted circle, as a share of its radius, may be this much
  // (a hexagon is 0.07, an octagon 0.04, a 12-gon 0.02: after the least-squares fit about 0.054 / 0.03 / 0.015; the tolerance scales with the level like the others).
  const ROUND = 0.055;

  // The stroke is judged as the line that is drawn (resampled every 0.01), not by its vertices: the corners of a hexagon
  // lie on a circle.
  function circleError(k0, g, scale = 1) {
    if (k0.length < 3) return EMPTY;
    const dense = resample(k0, 0.01);
    const k = dense.length >= 3 ? dense : k0;
    const fit = fitCircle(k);
    if (!fit || !isFinite(fit.r)) return EMPTY;
    const shape = Math.hypot(dist(fit.c, g.c), fit.r - g.r);
    let ss = 0;
    let worst = 0;
    for (const p of k) {
      const d = Math.abs(dist(p, fit.c) - fit.r);
      ss += d * d;
      worst = Math.max(worst, d);
    }
    const rms = Math.sqrt(ss / k.length);
    const round = (TAU.circle * scale * worst) / (ROUND * fit.r);
    const ang = k.map((p) => Math.atan2(p[1] - fit.c[1], p[0] - fit.c[0])).sort((a, b) => a - b);
    let gap = ang[0] + 2 * Math.PI - ang[ang.length - 1];
    for (let i = 1; i < ang.length; i++) gap = Math.max(gap, ang[i] - ang[i - 1]);
    const coverage = 2 * Math.PI - gap;
    const shortfall = g.r * Math.max(0, MIN_COVERAGE - coverage);
    return Math.min(EMPTY, Math.max(shape, rms, shortfall, round));
  }

  function traceError(k, path) {
    const ks = resample(k, 0.01);
    const ts = resample(path, 0.01);
    let a = 0;
    for (const p of ks) a += polyDist(p, path);
    let b = 0;
    for (const p of ts) b += polyDist(p, k);
    const chamfer = Math.max(a / ks.length, b / ts.length);
    return Math.max(chamfer, dist(k[0], path[0]), dist(k[k.length - 1], path[path.length - 1]));
  }

  const fin = (e) => (Number.isFinite(e) ? Math.min(EMPTY, e) : EMPTY);
  const boxOf = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];

  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('draw', {name, ...}); logic.js calls its hooks. Hooks of an object:
  //   sample(rng, { o, F, board, traits, lv })  the scenario's spec fields (o: ood / csplit / route / level, F: the frame
  //     figures are sampled in, board, traits: opts.traits, lv: 'easy' | 'medium' | null)
  //   tolerance(spec)  the base tolerance { tau, sigma?, minInitialError? } (the level scale is applied on top)
  //   ideal(spec, target?)  the oracle's stroke (optional: connect and erase have none)
  //   init(spec, rng, mode)  the start model (mode: the start mode, 'partial' for an easy 'off' start of an easyPartial scenario)
  //   error(model, spec), solve(spec), plan(model, spec)
  //   figurePts(spec)  every point of the figure (selftest.js: placement and board checks)
  //   instruction(spec, rng, say, tolP)
  // optional: facts(model, spec, out) (pushes onto out), parts(model, spec) (default: the one "Drawing" part),
  //   silent(next, prev, spec, rng, cands) (pushes candidate models after the generic stroke ones),
  //   retarget(spec, model, rng, ok) (ok(newSpec): newSpec if the model misses it), simulate(m, spec, step) (selftest.js:
  //   the model-space effect of a plan step on the copy m; default: a path adds a stroke) and check(fails) (selftest.js
  //   spot checks). Flags: placed (traits.placement places the figure), layered (traits.layers gates the strokes),
  //   easyPartial (an easy 'off' start is 'partial').

  const V = env.scenariosOf('draw-shape');

  // The start of the single-stroke scenarios: half the oracle stroke (partial), a wrong stroke, or an empty board.
  function strokeStart(k, mode, wrong) {
    if (mode === 'partial') return { strokes: [k.slice(0, Math.ceil(k.length * 0.45)).map(pt)] };
    if (mode === 'wrong') return wrong();
    return { strokes: [] };
  }
  const undoStep = (keyRoute) => (keyRoute ? { key: 'Control+z' } : { click: { control: 'undo' } });
  const keyTool = (k) => Object.keys(TOOL_KEYS).find((t) => TOOL_KEYS[t] === k);
  const addPath = (m, step) => {
    m.strokes = (m.strokes || []).concat([step.path.map((t) => t.point.slice())]);
    return m;
  };

  const errorOf = (model, spec) => V[spec.scenario].error(model, spec);

  function ideal(spec, target) {
    const v = V[spec.scenario];
    return v.ideal ? v.ideal(spec, target) : [];
  }

  function initOf(spec, rng) {
    const v = V[spec.scenario];
    // Easy: an 'off' start is partly solved where that is a sensible state (see Levels in the header).
    const mode = spec.level === 'easy' && spec.startMode === 'off' && v.easyPartial ? 'partial' : spec.startMode || 'off';
    return v.init(spec, rng, mode);
  }

  const solveOf = (spec, model) => V[spec.scenario].solve(spec, model);
  const planOf = (model, spec) => V[spec.scenario].plan(model, spec);
  const figurePts = (spec) => V[spec.scenario].figurePts(spec);

  function instructionOf(spec, rng) {
    const say = (core, terse, steps) => I.say(rng, core, { isplit: spec.isplit, terse, steps });
    const tolP = (phrase) => I.tol(rng, phrase, 0.3);
    return V[spec.scenario].instruction(spec, rng, say, tolP);
  }

  // Model-space effect of one plan step, as the base widget implements it (selftest.js only).
  function simulate(model, spec, step) {
    const m = copy(model);
    if (step.click && (step.click.layer !== undefined || step.click.eye !== undefined)) {
      if (step.click.layer !== undefined) m.layer = step.click.layer;
      else m.hide[step.click.eye] = !m.hide[step.click.eye];
      return m;
    }
    const v = V[spec.scenario];
    return v.simulate ? v.simulate(m, spec, step) : addPath(m, step);
  }

  // ---------------------------------------------------------------- round-2 hooks (pure: no DOM, rng only)

  // tolerance(spec).tau without the task object.
  const tauOf = (spec) => (V[spec.scenario].tolerance(spec).tau || 0) * tauK(spec);

  // facts: what a person reads off the page at the end; [] when fewer than 2 apply (line, circle, trace: the figure is the
  // whole page; nothing to report beyond the goal).
  function factsOf(model, spec) {
    const out = [];
    const v = V[spec.scenario];
    if (v.facts) v.facts(model, spec, out);
    return out.length >= 2 ? out.slice(0, 4) : [];
  }

  // parts: the page's discrete items for preempt=cancel, by the name the page shows. Scenarios whose page is one board with
  // nothing else to name (line, circle, trace, multi, outline) have one: the drawing.
  function partsOf(model, spec) {
    const v = V[spec.scenario];
    return v.parts ? v.parts(model, spec) : [{ name: 'Drawing', value: (model.strokes || []).length, aliases: ['Stroke', 'Strokes'] }];
  }

  // silent: a stroke that did not save or was cut short, then the scenario's candidates (a shape / link / erase that did not
  // stick, an Accept or a polygon close that did not register, a tool switch that did not take). Candidates in rng order;
  // the first that leaves the error above tau wins, else the previous model (the whole change did not stick), else null.
  function silentOf(next, prev, spec, rng) {
    const tau = tauOf(spec);
    const C = env.util.clone;
    const p = prev || {};
    const cands = [];
    if (Array.isArray(next.strokes)) {
      const ks = next.strokes;
      if (ks.length > (p.strokes || []).length) cands.push(() => ({ ...C(next), strokes: C(ks.slice(0, -1)) }));
      const last = ks[ks.length - 1];
      if (last && last.length >= 6) {
        cands.push(() => {
          const m = C(next);
          m.strokes[m.strokes.length - 1] = m.strokes[m.strokes.length - 1].slice(0, Math.ceil(last.length * 0.6));
          return m;
        });
      }
    }
    const v = V[spec.scenario];
    if (v.silent) v.silent(next, prev, spec, rng, cands);
    for (const f of rng.shuffle(cands)) {
      const m = f();
      if (errorOf(m, spec) > tau) return m;
    }
    if (prev && errorOf(prev, spec) > tau) return C(prev);
    return null;
  }

  // retarget: the same scene with another goal (null when the scenario has none or nothing fits): line 'through'
  // horizontal <-> vertical (when the stroke still fits), tool rectangle <-> ellipse over the same dashed outline, connect
  // other links (named) or the orphan linked to another node (while it is still unconnected), erase another stroke by its
  // shortest unique description. The page shows the whole goal of circle, trace, signature, multi and polygon (a reversed
  // route would keep the instruction's words).
  function retargetOf(spec, model, rng) {
    const tau = tauOf(spec);
    const ok = (ns) => (ns && errorOf(model, ns) > tau ? ns : null);
    const v = V[spec.scenario];
    return v.retarget ? v.retarget(spec, model, rng, ok) : null;
  }

  // ---------------------------------------------------------------- sampling

  function sampleConnect(rng, ood, F) {
    for (;;) {
      const a = [F.x + rng.float(0.1, F.w - 0.1), F.y + rng.float(0.1, F.h - 0.1)];
      const b = [F.x + rng.float(0.1, F.w - 0.1), F.y + rng.float(0.1, F.h - 0.1)];
      const L = dist(a, b);
      if (ood ? (L >= 1.15 && L <= 1.45) || (L >= 0.22 && L <= 0.32) : L >= 0.35 && L <= 1.15) return { a: pt(a), b: pt(b) };
    }
  }

  function segmentsCross(a, b, c, d) {
    const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
  }

  function samplePath(rng, segs, F, lo = 0.22, hi = 0.48) {
    const k = Math.min(1, F.w, F.h); // lengths shrink with a small frame
    for (;;) {
      const path = [[F.x + rng.float(0.12, F.w - 0.12), F.y + rng.float(0.12, F.h - 0.12)]];
      let heading = rng.float(0, 2 * Math.PI);
      let ok = true;
      for (let i = 0; i < segs && ok; i++) {
        if (i) heading += rng.float(Math.PI / 6, (5 * Math.PI) / 6) * (rng.bool() ? 1 : -1);
        const L = rng.float(lo * k, hi * k);
        const last = path[path.length - 1];
        const next = [last[0] + L * Math.cos(heading), last[1] + L * Math.sin(heading)];
        if (!inBoard(next, 0.08, F)) { ok = false; break; }
        // Keep it readable: no crossings, and new vertices clear of earlier segments.
        for (let j = 1; j < path.length - 1 && ok; j++) {
          if (segmentsCross(path[j - 1], path[j], last, next)) ok = false;
          if (segDist(next, path[j - 1], path[j]) < 0.12 * k) ok = false;
        }
        path.push(next);
      }
      if (ok && dist(path[0], path[path.length - 1]) > 0.2 * k) return path.map(pt);
    }
  }

  // traits.guide: a string or a list of 'wave' | 'both'.
  const hasGuide = (tr, v) => !!tr && (tr.guide === v || (Array.isArray(tr.guide) && tr.guide.includes(v)));

  // ---------------------------------------------------------------- ideal strokes (board units)

  function circlePts(c, r, from, n = 41) {
    const th0 = from ? Math.atan2(from[1] - c[1], from[0] - c[0]) : -Math.PI / 2;
    return Array.from({ length: n }, (_, i) => {
      const th = th0 + (2 * Math.PI * i) / (n - 1);
      return [c[0] + r * Math.cos(th), c[1] + r * Math.sin(th)];
    });
  }

  function pathPts(path, total = 31) {
    const L = polyLength(path);
    const out = [path[0]];
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1];
      const b = path[i];
      const n = Math.max(3, Math.round((total * dist(a, b)) / L));
      for (let j = 1; j <= n; j++) out.push(lerp(a, b, j / n));
    }
    return out;
  }

  const ptsTargets = (pts) => pts.map((p) => ({ point: [r4(p[0]), r4(p[1])] }));
  const shift = (pts, d, bd) => pts.map((p) => pt(clampB([p[0] + d[0], p[1] + d[1]], bd)));

  // ---------------------------------------------------------------- init / solve

  // ---------------------------------------------------------------- plan

  // ---------------------------------------------------------------- instructions

  const I = env.instruct;
  function T(rng, spec, list, vars) {
    return I.fill(I.pick(rng, list, spec.isplit), vars || {});
  }

  // ---------------------------------------------------------------- round-2 hooks (pure: no DOM, rng only)

  // ---------------------------------------------------------------- task

  env.task({
    name: 'draw-shape',
    scenarios: ['line', 'circle', 'trace', 'tool', 'signature', 'connect', 'erase', 'multi', 'polygon'],
    files: ['scenarios/line.js', 'scenarios/circle.js', 'scenarios/trace.js', 'scenarios/tool.js', 'scenarios/signature.js',
      'scenarios/connect.js', 'scenarios/erase.js', 'scenarios/multi.js', 'scenarios/polygon.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: (spec) => (spec && spec.keys ? ['pointer', 'keyboard'] : ['pointer']),

    // Helpers the scenario files share (they read env.taskOf('draw-shape').lib).
    lib: {
      addPath, BOARD, boxOf, C, circleError, circlePts, clampB, dist, EMPTY, errorOf, fin, frameOf, hasGuide, I,
      ideal, inBoard, initOf, INKS, keyRoute, keyTool, lastStroke, len, lerp, lineError, NODE, pathPts, polyDist,
      polyIoU, pt, ptsTargets, r4, resample, sampleConnect, samplePath, segmentsCross, shift, solveOf, strokeStart,
      sub, T, TAU, tauK, TOOL_KEYS, traceError, undoStep,
      factsOf, figurePts, fitCircle, fitLine, instructionOf, MIN_AREA, partsOf, planOf, retargetOf, silentOf, simulate, V
    },

    // Helpers for widgets (the scenario files add their own).
    helpers: { BOARD, INKS, NODE, TOOL_KEYS, ideal, polyIoU, figurePts },

    sample(rng, opts) {
      // Board geometry traits first: a malformed value throws before any draw.
      const { board, area: placed } = boardGeometry(opts.traits || {}, rng);
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const lv = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
      const o = { ood: !!opts.ood, csplit: opts.csplit || 'train', route: opts.route, level: lv };
      const area = placed && V[scenario].placed ? placed : null;
      const F = area || frameOf(board); // the frame the figure is sampled in
      const base = { scenario, board, isplit: opts.isplit || 'train', csplit: o.csplit, ood: o.ood, startMode: opts.startMode || 'off' };
      if (area) base.area = area;
      const spec = { ...base, ...V[scenario].sample(rng, { o, F, board, traits: opts.traits, lv }) };
      if (lv) spec.level = lv;
      // A widget with a layers panel (traits.layers): the strokes only count on the named layer.
      if (opts.traits && opts.traits.layers && V[scenario].layered) {
        const lr = rng.fork('layers');
        const names = lr.sample(LAYER_NAMES.slice(0, 8), 3);
        const goal = lr.int(0, 2);
        spec.layers = { names, goal, locked: lr.bool(0.5) ? (goal + 1 + lr.int(0, 1)) % 3 : -1, startHidden: lr.bool(0.3), startOn: lr.bool(0.75) ? (goal + 1 + lr.int(0, 1)) % 3 : goal };
      }
      return spec;
    },

    init(spec, rng) {
      const m = initOf(spec, rng);
      const L = spec.layers;
      if (L) {
        // off / wrong: another layer is active (the goal layer may be hidden); partial: the goal layer is on.
        const ready = spec.startMode === 'partial' || spec.startMode === 'solved';
        m.layer = ready ? L.goal : L.startOn;
        m.hide = [0, 1, 2].map((i) => !ready && i === L.goal && L.startHidden);
      }
      return m;
    },
    error: errorOf,
    facts: factsOf,
    parts: partsOf,
    silent: silentOf,
    retarget: retargetOf,

    tolerance(spec) {
      const t = V[spec.scenario].tolerance(spec);
      if (!spec.level || !(t.tau > 0)) return t;
      const k = tauK(spec);
      return { ...t, tau: t.tau * k, sigma: (t.sigma ?? 2.5 * t.tau) * k };
    },

    instruction(spec, rng) {
      const text = instructionOf(spec, rng);
      if (!spec.layers) return text;
      const lr = rng.fork('layer-clause');
      const name = spec.layers.names[spec.layers.goal];
      const clause = env.instruct.fill(env.instruct.pick(lr, ['Do it on the “{n}” layer.', 'Use the layer named {n} for this.', 'Draw on the {n} layer.',
        'Make sure it lands on the “{n}” layer.', 'Work on the {n} layer.', 'Put it on the layer called {n}.',
        'The target layer is “{n}”.', 'Let {n} be your working layer.', 'This belongs on the {n} layer.',
        'Your work goes on layer {n}.', 'Choose layer {n} before drawing.', 'Have {n} active as you draw.',
        'This task uses layer {n}.'], spec.isplit), { n: name });
      return `${text}${/[.!?]$/.test(text) ? ' ' : '. '}${clause}`;
    },
    plan(model, spec) {
      const L = spec.layers;
      if (L) {
        if (model.hide && model.hide[L.goal]) return { click: { eye: L.goal } };
        if (model.layer !== L.goal) return { click: { layer: L.goal } };
      }
      return planOf(model, spec);
    },
    solve(spec, model) {
      const m = solveOf(spec, model);
      if (spec.layers) Object.assign(m, { layer: spec.layers.goal, hide: [false, false, false] });
      return m;
    },


  });
})();
