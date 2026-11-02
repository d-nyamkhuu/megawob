// sort-into-bins/base: the base site's sort-into-bins widgets (boxes, scroll, native, lanes, interact, dragula) as a template.
// This file is their source. The design-* sites that started from a copy of them, and the composite sites that embed
// them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/sort-into-bins.js). A named
// widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/sort-into-bins.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/sort-into-bins.js`, HTML).href };
    /*
     * reference / bins / boxes: a dotted board with outlined boxes (labeled for sort, unlabeled when named by
     * position) and colored SVG shapes; a desktop with file icons, icon-sized folders, a Trash and a folder
     * window (desk); a shape palette next to a canvas with a frame (palette).
     *   shapes   drag freely in 2D (env.ui.draggable) and drop wherever they are released (no snapping); a
     *            dragged shape goes on top of the others (the stacking order is mirrored into model.z, so piles
     *            can be unstacked). The box under a dragged shape lights up when it fits inside (env.ui.dropzones).
     *   desk     files drop into a folder when released over its icon (the icon highlights); clicking a folder
     *            opens a window listing its files, which drag out like desktop files; the window closes with ×.
     *   palette  pressing a template drags out a new copy (a ghost follows the pointer); dropping on the canvas
     *            places it; dragging a placed copy back over the palette deletes it.
     * The board is sized from the stage and placed with a sampled margin.
     * Three widgets share the boxes code (single, collect, sort; boxes also desk and palette):
     *   boxes    as above. With spec.snap ('slot' | 'arrange', traits.snap) a dropped item snaps to the nearest free
     *            slot of the box it is released over, or the box's items re-flow into reading order.
     *   scroll   the board is taller than its pane (spec.tall = visible fraction of the board's height): the pane
     *            scrolls with the wheel or a custom scrollbar (spec.route 'wheel' | 'thumb' is how the oracle
     *            scrolls); the scroll window is mirrored into model.view. Pointer drags as in boxes, snap as above.
     *   native   real HTML5 drag-and-drop: items are draggable, the board takes the drop (position = release point
     *            minus the grab offset); the source item dims while the browser's drag image follows the pointer.
     *            In a sampled half of the episodes (reveal mode) boxes show only a faint outline until an item is
     *            dragged over them; snap as above. No pointerup fires for a native drag: nothing here uses it.
     * The lanes widget (end of file) turns the containers into kanban-style swimlanes.
     */
    env.templateLib('sort-into-bins/_base-board').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / bins / lanes: kanban-style swimlanes. Each container becomes a lane (a column with a header,
     * a count and a wrapping body of item cards) and everything outside the containers waits in an extra lane
     * (Unsorted / Backlog / Inbox). Scenarios single, collect, sort. The model is the same free 2D board: a card
     * counts as being in lane c when its position lies in container c (env.taskDef.helpers.where), and a drop onto a lane
     * puts the card on the lane's next free slot (env.taskDef.helpers.freeSlot) or, in the extra lane, on a free spot
     * outside every container (freeOutside). Cards are pressed and carried with pointer events (env.ui.track) and
     * follow the pointer by a CSS transform; the lane under the pointer lights up; a release outside every lane
     * puts the card back. Lanes follow the instruction's wording: left / right order for side-named boxes, side
     * names (Top box, Bottom box) in the header, the label of a sort container. Cards in a lane keep slot order;
     * traits: noPile (cards never overlap, so every press point is a card center).
     * Plan targets: { item } is a card's center, { point } maps to the lane holding that board point.
     */
    env.templateLib('sort-into-bins/_base-lanes').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / bins / interact: the dotted board of the boxes widget with its items and boxes driven by interact.js
     * 1.10.27 (vendored). Scenarios single, collect, sort. Every item is an interact `draggable` (inertia off, a
     * restrictRect modifier keeps it on the board, interact's own start rule: the drag starts on the first pointer move)
     * and every box an interact `dropzone` whose `overlap` rule (the pointer, the item's centre, or a fraction of the item's
     * area, drawn per episode) decides when the box lights up. Where an item ends is its own position; the task
     * decides what counts as inside (env.taskDef.helpers.snapDrop for snapping, spec.snap 'slot' | 'arrange', traits.snap).
     * A sampled half of the episodes also use interact's grid snap on the dragged item (a `snap` modifier on a coarse
     * grid), which moves the release point by up to half a cell.
     *
     * reference / bins / dragula: kanban-style lanes (as the lanes widget) whose cards are moved between lane bodies by
     * dragula 3.7.3 (vendored): the card follows the pointer as a `gu-mirror` clone, the real card jumps live to the lane
     * body under the pointer, a release outside every lane is reverted (revertOnSpill). The model is the free 2D board:
     * a card is in lane c when its position lies in container c; a drop puts it on the lane's next free slot
     * (env.taskDef.helpers.freeSlot) or, in the extra lane, outside every container (freeOutside). Scenarios single, collect, sort.
     */
    env.templateLib('sort-into-bins/_base-libraries').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    return captured;
  }
  env.template('sort-into-bins/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`sort-into-bins/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('sort-into-bins/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`sort-into-bins/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`sort-into-bins/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['sort-into-bins/_base-board', 'sort-into-bins/_base-lanes', 'sort-into-bins/_base-libraries'] });
})();
