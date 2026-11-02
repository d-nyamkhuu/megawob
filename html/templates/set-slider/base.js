// set-slider/base: the base site's set-slider widgets (classic, arc, settings, nouislider, rcslider, mui, video) as a
// template. Their units and styles live in _base-*.js. The design-* sites that started from a copy of them, and the composite sites that
// embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/set-slider.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/set-slider.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/set-slider.js`, HTML).href };
    env.templateLib('set-slider/_base-classic').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    env.templateLib('set-slider/_base-arc').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    env.templateLib('set-slider/_base-nouislider').register(env, scriptOf, __parts, __has, (scope) => { scopeNow = scope; });

    // Library and canvas widgets: names, scenarios and the scripts they load. Their render / locate live in
    // widgets/slider-react.js (rcslider, mui) and widgets/slider-video.js (video), loaded last through `uses`, which fill in
    // these same definitions.
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get missing() { return missing; },
        get REACT() { return REACT; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+3.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      const missing = __has('missing') ? __parts['missing'](undefined, __scope) : { missing: (name, file) => () => { throw new Error(`set-slider/${name}: widgets/${file}.js did not load`); } }.missing;
      const REACT = __has('REACT') ? __parts['REACT'](undefined, __scope) : ([['../vendor/react-18.3.1/react.production.min', 'vendor'], ['../vendor/react-18.3.1/react-dom.production.min', 'vendor']]);

      env.widget({
        task: 'set-slider', site: 'base', name: 'rcslider', split: 'train',
        scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi', 'stops', 'mixer', 'match'],
        uses: [...REACT, ['../vendor/rc-slider-11.1.9/rcslider.min', 'vendor'], ['slider-react']],
        render: missing('rcslider', 'slider-react'),
        locate: missing('rcslider', 'slider-react'),
      });

      env.widget({
        task: 'set-slider', site: 'base', name: 'mui', split: 'train',
        scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi', 'stops', 'mixer', 'match', 'rating'],
        uses: [...REACT, ['../vendor/mui-material-5.18.0/material-ui.production.min', 'vendor'], ['slider-react']],
        render: missing('mui', 'slider-react'),
        locate: missing('mui', 'slider-react'),
      });

      env.widget({
        task: 'set-slider', site: 'base', name: 'video', split: 'train',
        scenarios: ['media', 'player'],
        uses: [['slider-video']],
        render: missing('video', 'slider-video'),
        locate: missing('video', 'slider-video'),
      });
    })();

    return captured;
  }
  env.template('set-slider/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`set-slider/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('set-slider/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`set-slider/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`set-slider/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['set-slider/_base-classic', 'set-slider/_base-arc', 'set-slider/_base-nouislider'] });
})();
