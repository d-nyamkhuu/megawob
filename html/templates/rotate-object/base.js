// rotate-object/base: the base site's rotate-object widgets (stage, knobs, lines, viewer) as a template. This file is their
// registration entry; _base-stage/knobs/lines/viewer.js hold their implementations and unit hooks.
// The design-* sites that started from a copy of them, and the composite sites that embed them, are designs on
// it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/rotate-object.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/rotate-object.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/rotate-object.js`, HTML).href };
    env.templateLib('rotate-object/_base-stage').register({ env, scriptOf, __parts, __has,
      setScope(scope) { scopeNow = scope; } });

    // ================================================================ knobs
    env.templateLib('rotate-object/_base-knobs').register({ env, scriptOf, __parts, __has,
      setScope(scope) { scopeNow = scope; } });

    // ================================================================ lines
    env.templateLib('rotate-object/_base-lines').register({ env, scriptOf, __parts, __has,
      setScope(scope) { scopeNow = scope; } });

    // ================================================================ viewer
    env.templateLib('rotate-object/_base-viewer').register({ env, scriptOf, __parts, __has,
      setScope(scope) { scopeNow = scope; } });

    return captured;
  }
  env.template('rotate-object/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`rotate-object/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('rotate-object/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`rotate-object/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`rotate-object/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['rotate-object/_base-stage', 'rotate-object/_base-knobs', 'rotate-object/_base-lines', 'rotate-object/_base-viewer'] });
})();
