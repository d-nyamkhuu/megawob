// click-point/base: the base site's click-point widgets (board, cad, tiles) as a template. This file is their
// source. The design-* sites that started from a copy of them, and the composite sites that embed them, are designs on
// it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/click-point.js).
// A named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/click-point.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  function registerScenarios(env, S) {
    env.widget({
      task: 'click-point',
      site: 'base',
      name: 'board',
      split: 'train',
      scenarios: ['center', 'midpoint', 'bisect', 'right-angle', 'axis', 'map', 'path-mid', 'dense'],
      render: (ctx) => S.build(ctx, 'board'),
      locate: S.locatePoint,
    });
    env.widget({
      task: 'click-point',
      site: 'base',
      name: 'cad',
      split: 'train',
      scenarios: ['center', 'midpoint', 'bisect', 'right-angle', 'path-mid', 'dense'],
      render: (ctx) => S.build(ctx, 'cad'),
      locate: S.locatePoint,
    });
    env.widget({
      task: 'click-point',
      site: 'base',
      name: 'tiles',
      split: 'train',
      scenarios: ['map'],
      render: (ctx) => S.build(ctx, 'tiles'),
      locate: S.locatePoint,
    });
  }

  function registerWidgets(env, scriptOf, __parts, __has, setScope) {
    'use strict';
    const __scope = {
      get env() { return env; },
      get scriptOf() { return scriptOf; },
      get CSS() { return CSS; },
      get FILLS() { return FILLS; },
      get px() { return px; },
      get at() { return at; },
      get f1() { return f1; },
      get T() { return T; },
      get F() { return F; },
      get decOf() { return decOf; },
      get svg() { return svg; }, set svg(v) { svg = v; },
      get scale() { return scale; }, set scale(v) { scale = v; },
      get spec() { return spec; }, set spec(v) { spec = v; },
      get markG() { return markG; }, set markG(v) { markG = v; },
      get style() { return style; }, set style(v) { style = v; },
      get surface() { return surface; }, set surface(v) { surface = v; },
      get afterClick() { return afterClick; }, set afterClick(v) { afterClick = v; },
      get posEl() { return posEl; }, set posEl(v) { posEl = v; },
      get ensureStyle() { return ensureStyle; },
      get drawGrid() { return drawGrid; },
      get point() { return point; },
      get label() { return label; },
      get line() { return line; },
      get minCircle() { return minCircle; },
      get arcPath() { return arcPath; },
      get drawCenter() { return drawCenter; },
      get drawMidpoint() { return drawMidpoint; },
      get drawBisect() { return drawBisect; },
      get drawRightAngle() { return drawRightAngle; },
      get drawRuler() { return drawRuler; },
      get drawChart() { return drawChart; },
      get drawAxis() { return drawAxis; },
      get drawMap() { return drawMap; },
      get drawTiles() { return drawTiles; },
      get drawMapFigure() { return drawMapFigure; },
      get drawPath() { return drawPath; },
      get drawDense() { return drawDense; },
      get placeCard() { return placeCard; },
      get vertex() { return vertex; },
      get showMarker() { return showMarker; },
      get bindClicks() { return bindClicks; },
      get build() { return build; },
      get buildCad() { return buildCad; },
      get locatePoint() { return locatePoint; },
    };
    for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
      let v; let built = false;
      Object.defineProperty(__scope, k.slice(3), {
        get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
        set: (x) => { built = true; v = x; },
      });
    }
    setScope(__scope);
    if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
    if (__has('drawGrid')) drawGrid = __parts['drawGrid'](drawGrid, __scope);
    if (__has('point')) point = __parts['point'](point, __scope);
    if (__has('label')) label = __parts['label'](label, __scope);
    if (__has('line')) line = __parts['line'](line, __scope);
    if (__has('minCircle')) minCircle = __parts['minCircle'](minCircle, __scope);
    if (__has('arcPath')) arcPath = __parts['arcPath'](arcPath, __scope);
    if (__has('drawCenter')) drawCenter = __parts['drawCenter'](drawCenter, __scope);
    if (__has('drawMidpoint')) drawMidpoint = __parts['drawMidpoint'](drawMidpoint, __scope);
    if (__has('drawBisect')) drawBisect = __parts['drawBisect'](drawBisect, __scope);
    if (__has('drawRightAngle')) drawRightAngle = __parts['drawRightAngle'](drawRightAngle, __scope);
    if (__has('drawRuler')) drawRuler = __parts['drawRuler'](drawRuler, __scope);
    if (__has('drawChart')) drawChart = __parts['drawChart'](drawChart, __scope);
    if (__has('drawAxis')) drawAxis = __parts['drawAxis'](drawAxis, __scope);
    if (__has('drawMap')) drawMap = __parts['drawMap'](drawMap, __scope);
    if (__has('drawTiles')) drawTiles = __parts['drawTiles'](drawTiles, __scope);
    if (__has('drawMapFigure')) drawMapFigure = __parts['drawMapFigure'](drawMapFigure, __scope);
    if (__has('drawPath')) drawPath = __parts['drawPath'](drawPath, __scope);
    if (__has('drawDense')) drawDense = __parts['drawDense'](drawDense, __scope);
    if (__has('placeCard')) placeCard = __parts['placeCard'](placeCard, __scope);
    if (__has('vertex')) vertex = __parts['vertex'](vertex, __scope);
    if (__has('showMarker')) showMarker = __parts['showMarker'](showMarker, __scope);
    if (__has('bindClicks')) bindClicks = __parts['bindClicks'](bindClicks, __scope);
    if (__has('build')) build = __parts['build'](build, __scope);
    if (__has('buildCad')) buildCad = __parts['buildCad'](buildCad, __scope);
    if (__has('locatePoint')) locatePoint = __parts['locatePoint'](locatePoint, __scope);
    const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('click-point/_styles').REFERENCE_CSS);
    const FILLS = __has('FILLS') ? __parts['FILLS'](undefined, __scope) : (['#1c7ed6', '#0c8599', '#2f9e44', '#f76707', '#7048e8', '#d6336c']);
    let svg = __has('svg') ? __parts['svg'](undefined, __scope) : undefined;
    let scale = __has('scale') ? __parts['scale'](undefined, __scope) : undefined;
    let spec = __has('spec') ? __parts['spec'](undefined, __scope) : undefined;
    let markG = __has('markG') ? __parts['markG'](undefined, __scope) : undefined;
    let style = __has('style') ? __parts['style'](undefined, __scope) : undefined;
    let surface = __has('surface') ? __parts['surface'](undefined, __scope) : undefined;
    let afterClick = __has('afterClick') ? __parts['afterClick'](undefined, __scope) : (null); // cad: echo the clicked point in the command line
    let posEl = __has('posEl') ? __parts['posEl'](undefined, __scope) : (null); // board / tiles: the marker position readout in the hint row (the task's facts() reports it)
    function ensureStyle() { return env.templateLib('click-point/_base-drawing').ensureStyle(__scope); }
    const px = __has('px') ? __parts['px'](undefined, __scope) : { px: (p) => [p[0] * scale, p[1] * scale] }.px;
    const at = __has('at') ? __parts['at'](undefined, __scope) : { at: (c, th, r) => [c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r] }.at;
    const f1 = __has('f1') ? __parts['f1'](undefined, __scope) : { f1: (v) => v.toFixed(1) }.f1;
    function drawGrid(util, W, H) { return env.templateLib('click-point/_base-drawing').drawGrid(__scope, util, W, H); }
    // A marked point in the current point style; `hollow` for the secondary point (A in right-angle).
    function point(util, g, p, hollow) { return env.templateLib('click-point/_base-drawing').point(__scope, util, g, p, hollow); }
    // Text `off` px from p in screen direction th, kept inside the board.
    function label(util, g, p, th, text, off = 22) { return env.templateLib('click-point/_base-drawing').label(__scope, util, g, p, th, text, off); }
    function line(util, g, a, b, attrs) { return env.templateLib('click-point/_base-drawing').line(__scope, util, g, a, b, attrs); }
    function minCircle(util, g, c) { return env.templateLib('click-point/_base-drawing').minCircle(__scope, util, g, c); }
    function arcPath(c, r, a0, a1) { return env.templateLib('click-point/_base-drawing').arcPath(__scope, c, r, a0, a1); }
    function drawCenter(util, g) { return env.templateLib('click-point/_base-drawing').drawCenter(__scope, util, g); }
    function drawMidpoint(util, g) { return env.templateLib('click-point/_base-drawing').drawMidpoint(__scope, util, g); }
    function drawBisect(util, g) { return env.templateLib('click-point/_base-drawing').drawBisect(__scope, util, g); }
    function drawRightAngle(util, g) { return env.templateLib('click-point/_base-drawing').drawRightAngle(__scope, util, g); }
    // ---------------------------------------------------------------- axis
    const T = __has('T') ? __parts['T'](undefined, __scope) : { T: (util, g, x, y, text, attrs = {}) => {
      const t = util.svg('text', { x: f1(x), y: f1(y), 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'cp-tick', ...attrs }, g);
      t.textContent = text;
      return t;
    } }.T;
    const F = __has('F') ? __parts['F'](undefined, __scope) : { F: () => env.taskDef }.F;
    const decOf = __has('decOf') ? __parts['decOf'](undefined, __scope) : { decOf: (x) => (String(x).split('.')[1] || '').length }.decOf;
    function drawRuler(util, g, rng) { return env.templateLib('click-point/_base-plots').drawRuler(__scope, util, g, rng); }
    function drawChart(util, g, rng) { return env.templateLib('click-point/_base-plots').drawChart(__scope, util, g, rng); }
    function drawAxis(util, g, rng) { return env.templateLib('click-point/_base-plots').drawAxis(__scope, util, g, rng); }
    // ---------------------------------------------------------------- map
    function drawMap(util, g, rng, W, H) { return env.templateLib('click-point/_base-plots').drawMap(__scope, util, g, rng, W, H); }
    // Raster-tile look under the figure: a tile grid (tint, seams), and on land city blocks and parks.
    function drawTiles(util, g, rng, W, H) { return env.templateLib('click-point/_base-plots').drawTiles(__scope, util, g, rng, W, H); }
    function drawMapFigure(util, g, rng, W, H) { return env.templateLib('click-point/_base-plots').drawMapFigure(__scope, util, g, rng, W, H); }
    // ---------------------------------------------------------------- path
    function drawPath(util, g) { return env.templateLib('click-point/_base-plots').drawPath(__scope, util, g); }
    // ---------------------------------------------------------------- dense
    function drawDense(util, g, rng) { return env.templateLib('click-point/_base-plots').drawDense(__scope, util, g, rng); }
    // Shift the board to a sampled spot inside the stage (the site already varies the stage alignment).
    function placeCard(card, ctx) { return env.templateLib('click-point/_base-page').placeCard(__scope, card, ctx); }
    function vertex() { return env.templateLib('click-point/_base-page').vertex(__scope); }
    function showMarker(util, model) { return env.templateLib('click-point/_base-page').showMarker(__scope, util, model); }
    // Mechanics come from env.ui.board: a press inside the svg places the point (board units, clamped).
    function bindClicks(ctx) { return env.templateLib('click-point/_base-page').bindClicks(__scope, ctx); }
    function build(ctx, flavor) { return env.templateLib('click-point/_base-page').build(__scope, ctx, flavor); }
    // CAD frame: rulers (ticks every 0.02 board units, labels every 0.1), the pointer-following crosshair, the
    // X / Y status bar and the command line.
    function buildCad(ctx, card, rulers, W, H) { return env.templateLib('click-point/_base-page').buildCad(__scope, ctx, card, rulers, W, H); }
    function locatePoint(t) { return env.templateLib('click-point/_base-page').locatePoint(__scope, t); }
    registerScenarios(env, __scope);
  }

  function reference(site, __parts) {
    const captured = [];
    let scopeNow = null;
    const __has = (key) => { UNITS.add(key); return key in __parts; };
    const env = new Proxy(window.env, {
      get: (t, k) => (k === 'widget' ? (d) => {
        for (const key of Object.keys(__parts)) {
          const dot = key.indexOf('.');
          if (!key.startsWith('stmt') && !key.startsWith('+') && dot > 0 && key.slice(0, dot) === d.name) d[key.slice(dot + 1)] = __parts[key](d[key.slice(dot + 1)], scopeNow);
        }
        captured.push(d);
      } : Reflect.get(t, k)),
    });
    const scriptOf = { src: new URL(`sites/${site}/widgets/click-point.js`, HTML).href };
    /*
     * reference / click-point / board: an SVG board with the figure drawn on it. A left press anywhere on the
     * board places the marker (env.ui.board; each press replaces it); presses outside the board are ignored.
     * Every drawn shape, label and the marker have pointer-events: none, so a click on the drawing lands on the
     * board. Board units map to px with one isotropic scale (px per board height). Per-seed style: grid (dots /
     * lines / plain), stroke width, point markers (dot / cross / ring), dashed guides (midpoint segment, extension
     * of AB, angle mark), ray ends, dotted min circle; the board sits at a sampled offset inside the stage.
     * New scenarios: axis (a ruler / number line with major, medium and minor ticks, or a line chart with axes,
     * grid, tick labels, axis titles and a data series), map (a coastline map with a labeled lat/lon graticule, or
     * a street map with named streets), path-mid (a grid-aligned path on graph paper whose cells match the path
     * grid), dense (many small dots, labeled or with one odd dot).
     *
     * reference / click-point / cad: a CAD-like drawing canvas (center, midpoint, bisect, right-angle, path-mid, dense).
     * Dark slate, minor / major grid lines, rulers along the top and left edges (board units, ticks every 0.02, labels
     * every 0.1), a crosshair that follows the pointer across the whole board, and a status bar with the live X / Y
     * readout and a command line ("Specify point:" then the clicked point's coordinates). The readout is the pointer's
     * board position; the click places the marker exactly where the pointer is (no snapping).
     *
     * reference / click-point / tiles: a slippy-map page (map only). A header with a title, search box and zoom buttons
     * (inert) above the board, a raster-tile base map (a 5-column tile grid with per-tile tint, seams, city blocks, parks)
     * under the coastline / street figure, attribution under the board, and a pin marker whose tip is the point.
     */
    registerWidgets(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    return captured;
  }
  env.template('click-point/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`click-point/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('click-point/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`click-point/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`click-point/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['click-point/_styles', 'click-point/_base-drawing', 'click-point/_base-plots', 'click-point/_base-page'] });
})();
