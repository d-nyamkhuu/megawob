/*
 * templates / draw / canvas: the SVG single-stroke board from draw/L1's medoid,
 * design-draw-shape-line-01. Scenarios: line, circle, trace. Holding the left button records
 * a stroke; starting another replaces it. Geometry is isotropic and sized from ctx.size.
 * The wrapper's unreachable chalkboard widget and tool/signature/connect/erase/multi/polygon
 * builders are omitted: none of these 36 sites can register or sample them.
 *
 * Defaults without a scenario preset reproduce design-draw-shape-line-01. With design {} and
 * the site's original identity/traits, scenario presets reproduce these existing sites:
 *   line: design-draw-shape-line-04; circle: design-draw-shape-circle-08; trace: design-draw-shape-trace-05.
 * The line/circle presets enable sampled height, a sampled grid and seeded placement
 * (10/12 line, 11/12 circle sites); line uses a panel r9 dot plus a #050606 r10 dot, no halo.
 * Circle returns its Clear method. Trace uses a smooth, single-layer guide (10/12), a
 * single r17.5 #009d3c start circle (11/12), Start text (12/12), class dw-label, offset 30,
 * and a #81858f width-4 guide with dash 26 16 and butt caps. Its #464b55 arrowhead is
 * 30px long and 16px wide on each side; its end label says Arrowhead.
 * Full variation counts and exceptional sites: README.md in this folder.
 *
 * Tokens (defaults below; object/array tokens replace the whole value):
 *   css: ''                     additional structural CSS, appended after the original CSS
 *   labelFont: system 700 15px  font shorthand of .dw-label (see TOKENS for the task list)
 *   grid: 'plain'               'plain', 'dots', 'lines'; null draws a seeded choice of all three
 *   background: 'var(--panel)'  SVG background rectangle fill
 *   gridAttrs: {}               additional attributes of the grid's covering rectangle
 *   reserveH: 54, insetW: 32    stage space excluded when fitting the SVG
 *   sampleHeight: null          null: no draw; [min,max]: rng.int before building the SVG
 *   sampleFactor: 1             multiply that sampled height before applying the cap
 *   capHeight: true             cap the fitted height by the sampled height (still draw if false)
 *   scaleGutter: 0              pixels below the scored geometry, within SVG height
 *   seededPlace: false          sample wrapper placement from ctx.rng.fork('place')
 *   dotLayers: [{r:9,fill:panel},{r:6.5,fill:fg}]  ordered attributes of solid marker circles
 *   hollowAttrs: {r:7.5,fill:panel,stroke:fg,stroke-width:2.5}  hollow marker circle
 *   labelOffset: 20             default distance in pixels from marker to label
 *   labelInsets: [16,16,14,10]  label clamp insets: left, right, top, bottom
 *   connectDirection: null      null: outward along A-B; [dx,dy]: direction of both labels
 *   connectOffset: null         A/B label offset (null: labelOffset)
 *   haloAttrs: r15, fill none, muted stroke width 1.5, dash '3 4'; null omits the dot halo
 *   circleAttrs: fill none, muted stroke width 2, dash '8 7', opacity .8; excludes cx/cy/r
 *   circleBoth: false           also draw the circle guide when spec.show is 'both'
 *   rimOnGuide: false           true: add a hollow rim; 'spec': only when spec.rimDot is true
 *   startDot: false             argument passed as hollow to dot for a trace start (e.g. 'start')
 *   startText: 'start', startClass: 'dw-small', startDirection: null, startOffset: 24
 *                               trace label text, class, direction (null: outward) and offset
 *   smooth: false              true: cubic guide; false: polyline guide
 *   guideLayers: muted width 16, round caps/joins, opacity .18; then muted width 2,
 *                dash '6 6', round joins; ordered guide attributes, excluding points/d/fill
 *   headLength: 18, headWidth: 9 arrowhead length and half-width in pixels
 *   headAttrs: fg, panel outline 1.5, round joins (TOKENS)  arrowhead polygon attributes
 *   endText: null               null: omit end label; string (including ''): draw a label
 *   ink: 'var(--accent)'        stroke color (the original rng.pick still chooses its width)
 *   clearTarget: 'widget'         'widget': install at render; 'returned': return a widget method;
 *                               'none': no Clear method
 *   clearLog: false             log 'clear' before updating
 *   clearInkFirst: false        clear ink before ctx.update instead of synchronizing afterwards
 *   clearPreserve: false        preserve other model fields when clearing strokes
 *
 * Parts: design.parts[name] = (base, S) => replacement. All inner calls use resolved P.
 * S exposes ctx, spec, geo (settable), wrap, board, svg, B, view, pen, stroke, D, P, fmtPx,
 * unit(a,b). All are live getters except the two pure helpers. geo = {W,H,scale,x?,y?};
 * optional x/y translate model coordinates inside the SVG. B = {ctx,svg,W,H,scale,px,
 * toBoard,frame,hintEl,hint(text,swatch=true),up(model),bar:null,foot:null}.
 *   style() -> string          original CSS with labelFont and appended css
 *   begin(ctx)                 before layout (noop; adapt frame instructions here)
 *   fit(ctx) -> geo            stage fit and optional sampled cap; preserves height draw
 *   wrap(ctx) -> element       create .dw-wrap at 0,0 in ctx.stage
 *   px(point) -> [x,y]         model -> SVG pixels
 *   toBoard([x,y]), fromBoard(point) -> point   viewport <-> model (unrounded)
 *   frame() -> stroke options  uses toBoard/fromBoard and spec.board bounds
 *   grid(B)                    background, optional seeded pattern (no return value)
 *   dot(util,g,px,p,hollow)     layered solid circle or hollow marker
 *   label(util,g,px,W,H,p,d,text,cls?,off?)  draw clamped text (return value unused)
 *   line(B,g), circle(B,g), trace(B,g)  draw scenario targets, through the smaller parts
 *   lineGuide(B,g)             angle-mode guide line, endpoints and 'guide' label
 *   curve(path,px) -> string   smooth cubic SVG path through the scored polyline
 *   guide(B,g,path)            draw ordered guide layers
 *   headGeometry(B,path) -> {tip,d,head}  arrowhead points and final segment direction
 *   arrowHead(B,g,geometry) -> element   draw polygon using headAttrs
 *   endLabel(B,g,geometry)     draw endText label, if enabled
 *   arrowPath(B,g,path)        guide, arrowhead and end label, in that order
 *   penCreated(B,pen)          before binding stroke (noop; detached preview/tool hooks)
 *   ink(points,B,pen)          redraw the pen polyline for the last stroke
 *   strokeOptions(B,pen) -> object  pointer frame and model callbacks for env.ui.stroke
 *   strokeReady(B,pen,stroke)  after binding stroke, before the hint draw (noop)
 *   build(B) -> {sync,locate}  grid, targets, pen, stroke and seeded hint, in draw order
 *   hint(B,text,swatch=true)   draw hint spans
 *   clear()                    clear scored strokes and ink, respecting the clear tokens
 *   controls(B,view)           install widget Clear when requested
 *   place(wrap,ctx,rng)        seeded placement if enabled; rng is the 'place' fork
 *   rendered(ctx)             after sync, hint sizing and placement (noop)
 * No DOM work happens in the factory. Overrides keep every original rng draw in order;
 * extra decoration randomness must use its own named fork.
 */
(function () {
  'use strict';

  const CSS = `
  .dw-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .dw-board {
    border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--panel);
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.07);
  }
  .dw-board svg { display: block; cursor: crosshair; touch-action: none; user-select: none; -webkit-user-select: none; }
  .dw-hint { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; max-width: 100%; text-align: center; }
  .dw-hint .dw-swatch { flex: none; display: inline-block; width: 22px; height: 4px; border-radius: 2px; background: var(--accent); }
  .dw-label { font: 700 15px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg);
    paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round; pointer-events: none; }
  .dw-small { font: 600 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--muted);
    paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round;
    text-transform: uppercase; letter-spacing: .06em; pointer-events: none; }
  .dw-bar { display: flex; align-items: center; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 10px;
    background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.05); max-width: 100%; }
  .dw-bar .sep { width: 1px; height: 24px; background: var(--line); margin: 0 4px; }
  .dw-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: 7px; border: 1px solid transparent;
    background: transparent; color: var(--fg); font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; cursor: pointer; white-space: nowrap; }
  .dw-btn svg { width: 17px; height: 17px; flex: none; }
  .dw-btn:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .dw-btn[aria-pressed="true"] { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 45%, transparent); color: var(--accent); }
  .dw-btn kbd { font: 600 10px ui-monospace, Menlo, Consolas, monospace; color: var(--muted); border: 1px solid var(--line); border-radius: 4px; padding: 0 4px; }
  .dw-btn:disabled { opacity: .45; cursor: default; }
  .dw-foot { display: flex; align-items: center; gap: 10px; }
  .dw-foot .dw-btn { border-color: var(--line); height: 36px; padding: 0 16px; }
  .dw-foot .dw-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .dw-foot .dw-btn.primary:disabled { background: color-mix(in srgb, var(--fg) 25%, var(--panel)); border-color: transparent; }
  .dw-foot .dw-ok { font-size: 13px; font-weight: 600; color: #2b8a3e; }
  .dw-node rect { fill: var(--panel); stroke: color-mix(in srgb, var(--fg) 35%, var(--line)); stroke-width: 1.5; }
  .dw-node text { font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
  .dw-port { fill: var(--panel); stroke: var(--accent); stroke-width: 2.5; cursor: crosshair; }
  .dw-port:hover { fill: var(--accent); }
  .dw-edge path.e { fill: none; stroke: color-mix(in srgb, var(--fg) 60%, transparent); stroke-width: 2.2; pointer-events: stroke; }
  .dw-edge .del { opacity: .5; cursor: pointer; }
  .dw-edge:hover .del, .dw-edge .del:hover { opacity: 1; }
  .dw-edge .del circle { fill: var(--panel); stroke: #c92a2a; stroke-width: 1.5; }
  .dw-edge .del path { stroke: #c92a2a; stroke-width: 2; stroke-linecap: round; }
  .dw-rubber { stroke: var(--accent); stroke-width: 2; stroke-dasharray: 6 5; fill: none; pointer-events: none; }
  .dw-doc { font: 13px Georgia, "Times New Roman", serif; fill: color-mix(in srgb, var(--fg) 75%, transparent); pointer-events: none; }
  .dw-doc.t { font: 700 19px Georgia, "Times New Roman", serif; fill: var(--fg); }
  .dw-street { font: 600 11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #5c5f66; paint-order: stroke; stroke: #f3f1ea; stroke-width: 3px; pointer-events: none; }
  .dw-pin text { font: 700 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
  .dw-pin { pointer-events: none; }
  .dw-area { font: 700 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #2c3e2f; text-anchor: middle; paint-order: stroke; stroke: rgba(255,255,255,.75); stroke-width: 3px; pointer-events: none; }
  `;

  const TOKENS = {
    css: '', labelFont: '700 15px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    grid: 'plain', background: 'var(--panel)', gridAttrs: {},
    reserveH: 54, insetW: 32, sampleHeight: null, sampleFactor: 1, capHeight: true, scaleGutter: 0,
    seededPlace: false,
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 6.5, fill: 'var(--fg)' }],
    hollowAttrs: { r: 7.5, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 },
    labelOffset: 20, labelInsets: [16, 16, 14, 10], connectDirection: null, connectOffset: null,
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    circleAttrs: { fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '8 7', opacity: 0.8 },
    circleBoth: false, rimOnGuide: false,
    startDot: false, startText: 'start', startClass: 'dw-small', startDirection: null, startOffset: 24,
    smooth: false,
    guideLayers: [
      { stroke: 'var(--muted)', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.18 },
      { stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '6 6', 'stroke-linejoin': 'round' },
    ],
    headLength: 18, headWidth: 9,
    headAttrs: { fill: 'var(--fg)', stroke: 'var(--panel)', 'stroke-width': 1.5, 'stroke-linejoin': 'round' },
    endText: null, ink: 'var(--accent)',
    clearTarget: 'widget', clearLog: false, clearInkFirst: false, clearPreserve: false,
  };
  const SCENARIOS = {
    line: {
      grid: null, sampleHeight: [400, 600], seededPlace: true,
      dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 10, fill: '#050606' }], haloAttrs: null,
    },
    circle: { grid: null, sampleHeight: [400, 600], seededPlace: true, clearTarget: 'returned' },
    trace: {
      dotLayers: [{ r: 17.5, fill: '#009d3c' }], smooth: true,
      guideLayers: [{ stroke: '#81858f', 'stroke-width': 4, 'stroke-dasharray': '26 16', 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' }],
      headLength: 30, headWidth: 16, headAttrs: { fill: '#464b55', 'stroke-linejoin': 'round' },
      endText: 'Arrowhead', startText: 'Start', startClass: 'dw-label', startOffset: 30,
    },
  };

  const fmtPx = (pts, px) => pts.map((p) => px(p).map((v) => v.toFixed(1)).join(',')).join(' ');
  const unit = (a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };

  env.template('draw-shape/canvas', (design, def) => {
    let D, P, ctxRef, geo, wrap, board, svg, B, view, pen, stroke;
    const BASE = {};
    const S = {
      get D() { return D; }, get P() { return P; }, get ctx() { return ctxRef; },
      get spec() { return ctxRef.spec; }, get geo() { return geo; }, set geo(g) { geo = g; },
      get wrap() { return wrap; }, get board() { return board; }, get svg() { return svg; },
      get B() { return B; }, get view() { return view; }, get pen() { return pen; }, get stroke() { return stroke; },
      fmtPx, unit,
    };

    defineBoardParts();
    defineTargetParts();
    defineStrokeParts();

    function defineBoardParts() {
      BASE.style = () => CSS.replace('700 15px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', D.labelFont) + D.css;
      BASE.begin = () => {};
      BASE.fit = (ctx) => {
        const { size, spec, rng } = ctx;
        const fit = Math.min(size.height - D.reserveH, (size.width - D.insetW) / (spec.board.w / spec.board.h));
        const sampled = D.sampleHeight ? rng.int(...D.sampleHeight) * D.sampleFactor : Infinity;
        const H = Math.max(120, Math.floor(D.capHeight ? Math.min(fit, sampled) : fit));
        const scale = (H - D.scaleGutter) / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      };
      BASE.wrap = (ctx) => {
        const el = ctx.util.el('div', 'dw-wrap', ctx.stage);
        el.style.left = '0px';
        el.style.top = '0px';
        return el;
      };
      BASE.px = (p) => [geo.x === undefined ? p[0] * geo.scale : geo.x + p[0] * geo.scale,
        geo.y === undefined ? p[1] * geo.scale : geo.y + p[1] * geo.scale];
      BASE.toBoard = ([x, y]) => {
        const r = svg.getBoundingClientRect();
        return [(x - r.left - (geo.x || 0)) / geo.scale, (y - r.top - (geo.y || 0)) / geo.scale];
      };
      BASE.fromBoard = ([bx, by]) => {
        const r = svg.getBoundingClientRect();
        return [geo.x === undefined ? r.left + bx * geo.scale : r.left + geo.x + bx * geo.scale,
          geo.y === undefined ? r.top + by * geo.scale : r.top + geo.y + by * geo.scale];
      };
      BASE.frame = () => ({
        toBoard: (p) => P.toBoard(p), fromBoard: (p) => P.fromBoard(p),
        bounds: { x0: 0, y0: 0, x1: ctxRef.spec.board.w, y1: ctxRef.spec.board.h },
      });
      BASE.grid = (b) => {
        const { ctx, svg, W, H } = b;
        const { util, rng } = ctx;
        const style = D.grid || rng.pick(['dots', 'lines', 'plain']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: D.background }, svg);
        if (style === 'plain') return;
        const step = rng.int(20, 32);
        const defs = util.svg('defs', {}, svg);
        const pat = util.svg('pattern', { id: 'dw-grid', width: step, height: step, patternUnits: 'userSpaceOnUse' }, defs);
        if (style === 'dots') util.svg('circle', { cx: step / 2, cy: step / 2, r: 1.4, fill: 'var(--line)' }, pat);
        else util.svg('path', { d: `M ${step} 0 L 0 0 0 ${step}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#dw-grid)', ...D.gridAttrs, 'pointer-events': 'none' }, svg);
      };
    }

    function defineTargetParts() {
      BASE.dot = (util, g, px, p, hollow) => {
        const [x, y] = px(p);
        if (hollow) util.svg('circle', { cx: x, cy: y, ...D.hollowAttrs }, g);
        else for (const attrs of D.dotLayers) util.svg('circle', { cx: x, cy: y, ...attrs }, g);
      };
      BASE.label = (util, g, px, W, H, p, d, text, cls = 'dw-label', off = D.labelOffset) => {
        const [x, y] = px(p);
        const [left, right, top, bottom] = D.labelInsets;
        const lx = Math.min(W - right, Math.max(left, x + d[0] * off));
        const ly = Math.min(H - bottom, Math.max(top, y + d[1] * off));
        return util.svg('text', { x: lx, y: ly, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g).textContent = text;
      };
      BASE.line = (b, g) => {
        const { ctx, px, W, H } = b;
        const { util, spec } = ctx;
        if (spec.mode === 'connect') {
          P.dot(util, g, px, spec.a);
          P.dot(util, g, px, spec.b);
          P.label(util, g, px, W, H, spec.a, D.connectDirection || unit(spec.b, spec.a), 'A', 'dw-label', D.connectOffset ?? D.labelOffset);
          P.label(util, g, px, W, H, spec.b, D.connectDirection || unit(spec.a, spec.b), 'B', 'dw-label', D.connectOffset ?? D.labelOffset);
        } else {
          if (spec.dir === 'guide') P.lineGuide(b, g);
          const [x, y] = px(spec.p);
          if (D.haloAttrs) util.svg('circle', { cx: x, cy: y, ...D.haloAttrs }, g);
          P.dot(util, g, px, spec.p);
        }
      };
      BASE.lineGuide = (b, g) => {
        const { ctx, px, W, H } = b;
        const { util, spec } = ctx;
        const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
        const h = spec.guide.len / 2;
        const a = px([spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h]);
        const z = px([spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h]);
        util.svg('line', { x1: a[0], y1: a[1], x2: z[0], y2: z[1], stroke: 'var(--muted)', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
        for (const e of [a, z]) util.svg('circle', { cx: e[0], cy: e[1], r: 4, fill: 'var(--muted)' }, g);
        const nrm = [-d[1], d[0]];
        P.label(util, g, px, W, H, spec.guide.c, nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm, 'guide', 'dw-small', 18);
      };
      BASE.circle = (b, g) => {
        const { ctx, px } = b;
        const { util, spec } = ctx;
        const [x, y] = px(spec.c);
        if (spec.show === 'guide' || (D.circleBoth && spec.show === 'both')) {
          util.svg('circle', { cx: x, cy: y, r: spec.r * b.scale, ...D.circleAttrs }, g);
          P.dot(util, g, px, spec.c);
          if (D.rimOnGuide === true || (D.rimOnGuide === 'spec' && spec.rimDot)) {
            P.dot(util, g, px, spec.rim || [spec.c[0], spec.c[1] - spec.r], true);
          }
        } else {
          P.dot(util, g, px, spec.c);
          P.dot(util, g, px, spec.rim, true);
        }
      };
      BASE.trace = (b, g) => {
        const { ctx, px, W, H } = b;
        const { util, spec } = ctx;
        P.arrowPath(b, g, spec.path);
        P.dot(util, g, px, spec.path[0], D.startDot);
        P.label(util, g, px, W, H, spec.path[0], D.startDirection || unit(spec.path[1], spec.path[0]), D.startText, D.startClass, D.startOffset);
      };
      BASE.curve = (path, px) => {
        const pts = path.map(px);
        let dd = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], e = pts[Math.min(pts.length - 1, i + 2)];
          const f = (v) => v.toFixed(1);
          dd += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
        }
        return dd;
      };
      BASE.guide = (b, g, path) => {
        const attrs = D.smooth ? { d: P.curve(path, b.px) } : { points: fmtPx(path, b.px) };
        for (const layer of D.guideLayers) b.ctx.util.svg(D.smooth ? 'path' : 'polyline', { ...attrs, fill: 'none', ...layer }, g);
      };
      BASE.headGeometry = (b, path) => {
        const tip = b.px(path[path.length - 1]);
        const d = unit(path[path.length - 2], path[path.length - 1]);
        const n = [-d[1], d[0]];
        const back = [tip[0] - d[0] * D.headLength, tip[1] - d[1] * D.headLength];
        return { tip, d, head: [tip, [back[0] + n[0] * D.headWidth, back[1] + n[1] * D.headWidth], [back[0] - n[0] * D.headWidth, back[1] - n[1] * D.headWidth]] };
      };
      BASE.arrowHead = (b, g, a) => b.ctx.util.svg('polygon', { points: a.head.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), ...D.headAttrs }, g);
      BASE.endLabel = (b, g, a) => {
        if (D.endText === null) return;
        const { tip, d } = a;
        const lab = b.ctx.util.svg('text', { x: Math.max(40, tip[0] + d[0] * 40), y: Math.max(14, tip[1] + d[1] * 24 + (d[1] > 0.5 ? 6 : 0)), class: 'dw-label', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-weight': 400 }, g);
        lab.textContent = D.endText;
      };
      BASE.arrowPath = (b, g, path) => {
        P.guide(b, g, path);
        const a = P.headGeometry(b, path);
        P.arrowHead(b, g, a);
        P.endLabel(b, g, a);
      };
    }

    function defineStrokeParts() {
      BASE.penCreated = () => {};
      BASE.ink = (points, b, el) => el.setAttribute('points', fmtPx(points, b.px));
      BASE.strokeOptions = (b, el) => ({
        ...b.frame, strokes: b.ctx.model.strokes,
        render: (points) => P.ink(points, b, el),
        onStroke: (points, strokes) => b.ctx.update({ strokes }),
        onChange: (strokes) => b.ctx.update({ strokes }), label: 'pen',
      });
      BASE.strokeReady = () => {};
      BASE.build = (b) => {
        const { ctx, svg } = b;
        const { util, rng, spec } = ctx;
        P.grid(b);
        const g = util.svg('g', {}, svg);
        P[spec.scenario](b, g);
        pen = util.svg('polyline', {
          fill: 'none', stroke: D.ink, 'stroke-width': rng.pick([3, 3.5, 4, 5]),
          'stroke-linecap': 'round', 'stroke-linejoin': 'round', points: '',
        }, svg);
        P.penCreated(b, pen);
        stroke = env.ui.stroke(svg, P.strokeOptions(b, pen));
        P.strokeReady(b, pen, stroke);
        P.hint(b, rng.pick(['Hold the mouse button to draw. Starting a new stroke replaces the old one.',
          'Press and drag to draw. Each new stroke replaces the previous one.']));
        return { sync: (m) => stroke.set(m.strokes), locate: (t) => (t.point ? stroke.locate(t.point) : null) };
      };
      BASE.hint = (b, text, swatch = true) => {
        if (swatch) b.ctx.util.el('span', 'dw-swatch', b.hintEl);
        b.ctx.util.el('span', '', b.hintEl, text);
      };
      BASE.clear = () => {
        if (D.clearLog) ctxRef.log('clear');
        if (D.clearInkFirst) stroke.set([]);
        ctxRef.update(D.clearPreserve ? { ...ctxRef.model, strokes: [] } : { strokes: [] });
        if (!D.clearInkFirst) view.sync(ctxRef.model);
      };
      BASE.controls = () => {
        if (D.clearTarget === 'widget') env.widgetDef.clear = () => P.clear();
      };
      BASE.place = (el, ctx, rng) => {
        if (!D.seededPlace) return;
        const { size } = ctx;
        const r = el.getBoundingClientRect();
        const fx = rng.pick([0, 0.5, 0.5, 1, rng.float(0, 1)]);
        const fy = rng.pick([0, 0.5, 0.5, 1, rng.float(0, 1)]);
        const mx = Math.min(16, Math.max(0, (size.width - r.width) / 2));
        const my = Math.min(12, Math.max(0, (size.height - r.height) / 2));
        el.style.left = `${Math.round(mx + fx * Math.max(0, size.width - 2 * mx - r.width))}px`;
        el.style.top = `${Math.round(my + fy * Math.max(0, size.height - 2 * my - r.height))}px`;
      };
      BASE.rendered = () => {};
    }

    ({ D, P } = env.templateDesign('draw-shape/canvas', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    const widget = {
      render(ctx) {
        ctxRef = ctx;
        if (!document.getElementById('dw-style')) {
          const el = document.createElement('style');
          el.id = 'dw-style';
          el.textContent = P.style();
          document.head.append(el);
        }
        P.begin(ctx);
        geo = P.fit(ctx);
        const { W, H, scale } = geo;
        wrap = P.wrap(ctx);
        board = ctx.util.el('div', 'dw-board', wrap);
        svg = ctx.util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, board);
        svg.dataset.role = 'board';
        const hintEl = ctx.util.el('div', 'dw-hint', wrap);
        B = {
          ctx, svg, W, H, scale, hintEl, bar: null, foot: null,
          px: (p) => P.px(p), toBoard: (p) => P.toBoard(p).map((v) => Math.round(v * 1e4) / 1e4), frame: P.frame(),
          hint: (...args) => P.hint(B, ...args),
          up(m) { ctx.update(m); if (view) view.sync(ctx.model); },
        };
        view = null;
        view = P.build(B);
        P.controls(B, view);
        view.sync(ctx.model);
        hintEl.style.maxWidth = `${Math.max(W, 200)}px`;
        P.place(wrap, ctx, ctx.rng.fork('place'));
        P.rendered(ctx);
        return { anchors: [svg], sync: (m) => view.sync(m) };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`draw-shape/canvas cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
    if (D.clearTarget === 'returned') widget.clear = () => P.clear();
    return widget;
  });
})();

