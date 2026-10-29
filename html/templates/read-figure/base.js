// read-figure/base: the base site's read-figure widgets (panel) as a template. This file is their source. The
// design-* sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/read-figure.js).
// A named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/read-figure.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/read-figure.js`, HTML).href };
    /*
     * reference / read-figure / panel: one task card ("panel") with a small title bar, sized from ctx.size and
     * placed (absolutely) at a seeded spot of the stage's free space, so sidebars, side panels, footers and
     * narrow stages never push it out; if a scenario's content still does not fit, the card is scaled down.
     * The card body holds the scenario's figure and its answer controls:
     *   color       a grid of swatches (round, square or rounded, seeded size); mode 'sample' adds a sample swatch
     *   shades      a grid of colored tiles; selected tiles show a check badge; select 'modifier': a plain click
     *               selects only that tile, Ctrl/Shift+click adds or removes one
     *   shape       an SVG board (light paper, optional cell grid) with letters, digits and shapes; the whole cell
     *               of an item is its click area (tiny boards: only the item and a small margin)
     *   identify    an SVG frame with one big figure, answer buttons below
     *   count       a board (mode 'shapes', not clickable) or a frame with an outlined polygon (mode 'sides'), then
     *               a row of number buttons or an "Answer" text field
     *   greatest    a row of cards; face-down cards show a striped back (mode 'cards'); the chosen card is ringed
     *   grid        an SVG Cartesian plane with a dot per integer point
     *   addition    two dashed boxes of blocks with "+" and "=", then the answer field
     *   ascending   number tiles scattered over a board; clicked tiles disappear
     *   number-checkboxes  native checkboxes beside an "Example" card
     *   spatial     a board of glyphs or line icons (cell-sized click areas)
     *   icon        a board of line icons in item colors (tiny boards: small icons, small click areas)
     *   scroll-count  a list pane (rows: icon, label, date) showing spec.view rows; native overflow (wheel) with
     *               the native scrollbar hidden and a custom draggable scrollbar beside it; answers below
     * traits { glyphs: line x2 | symbol | emoji, contrast: normal x2 | low } (sampled by the logic per episode):
     *   glyphs      icon / spatial / scroll-count icons drawn as SVG line icons ('line'), as monochrome DejaVu Sans
     *               text symbols in the item color ('symbol'), or as Noto Color Emoji ('emoji'; needs the
     *               fonts-noto-color-emoji package, which the Docker image installs). Click areas stay the cells.
     *   contrast    'low' (shape, identify, count, spatial, icon, scroll-count): items in the logic's washed-out
     *               LOW_ITEM_COLORS on a darker LOW_BOARD (CIEDE2000 floors in the logic's selfTest); emoji fade
     * Recoverable episodes (spec.recoverable) get a result bar at the bottom of the card: after an answer it
     * says the answer was recorded (ascending: "out of order") and offers Undo / Change answer.
     * Mechanics come from env.ui: buttons() for single-answer clicks, cards and number tiles, choices() for
     * checkboxes, listbox() (+ scrollbar) for the scroll pane, textField() for typed answers. The panel is the anchor.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get TITLES() { return TITLES; },
        get EYE() { return EYE; },
        get CHECK() { return CHECK; },
        get BLOCK_COLORS() { return BLOCK_COLORS; },
        get DOT_COLORS() { return DOT_COLORS; },
        get ROW_COLORS() { return ROW_COLORS; },
        get ICON_SHAPES() { return ICON_SHAPES; },
        get fam() { return fam; },
        get px() { return px; },
        get cap() { return cap; },
        get answered() { return answered; },
        get fail() { return fail; },
        get buildShape() { return buildShape; },
        get buildSpatial() { return buildSpatial; },
        get buildIcon() { return buildIcon; },
        get BUILDERS() { return BUILDERS; },
        get view() { return view; }, set view(v) { view = v; },
        get ensureStyle() { return ensureStyle; },
        get polyPoints() { return polyPoints; },
        get drawIcon() { return drawIcon; },
        get drawFigure() { return drawFigure; },
        get palette() { return palette; },
        get boardSvg() { return boardSvg; },
        get drawBoard() { return drawBoard; },
        get answerer() { return answerer; },
        get optionButtons() { return optionButtons; },
        get answerField() { return answerField; },
        get buildColor() { return buildColor; },
        get buildShades() { return buildShades; },
        get boardCell() { return boardCell; },
        get buildItemsBoard() { return buildItemsBoard; },
        get buildIdentify() { return buildIdentify; },
        get buildCount() { return buildCount; },
        get buildGreatest() { return buildGreatest; },
        get buildGrid() { return buildGrid; },
        get buildAddition() { return buildAddition; },
        get buildAscending() { return buildAscending; },
        get buildCheckboxes() { return buildCheckboxes; },
        get buildScrollCount() { return buildScrollCount; },
        get resultBar() { return resultBar; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('polyPoints')) polyPoints = __parts['polyPoints'](polyPoints, __scope);
      if (__has('drawIcon')) drawIcon = __parts['drawIcon'](drawIcon, __scope);
      if (__has('drawFigure')) drawFigure = __parts['drawFigure'](drawFigure, __scope);
      if (__has('palette')) palette = __parts['palette'](palette, __scope);
      if (__has('boardSvg')) boardSvg = __parts['boardSvg'](boardSvg, __scope);
      if (__has('drawBoard')) drawBoard = __parts['drawBoard'](drawBoard, __scope);
      if (__has('answerer')) answerer = __parts['answerer'](answerer, __scope);
      if (__has('optionButtons')) optionButtons = __parts['optionButtons'](optionButtons, __scope);
      if (__has('answerField')) answerField = __parts['answerField'](answerField, __scope);
      if (__has('buildColor')) buildColor = __parts['buildColor'](buildColor, __scope);
      if (__has('buildShades')) buildShades = __parts['buildShades'](buildShades, __scope);
      if (__has('boardCell')) boardCell = __parts['boardCell'](boardCell, __scope);
      if (__has('buildItemsBoard')) buildItemsBoard = __parts['buildItemsBoard'](buildItemsBoard, __scope);
      if (__has('buildIdentify')) buildIdentify = __parts['buildIdentify'](buildIdentify, __scope);
      if (__has('buildCount')) buildCount = __parts['buildCount'](buildCount, __scope);
      if (__has('buildGreatest')) buildGreatest = __parts['buildGreatest'](buildGreatest, __scope);
      if (__has('buildGrid')) buildGrid = __parts['buildGrid'](buildGrid, __scope);
      if (__has('buildAddition')) buildAddition = __parts['buildAddition'](buildAddition, __scope);
      if (__has('buildAscending')) buildAscending = __parts['buildAscending'](buildAscending, __scope);
      if (__has('buildCheckboxes')) buildCheckboxes = __parts['buildCheckboxes'](buildCheckboxes, __scope);
      if (__has('buildScrollCount')) buildScrollCount = __parts['buildScrollCount'](buildScrollCount, __scope);
      if (__has('resultBar')) resultBar = __parts['resultBar'](resultBar, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('read-figure/_styles').referenceCSS);

      const TITLES = __has('TITLES') ? __parts['TITLES'](undefined, __scope) : ({
        color: ['Color check', 'Swatches', 'Palette'], shades: ['Shade sorter', 'Color tiles'], shape: ['Shape finder', 'Symbol board'],
        identify: ['Identify', 'What is this?'], count: ['Counting', 'Quick count'], greatest: ['Card game', 'High card'],
        grid: ['Coordinates', 'Plot points'], addition: ['Visual addition', 'Block math'], ascending: ['Number order', 'Sequence'],
        'number-checkboxes': ['Checkbox drawing', 'Pixel copy'], spatial: ['Where is it?', 'Layout quiz', 'Board'],
        icon: ['Icon finder', 'Toolbar icons', 'Icons'], 'scroll-count': ['Inventory', 'File list', 'Records'],
      });
      const EYE = __has('EYE') ? __parts['EYE'](undefined, __scope) : ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>');
      const CHECK = __has('CHECK') ? __parts['CHECK'](undefined, __scope) : ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>');
      const BLOCK_COLORS = __has('BLOCK_COLORS') ? __parts['BLOCK_COLORS'](undefined, __scope) : (['#1c63d6', '#2f9e44', '#e8590c', '#7048e8', '#c2255c', '#0c8599']);
      const DOT_COLORS = __has('DOT_COLORS') ? __parts['DOT_COLORS'](undefined, __scope) : (['#1c63d6', '#2b8a3e', '#5f3dc4', '#c92a2a']);
      const ROW_COLORS = __has('ROW_COLORS') ? __parts['ROW_COLORS'](undefined, __scope) : ({ red: '#e03131', green: '#2f9e44', blue: '#1c63d6', orange: '#e8590c', purple: '#7b2fd9' });

      // Line icons on a 24-unit grid: [tag, attrs] lists; 'F' marks a filled shape.
      const ICON_SHAPES = __has('ICON_SHAPES') ? __parts['ICON_SHAPES'](undefined, __scope) : ({
        home: [['path', { d: 'M3 11.5L12 4l9 7.5' }], ['path', { d: 'M5.5 10v10h5v-6h3v6h5V10' }]],
        gear: [['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1' }], ['circle', { cx: 12, cy: 12, r: 6.5 }]],
        bell: [['path', { d: 'M6 16.5V11a6 6 0 0112 0v5.5l1.8 1.8H4.2z' }], ['path', { d: 'M10 20.5a2 2 0 004 0' }]],
        heart: [['path', { d: 'M12 20s-7.5-4.6-9-9.2A4.6 4.6 0 0112 8a4.6 4.6 0 019 2.8C19.5 15.4 12 20 12 20z', F: 1 }]],
        mail: [['rect', { x: 3, y: 5.5, width: 18, height: 13, rx: 1.5 }], ['path', { d: 'M3.5 6.5l8.5 6.5 8.5-6.5' }]],
        trash: [['path', { d: 'M4 7h16M9 7V4.5h6V7M6.2 7l1 13h9.6l1-13M10 11v6M14 11v6' }]],
        search: [['circle', { cx: 10.5, cy: 10.5, r: 6 }], ['path', { d: 'M15 15l5.5 5.5' }]],
        user: [['circle', { cx: 12, cy: 8, r: 4 }], ['path', { d: 'M4 21a8 8 0 0116 0' }]],
        lock: [['rect', { x: 5, y: 10.5, width: 14, height: 10, rx: 1.5 }], ['path', { d: 'M8 10.5V7.5a4 4 0 018 0v3' }]],
        cloud: [['path', { d: 'M7 18.5h10.5a4 4 0 00.3-8 6 6 0 00-11.6 1.6A3.3 3.3 0 007 18.5z' }]],
        camera: [['rect', { x: 3, y: 7, width: 18, height: 13, rx: 2 }], ['path', { d: 'M8.5 7l1.8-2.8h3.4L15.5 7' }], ['circle', { cx: 12, cy: 13.5, r: 3.5 }]],
        calendar: [['rect', { x: 3.5, y: 5, width: 17, height: 15.5, rx: 1.5 }], ['path', { d: 'M3.5 10h17M8 3v4M16 3v4' }]],
        star: [['path', { d: 'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.8 6.6 19.6l1.1-6-4.5-4.2 6.1-.8z', F: 1 }]],
        download: [['path', { d: 'M12 4v11M7 10.5l5 5 5-5M4.5 20h15' }]],
        pencil: [['path', { d: 'M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19z' }], ['path', { d: 'M13.5 7l3.5 3.5' }]],
        folder: [['path', { d: 'M3 6.5h6.5l2 2.2H21v10.8H3z' }]],
        plus: [['path', { d: 'M12 4.5v15M4.5 12h15', W: 3 }]],
        flag: [['path', { d: 'M5.5 21V4' }], ['path', { d: 'M5.5 4.5h11l-2.3 4 2.3 4h-11', F: 1 }]],
        pin: [['path', { d: 'M12 21s-6.5-6.6-6.5-11.2a6.5 6.5 0 0113 0C18.5 14.4 12 21 12 21z' }], ['circle', { cx: 12, cy: 9.8, r: 2.3 }]],
        clock: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7v5.2l3.4 2' }]],
      });

      let view = __has('view') ? __parts['view'](undefined, __scope) : (null); // live episode: { locate(t), sync(m) }

      function ensureStyle() {
        if (document.getElementById('up-style')) return;
        const s = document.createElement('style');
        s.id = 'up-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const fam = __has('fam') ? __parts['fam'](undefined, __scope) : { fam: () => env.taskDef }.fam;
      const px = __has('px') ? __parts['px'](undefined, __scope) : { px: (v) => `${Math.round(v)}px` }.px;
      const cap = __has('cap') ? __parts['cap'](undefined, __scope) : { cap: (s) => s.charAt(0).toUpperCase() + s.slice(1) }.cap;

      // ---------------------------------------------------------------- SVG figures

      function polyPoints(n, cx, cy, r, rotDeg, inner) {
        return env.templateLib('read-figure/_base-figures').polyPoints(__scope, n, cx, cy, r, rotDeg, inner);
      }

      // glyphs (spec.glyphs): 'symbol' draws the task's GLYPHS.symbol text glyph in the item color (DejaVu Sans,
      // text presentation), 'emoji' its color emoji (Noto Color Emoji; color ignored); otherwise the SVG line icon.
      function drawIcon(util, parent, name, cx, cy, s, color, glyphs) {
        return env.templateLib('read-figure/_base-figures').drawIcon(__scope, util, parent, name, cx, cy, s, color, glyphs);
      }

      // Draw a letter, digit, shape or icon of size s (px, bounding box) centered at (cx, cy).
      function drawFigure(util, parent, kind, text, cx, cy, s, fill, glyphs) {
        return env.templateLib('read-figure/_base-figures').drawFigure(__scope, util, parent, kind, text, cx, cy, s, fill, glyphs);
      }

      // Item colors and board color for a spec (spec.contrast 'low': washed-out palette on a darker board).
      function palette(spec) {
        return env.templateLib('read-figure/_base-figures').palette(__scope, spec);
      }

      // A board / frame SVG; low contrast paints it with the palette's board color.
      function boardSvg(util, parent, W, H, spec) {
        return env.templateLib('read-figure/_base-figures').boardSvg(__scope, util, parent, W, H, spec);
      }

      // Light board with items in cells. clickable: wrap each item in a g.up-item with a hit rect (the whole cell,
      // or the item plus a small margin for tiny items).
      function drawBoard(ctx, parent, spec, cell, clickable) {
        return env.templateLib('read-figure/_base-figures').drawBoard(__scope, ctx, parent, spec, cell, clickable);
      }

      // ---------------------------------------------------------------- answer controls

      // Single-answer click: record and lock the answer (the episode may end on a wrong one).
      function answerer(ctx, up) {
        return env.templateLib('read-figure/_base-controls').answerer(__scope, ctx, up);
      }
      const answered = __has('answered') ? __parts['answered'](undefined, __scope) : { answered: (m) => (m.answer !== null && m.answer !== undefined ? [m.answer] : []) }.answered;

      // Row of answer buttons over keys (labels from label(key)).
      function optionButtons(ctx, parent, keys, label, up) {
        return env.templateLib('read-figure/_base-controls').optionButtons(__scope, ctx, parent, keys, label, up);
      }

      function answerField(ctx, parent, up, hint) {
        return env.templateLib('read-figure/_base-controls').answerField(__scope, ctx, parent, up, hint);
      }

      const fail = __has('fail') ? __parts['fail'](undefined, __scope) : { fail: (t) => { throw new Error(`read-figure/panel cannot locate ${JSON.stringify(t)}`); } }.fail;

      // ---------------------------------------------------------------- scenarios

      function buildColor(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-choices').buildColor(__scope, ctx, body, up, B);
      }

      function buildShades(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-choices').buildShades(__scope, ctx, body, up, B);
      }

      function boardCell(spec, B, max, reserve = 0) {
        return env.templateLib('read-figure/_base-choices').boardCell(__scope, spec, B, max, reserve = 0);
      }

      function buildItemsBoard(ctx, body, up, B, max) {
        return env.templateLib('read-figure/_base-choices').buildItemsBoard(__scope, ctx, body, up, B, max);
      }

      const buildShape = __has('buildShape') ? __parts['buildShape'](undefined, __scope) : { buildShape: (ctx, body, up, B) => buildItemsBoard(ctx, body, up, B, 70) }.buildShape;
      const buildSpatial = __has('buildSpatial') ? __parts['buildSpatial'](undefined, __scope) : { buildSpatial: (ctx, body, up, B) => buildItemsBoard(ctx, body, up, B, 68) }.buildSpatial;
      const buildIcon = __has('buildIcon') ? __parts['buildIcon'](undefined, __scope) : { buildIcon: (ctx, body, up, B) => buildItemsBoard(ctx, body, up, B, 64) }.buildIcon;

      function buildIdentify(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-choices').buildIdentify(__scope, ctx, body, up, B);
      }

      function buildCount(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-choices').buildCount(__scope, ctx, body, up, B);
      }

      function buildGreatest(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-choices').buildGreatest(__scope, ctx, body, up, B);
      }

      function buildGrid(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-widgets').buildGrid(__scope, ctx, body, up, B);
      }

      function buildAddition(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-widgets').buildAddition(__scope, ctx, body, up, B);
      }

      function buildAscending(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-widgets').buildAscending(__scope, ctx, body, up, B);
      }

      function buildCheckboxes(ctx, body, up) {
        return env.templateLib('read-figure/_base-widgets').buildCheckboxes(__scope, ctx, body, up);
      }

      function buildScrollCount(ctx, body, up, B) {
        return env.templateLib('read-figure/_base-widgets').buildScrollCount(__scope, ctx, body, up, B);
      }

      const BUILDERS = __has('BUILDERS') ? __parts['BUILDERS'](undefined, __scope) : ({
        color: buildColor, shades: buildShades, shape: buildShape, identify: buildIdentify, count: buildCount,
        greatest: buildGreatest, grid: buildGrid, addition: buildAddition, ascending: buildAscending,
        'number-checkboxes': buildCheckboxes, spatial: buildSpatial, icon: buildIcon, 'scroll-count': buildScrollCount,
      });

      // Result bar for recoverable episodes: shows the recorded answer state and Undo.
      function resultBar(ctx, panel, up) {
        return env.templateLib('read-figure/_base-controls').resultBar(__scope, ctx, panel, up);
      }

      env.widget({
        task: 'read-figure',
        site: 'base',
        name: 'panel',
        split: 'train',
        // Opt-in task features (see the logic header): icon glyph sets and the low-contrast item palette.
        traits: { glyphs: ['line', 'line', 'symbol', 'emoji'], contrast: ['normal', 'normal', 'low'] },
        scenarios: ['color', 'shades', 'shape', 'identify', 'count', 'greatest', 'grid', 'addition', 'ascending', 'number-checkboxes',
          'spatial', 'icon', 'scroll-count'],

        render(ctx) {
          ensureStyle();
          const { spec, util, rng, size } = ctx;
          const panel = util.el('div', 'up-panel', ctx.stage);
          panel.style.setProperty('--up-r', `${rng.pick([6, 10, 12, 16])}px`);
          const head = util.el('div', 'up-head', panel);
          util.el('span', 'up-badge', head).innerHTML = EYE;
          util.el('span', 'up-title', head, rng.pick(TITLES[spec.scenario]));
          util.el('span', 'up-meta', head, `Task ${rng.int(2, 9)} of 10`);
          const body = util.el('div', 'up-body', panel);
          const recover = !!spec.recoverable;
          // Content budget inside the body: stage minus margins, title bar, body padding and the result bar.
          const B = { w: Math.floor(size.width - 24 - 48 - 4), h: Math.floor(size.height - 20 - 51 - 40 - (recover ? 45 : 0) - 4) };
          let bar = null;
          // The kit only calls sync() after time advances, so redraw here after every change.
          const up = (patch) => {
            ctx.update({ ...ctx.model, ...patch });
            view.sync(ctx.model);
            if (bar) bar.sync(ctx.model);
          };
          const inner = BUILDERS[spec.scenario](ctx, body, up, B);
          if (recover) bar = resultBar(ctx, panel, up);
          view = {
            sync(m) { inner.sync(m); if (bar) bar.sync(m); },
            locate(t) { return t.undo ? (bar ? bar.locate() : fail(t)) : inner.locate(t); },
          };
          view.sync(ctx.model);
          // Fit (scale down if the content is still too large), then place at a seeded spot of the free space.
          const r = panel.getBoundingClientRect();
          const k = Math.min(1, (size.width - 8) / r.width, (size.height - 8) / r.height);
          if (k < 1) panel.style.transform = `scale(${k.toFixed(4)})`;
          const w = r.width * k;
          const h = r.height * k;
          const pr = rng.fork('place');
          const fx = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]);
          const fy = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]);
          const mx = Math.min(16, Math.max(0, (size.width - w) / 2));
          const my = Math.min(12, Math.max(0, (size.height - h) / 2));
          panel.style.left = px(mx + fx * Math.max(0, size.width - 2 * mx - w));
          panel.style.top = px(my + fy * Math.max(0, size.height - 2 * my - h));
          return { anchors: [panel], sync: (m) => view.sync(m) };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) fail(t);
          return p;
        },
      });
    })();

    return captured;
  }
  env.template('read-figure/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`read-figure/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('read-figure/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`read-figure/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`read-figure/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['read-figure/_base-figures', 'read-figure/_base-controls', 'read-figure/_base-choices', 'read-figure/_base-widgets', 'read-figure/_styles'] });
})();
