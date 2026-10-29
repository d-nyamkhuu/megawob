// resize-element/base: the base site's resize-element widgets (panel, drawer, window, interact) as a template. This file is
// their source; _base-*.js holds their original scopes and _styles.js their unchanged CSS. The design-* sites that started from a copy of them, and the composite sites that embed them, are
// designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/resize-element.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/resize-element.js (what
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
    const setScope = (scope) => { scopeNow = scope; };
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/resize-element.js`, HTML).href };
    /*
     * reference / resize / panel: all scenarios.
     *   numeric, ghost, relative: a window-like panel inside a dotted workspace, pinned at the corner opposite
     *     spec.grip (so dragging a left or top handle moves the panel's origin). The grip is always shown; on
     *     some seeds the other handles that share the same fixed corner too. Live preview; a size readout in the
     *     panel (spec.readout), otherwise px rulers along the fixed edges. ghost: the target as a dashed outline at
     *     the fixed corner. relative/ref: a reference bar (width goals) above or below the workspace, or a
     *     reference column (height goals) beside it, drawn at the target size and aligned with the fixed edge.
     *   textarea: a form card with a native <textarea> (CSS resize both / vertical / horizontal, the browser's own
     *     grip); the size is read from the element after pointer moves. A size caption for numeric goals, a
     *     dashed outline for outline goals, nothing for "at least N px taller".
     *   column: a data table with a resize grip on the right border of every header cell; a column-width bar
     *     under the table (spec.readout) or a px ruler above it.
     *   split: two panes and a divider (vertical or horizontal); pane headers show their size (spec.readout).
     *   aspect: the panel, plus a "keep proportions" lock toggle (chain icon) in a toolbar above the workspace (model.lock,
     *     target { lock: true }); a locked drag keeps the ratio (env.ui.resizable aspect: true), and so does a drag
     *     started with Shift held. The corner that shares the fixed point (spec.corner) is always shown too.
     * Keyboard episodes: the grip / divider is focusable (a press focuses it); arrows move it by spec.kstep px
     * (Shift: x10), Home/End for dividers (taskDef.helpers.keyApply); focus is mirrored into model.focus.
     * Everything is placed at a sampled position inside the stage, away from the site's floating end button.
     * Mechanics: env.ui.resizable (panel), native resize (textarea), env.util.drag (columns, divider).
     *
     * reference / resize / window: numeric, ghost, aspect. A desktop window-manager scene: a wallpaper desk with
     * inert desktop icons and a taskbar, and one application window pinned at the corner opposite spec.grip.
     * The window has real frame: a title bar (Windows-style min / max / close on the right, or mac-style traffic
     * lights on the left; all inert decoys that only log 'decoy'), a menu strip and a status bar. Resize zones
     * sit on every edge / corner that keeps the fixed corner (always spec.grip and spec.corner) and are invisible
     * until the pointer is over the window. The body reflows while resizing: paragraphs wrap and a CSS auto-fill
     * grid of tiles changes its column count. The size shows in the status bar (spec.readout), otherwise px
     * tick marks run along the desk edges from the fixed corner. aspect: a "keep proportions" toggle in the title
     * bar (model.lock); Shift at the press also locks one drag. Mechanics: env.ui.resizable on the window frame.
     *
     * reference / resize / drawer: a textarea-like notes box docked to the top-right corner of a dark
     * editor pane, so it grows leftwards and down from a single ribbed grip in its bottom-left corner
     * (traits.grips = ['sw']: the task samples that grip). numeric and ghost only.
     */
    env.templateLib('resize-element/_base-panel').register({ env, scriptOf, __parts, __has, setScope });

    env.templateLib('resize-element/_base-drawer').register({ env, scriptOf, __parts, __has, setScope });

    /*
     * reference / resize / interact: the panel scene (numeric, ghost, relative, aspect) resized with interact.js 1.10.27
     * (vendored): one `resizable` on a frame that holds the panel and its handles, `edges` given as handle selectors, and
     * interact's own modifiers doing the clamping: `restrictSize` (the task's min and max), `snapSize` on a small grid
     * in a sampled half of the episodes (the grid is finer than the tolerance, so the target stays reachable) and
     * `aspectRatio` (preserve the ratio the gesture started with) while the aspect lock is on or Shift is held at the
     * press (a toggle in a toolbar above the workspace, model.lock). The frame is pinned at the corner opposite
     * spec.grip by CSS, so dragging a left or top handle changes the size and the origin follows. Quirks kept: the
     * resize starts on the first pointer move after the press, sizes come from the pointer's offset since the press
     * (the grab point on the handle does not matter) and a handle is only active where it is drawn.
     * The shown handles are spec.grip, the corner that shares its fixed point (aspect) and, in half of the episodes,
     * every other handle that keeps the same corner. A readout or px rulers show the size, as in the panel widget.
     * Keyboard episodes (spec.keys): the grip is focusable and arrows nudge it (env.taskDef.helpers.keyApply).
     */
    env.templateLib('resize-element/_base-interact').register({ env, scriptOf, __parts, __has, setScope });

    return captured;
  }
  env.template('resize-element/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`resize-element/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('resize-element/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`resize-element/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`resize-element/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['resize-element/_base-panel', 'resize-element/_base-drawer', 'resize-element/_base-interact'] });
})();
