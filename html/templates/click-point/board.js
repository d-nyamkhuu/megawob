/*
 * templates / click-point / board: the shared widget code of the design-click-point-* sites (taken from the reference
 * widget click-point/board as those sites had it). A site's widgets/click-point.js is only its design:
 *
 *   env.widget({ task: 'click-point', site, name: 'design', split, scenarios: ['midpoint'], traits?: {...},
 *              template: 'click-point/board', design: { style: { grid: 'plain' }, clear: true, parts: {...} } });
 *
 * Scenarios: center (a circle, ring, disc or arc), midpoint (segment AB), bisect (an angle with two rays and a
 * vertex V), right-angle (the leg BA). A left press on the board places the marker (env.ui.board; each press
 * replaces it); presses outside the board are ignored. Every drawn shape, label and the marker have
 * pointer-events: none. Board units map to px with one isotropic scale and an origin: px = (p - origin) * scale +
 * offset. The base widget's other scenarios (axis, map, path-mid, dense) are not served by any design-* site and
 * are not part of this template.
 *
 * The token defaults and the center preset reproduce design-click-point-center-05 with `design: {}`:
 * the board is H = min(fit, rng.int(440, 600)) px tall, sits at a sampled offset in the stage, and is drawn with
 * the per-seed style (grid, stroke width, point markers, guides, ray ends, labels).
 *
 * Scenario presets (VARIANTS; applied to a widget that declares exactly that scenario, before its design; a token
 * in the design replaces the preset's, an object token whole):
 *   center       {} (design-click-point-center-05, the lineage medoid)
 *   midpoint     { clear: true, alwaysLabels: true, gridPlain: true, pairedLabels: true,
 *                  guideLine: false, dot: { r: 8.5, fill: '#080808' },
 *                  labelAt: { A: [-Math.PI / 2, 26], B: [-Math.PI / 2, 26] } }
 *                (design-click-point-midpoint-08; grid and labels are built in endpoint order)
 *   right-angle  { clear: true, alwaysLabels: true, alwaysC: true,
 *                  style: { point: 'dot', minDash: '2 5' },
 *                  labelAt: { A: [Math.PI / 2, 26], B: [Math.PI / 2, 26] } }
 *                (design-click-point-right-angle-12)
 *   bisect       { camera: true, placeCard: 'none', plainLook: true, alwaysLabels: true, clear: true,
 *                  asideReadout: true } (design-click-point-bisect-01 and -02)
 * Each named site is reproduced exactly with `design: {}` for its scenario. The shared majority features are
 * always-on figure labels for midpoint/right-angle and the fitted plain camera and answer readout for bisect.
 *
 * design tokens (defaults in TOKENS):
 *   plainLook     false: true starts from the plain drawn look (no grid, dot points, guides on, no angle mark,
 *                 arrow ray ends, no fills or edges, stroke 2, dotted min circle '2 5', serif labels) before
 *                 `style` is applied
 *   style         {} assigned over the per-seed style after its draws (the draws are kept): grid ('dots' |
 *                 'lines' | 'plain'), gridStep, sw (stroke width), point ('dot' | 'cross' | 'ring'), guide (dashed
 *                 guides), angleMark, rayEnd ('arrow' | 'dot' | 'none'), minDash, minFill, fill, edges,
 *                 dashOutline, serif (italic serif labels), labelTurn (label angle offset, radians)
 *   gridPlain     false: still draw the grid when the sampled grid style is 'plain'
 *   pairedLabels  false: midpoint letters are drawn immediately after their point (rather than after both)
 *   css           '' extra CSS appended to the template's (classes cp-wrap, cp-board, cp-hint, cp-label, cp-fig,
 *                 cp-mark; .serif on labels)
 *   fitMargin     [72, 80] px taken off the stage height and width to fit the board
 *   fillBoard     false: the board takes the whole fit (the height draw is still consumed)
 *   camera        false: the board shows the figure through a fitted camera (framePoints + padding fill the
 *                 canvas) instead of the whole board; the spec's board units stay the click coordinates
 *   cameraMargin  10 px taken off the stage size for the camera canvas
 *   frameFill     [1, 1] share of the canvas width and height the framed points may use
 *   framePad      .09 board units around the framed points
 *   placeCard     'sampled' | 'draw' (draws kept, board stays put) | 'none' (no draws)
 *   pin           null: [left, top] px the board wrap is pinned to after it is placed
 *   hint          'below' | 'hidden' (kept, display none) | 'stage' (appended to the stage, not the wrap)
 *   boardFill     'var(--panel)' fill of the board backdrop rect ('transparent' for none)
 *   clear         false: true makes the frame's Clear control (env.widgetDef.clear) empty the board
 *   asideReadout  false: true mirrors a press into the frame's `.aside` "Your Answer" box and `.points` counter
 *   alwaysLabels  false: true draws the A / B / V labels (and the figure's labeled look) even when spec.labels is
 *                 false
 *   alwaysC       false: true draws the right-angle marker's C label even when spec.labels is false
 *   hollowA       'labels' | 'always' | 'never': A of right-angle is a hollow point when spec.labels is false /
 *                 always / never
 *   labelAt       null: { A: [angle, off], B: [...], V: [...] } fixed label positions (screen angle in
 *                 radians, off px from the point) instead of the per-seed ones
 *   dot           null: attrs { r, fill, stroke?, ... } of the single circle every point is drawn as
 *   hollowDot     null: the same for the secondary point (default: panel fill, ink ring, r 7)
 *   dotRadii      [8.5, 6] radii of the default point's panel disc and ink dot
 *   guideLine     null | false | attrs: the midpoint segment AB; null: dashed guide when style.guide, false: no
 *                 line, attrs: a solid line with those attributes always
 *   rayStroke     'var(--fg)' stroke of the bisect rays and the right-angle leg
 *   rayDotR       4 radius of the dot at a ray's end (style.rayEnd 'dot')
 *   minCircle     {} attrs assigned over the minimum-length circle's (stroke, stroke-width, stroke-dasharray, ...)
 *   arrow         { back: 14, half: 7, notch: null, fill: 'var(--fg)', stroke: null, chevron: false, width: null,
 *                 round: true } ray arrow head: length, half width, notch depth (4-point head), fill, outline, an
 *                 open chevron drawn with stroke width (width, default style.sw; round caps and joins if round)
 *                 instead of a polygon
 *   rayMarks      null | { frac } | { back } (+ early: true): a marked point and the A / B letters on each ray, at
 *                 frac of the ray's length or back px short of its end, instead of the letters at the ray ends;
 *                 the points are drawn after the vertex, or before their ray's line (under it) if early
 *   circleExtra   {} attrs assigned over the center circle's (class, ...)
 *   arcClass      null: class on the arc outline paths (center)
 *   arcExtra      1: px added to the style stroke width of the arc outline (center)
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part; the replacement takes the part's arguments,
 * and may call base(...) for the default. S reads the live state: S.svg, S.spec, S.style, S.ctx, S.surface,
 * S.scale / S.origin / S.offset (settable), S.D (tokens), S.P (the parts, overrides included). Parts:
 *   px(p) -> [x, y]                 board point -> svg px
 *   layout(ctx) -> { W, H }         svg size; sets scale / origin / offset (camera ? cameraLayout : boardLayout)
 *   boardLayout(ctx)                whole-board scale (draws rng.int(440, 600) for the height)
 *   boardHeight(fit, drawn) -> H    the board height from the fit and the drawn height
 *   canvas(ctx) -> [W, H]           camera canvas size
 *   framePoints() -> points         board points to frame; framePad() -> padding in board units
 *   frame(W, H)                    fit the points isotropically, setting scale and origin
 *   cameraLayout(ctx)               canvas(ctx) -> [W, H], frame(W, H) sets scale / origin from framePoints() +
 *                                   framePad()
 *   placeCard(card, ctx)            places the wrap at a sampled offset (always draws its two floats)
 *   built(ctx, { wrap, board, hint, sync })   after the page is built (default: nothing)
 *   readout(p)                      after the marker is redrawn, p = the point or null (default: nothing)
 *   picked(point)                   after a press placed a point (default: asideReadout)
 *   backdrop(util, W, H)            after the backdrop rect; return true to skip the grid
 *   drawGrid(util, W, H)            backdrop and grid
 *   point(util, g, p, hollow)       a marked point         label(util, g, p, th, text, off)   a letter
 *   figLabel(util, g, p, th, text, off)   a figure letter (labelAt applies)
 *   line(util, g, a, b, attrs)      minCircle(util, g, c)   arcPath(c, r, a0, a1)
 *   drawCenter(util, g)             the center figure
 *   midSegment / midPoints / midLabels(util, g)                       the midpoint figure
 *   bisectAngle(util, g) / bisectRay(util, g, ray) / arrowHead(util, g, end, ray) / bisectPoints(util, g) /
 *   bisectLabels(util, g)                                              the bisect figure (minCircle first)
 *   rayMark(ray) -> [x, y]          board point of a ray's mark         arrowTip(util, g, end, ray) -> [x, y] svg px
 *   raExtension / raLeg / raPoints / raLabels(util, g)                 the right-angle figure (minCircle first)
 *   showMarker(util, model)         redraws the placed marker          toBoard / fromBoard(xy)   click mapping
 *   drawMidpoint / drawBisect / drawRightAngle(util, g)    compose the figure's smaller drawing parts
 *   bindClicks(ctx) -> board        attach the controlled board primitive
 *   locate(target) -> [x, y]
 * An override must keep the rng draws of the parts it replaces (rng.int / pick / bool / float calls, in order), or
 * episodes change for every seed.
 */
(function () {
  'use strict';

  const CSS = `
  .cp-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .cp-board {
    border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--panel);
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.07);
  }
  .cp-board svg { display: block; cursor: crosshair; touch-action: none; }
  .cp-board svg .cp-fig, .cp-board svg .cp-mark { pointer-events: none; }
  .cp-hint { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .cp-hint svg { flex: none; }
  .cp-label { font: 700 16px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg);
    paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round; }
  .cp-label.serif { font: italic 700 18px Georgia, "Times New Roman", "Liberation Serif", serif; }
  `;

  const FILLS = ['#1c7ed6', '#0c8599', '#2f9e44', '#f76707', '#7048e8', '#d6336c'];

  const TOKENS = {
    plainLook: false,
    style: {},
    gridPlain: false,
    pairedLabels: false,
    css: '',
    fitMargin: [72, 80],
    fillBoard: false,
    camera: false,
    cameraMargin: 10,
    frameFill: [1, 1],
    framePad: 0.09,
    placeCard: 'sampled',
    pin: null,
    hint: 'below',
    boardFill: 'var(--panel)',
    clear: false,
    asideReadout: false,
    alwaysLabels: false,
    alwaysC: false,
    hollowA: 'labels',
    labelAt: null,
    dot: null,
    hollowDot: null,
    dotRadii: [8.5, 6],
    guideLine: null,
    rayStroke: 'var(--fg)',
    rayDotR: 4,
    minCircle: {},
    arrow: {},
    arcClass: null,
    arcExtra: 1,
    circleExtra: {},
    rayMarks: null,
  };
  const ARROW = { back: 14, half: 7, notch: null, fill: 'var(--fg)', stroke: null, chevron: false, width: null, round: true };

  const at = (c, th, r) => [c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r];
  const f1 = (v) => v.toFixed(1);

  // What most sites of one scenario share; a widget that declares exactly that scenario starts from it.
  const SCENARIOS = {
    center: {},
    midpoint: {
      clear: true, alwaysLabels: true, gridPlain: true, pairedLabels: true, guideLine: false,
      dot: { r: 8.5, fill: '#080808' },
      labelAt: { A: [-Math.PI / 2, 26], B: [-Math.PI / 2, 26] },
    },
    bisect: { camera: true, placeCard: 'none', plainLook: true, alwaysLabels: true, clear: true, asideReadout: true },
    'right-angle': {
      clear: true, alwaysLabels: true, alwaysC: true, style: { point: 'dot', minDash: '2 5' },
      labelAt: { A: [Math.PI / 2, 26], B: [Math.PI / 2, 26] },
    },
  };

  function installLayout(BASE, S) {
    BASE.boardHeight = (fit, drawn) => (S.D.fillBoard ? fit : Math.min(fit, drawn));

    BASE.boardLayout = (ctx) => {
      const { size, rng } = ctx;
      const aspect = S.spec.board.w / S.spec.board.h;
      const fit = Math.min(size.height - S.D.fitMargin[0], (size.width - S.D.fitMargin[1]) / aspect);
      const H = Math.floor(S.P.boardHeight(fit, rng.int(440, 600)));
      S.scale = H / S.spec.board.h;
      const W = Math.round(S.spec.board.w * S.scale);
      return { W, H };
    };

    BASE.canvas = ({ size }) => [Math.floor(size.width - S.D.cameraMargin), Math.floor(size.height - S.D.cameraMargin)];

    // The points the camera keeps in view, per scenario.
    BASE.framePoints = () => {
      const pts = [];
      const add = (p) => pts.push(p);
      if (S.spec.scenario === 'center') {
        for (const dx of [-1, 1]) for (const dy of [-1, 1]) add([S.spec.c[0] + dx * S.spec.r * 1.45, S.spec.c[1] + dy * S.spec.r * 1.45]);
      } else if (S.spec.scenario === 'midpoint') {
        add(S.spec.a);
        add(S.spec.b);
      } else if (S.spec.scenario === 'bisect') {
        add(S.spec.v);
        for (const ray of S.spec.rays) add(at(S.spec.v, ray.angle, ray.len));
        add(at(S.spec.v, S.spec.bisector, 0.3));
        for (const x of [-1, 1]) for (const y of [-1, 1]) add([S.spec.v[0] + x * S.spec.minLen, S.spec.v[1] + y * S.spec.minLen]);
      } else {
        add(S.spec.a);
        add(S.spec.b);
        for (const dx of [-1, 1]) for (const dy of [-1, 1]) add([S.spec.b[0] + dx * 0.33, S.spec.b[1] + dy * 0.33]);
      }
      return pts;
    };

    BASE.framePad = () => S.D.framePad;

    BASE.frame = (W, H) => {
      const pts = S.P.framePoints();
      const pad = S.P.framePad();
      const x0 = Math.min(...pts.map((p) => p[0])) - pad;
      const x1 = Math.max(...pts.map((p) => p[0])) + pad;
      const y0 = Math.min(...pts.map((p) => p[1])) - pad;
      const y1 = Math.max(...pts.map((p) => p[1])) + pad;
      S.scale = Math.min((W * S.D.frameFill[0]) / (x1 - x0), (H * S.D.frameFill[1]) / (y1 - y0));
      S.origin = [(x0 + x1) / 2 - W / 2 / S.scale, (y0 + y1) / 2 - H / 2 / S.scale];
    };

    BASE.cameraLayout = (ctx) => {
      const [W, H] = S.P.canvas(ctx);
      S.P.frame(W, H);
      return { W, H };
    };

    BASE.layout = (ctx) => (S.D.camera ? S.P.cameraLayout(ctx) : S.P.boardLayout(ctx));

    // Shift the board to a sampled spot inside the stage (the site already varies the stage alignment).
    BASE.placeCard = (card, ctx) => {
      const s = ctx.stage.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      const lo = [s.left - r.left + 4, s.top - r.top + 4];
      const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
      const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -80), Math.min(b, 80))) : 0);
      if (S.D.placeCard === 'draw') {
        pick(lo[0], hi[0]);
        pick(lo[1], hi[1]);
        return;
      }
      card.style.position = 'relative';
      card.style.left = pick(lo[0], hi[0]) + 'px';
      card.style.top = pick(lo[1], hi[1]) + 'px';
    };

    BASE.built = () => {};
    BASE.readout = () => {};

    BASE.picked = (point) => {
      if (!S.D.asideReadout) return;
      const answer = document.querySelector('.aside');
      if (answer && answer.querySelector('h3')?.textContent === 'Your Answer') {
        const ps = answer.querySelectorAll('p');
        ps[0].textContent = 'Point selected.';
        ps[1].textContent = 'X: ' + point[0].toFixed(3);
        ps[2].textContent = 'Y: ' + point[1].toFixed(3);
      }
      const counter = document.querySelector('.points');
      if (counter) counter.textContent = 'Points: 1/1';
    };
  }

  function installDrawing(BASE, S) {
    BASE.backdrop = () => false;

    BASE.drawGrid = (util, W, H) => {
      util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.D.boardFill }, S.svg);
      if (S.P.backdrop(util, W, H)) return;
      if (S.style.grid === 'plain' && !S.D.gridPlain) return;
      const step = S.style.gridStep;
      const defs = util.svg('defs', {}, S.svg);
      const pat = util.svg('pattern', { id: 'cp-grid', width: step, height: step, patternUnits: 'userSpaceOnUse' }, defs);
      if (S.style.grid === 'dots') util.svg('circle', { cx: step / 2, cy: step / 2, r: 1.4, fill: 'var(--line)' }, pat);
      else util.svg('path', { d: `M ${step} 0 L 0 0 0 ${step}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
      util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#cp-grid)' }, S.svg);
    };

    // A marked point in the current point style; `hollow` for the secondary point (A in right-angle).
    BASE.point = (util, g, p, hollow) => {
      const [x, y] = S.P.px(p);
      const ink = 'var(--fg)';
      if (hollow) {
        if (S.D.hollowDot) util.svg('circle', { cx: x, cy: y, ...S.D.hollowDot }, g);
        else util.svg('circle', { cx: x, cy: y, r: 7, fill: 'var(--panel)', stroke: ink, 'stroke-width': 2.5 }, g);
        return;
      }
      if (S.D.dot) {
        util.svg('circle', { cx: x, cy: y, ...S.D.dot }, g);
        return;
      }
      if (S.style.point === 'cross') {
        const k = 7;
        util.svg('circle', { cx: x, cy: y, r: 10, fill: 'var(--panel)', opacity: 0.85 }, g);
        for (const [dx, dy] of [[k, k], [k, -k]]) {
          util.svg('line', { x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy, stroke: ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
        }
        return;
      }
      if (S.style.point === 'ring') {
        util.svg('circle', { cx: x, cy: y, r: 8, fill: 'var(--panel)', stroke: ink, 'stroke-width': 2 }, g);
        util.svg('circle', { cx: x, cy: y, r: 3, fill: ink }, g);
        return;
      }
      util.svg('circle', { cx: x, cy: y, r: S.D.dotRadii[0], fill: 'var(--panel)' }, g);
      util.svg('circle', { cx: x, cy: y, r: S.D.dotRadii[1], fill: ink }, g);
    };

    // Text `off` px from p in screen direction th, kept inside the board.
    BASE.label = (util, g, p, th, text, off = 22) => {
      const [x, y] = S.P.px(p);
      const W = S.spec.board.w * S.scale;
      const H = S.spec.board.h * S.scale;
      const lx = Math.min(W - 14, Math.max(14, x + Math.cos(th) * off));
      const ly = Math.min(H - 12, Math.max(14, y + Math.sin(th) * off));
      const t = util.svg('text', { x: f1(lx), y: f1(ly), class: `cp-label${S.style.serif ? ' serif' : ''}`, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
      t.textContent = text;
    };

    // A letter of the figure: at the per-seed angle, or at the design's fixed spot.
    BASE.figLabel = (util, g, p, th, text, off) => {
      const fixed = S.D.labelAt && S.D.labelAt[text];
      if (fixed) S.P.label(util, g, p, fixed[0], text, fixed[1]);
      else S.P.label(util, g, p, th, text, off);
    };

    BASE.line = (util, g, a, b, attrs) => {
      const [x1, y1] = S.P.px(a);
      const [x2, y2] = S.P.px(b);
      return util.svg('line', { x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), 'stroke-linecap': 'round', ...attrs }, g);
    };

    BASE.minCircle = (util, g, c) => {
      const [x, y] = S.P.px(c);
      util.svg('circle', {
        cx: f1(x), cy: f1(y), r: f1(S.spec.minLen * S.scale), fill: S.style.minFill ? 'var(--line)' : 'none', 'fill-opacity': 0.25,
        stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': S.style.minDash, opacity: 0.9, ...S.D.minCircle,
      }, g);
    };

    BASE.arcPath = (c, r, a0, a1) => env.templateLib('click-point/_geometry').arcPath(at, f1, c, r, a0, a1);
  }

  function installFigures(BASE, S) {
    BASE.drawCenter = (util, g) => {
      const c = S.P.px(S.spec.c);
      const r = S.spec.r * S.scale;
      const sw = S.style.sw;
      if (S.spec.shape === 'circle') {
        util.svg('circle', { cx: f1(c[0]), cy: f1(c[1]), r: f1(r), fill: 'none', stroke: 'var(--fg)', 'stroke-width': sw, 'stroke-dasharray': S.style.dashOutline ? '10 6' : 'none', ...S.D.circleExtra }, g);
      } else if (S.spec.shape === 'ring') {
        const w = S.spec.ringWidth * S.scale;
        util.svg('circle', { cx: f1(c[0]), cy: f1(c[1]), r: f1(r), fill: 'none', stroke: S.style.fill, 'stroke-width': f1(w), opacity: 0.8 }, g);
        if (S.style.edges) {
          for (const rr of [r - w / 2, r + w / 2]) util.svg('circle', { cx: f1(c[0]), cy: f1(c[1]), r: f1(rr), fill: 'none', stroke: 'var(--fg)', 'stroke-width': 1.5 }, g);
        }
      } else if (S.spec.shape === 'disc') {
        util.svg('circle', { cx: f1(c[0]), cy: f1(c[1]), r: f1(r), fill: S.style.fill, 'fill-opacity': 0.75, stroke: S.style.edges ? 'var(--fg)' : 'none', 'stroke-width': 2 }, g);
      } else {
        const a0 = S.spec.arc.start;
        const a1 = a0 + S.spec.arc.span;
        const cls = S.D.arcClass ? { class: S.D.arcClass } : {};
        util.svg('path', { d: S.P.arcPath(c, r, a0, a1), fill: 'none', stroke: 'var(--fg)', 'stroke-width': sw + S.D.arcExtra, 'stroke-linecap': S.style.edges ? 'butt' : 'round', ...cls }, g);
        if (S.style.edges) {
          for (const a of [a0, a1]) {
            const p = at(c, a, r - 7);
            const q = at(c, a, r + 7);
            util.svg('line', { x1: f1(p[0]), y1: f1(p[1]), x2: f1(q[0]), y2: f1(q[1]), stroke: 'var(--fg)', 'stroke-width': 2, ...cls }, g);
          }
        }
      }
    };

    // midpoint: segment AB, both ends, letters.
    BASE.midSegment = (util, g) => {
      if (S.D.guideLine === false) return;
      if (S.D.guideLine) S.P.line(util, g, S.spec.a, S.spec.b, S.D.guideLine);
      else if (S.style.guide) S.P.line(util, g, S.spec.a, S.spec.b, { stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.8 });
    };
    BASE.midPoints = (util, g) => {
      for (const [p, text] of [[S.spec.a, 'A'], [S.spec.b, 'B']]) {
        S.P.point(util, g, p);
        if (S.D.pairedLabels && (S.spec.labels || S.D.alwaysLabels)) S.P.figLabel(util, g, p, -Math.PI / 2, text, 26);
      }
    };
    BASE.midLabels = (util, g) => {
      if (S.D.pairedLabels || !(S.spec.labels || S.D.alwaysLabels)) return;
      const th = Math.atan2(S.spec.b[1] - S.spec.a[1], S.spec.b[0] - S.spec.a[0]);
      S.P.figLabel(util, g, S.spec.a, th + Math.PI + S.style.labelTurn, 'A');
      S.P.figLabel(util, g, S.spec.b, th - S.style.labelTurn, 'B');
    };
  }

  function installBisect(BASE, S) {
    BASE.bisectAngle = (util, g) => {
      if (!S.style.angleMark) return;
      const [r0, r1] = S.spec.rays;
      const rr = Math.min(0.055, S.spec.minLen * 0.55) * S.scale;
      util.svg('path', { d: S.P.arcPath(S.P.px(S.spec.v), rr, r0.angle, r1.angle), fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5 }, g);
    };
    // Where the arrow's tip is, in svg px (a design may draw an end cap and move the tip out).
    BASE.arrowTip = (util, g, end) => S.P.px(end);
    BASE.arrowHead = (util, g, end, ray) => {
      const tip = S.P.arrowTip(util, g, end, ray);
      const back = at(tip, ray.angle, -S.A.back);
      const n = ray.angle + Math.PI / 2;
      const h1 = at(back, n, S.A.half);
      const h2 = at(back, n, -S.A.half);
      if (S.A.chevron) {
        util.svg('polyline', {
          points: [h1, tip, h2].map((p) => p.map(f1).join(',')).join(' '), fill: 'none', stroke: 'var(--fg)',
          'stroke-width': S.A.width === null ? S.style.sw : S.A.width, ...(S.A.round ? { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } : {}),
        }, g);
        return;
      }
      const pts = S.A.notch === null ? [tip, h1, h2] : [tip, h1, at(tip, ray.angle, -S.A.notch), h2];
      util.svg('polygon', { points: pts.map((p) => p.map(f1).join(',')).join(' '), fill: S.A.fill, ...(S.A.stroke ? { stroke: S.A.stroke, 'stroke-width': 1 } : {}) }, g);
    };
    BASE.bisectRay = (util, g, ray) => {
      const v = S.spec.v;
      const end = at(v, ray.angle, ray.len);
      if (S.D.rayMarks && S.D.rayMarks.early) S.P.point(util, g, S.P.rayMark(ray));
      S.P.line(util, g, v, end, { stroke: S.D.rayStroke, 'stroke-width': S.style.sw });
      if (S.style.rayEnd === 'arrow') {
        S.P.arrowHead(util, g, end, ray);
      } else if (S.style.rayEnd === 'dot') {
        const e = S.P.px(end);
        util.svg('circle', { cx: f1(e[0]), cy: f1(e[1]), r: S.D.rayDotR, fill: 'var(--fg)' }, g);
      }
    };
    // Where a ray's mark (and its letter) sits: the ray's end, or a point on the ray (rayMarks).
    BASE.rayMark = (ray) => {
      const m = S.D.rayMarks;
      if (!m) return at(S.spec.v, ray.angle, ray.len);
      return at(S.spec.v, ray.angle, m.frac !== undefined ? ray.len * m.frac : Math.max(0, ray.len - m.back / S.scale));
    };
    BASE.bisectPoints = (util, g) => {
      S.P.point(util, g, S.spec.v);
      if (S.D.rayMarks && !S.D.rayMarks.early) for (const ray of S.spec.rays) S.P.point(util, g, S.P.rayMark(ray));
    };
    BASE.bisectLabels = (util, g) => {
      if (!(S.spec.labels || S.D.alwaysLabels)) return;
      const v = S.spec.v;
      const [r0, r1] = S.spec.rays;
      S.P.figLabel(util, g, S.P.rayMark(r0), r0.angle, 'A', 18);
      S.P.figLabel(util, g, S.P.rayMark(r1), r1.angle, 'B', 18);
      S.P.figLabel(util, g, v, S.spec.bisector + Math.PI + S.style.labelTurn, 'V', 24);
    };
    BASE.drawBisect = (util, g) => {
      S.P.minCircle(util, g, S.spec.v);
      S.P.bisectAngle(util, g);
      for (const ray of S.spec.rays) S.P.bisectRay(util, g, ray);
      S.P.bisectPoints(util, g);
      S.P.bisectLabels(util, g);
    };
  }

  function installRightAngle(BASE, S) {
    BASE.raExtension = (util, g) => {
      if (!S.style.guide) return;
      const far = 2;
      S.P.line(util, g, at(S.spec.b, S.raTheta(), -far), at(S.spec.b, S.raTheta(), far), { stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '4 6', opacity: 0.7 });
    };
    BASE.raLeg = (util, g) => {
      S.P.line(util, g, S.spec.b, S.spec.a, { stroke: S.D.rayStroke, 'stroke-width': S.style.sw });
    };
    BASE.raPoints = (util, g) => {
      const hollow = S.D.hollowA === 'always' ? true : S.D.hollowA === 'never' ? false : !S.spec.labels;
      S.P.point(util, g, S.spec.a, hollow);
      S.P.point(util, g, S.spec.b);
    };
    BASE.raLabels = (util, g) => {
      if (!(S.spec.labels || S.D.alwaysLabels)) return;
      const th = S.raTheta();
      S.P.figLabel(util, g, S.spec.a, th + S.style.labelTurn, 'A');
      S.P.figLabel(util, g, S.spec.b, th + Math.PI + S.style.labelTurn, 'B');
    };
    BASE.drawRightAngle = (util, g) => {
      S.P.minCircle(util, g, S.spec.b);
      S.P.raExtension(util, g);
      S.P.raLeg(util, g);
      S.P.raPoints(util, g);
      S.P.raLabels(util, g);
    };
    BASE.drawMidpoint = (util, g) => {
      S.P.midSegment(util, g);
      S.P.midPoints(util, g);
      S.P.midLabels(util, g);
    };
  }

  function installMarker(BASE, S) {
    const vertex = () => {
      if (S.spec.scenario === 'bisect') return S.spec.v;
      if (S.spec.scenario === 'right-angle') return S.spec.b;
      return null;
    };

    BASE.showMarker = (util, model) => {
      S.markG.replaceChildren();
      const p = model && model.point;
      S.P.readout(p);
      if (!p) return;
      const [x, y] = S.P.px(p);
      const vtx = vertex();
      if (vtx) S.P.line(util, S.markG, vtx, p, { stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      if (S.spec.scenario === 'right-angle' && (S.spec.labels || S.D.alwaysC)) {
        S.P.label(util, S.markG, p, Math.atan2(p[1] - vtx[1], p[0] - vtx[0]) + S.style.labelTurn, 'C', 26);
      }
      util.svg('circle', { cx: f1(x), cy: f1(y), r: 9, fill: 'none', stroke: 'var(--panel)', 'stroke-width': 5, opacity: 0.9 }, S.markG);
      util.svg('circle', { cx: f1(x), cy: f1(y), r: 9, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        util.svg('line', { x1: f1(x - dx * 14), y1: f1(y - dy * 14), x2: f1(x - dx * 4), y2: f1(y - dy * 4), stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
        util.svg('line', { x1: f1(x + dx * 4), y1: f1(y + dy * 4), x2: f1(x + dx * 14), y2: f1(y + dy * 14), stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
      }
      util.svg('circle', { cx: f1(x), cy: f1(y), r: 1.6, fill: 'var(--accent)' }, S.markG);
    };

    BASE.toBoard = ([x, y]) => {
      const r = S.svg.getBoundingClientRect();
      return [(x - r.left - S.offset[0]) / S.scale + S.origin[0], (y - r.top - S.offset[1]) / S.scale + S.origin[1]];
    };
    BASE.fromBoard = ([bx, by]) => {
      const r = S.svg.getBoundingClientRect();
      return [r.left + (bx - S.origin[0]) * S.scale + S.offset[0], r.top + (by - S.origin[1]) * S.scale + S.offset[1]];
    };

    // Mechanics come from env.ui.board: a press inside the svg places the point (board units, clamped).
    BASE.bindClicks = (ctx) => {
      const { util } = ctx;
      return env.ui.board(S.svg, {
        toBoard: (xy) => S.P.toBoard(xy),
        fromBoard: (xy) => S.P.fromBoard(xy),
        bounds: { x0: 0, y0: 0, x1: S.spec.board.w, y1: S.spec.board.h },
        value: ctx.model.point,
        onChange: (point) => {
          ctx.update({ point });
          S.P.picked(point);
          S.P.showMarker(util, ctx.model);
        },
        label: 'board',
      });
    };

    BASE.locate = (t) => {
      if (!t || !t.point) throw new Error(`click-point/board cannot locate ${JSON.stringify(t)}`);
      return S.surface.locate(t.point);
    };
  }

  function renderBoard(S, ctx) {
    S.ensureStyle();
    const { util, rng } = ctx;
    S.ctxRef = ctx;
    S.spec = ctx.spec;
    S.origin = [0, 0];
    S.offset = [0, 0];
    S.style = {
      grid: rng.pick(['dots', 'lines', 'lines', 'plain']),
      gridStep: rng.int(20, 32),
      sw: rng.pick([2, 2.5, 3, 4]),
      point: rng.pick(['dot', 'dot', 'cross', 'ring']),
      guide: rng.bool(0.5),
      angleMark: rng.bool(0.6),
      rayEnd: rng.pick(['arrow', 'dot', 'none']),
      minDash: rng.pick(['2 5', '5 5', '1 4']),
      minFill: rng.bool(0.4),
      fill: rng.pick(FILLS),
      edges: rng.bool(0.5),
      dashOutline: rng.bool(0.2),
      serif: rng.bool(0.3),
      labelTurn: rng.float(-0.7, 0.7),
    };
    // The base widget's draws for its other scenarios (ruler fill, minor grid, series markers, map colors,
    // graticule, street casing and width) stay, so every seed keeps its stream.
    rng.pick(['#f6e7b0', '#e9eef3', '#f3f0e6', '#dfe9d8']);
    rng.bool(0.5);
    rng.bool(0.6);
    rng.pick(['#b9d6ea', '#a9cbe3', '#c3dcec']);
    rng.pick(['#e9e4d0', '#e4ead2', '#efe9dc']);
    rng.pick(['rgba(40,60,90,.45)', 'rgba(20,20,20,.35)']);
    rng.pick(['none', '4 4']);
    rng.pick(['#c9c3b3', '#bfc5cc']);
    rng.int(7, 11);
    if (S.D.plainLook) {
      Object.assign(S.style, {
        grid: 'plain', sw: 2, point: 'dot', guide: true, angleMark: false, rayEnd: 'arrow', minDash: '2 5',
        minFill: false, fill: 'var(--fg)', edges: false, dashOutline: false, serif: true,
      });
    }
    Object.assign(S.style, S.D.style);

    const { W, H } = S.P.layout(ctx);
    const wrap = util.el('div', 'cp-wrap', ctx.stage);
    const board = util.el('div', 'cp-board', wrap);
    S.svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, board);
    S.svg.dataset.role = 'board';
    S.P.drawGrid(util, W, H);
    const g = util.svg('g', { class: 'cp-fig' }, S.svg);
    if (S.spec.scenario === 'center') S.P.drawCenter(util, g);
    else if (S.spec.scenario === 'midpoint') S.P.drawMidpoint(util, g);
    else if (S.spec.scenario === 'bisect') S.P.drawBisect(util, g);
    else S.P.drawRightAngle(util, g);
    S.markG = util.svg('g', { class: 'cp-mark' }, S.svg);
    S.P.showMarker(util, ctx.model);
    S.surface = S.P.bindClicks(ctx);

    const hint = util.el('div', 'cp-hint', S.D.hint === 'stage' ? ctx.stage : wrap);
    hint.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="9" cy="9" r="1.6" fill="var(--accent)"/></svg>';
    util.el('span', '', hint, rng.pick(['Click on the board to place the marker. Clicking again moves it.',
      'Click to drop a marker; click again to move it.', 'One click places the marker.']));
    if (S.D.hint === 'hidden') hint.style.display = 'none';
    const sync = (m) => {
      S.surface.set(m.point);
      S.P.showMarker(util, m);
    };
    if (S.D.placeCard !== 'none') S.P.placeCard(wrap, ctx);
    if (S.D.pin) {
      wrap.style.left = S.D.pin[0] + 'px';
      wrap.style.top = S.D.pin[1] + 'px';
    }
    S.P.built(ctx, { wrap, board, hint, sync });
    return { anchors: [S.svg], sync };
  }

  env.template('click-point/board', (design, def) => {
    let D;
    let P;
    let svg;
    let scale;
    let origin = [0, 0];
    let offset = [0, 0];
    let spec;
    let markG;
    let style;
    let surface;
    let ctxRef;
    const BASE = {};
    const S = {
      get svg() { return svg; },
      get scale() { return scale; },
      set scale(v) { scale = v; },
      get origin() { return origin; },
      set origin(v) { origin = v; },
      get offset() { return offset; },
      set offset(v) { offset = v; },
      get spec() { return spec; },
      get style() { return style; },
      get ctx() { return ctxRef; },
      get surface() { return surface; },
      at, f1,
      get D() { return D; },
      get P() { return P; },
      set svg(v) { svg = v; },
      set spec(v) { spec = v; },
      set style(v) { style = v; },
      set surface(v) { surface = v; },
      get markG() { return markG; }, set markG(v) { markG = v; },
      get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
      get A() { return A; },
      get raTheta() { return raTheta; },
      get ensureStyle() { return ensureStyle; },
    };

    function ensureStyle() {
      if (document.getElementById('cp-style')) return;
      const s = document.createElement('style');
      s.id = 'cp-style';
      s.textContent = CSS + D.css;
      document.head.append(s);
    }

    BASE.px = (p) => [(p[0] - origin[0]) * scale + offset[0], (p[1] - origin[1]) * scale + offset[1]];

    // ------------------------------------------------------------ layout

    installLayout(BASE, S);

    // ------------------------------------------------------------ drawing

    installDrawing(BASE, S);

    installFigures(BASE, S);

    // bisect: min circle, angle mark, the rays with their ends, the vertex, letters.
    installBisect(BASE, S);

    // right-angle: min circle, extension of AB, the leg BA, points A (hollow without labels) and B, letters.
    const raTheta = () => Math.atan2(spec.a[1] - spec.b[1], spec.a[0] - spec.b[0]);
    installRightAngle(BASE, S);

    // ------------------------------------------------------------ marker and clicks

    installMarker(BASE, S);

    ({ D, P } = env.templateDesign('click-point/board', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    const A = { ...ARROW, ...D.arrow };

    const widget = {
      render(ctx) { return renderBoard(S, ctx); },

      locate(t) {
        return P.locate(t);
      },
    };

    if (D.clear) {
      widget.clear = () => {
        if (!ctxRef || !surface) return;
        ctxRef.update({ point: null });
        surface.set(null);
        P.showMarker(ctxRef.util, ctxRef.model);
      };
    }
    return widget;
  }, { uses: ['click-point/_geometry'] });
})();
