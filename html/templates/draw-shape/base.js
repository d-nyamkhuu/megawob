// draw-shape/base: the base site's draw-shape widgets (canvas, chalkboard, whiteboard, atlas, canvasboard) as a template.
// This file is their source. The design-* sites that started from a copy of them, and the composite sites that embed
// them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/draw-shape.js). A named
// widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/draw-shape.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/draw-shape.js`, HTML).href };
    /*
     * reference / draw / canvas: an SVG drawing board, placed at a seeded spot inside the stage and sized from
     * ctx.size. Board units map to px with one isotropic scale (px per board height). Per scenario:
     *   line, circle, trace  graph-paper board with the targets; holding the left button records a stroke
     *               (env.ui.stroke: pointer capture, clamped to the board); a new stroke replaces the old one
     *   tool       a drawing app: toolbar (Pen, Line, Rectangle, Ellipse, Undo; shortcut letters and Ctrl+Z when
     *               the episode allows keys), live preview while dragging; line/rect/ellipse use press + release
     *   signature  a document page with a dashed "Sign here" field, the signer's name and a Clear / Accept row
     *               under the board; Accept is disabled while the pad is empty and locks the pad
     *   connect    a node diagram: nodes with an in port (left) and an out port (right); drag from a port to
     *               another node (or its port) to add an arrow; each arrow has a remove handle at its midpoint
     *               (faint until hovered)
     *   erase      a whiteboard with colored doodles; Pen / Eraser / Undo toolbar; the eraser deletes every
     *               stroke it touches (press or scrub); pen strokes are added as new ink
     *   multi      dots and dashed circles; every stroke stays and counts; Undo / Clear toolbar
     *   polygon    an SVG map (land, river, labelled streets, numbered pins or a named area). Pins: "Draw area"
     *               starts drawing; clicks add corners; clicking the first corner, a double-click or Enter
     *               closes it; Undo point (Backspace) / Clear. Outline: freehand loop, the last stroke counts
     *
     * reference / draw / whiteboard: a whiteboard app with a layers panel (line, circle, trace, tool, multi; traits.layers).
     *   An app header (board title, inert tool icons and Share), the board built by the same builders as 'canvas', and a
     *   Layers panel on the right: 3 named layers, each with a visibility eye (model.hide) and a row that selects the
     *   active layer (model.layer); one layer is locked (padlock). A press on the board while the active layer is hidden,
     *   locked or not the layer the task names (spec.layers.goal) draws nothing and says why in the panel. Plan targets
     *   { layer: i } (the row) and { eye: i } (its eye button).
     *
     * reference / draw / atlas: polygon only. The same map interactions (pins, outline) over a raster-tile map page:
     *   a header with title, search box and zoom buttons (inert), a 5-column tile grid (per-tile tint, seams, city
     *   blocks, parks, river, streets) under the figure, and the attribution below the board.
     */
    env.templateLib('draw-shape/_base-svg').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / draw / chalkboard: a classroom chalkboard on two stacked <canvas> layers (slate + ink)
     * in a wooden frame with a chalk tray and a felt eraser. A different coordinate frame from 'canvas':
     * the scored board (spec.board, 1.5 x 1) is inset by a margin inside a larger slate, the canvases run
     * at device-pixel resolution, and strokes drawn into the margin are clamped onto the board edge
     * (env.ui.stroke bounds). Chalk-textured ink, hand-lettered labels, per-seed slate color and smudges.
     * The eraser clears the board (the model's strokes become []), which is never needed by the oracle.
     * Supports the single-stroke scenarios (line, circle, trace); placed at a seeded spot in the stage.
     */
    env.templateLib('draw-shape/_base-chalk').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / draw / canvasboard: an infinite-canvas whiteboard. Everything the task is about is painted on one
     * <canvas> (no DOM or SVG per object): the board's frame, dot grid, sticky notes, connectors, doodles, targets and
     * ink, plus clutter (notes, shapes and a second frame) outside the frame. Only the floating frame is DOM: the board
     * name, avatars and Share (inert), a vertical toolbar (Hand, the scenario's tools, Undo / Clear) and a zoom widget
     * (−, percentage, +, Fit). A camera (pan offset + zoom) maps board units to canvas px with one isotropic scale; it
     * starts with the frame fitted in the free area (seeded zoom and offset), and the hand tool, a middle-button drag or
     * (connect) a drag on empty canvas pans it; − / + zoom about the view's centre. Hit testing is the widget's own:
     * ports, notes and connector remove handles are found from the computed geometry, and locate() maps every plan
     * target through the live camera. Scenarios:
     *   line, circle, trace  dots, guides and the route on the frame; a press draws a stroke, a new stroke replaces it
     *   tool       Pen / Line / Rectangle / Ellipse tools (shortcut letters and Ctrl+Z with spec.keys), Undo
     *   connect    nodes are sticky notes with an in port (left) and out port (right); drag from a port onto another
     *              note to add a connector; the × at a connector's midpoint (faint until hovered) removes it
     *   erase      colored doodles on the frame; Pen / Eraser / Undo; the eraser deletes any doodle it touches
     *   multi      dots and dashed circles; every stroke stays and counts; Undo / Clear
     */
    env.templateLib('draw-shape/_base-board').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    return captured;
  }
  env.template('draw-shape/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`draw-shape/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('draw-shape/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`draw-shape/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`draw-shape/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['draw-shape/_base-svg', 'draw-shape/_base-chalk', 'draw-shape/_base-board'] });
})();
