// solve-puzzle/base: the base site's solve-puzzle widgets (puzzle) as a template. This file is their source. The
// design-* sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/solve-puzzle.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/solve-puzzle.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
// Shared defaults: solve-puzzle/_theme (style/data) and solve-puzzle/_base-widgets (widget bodies).
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  // Registration keeps the reference units and their live scope; widget bodies live in the shared library.
  function registerPuzzle(env, scriptOf, __has, __parts, scopeReady) {
    'use strict';
    const __scope = {
      get env() { return env; },
      get scriptOf() { return scriptOf; },
      get CSS() { return CSS; },
      get ICONS() { return ICONS; },
      get ARROW_UP() { return ARROW_UP; },
      get ARROW_DOWN() { return ARROW_DOWN; },
      get CHECK() { return CHECK; },
      get MARK_X() { return MARK_X; },
      get MARK_O() { return MARK_O; },
      get BAND_COLOR() { return BAND_COLOR; },
      get META() { return META; },
      get FONTS() { return FONTS; },
      get pretty() { return pretty; },
      get fmtNum() { return fmtNum; },
      get html() { return html; },
      get eqHtml() { return eqHtml; },
      get BUILD() { return BUILD; },
      get st() { return st; }, set st(v) { st = v; },
      get ensureStyle() { return ensureStyle; },
      get numberField() { return numberField; },
      get buildEquation() { return buildEquation; },
      get buildOddEven() { return buildOddEven; },
      get buildGuess() { return buildGuess; },
      get buildGenerate() { return buildGenerate; },
      get buildHotCold() { return buildHotCold; },
      get buildTictactoe() { return buildTictactoe; },
      get buildCompute() { return buildCompute; },
      get buildFixError() { return buildFixError; },
      get usable() { return usable; },
      get build() { return build; },
    };
    for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
      let v; let built = false;
      Object.defineProperty(__scope, k.slice(3), {
        get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
        set: (x) => { built = true; v = x; },
      });
    }
    scopeReady(__scope);
    if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
    if (__has('numberField')) numberField = __parts['numberField'](numberField, __scope);
    if (__has('buildEquation')) buildEquation = __parts['buildEquation'](buildEquation, __scope);
    if (__has('buildOddEven')) buildOddEven = __parts['buildOddEven'](buildOddEven, __scope);
    if (__has('buildGuess')) buildGuess = __parts['buildGuess'](buildGuess, __scope);
    if (__has('buildGenerate')) buildGenerate = __parts['buildGenerate'](buildGenerate, __scope);
    if (__has('buildHotCold')) buildHotCold = __parts['buildHotCold'](buildHotCold, __scope);
    if (__has('buildTictactoe')) buildTictactoe = __parts['buildTictactoe'](buildTictactoe, __scope);
    if (__has('buildCompute')) buildCompute = __parts['buildCompute'](buildCompute, __scope);
    if (__has('buildFixError')) buildFixError = __parts['buildFixError'](buildFixError, __scope);
    if (__has('usable')) usable = __parts['usable'](usable, __scope);
    if (__has('build')) build = __parts['build'](build, __scope);

    const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').CSS);

    const ICONS = __has('ICONS') ? __parts['ICONS'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').ICONS);
    const ARROW_UP = __has('ARROW_UP') ? __parts['ARROW_UP'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').ARROW_UP);
    const ARROW_DOWN = __has('ARROW_DOWN') ? __parts['ARROW_DOWN'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').ARROW_DOWN);
    const CHECK = __has('CHECK') ? __parts['CHECK'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').CHECK);
    const MARK_X = __has('MARK_X') ? __parts['MARK_X'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').MARK_X);
    const MARK_O = __has('MARK_O') ? __parts['MARK_O'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').MARK_O);
    const BAND_COLOR = __has('BAND_COLOR') ? __parts['BAND_COLOR'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').BAND_COLOR);

    const META = __has('META') ? __parts['META'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').META);

    const FONTS = __has('FONTS') ? __parts['FONTS'](undefined, __scope) : (env.templateLib('solve-puzzle/_theme').FONTS);

    let st = __has('st') ? __parts['st'](undefined, __scope) : (null); // this episode's widgets

    function ensureStyle() {
      return env.templateLib('solve-puzzle/_base-widgets').ensureStyle(__scope);
    }

    const pretty = __has('pretty') ? __parts['pretty'](undefined, __scope) : { pretty: (expr) => expr.replace(/-/g, '−').replace(/\*/g, '×').replace(/\//g, '÷') }.pretty;
    const fmtNum = __has('fmtNum') ? __parts['fmtNum'](undefined, __scope) : { fmtNum: (n) => String(n).replace('-', '−') }.fmtNum;
    const html = __has('html') ? __parts['html'](undefined, __scope) : { html: (el, s) => { el.innerHTML = s; return el; } }.html;
    // Equation markup: digits and operators from the spec (no user text), x in italics.
    const eqHtml = __has('eqHtml') ? __parts['eqHtml'](undefined, __scope) : { eqHtml: (expr) => pretty(expr).replace(/x/g, '<i>x</i>') }.eqHtml;

    // ---------------------------------------------------------------- scenario bodies
    function numberField(ctx, parent, value, onInput, opts = {}) {
      return env.templateLib('solve-puzzle/_base-widgets').numberField(__scope, ctx, parent, value, onInput, opts);
    }
    function buildEquation(ctx, body) {
      return env.templateLib('solve-puzzle/_base-widgets').buildEquation(__scope, ctx, body);
    }
    function buildOddEven(ctx, body) {
      return env.templateLib('solve-puzzle/_base-widgets').buildOddEven(__scope, ctx, body);
    }
    function buildGuess(ctx, body) {
      return env.templateLib('solve-puzzle/_base-widgets').buildGuess(__scope, ctx, body);
    }
    function buildGenerate(ctx, body) {
      return env.templateLib('solve-puzzle/_base-widgets').buildGenerate(__scope, ctx, body);
    }
    function buildHotCold(ctx, body, avail) {
      return env.templateLib('solve-puzzle/_base-widgets').buildHotCold(__scope, ctx, body, avail);
    }
    function buildTictactoe(ctx, body, avail) {
      return env.templateLib('solve-puzzle/_base-widgets').buildTictactoe(__scope, ctx, body, avail);
    }
    function buildCompute(ctx, body, avail) {
      return env.templateLib('solve-puzzle/_base-widgets').buildCompute(__scope, ctx, body, avail);
    }
    function buildFixError(ctx, body, avail) {
      return env.templateLib('solve-puzzle/_base-widgets').buildFixError(__scope, ctx, body, avail);
    }

    // ---------------------------------------------------------------- widget

    // Usable part of the stage (stage-local px): the stage minus a floating end control inside it.
    function usable(ctx) {
      return env.templateLib('solve-puzzle/_base-widgets').usable(__scope, ctx);
    }

    const BUILD = __has('BUILD') ? __parts['BUILD'](undefined, __scope) : ({
      arithmetic: buildEquation, algebra: buildEquation, 'odd-even': buildOddEven, guess: buildGuess, generate: buildGenerate,
      'hot-cold': buildHotCold, tictactoe: buildTictactoe, compute: buildCompute, 'fix-error': buildFixError,
    });

    function build(ctx, box, squeeze) {
      return env.templateLib('solve-puzzle/_base-widgets').build(__scope, ctx, box, squeeze);
    }

    env.widget({
      task: 'solve-puzzle',
      site: 'base',
      name: 'puzzle',
      split: 'train',
      scenarios: ['arithmetic', 'algebra', 'odd-even', 'guess', 'generate', 'hot-cold', 'tictactoe', 'compute', 'fix-error'],

      render(ctx) {
        return env.templateLib('solve-puzzle/_base-widgets').render(__scope, ctx);
      },

      locate(t) {
        return env.templateLib('solve-puzzle/_base-widgets').locate(__scope, t);
      },
    });
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/solve-puzzle.js`, HTML).href };
    /*
     * reference / solve-puzzle / puzzle: one puzzle card per episode (title bar, body, status footer), offset
     * from the stage centre by a seeded amount. Card corner radius, header style (tinted band or ruled),
     * number typeface (sans, mono, serif) and sizes vary per seed. Mechanics come from env.ui:
     *   arithmetic / algebra   the problem in large type and one answer field (env.ui.textField, digits and
     *                          minus only); layout 'inline' (field right after "=") or 'stacked'
     *   odd-even               one row per number with Odd / Even buttons (env.ui.choices per row); layout
     *                          'sides' (Odd | number | Even, as in MiniWoB) or 'right' (number, then a
     *                          segmented Odd / Even pair)
     *   guess                  field + Guess button (env.ui.textField, env.ui.buttons; Enter in the field also
     *                          guesses), a feedback line and the guess history as chips; guesses left in the footer
     *   generate               a number display and a Generate button (env.ui.buttons)
     *   hot-cold               a click board (env.ui.board) with numbered markers for past clicks and a side
     *                          panel: temperature of the last click, warmer / colder than the one before,
     *                          clicks left. The spot is never drawn
     *   tictactoe              a 3x3 grid of cells (env.ui.buttons; taken cells and finished games ignore
     *                          clicks); X and O drawn in SVG, the winning line struck through
     *   compute                'sum' / 'count': a ruled table (invoice, expense report, payments) with the answer
     *                          field beside or below it; 'pick': a grid of offer cards (name, price, rating,
     *                          delivery) each with a Select button (env.ui.buttons); the chosen card is marked
     *   fix-error              a form (one or two columns of labeled fields, env.ui.textField) after a failed save:
     *                          a banner, red border and inline message on invalid fields, re-validated live with
     *                          the task's fieldValid(); every field reserves its message line
     * The card is placed absolutely inside the stage (sampled alignment, sized from ctx.size and kept clear of
     * a floating end control); it has a fixed size after setup and is the anchor (with the main control). When
     * the content does not fit, the card is rebuilt with tighter spacing (same draws).
     */
    registerPuzzle(env, scriptOf, __has, __parts, (scope) => { scopeNow = scope; });

    return captured;
  }
  env.template('solve-puzzle/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`solve-puzzle/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('solve-puzzle/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`solve-puzzle/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`solve-puzzle/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['solve-puzzle/_theme', 'solve-puzzle/_base-widgets'] });
})();
