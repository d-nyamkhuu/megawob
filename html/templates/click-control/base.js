// click-control/base: the base site's click-control widgets (controls, desktop, eras) as a template. This file is their
// entry point; its units live in _base-*.js. The design-* sites that started from a copy of them, and the composite sites that embed them, are designs on
// it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/click-control.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/click-control.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates". Unit names and mutable bindings are retained below; implementations receive the live scope.
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/click-control.js`, HTML).href };
    // These accessors are the original reference IIFE's scope: all existing design keys stay live.
    const values = { env, scriptOf };
    const mutable = new Set(['view', 'blankEl', 'ERA', 'view2']);
    const __scope = {};
    for (const key of [
      'env', 'scriptOf', 'CSS', 'BRANDS', 'NAV', 'SIDE',
      'TITLES', 'PAST', 'HOVER_FILL', 'CHEVRON', 'ICON_PATHS', 'icon',
      'FILE_COLORS', 'linkPoint', 'fail', 'must', 'fam', 'fromNotice',
      'CSS_HIDDEN', 'HERO', 'FEATS', 'PRODUCTS', 'SHOP_LINKS', 'BUILDERS',
      'CSS2', 'decoMenus', 'BUILDERS2', 'CSS3', 'ERA_MODES', 'RIPPLE_MS',
      'eraHost', 'view', 'blankEl', 'ERA', 'view2', 'fileIcon',
      'ensureStyle', 'frame', 'box', 'paragraph', 'recovery', 'surface',
      'lookClass', 'makeButton', 'buildButton', 'buildSequence', 'buildLink', 'buildTab',
      'buildMenu', 'buildCollapsible', 'buildDialog', 'buildPie', 'buildWidget', 'buildFocus',
      'buildHover', 'tooltip', 'buildTooltip', 'buildRows', 'fileView', 'chooseLayout',
      'buildContext', 'buildOpen', 'buildHoverMenu', 'buildFlyout', 'buildRowReveal', 'mount',
      'window2', 'dTab', 'dMenu', 'dCollapsible', 'dPie', 'dDialog',
      'deskIcons', 'dContext', 'dOpen', 'eraFit', 'iconFor', 'ripple',
      'tickRipples', 'eraButton', 'buildFabScreen'
    ]) {
      Object.defineProperty(__scope, key, {
        enumerable: true, configurable: true,
        get() {
          if (!(key in values)) throw new ReferenceError(`Cannot access '${key}' before initialization`);
          return values[key];
        },
        ...(mutable.has(key) ? { set(v) { values[key] = v; } } : {}),
      });
    }
    for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
      let v; let built = false;
      Object.defineProperty(__scope, k.slice(3), {
        get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
        set: (x) => { built = true; v = x; },
      });
    }
    scopeNow = __scope;
    const modules = ['_base-frame', '_base-controls', '_base-records', '_base-navigation', '_base-mount', '_base-desktop', '_base-eras']
      .map((name) => env.templateLib(`click-control/${name}`));
    for (const lib of modules) {
      for (const [name, fn] of Object.entries(lib.functions)) values[name] = fn.bind(null, __scope);
    }
    for (const key of [
      'fileIcon', 'ensureStyle', 'frame', 'box', 'paragraph', 'recovery',
      'surface', 'lookClass', 'makeButton', 'buildButton', 'buildSequence', 'buildLink',
      'buildTab', 'buildMenu', 'buildCollapsible', 'buildDialog', 'buildPie', 'buildWidget',
      'buildFocus', 'buildHover', 'tooltip', 'buildTooltip', 'buildRows', 'fileView',
      'chooseLayout', 'buildContext', 'buildOpen', 'buildHoverMenu', 'buildFlyout', 'buildRowReveal',
      'mount', 'window2', 'dTab', 'dMenu', 'dCollapsible', 'dPie',
      'dDialog', 'deskIcons', 'dContext', 'dOpen', 'eraFit', 'iconFor',
      'ripple', 'tickRipples', 'eraButton', 'buildFabScreen'
    ]) {
      if (__has(key)) values[key] = __parts[key](values[key], __scope);
    }
    const set = (key, value) => { values[key] = value; };
    for (const lib of modules) lib.initialize(__scope, set, __has, __parts);

    return captured;
  }
  env.template('click-control/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`click-control/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('click-control/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`click-control/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`click-control/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['click-control/_base-frame', 'click-control/_base-controls', 'click-control/_base-records', 'click-control/_base-navigation', 'click-control/_base-mount', 'click-control/_base-desktop', 'click-control/_base-eras'] });
})();
