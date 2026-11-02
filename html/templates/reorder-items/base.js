// reorder-items/base: the base site's reorder-items widgets (cards, table, native, sortablejs, jqueryui, dragula, pangea,
// dndkit) as a template. This file is their source. The design-* sites that started from a copy of them, and the
// composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/reorder-items.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/reorder-items.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/reorder-items.js`, HTML).href };
    /*
     * reference / reorder widgets, both built on env.ui.sortable (kit/ui/sortable.js).
     *
     * cards  absolutely positioned cards that follow the pointer (slots mode: the widget computes every
     *        slot). Other cards reflow live around the nearest slot (list, move, grid), or the card drops into
     *        the column under it (kanban). Kanban boards with many columns sit in a horizontally scrolling pane
     *        with a custom scrollbar (wheel over the pane, or drag the thumb); the pane's layout facts are
     *        mirrored into model.pane for the plan. Carrying a card into a pane edge pans toward that side;
     *        the depth into the edge band determines how much of the board is revealed. Crowded columns stack.
     * table  a data table (list, move) or a spreadsheet grid (grid) laid out by the browser (measured mode):
     *        rows are dragged by a grip handle only and slide vertically; grid cells drag freely.
     *
     * Both: realistic rows (title, value, tag badge), a key panel for legend rules, pinned items (lock icon,
     * no grip, re-pinned after every drop with env.taskDef.helpers.pin), keyboard reorder when spec.keys (focus an
     * item, arrows; the focused item is mirrored into model.focus), and the widget placed at a sampled offset.
     */
    env.templateLib('reorder-items/_base-cards').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / reorder / table: the same task as a data table. Measured mode: the browser lays out
     * the rows and cells, env.ui.sortable reads their boxes at press time and slides them with transforms.
     *   list, move  table rows with a rank column; a row moves only by its grip and only vertically; the gap
     *               is marked by a tinted band (the placeholder, sized by the widget's place()). Pinned rows show
     *               a lock instead of a grip. Value and tag columns for realistic rules.
     *   grid        a spreadsheet: lettered columns, numbered rows, one item per cell; any cell drags in 2D.
     */
    env.templateLib('reorder-items/_base-table').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / reorder / native, sortablejs: items laid out by the browser (flex / grid, no absolute
     * positions) and reordered by real HTML5 drag-and-drop. Both widgets share the DOM builders and the oracle
     * geometry (drop on a card of the same list: the dragged item takes that card's index; drop on another
     * column's card: it goes before it when pressed in the upper half, after it in the lower half; below the
     * cards: appended) and differ in mechanics.
     *   native      own dragstart / dragover / drop handlers. Nothing moves during the drag: an insertion line
     *               (horizontal in lists and columns, vertical in grids) marks where the item will land, the
     *               source card dims. Position is computed from the drop point alone (one dragover is enough, so a
     *               single press-move-release lands correctly). Pointer events are cancelled by the browser at
     *               dragstart (no pointerup): nothing here depends on them.
     *   sortablejs  SortableJS 1.15.6 (vendor/, native-DnD mode, animation 0): the real card moves in the DOM
     *               while dragging, a dashed ghost marks the gap. The vendored script is loaded through the
     *               widget's `uses` list (the kit awaits it before the first render).
     * Scenarios list, move, grid, kanban. Kanban cards are multi-line (traits.cardMeta: title, price, two detail
     * lines, status badges, owner initials) and boards with spec.pane sit in a horizontally scrolling pane
     * (wheel only: traits.wheelPane; the scroll offset and column extents are mirrored into model.pane). Pinned
     * items (spec.locked) are not draggable and are re-pinned after every drop; keyboard episodes (spec.keys)
     * move the focused item with the arrow keys (focus mirrored into model.focus).
     */
    env.templateLib('reorder-items/_base-native').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    /*
     * reference / reorder / jqueryui and dragula: the same rows, tiles and kanban boards as native / sortablejs, driven
     * by real vendored libraries. Both let the library move the real elements and read the result from the DOM at the
     * end of the drag (jQuery UI `stop`, dragula `drop`), so the library's own rules decide where an item lands.
     *   jqueryui  jQuery 3.7.1 + jQuery UI 1.13.3 sortable. Quirks kept: an activation distance (a press that moves
     *             less than `distance` px starts nothing), a helper that is the card itself (position absolute, grabbed
     *             where it was pressed) or a clone, a placeholder that swaps with the item under the pointer by
     *             `tolerance` ('intersect': only in the half of the item the drag is heading to; 'pointer': anywhere on
     *             it) and the direction of the last pointer move, `containment` of lists inside their box, `axis: 'y'`
     *             on lists, kanban columns joined with `connectWith`. Scenarios list, grid, move, kanban.
     *   dragula   dragula 3.7.3. Quirks kept: the item moves live to the spot under the pointer (before or after the
     *             hovered item by which half of it the pointer is in; grids by the horizontal half), a `gu-mirror`
     *             clone follows the pointer, a drop outside every container is reverted (revertOnSpill). Scenarios list,
     *             grid, move, kanban.
     * Both: pinned items (spec.locked) have no handle for the library and are re-pinned after every drop; keyboard
     * episodes (spec.keys) move the focused item with the arrow keys; kanban boards with spec.pane sit in a pane that
     * scrolls with the wheel (traits.wheelPane). The plan only ever drags an item up the list (to an earlier slot) or
     * appends it to a column, so locate() aims at the half of the target item the drag is heading to.
     */
    env.templateLib('reorder-items/_base-libraries').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    // React widgets on real React drag libraries: names, scenarios, traits and the scripts they load. Their render / locate
    // live in widgets/reorder-react.js (loaded last through `uses`), which fills in these same definitions.
    env.templateLib('reorder-items/_base-react').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    return captured;
  }
  env.template('reorder-items/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`reorder-items/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('reorder-items/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`reorder-items/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`reorder-items/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['reorder-items/_base-cards', 'reorder-items/_base-table', 'reorder-items/_base-native', 'reorder-items/_base-libraries', 'reorder-items/_base-react'] });
})();
