/*
 * templates / act-in-time / arena: the arena console (a bar with status and clock over the body) around one timed
 * widget per scenario, which the widget's scenario picks: chase (moving circle, elapsed and dwell meters), delay
 * (delayed-action card or interval buttons), moving (shapes sliding along lanes), popup (sign-in form with a modal
 * or cookie notice), simon (rectangular pads, phase and history), stock (quote, price chart and order form).
 * design: {} reproduces design-act-in-time-chase-01, -delay-02, -moving-03, -popup-08, -simon-01 and -stock-01.
 * Lineage medoid: design-act-in-time-delay-04; each widget keeps its own original rng order.
 * Tokens (defaults before VARIANTS; counts are sites of the scenario):
 *   clockPad: false; pad clock minutes (delay-10 and delay-12).
 *   chase: elapsedLabel 'Time elapsed' (Time Elapsed in 2/12) and insideLabel 'Pointer dwell time inside circle',
 *     the metric labels; sideTarget null, frame selector receiving the side panel; sidePlacement 'append', its
 *     DOM method (prepend for footer layouts); metricsTarget null, separate frame container for the metrics;
 *     motionOnly false, filter zero-motion pointer events (3/12); clearView false, expose the clear/detach
 *     lifecycle (2/12); clearOnRender false, also detach before render (chase-04).
 *   delay: process false, array of process-step labels; waitText null, wait label (Waiting… in 2/12);
 *     intervalWidth 1, fraction of the main width the interval surface uses.
 *   moving: triangle false, triangle silhouette; caughtLabel false, remaining count and Shapes to catch label
 *     (moving-09).
 *   popup: loginTitle null, fixed title (null draws one; a fixed title skips that rng.pick); loginSubtitle null;
 *     dialogTitle and dialogText null, fixed modal heading and paragraph (null keeps the sampled two paragraphs);
 *     stayLabel null, replaces the sampled stay label; hideLeave false, hide the leave choice; geometric false,
 *     backdrop decoration; openPending false, open a pending popup through a model update (2/12);
 *     pendingVisible false, show a pending modal without changing the model (popup-07).
 *   stock: namesClass 'ds-stock-name', quote name class; showStats false, four market facts; chartTitle null;
 *     chartColor '#4199e6', price line and marker; quantityLabel 'Quantity' and quantity '100', the order
 *     quantity row; symbolField null, symbol label before Action; estimate true, cost/buying-power panel; quick
 *     true, quick values and clear binding.
 * Presets (VARIANTS): chase sideTarget '.ds-brief' (7/12); delay the four-step process strip (7/12); moving
 *   triangle (10/12); popup the Welcome Back login copy, System Update dialog, Close, hideLeave and geometric;
 *   stock showStats and chartTitle (11/12); simon none.
 * Parts are factories {name: (base, S) => replacement}; unknown names throw in templateDesign.
 * S.ctx, S.spec, S.frame, S.view (settable), S.D and S.P are live; S.els stores page decorations.
 * Shared parts (arguments -> result; default behavior):
 *   ensureStyle() -> void: install the ut-style sheet once.
 *   clockText(ms) -> string: task time m:ss (clockPad pads minutes).
 *   sec1(ms) -> string: seconds to one decimal place.
 *   frame(ctx) -> {arena,body,status,setClock,setStatus}: full-stage console; moving: the sampled console,
 *     seven draws in the original order.
 *   begin(ctx): before style/frame creation. beforeBuild(ctx, f): after frame, before widget. rendered(ctx, f):
 *     after widget, before first sync. beforeSync(ctx, f, m), synced(ctx, f, m): around each widget sync.
 *     afterRender(ctx, f): after the initial sync, before anchors. Noops unless the scenario says otherwise.
 *   build(ctx, f, up) -> view {sync, locate, detach?}: the scenario's widget.
 * Parts of one scenario (only the widget's scenario defines them; a design naming another scenario's part throws):
 *   chase, moving: sideCard(util, parent, label) -> el: labeled ut-card. boardSize(main, aspect) -> [w,h]:
 *     largest fitting board. boardSvg(util, main, aspect, cls) -> {svg,toBoard,fromBoard}: live DOM coordinates.
 *   chase: build: grid, trajectory, circle and hover tracking. rendered: move side/metrics into frame, then
 *     P.resizeBoard. metrics(ctx, main, side) -> {leftV,leftM,insV,insM,pill}: elapsed and dwell cards.
 *     details(ctx, details): four target facts. hover(ctx, board, up) -> {detach}: hover binding.
 *     metricValue(valueMs, totalMs) -> string: one-decimal value / total seconds. extraMetrics(ctx, main,
 *     metrics): before details (noop). readout(ctx, main): after details, before hover (noop). metricsSync(ctx,
 *     m): after meters, before frame status (noop). resizeBoard(ctx, f): fit board to stage, update the diameter.
 *   delay: build: interval surface or delayed-action card. beforeBuild: process strip when D.process is an array.
 *     spinner(util, parent) -> {svg,arc}. delayBegin(ctx): before the main area (noop). main(ctx, main): before
 *     the mode branch (noop). interval(ctx, {main,surf,els,pad,W,H}): after interval buttons, before binding
 *     (noop). delayState(ctx, card) -> extra: decorations after status, before actions ({}). actions(ctx, card)
 *     -> parent of the action row (card). go(ctx, f, go): after target creation, before sizing/binding (noop).
 *     card(ctx, layout): after card binding, before sync (noop). waitText(ctx, ready) -> string: Ready, or
 *     D.waitText / the mode's wait text. delaySync(ctx, layout, m, ready): after status text; layout has extra.
 *   moving: build: lanes, shapes and board hit testing. shapeEl(util, group, shape, radius, fill) -> el:
 *     silhouettes. side(ctx, f) -> el: ut-side container. board(ctx, board, main): before lanes (noop).
 *     item(ctx, main, group, item, index): shape and tooltip. metrics(ctx, side) -> state: Catch/Caught/Missed
 *     cards and tally. metricsSync(ctx, f, metrics, m): counts, tally, misses and frame status. hit(ctx, sync):
 *     after a successful shape click (noop).
 *   popup: build(ctx, f): sign-in form, modal/cookie notice and recoverable exit. beforeBuild: geometric
 *     decoration and pending-popup model update. loginHeading(ctx, card): title. loginIntro(ctx, main, card) ->
 *     subtitle element or null. fields(ctx, card, userEl, passEl) -> extra: after fields, before error/login
 *     ({}). loginButton(ctx, button, fieldExtra): before signed-in notice (noop). dialogContent(ctx, box): fixed
 *     heading/text or the two sampled paragraphs. dialogButtons(ctx, box, row, choice, mk): before button
 *     order/placement/binding (noop). loginSync(ctx, layout, m): after field/signed state and status (noop).
 *     popupOpen(m) -> bool: open, or also pending with pendingVisible.
 *   simon: build: rectangular pads, phase and history; no rng draws.
 *   stock: build: quote, historical chart and order form. quote(ctx, quote) -> extra: after price ({}).
 *     stats(ctx, quote): four market statistics when showStats. chartTitle(ctx, market). history(ctx) -> prices:
 *     31 draws from the historical-prices fork, shifted to the opening price. chartX(ctx, history, index),
 *     chartY(ctx, low, high, price) -> px. axes(ctx, chart, X, Y, low, high): grid and price labels.
 *     afterAxes(ctx, chart, X, Y): before threshold and price paths (noop). recent(ctx, market, history): six
 *     recent-price cells. orderFields(ctx) -> [label,value][]. estimate(ctx, order) -> el|null. notes(ctx,
 *     root): four order instructions. extraOrder(ctx, root): after notes (noop). frame(ctx, root, history, up,
 *     sync): quick values and clear handler when quick. samples(ctx, history, index) -> history plus live
 *     prices. quoteSync(ctx, extra, history, m), stockSync(ctx, {root,buy}, m): sync hooks (noop).
 * Keep replaced parts' rng draws in order; additional decoration uses a named fork.
 */
(function () {
  'use strict';

  const NS = { 'vector-effect': 'non-scaling-stroke' };
  const ICON = {
    check:
      '<svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#2f9e44"/><path d="M6.5 11.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.2"/><path d="M8 4.5V8l2.4 1.6" stroke-linecap="round"/></svg>',
    app: '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 8h3l2-4 2 8 2-4h1"/></svg>',
  };
  const APPS = { moving: [['Shape Catcher', 'arcade'], ['Conveyor', 'quality control'], ['Sorting Line', 'pick station']] };
  const TOKENS = {
    clockPad: false,
    // chase
    elapsedLabel: 'Time elapsed',
    insideLabel: 'Pointer dwell time inside circle',
    sideTarget: null,
    sidePlacement: 'append',
    metricsTarget: null,
    motionOnly: false,
    clearView: false,
    clearOnRender: false,
    // delay
    process: false,
    waitText: null,
    intervalWidth: 1,
    // moving
    triangle: false,
    caughtLabel: false,
    // popup
    loginTitle: null,
    loginSubtitle: null,
    dialogTitle: null,
    dialogText: null,
    stayLabel: null,
    hideLeave: false,
    geometric: false,
    openPending: false,
    pendingVisible: false,
    // stock
    namesClass: 'ds-stock-name',
    showStats: false,
    chartTitle: null,
    chartColor: '#4199e6',
    quantityLabel: 'Quantity',
    quantity: '100',
    symbolField: null,
    estimate: true,
    quick: true,
  };
  const SCENARIOS = {
    chase: { sideTarget: '.ds-brief' },
    delay: { process: ['1. Load Images', '2. Apply Settings', '3. Start Processing', '4. Review Results'] },
    moving: { triangle: true },
    popup: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Log in to access your workspace.',
      dialogTitle: 'System Update',
      dialogText:
        'A new version is available. You can continue working, but some features may be limited until you update.',
      stayLabel: 'Close',
      hideLeave: true,
      geometric: true,
    },
    stock: { showStats: true, chartTitle: 'Price History (5 Days)' },
  };

  env.template('act-in-time/arena', (design, def) => {
    const CSS = env.templateLib('act-in-time/_styles').arenaCSS;
    const V = def.scenarios[0];
    let D, P;
    let ctxRef, frameRef;
    let view = null;
    const els = {};
    const BASE = {};
    const S = {
      get ctx() {
        return ctxRef;
      },
      get spec() {
        return ctxRef && ctxRef.spec;
      },
      get frame() {
        return frameRef;
      },
      get view() {
        return view;
      },
      set view(v) {
        view = v;
      },
      get D() {
        return D;
      },
      get P() {
        return P;
      },
      els,
    };

    // The console and lifecycle hooks every scenario shares.
    BASE.ensureStyle = function () {
      if (document.getElementById('ut-style')) return;
      const s = document.createElement('style');
      s.id = 'ut-style';
      s.textContent = CSS;
      document.head.append(s);
    };

    BASE.clockText = (t) => {
      const s = Math.floor(t / 1000 + 1e-9);
      return `${D.clockPad ? String(Math.floor(s / 60)).padStart(2, '0') : Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    BASE.sec1 = (ms) => (ms / 1000).toFixed(1);

    BASE.frame = function (ctx) {
      const { util, size } = ctx;
      const arena = util.el('div', 'ut-arena', ctx.stage);
      arena.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column';
      const bar = util.el('div', 'ut-bar', arena);
      const status = util.el('div', 'ut-status', bar);
      const clockT = util.el('span', 'ut-clock', bar);
      const body = util.el('div', 'ut-body', arena);
      return {
        arena,
        body,
        status,
        setClock: (t) => {
          clockT.textContent = P.clockText(t);
        },
        setStatus: (h) => {
          status.innerHTML = h;
        },
      };
    };

    BASE.beforeBuild = (ctx, f) => {};

    BASE.rendered = (ctx, f) => {};

    BASE.beforeSync = (ctx, f, m) => {};

    BASE.synced = (ctx, f, m) => {};

    BASE.afterRender = (ctx, f) => {};

    BASE.begin = (ctx) => {};

    // The board of chase and moving.
    env.templateLib('act-in-time/_arena-boards').installBoard(BASE, S, V, { NS, ICON, APPS });

    // The parts of the widget's scenario: its widget and the units that build it.
    env.templateLib('act-in-time/_arena-boards').installChase(BASE, S, V, { NS, ICON, APPS });

    env.templateLib('act-in-time/_arena-delay').installDelay(BASE, S, V, { NS, ICON, APPS });

    env.templateLib('act-in-time/_arena-boards').installMoving(BASE, S, V, { NS, ICON, APPS });

    env.templateLib('act-in-time/_arena-popup').installPopup(BASE, S, V, { NS, ICON, APPS });

    env.templateLib('act-in-time/_arena-simon').installSimon(BASE, S, V, { NS, ICON, APPS });

    env.templateLib('act-in-time/_arena-stock').installStock(BASE, S, V, { NS, ICON, APPS });

    ({ D, P } = env.templateDesign('act-in-time/arena', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    const clear = () => {
      if (view && view.detach) view.detach();
      view = null;
    };
    return {
      ...(D.clearView ? { clear } : {}),
      render(ctx) {
        ctxRef = ctx;
        if (D.clearOnRender) clear();
        for (const key of Object.keys(els)) delete els[key];
        P.begin(ctx);
        P.ensureStyle();
        const f = (frameRef = P.frame(ctx));
        P.beforeBuild(ctx, f);
        const up = (patch) => ctx.update({ ...ctx.model, ...patch });
        view = P.build(ctx, f, up);
        P.rendered(ctx, f);
        const sync = (m) => {
          f.setClock(m.t);
          P.beforeSync(ctx, f, m);
          view.sync(m);
          P.synced(ctx, f, m);
        };
        sync(ctx.model);
        P.afterRender(ctx, f);
        return { anchors: [f.arena], sync };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`act-in-time/arena cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ['act-in-time/_styles', 'act-in-time/_arena-boards', 'act-in-time/_arena-delay', 'act-in-time/_arena-popup', 'act-in-time/_arena-simon', 'act-in-time/_arena-stock'] });
})();
