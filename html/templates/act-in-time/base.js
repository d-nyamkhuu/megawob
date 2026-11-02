// act-in-time/base: the base site's act-in-time widgets (arena) as a template. This file is their source. The design-*
// sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/act-in-time.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/act-in-time.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/act-in-time.js`, HTML).href };
    /*
     * reference / act-in-time / arena: a "mini-app console" card with a title bar (app name, live status,
     * task clock) and one timed mini-app per scenario. The card's size and position inside the stage are
     * sampled per episode. Everything that moves or waits is drawn from the model in sync(), which the kit
     * calls after it advances the task clock; the widget never uses timers.
     * Mechanics come from env.ui:
     *   chase    hover() on the board records the pointer (board units) into model.p on every pointermove
     *            and clears it on leave; the circle, a short trail of its recent path and the time meters
     *            are redrawn from model.t
     *   moving   board() turns presses into board points; the task's itemAt() hit-tests them against the
     *            shapes' positions at model.t (lanes with direction chevrons, shapes of 3 colors)
     *   chase and moving draw a board of the task's boardDims(spec): wide by default, upright (vertical lanes)
     *   when the widget declares traits.orient 'vertical'
     *   delay    buttons() for the target and distractor buttons ('enable': aria-disabled until ready with a
     *            spinner; 'appear': a skeleton placeholder in its place; 'interval': ONE and TWO on a dotted
     *            surface). Early clicks reach the model (the native disabled attribute would swallow them)
     *   simon    buttons() over the wedges of a Simon disc; presses during the show are ignored (logged)
     *   stock    a price chart (history up to now) and a ticker panel with a Buy button (buttons())
     *   popup    a sign-in card (textField() x2, "Log in") with either a modal dialog (dialog()) over the
     *            console body (fields disabled while open) or a non-modal cookie bar along the bottom of the
     *            body (a "Cookie settings" link reopens it); a failed login shows an error line; leaving via
     *            the dialog shows a "you left" page with a way back (recoverable mode)
     *   loading  a search bar with the prefilled query and a Search button; a spinner and skeleton rows while
     *            loading; result rows (thumbnail, name, rating, note, price); a result page with "Back"
     *   toast    a "verify it's you" card (Send / Resend code, code boxes, Verify) beside an on-screen keypad;
     *            the code arrives in a toast in a corner of the console with a shrinking life bar
     *   countdown a hold card with a live mm:ss timer and life bar, chip groups and a confirm button; a
     *            confirmation strip with "Cancel reservation"
     *   carousel a banner carousel (one slide visible, gradient art, title, CTA), arrows, dots, an auto-advance
     *            progress line and a "Paused" badge; a slide page with "Back"
     *   debounce a trip form whose city field (textField()) shows a spinner and a "Searching…" row while the
     *            debounce and fetch run, then a suggestion list (click or ArrowUp/Down + Enter)
     *   refresh  a list (avatar rows, inbox style) that reloads on the clock: skeleton rows at first, then rows that
     *            dim with a "Refreshing…" spinner while busy and come back reordered; a row page with "Back"
     *   deadline an offer card (claim button + decoy) or a slot picker: placeholders with a spinner until the
     *            content is ready, then live buttons with a time-left line and a shrinking bar, then "expired"
     *   search   a search box (textField()) over a result list: the list keeps showing the previous results (header
     *            "Popular products" / "N results for ...") until the debounced results arrive; a spinner shows
     *            while they load; a product page with "Back"
     * The newer scenarios change the model only through env.taskDef.helpers.act(). The console card is the anchor.
     * Round 2 (task facts / judge hooks): the status bar shows both press times of delay 'interval' (ONE at, TWO at) and
     * "City, Country (IATA) selected" for debounce; the deadline card confirms a claim inside the window ("Offer claimed with
     * 2.5 s to spare" / "Slot booked ..."); moving hides its "Catch <color>" card in a judge episode, whose goal names a color
     * the board does not have.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get ICON() { return ICON; },
        get APPS() { return APPS; },
        get clockText() { return clockText; },
        get sec1() { return sec1; },
        get NS() { return NS; },
        get initials() { return initials; },
        get BUILDERS() { return BUILDERS; },
        get view() { return view; }, set view(v) { view = v; },
        get ensureStyle() { return ensureStyle; },
        get frame() { return frame; },
        get sideCard() { return sideCard; },
        get boardSize() { return boardSize; },
        get boardSvg() { return boardSvg; },
        get spot() { return spot; },
        get buildChase() { return buildChase; },
        get shapeEl() { return shapeEl; },
        get buildMoving() { return buildMoving; },
        get spinner() { return spinner; },
        get buildDelay() { return buildDelay; },
        get buildSimon() { return buildSimon; },
        get buildStock() { return buildStock; },
        get buildPopup() { return buildPopup; },
        get stars() { return stars; },
        get buildLoading() { return buildLoading; },
        get buildToast() { return buildToast; },
        get buildCountdown() { return buildCountdown; },
        get buildCarousel() { return buildCarousel; },
        get buildDebounce() { return buildDebounce; },
        get buildRefresh() { return buildRefresh; },
        get buildDeadline() { return buildDeadline; },
        get buildSearch() { return buildSearch; },
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
      if (__has('frame')) frame = __parts['frame'](frame, __scope);
      if (__has('sideCard')) sideCard = __parts['sideCard'](sideCard, __scope);
      if (__has('boardSize')) boardSize = __parts['boardSize'](boardSize, __scope);
      if (__has('boardSvg')) boardSvg = __parts['boardSvg'](boardSvg, __scope);
      if (__has('spot')) spot = __parts['spot'](spot, __scope);
      if (__has('buildChase')) buildChase = __parts['buildChase'](buildChase, __scope);
      if (__has('shapeEl')) shapeEl = __parts['shapeEl'](shapeEl, __scope);
      if (__has('buildMoving')) buildMoving = __parts['buildMoving'](buildMoving, __scope);
      if (__has('spinner')) spinner = __parts['spinner'](spinner, __scope);
      if (__has('buildDelay')) buildDelay = __parts['buildDelay'](buildDelay, __scope);
      if (__has('buildSimon')) buildSimon = __parts['buildSimon'](buildSimon, __scope);
      if (__has('buildStock')) buildStock = __parts['buildStock'](buildStock, __scope);
      if (__has('buildPopup')) buildPopup = __parts['buildPopup'](buildPopup, __scope);
      if (__has('stars')) stars = __parts['stars'](stars, __scope);
      if (__has('buildLoading')) buildLoading = __parts['buildLoading'](buildLoading, __scope);
      if (__has('buildToast')) buildToast = __parts['buildToast'](buildToast, __scope);
      if (__has('buildCountdown')) buildCountdown = __parts['buildCountdown'](buildCountdown, __scope);
      if (__has('buildCarousel')) buildCarousel = __parts['buildCarousel'](buildCarousel, __scope);
      if (__has('buildDebounce')) buildDebounce = __parts['buildDebounce'](buildDebounce, __scope);
      if (__has('buildRefresh')) buildRefresh = __parts['buildRefresh'](buildRefresh, __scope);
      if (__has('buildDeadline')) buildDeadline = __parts['buildDeadline'](buildDeadline, __scope);
      if (__has('buildSearch')) buildSearch = __parts['buildSearch'](buildSearch, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('act-in-time/_styles').referenceCSS);

      const ICON = __has('ICON') ? __parts['ICON'](undefined, __scope) : ({
        clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.2"/><path d="M8 4.5V8l2.4 1.6" stroke-linecap="round"/></svg>',
        app: '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 8h3l2-4 2 8 2-4h1"/></svg>',
        check: '<svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#2f9e44"/><path d="M6.5 11.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4 4"/></svg>',
      });
      const APPS = __has('APPS') ? __parts['APPS'](undefined, __scope) : ({
        chase: [['Pointer Lab', 'tracking test'], ['Focus Trainer', 'follow the target'], ['Reflex', 'circle chase']],
        moving: [['Shape Catcher', 'arcade'], ['Conveyor', 'quality control'], ['Sorting Line', 'pick station']],
        delay: [['Portal', 'please wait'], ['Launcher', 'loading'], ['Timing Test', 'buttons']],
        simon: [['Simon', 'memory game'], ['Echo', 'repeat the pattern'], ['Recall', 'sequence trainer']],
        stock: [['Market Watch', 'live quotes'], ['TradeDesk', 'equities'], ['Ticker', 'real-time']],
        popup: [['Member Area', 'sign in'], ['Account', 'secure login'], ['Intranet', 'single sign-on']],
        loading: [['Shopfront', 'product search'], ['Catalog', 'search'], ['Marketplace', 'find products']],
        toast: [['Account', 'security check'], ['Secure Login', 'two-step'], ['Wallet', 'verify device']],
        countdown: [['Checkout', 'items on hold'], ['Booking', 'reservation'], ['Tickets', 'seat hold']],
        carousel: [['Storefront', 'featured'], ['Home', 'highlights'], ['Daily', 'top stories']],
        debounce: [['Trips', 'plan a journey'], ['Travel', 'search'], ['Shipping', 'address lookup']],
        refresh: [['Live Inbox', 'auto-refresh'], ['Helpdesk', 'live queue'], ['Orders', 'syncing']],
        deadline: [['Deals', 'limited time'], ['Offers', 'today only'], ['Slots', 'held briefly']],
        search: [['Shopfront', 'instant search'], ['Catalog', 'live search'], ['Market', 'type to search']],
      });

      let view = __has('view') ? __parts['view'](undefined, __scope) : (null); // live episode: { sync(m), locate(t) }

      function ensureStyle() {
        if (document.getElementById('ut-style')) return;
        const s = document.createElement('style');
        s.id = 'ut-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const clockText = __has('clockText') ? __parts['clockText'](undefined, __scope) : { clockText: (t) => {
        const s = Math.floor(t / 1000 + 1e-9);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      } }.clockText;
      const sec1 = __has('sec1') ? __parts['sec1'](undefined, __scope) : { sec1: (ms) => (ms / 1000).toFixed(1) }.sec1;

      // ---------------------------------------------------------------- console frame

      function frame(ctx) {
        const { util, rng, spec, size } = ctx;
        // Size and place the console inside the stage (not always centered, not always full size).
        const maxW = Math.min(1120, Math.floor(size.width) - 16);
        const W = Math.max(Math.min(maxW, 780), Math.round(maxW * rng.float(0.8, 1)));
        const maxH = Math.min(700, Math.floor(size.height) - 12);
        const H = Math.max(Math.min(maxH, 470), Math.round(maxH * rng.float(0.86, 1)));
        const arena = util.el('div', 'ut-arena', ctx.stage);
        arena.style.width = W + 'px';
        arena.style.height = H + 'px';
        arena.style.left = Math.round(rng.pick([0.5, 0.5, rng.float(0, 1)]) * (size.width - W)) + 'px';
        arena.style.top = Math.round(rng.pick([0.5, rng.float(0, 1)]) * (size.height - H)) + 'px';
        const bar = util.el('div', 'ut-bar', arena);
        const app = util.el('div', 'ut-app', bar);
        const ic = util.el('i', '', app);
        ic.innerHTML = ICON.app;
        const [name, sub] = rng.pick(APPS[spec.scenario]);
        util.el('span', '', app, name);
        util.el('small', '', app, sub);
        const status = util.el('div', 'ut-status', bar);
        const clock = util.el('div', 'ut-clock', bar);
        clock.innerHTML = ICON.clock;
        const clockT = util.el('span', '', clock, '0:00');
        const body = util.el('div', 'ut-body', arena);
        return {
          arena, body, status,
          setClock: (t) => { clockT.textContent = clockText(t); },
          setStatus: (html) => { status.innerHTML = html; },
        };
      }

      function sideCard(util, side, key) {
        const c = util.el('div', 'ut-card', side);
        util.el('div', 'ut-k', c, key);
        return c;
      }

      // Largest board of W x H board units (fam.helpers.boardDims: [A, 1], or [1, A] upright) that fits the main area.
      function boardSize(main, W, H) {
        const r = main.getBoundingClientRect();
        const w = Math.floor(Math.min(r.width, ((r.height - 2) * W) / H));
        return [w, Math.floor((w * H) / W)];
      }

      function boardSvg(util, main, [W, H], cls) {
        const [bw, bh] = boardSize(main, W, H);
        const svg = util.svg('svg', { class: `ut-board ${cls}`, width: bw, height: bh, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' }, main);
        const toBoard = ([x, y]) => {
          const r = svg.getBoundingClientRect();
          return [((x - r.left) / r.width) * W, ((y - r.top) / r.height) * H];
        };
        const fromBoard = ([bx, by]) => {
          const r = svg.getBoundingClientRect();
          return [r.left + (bx / W) * r.width, r.top + (by / H) * r.height];
        };
        return { svg, toBoard, fromBoard };
      }

      const NS = __has('NS') ? __parts['NS'](undefined, __scope) : ({ 'vector-effect': 'non-scaling-stroke' });

      // Place a w x h box at a sampled spot of `main` (clamped inside it); returns [left, top].
      function spot(rng, main, w, h, fx = [0.05, 0.95], fy = [0.05, 0.9]) {
        const r = main.getBoundingClientRect();
        return [Math.round(rng.float(fx[0], fx[1]) * Math.max(0, r.width - w)), Math.round(rng.float(fy[0], fy[1]) * Math.max(0, r.height - h))];
      }

      // ---------------------------------------------------------------- chase

      function buildChase(ctx, f, up) {
        return env.templateLib('act-in-time/_base-boards').buildChase(__scope, ctx, f, up);
      }

      // ---------------------------------------------------------------- moving

      function shapeEl(util, g, shape, r, fill) {
        let el;
        if (shape === 'circle') el = util.svg('circle', { r }, g);
        else if (shape === 'square') el = util.svg('rect', { x: -0.85 * r, y: -0.85 * r, width: 1.7 * r, height: 1.7 * r, rx: 0.2 * r }, g);
        else if (shape === 'triangle') el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.05 * r},${0.85 * r} ${-1.05 * r},${0.85 * r}` }, g);
        else el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.1 * r},0 0,${1.1 * r} ${-1.1 * r},0` }, g);
        el.setAttribute('class', 'ut-item');
        el.setAttribute('fill', fill);
        el.setAttribute('stroke-width', 2);
        el.setAttribute('vector-effect', 'non-scaling-stroke');
        return el;
      }

      function buildMoving(ctx, f, up) {
        return env.templateLib('act-in-time/_base-boards').buildMoving(__scope, ctx, f, up);
      }

      // ---------------------------------------------------------------- delay

      function spinner(util, parent) {
        const svg = util.svg('svg', { viewBox: '0 0 22 22' }, parent);
        util.svg('circle', { class: 'ut-spin-track', cx: 11, cy: 11, r: 8.5, fill: 'none', 'stroke-width': 3 }, svg);
        const arc = util.svg('path', { class: 'ut-spin-arc', d: 'M11 2.5A8.5 8.5 0 0 1 19.5 11', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
        return { svg, arc };
      }

      function buildDelay(ctx, f, up) {
        return env.templateLib('act-in-time/_base-boards').buildDelay(__scope, ctx, f, up);
      }

      // ---------------------------------------------------------------- simon

      function buildSimon(ctx, f, up) {
        return env.templateLib('act-in-time/_base-boards').buildSimon(__scope, ctx, f, up);
      }

      // ---------------------------------------------------------------- stock

      function buildStock(ctx, f, up) {
        return env.templateLib('act-in-time/_base-boards').buildStock(__scope, ctx, f, up);
      }

      // ---------------------------------------------------------------- popup

      function buildPopup(ctx, f) {
        return env.templateLib('act-in-time/_base-forms').buildPopup(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- loading

      function stars(r) {
        const full = Math.round(r);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
      }

      function buildLoading(ctx, f) {
        return env.templateLib('act-in-time/_base-lists').buildLoading(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- toast (one-time code)

      function buildToast(ctx, f) {
        return env.templateLib('act-in-time/_base-forms').buildToast(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- countdown (hold timer)

      function buildCountdown(ctx, f) {
        return env.templateLib('act-in-time/_base-forms').buildCountdown(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- carousel

      function buildCarousel(ctx, f) {
        return env.templateLib('act-in-time/_base-lists').buildCarousel(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- debounce (autocomplete)

      function buildDebounce(ctx, f) {
        return env.templateLib('act-in-time/_base-forms').buildDebounce(__scope, ctx, f);
      }


      // ---------------------------------------------------------------- refresh (busy list)

      const initials = __has('initials') ? __parts['initials'](undefined, __scope) : { initials: (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() }.initials;

      function buildRefresh(ctx, f) {
        return env.templateLib('act-in-time/_base-lists').buildRefresh(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- deadline (offer / slot window)

      function buildDeadline(ctx, f) {
        return env.templateLib('act-in-time/_base-lists').buildDeadline(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- search (debounced results)

      function buildSearch(ctx, f) {
        return env.templateLib('act-in-time/_base-lists').buildSearch(__scope, ctx, f);
      }

      // ---------------------------------------------------------------- widget

      const BUILDERS = __has('BUILDERS') ? __parts['BUILDERS'](undefined, __scope) : ({ chase: buildChase, moving: buildMoving, delay: buildDelay, simon: buildSimon, stock: buildStock, popup: buildPopup,
        loading: buildLoading, toast: buildToast, countdown: buildCountdown, carousel: buildCarousel, debounce: buildDebounce,
        refresh: buildRefresh, deadline: buildDeadline, search: buildSearch });

      env.widget({
        task: 'act-in-time',
        site: 'base',
        name: 'arena',
        split: 'train',
        scenarios: ['chase', 'moving', 'delay', 'simon', 'stock', 'popup', 'loading', 'toast', 'countdown', 'carousel', 'debounce', 'refresh', 'deadline', 'search'],

        render(ctx) {
          ensureStyle();
          const f = frame(ctx);
          const up = (patch) => ctx.update({ ...ctx.model, ...patch });
          view = BUILDERS[ctx.spec.scenario](ctx, f, up);
          const sync = (m) => {
            f.setClock(m.t);
            view.sync(m);
          };
          sync(ctx.model);
          return { anchors: [f.arena], sync };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) throw new Error(`act-in-time/arena cannot locate ${JSON.stringify(t)}`);
          return p;
        },
      });
    })();

    return captured;
  }
  env.template('act-in-time/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`act-in-time/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('act-in-time/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`act-in-time/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`act-in-time/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['act-in-time/_styles', 'act-in-time/_base-boards', 'act-in-time/_base-forms', 'act-in-time/_base-lists'] });
})();
