/*
 * read-figure/shades: panel renderer from L2 medoid design-read-figure-shades-03.
 * Scenario: shades. design {} reproduces that medoid; VARIANTS.shades has no preset:
 * its layouts share five-column reflow (7/12) and omit --tile-cols (10/12), but every
 * such site also has its own geometry. These are independent tokens, preserving the medoid default.
 * Tokens (defaults): columns (null): sampled columns, else maximum fixed columns;
 * columnVar ('--tile-cols'), columnDivisor (4): CSS count variable and divisor, null omits it;
 * budgetWidth (76), budgetHeight (115), recoverHeight (45): body budget deductions;
 * scaleVar (false): mirror fit scale in --up-scale.
 * Parts:
 * columns(ctx,n)->count: sampled or capped fixed columns;
 * layout(ctx,B)->geo: draws gap and tile size, then computes {n,cols,rows,gap,hintH,T};
 * grid(ctx,body,geo)->element: CSS grid; tileStyle(ctx,tile,geo)->CSS: square dimensions and HSL;
 * tile(ctx,el,index): noop decoration hook; tilesReady(ctx,tiles): noop for clear controls;
 * selection(ctx,tiles,up)->sync: scopes clear controls and sync; tilesSync(ctx,tiles,model): aria-checked; begin(ctx): noop before tiles;
 * shades(ctx,body,up,B)->{sync,locate}: tile click handlers, modifier hint;
 * budget(ctx,recover)->{w,h}: body budget; resultBar(ctx,panel,up)->{sync,locate}: seeded feedback;
 * beforeFit(ctx,panel,body): noop after first sync; scale(ctx,panel,k): transform and optional scale variable;
 * fit(ctx,panel)->{w,h,k}: measure and scale; position(ctx,panel,geo,place): set left/top;
 * place(ctx,panel,geo): consume the medoid's place fork then call position;
 * rendered(ctx,panel): noop after placement. S exposes ctx, panel, body, tiles, view, up, D, P (live).
 * Keep layout's two draws, resultBar's three draws and place's fork draws in their original order.
 */
(function () {
  'use strict';

  const EYE =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';
  const CHECK =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';

  const px = (v) => `${Math.round(v)}px`;
  const fail = (t) => {
    throw new Error(`read-figure/panel cannot locate ${JSON.stringify(t)}`);
  };

  const TOKENS = {
    columns: null,
    columnVar: '--tile-cols',
    columnDivisor: 4,
    budgetWidth: 76,
    budgetHeight: 115,
    recoverHeight: 45,
    scaleVar: false,
  };
  const SCENARIOS = { shades: {} };
  env.template('read-figure/shades', (design, def) => {
    const CSS = env.templateLib('read-figure/_styles').shadesCSS;
    function ensureStyle() {
      if (document.getElementById('up-style')) return;
      const s = document.createElement('style');
      s.id = 'up-style';
      s.textContent = CSS;
      document.head.append(s);
    }
    let D, P, ctx, panel, body, tiles, view, up;
    const BASE = {};
    const S = {
      get ctx() {
        return ctx;
      },
      get panel() {
        return panel;
      },
      get body() {
        return body;
      },
      get tiles() {
        return tiles;
      },
      get view() {
        return view;
      },
      get up() {
        return up;
      },
      get D() {
        return D;
      },
      get P() {
        return P;
      },
    };
    const scope = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; },
      get panel() { return panel; },
      get body() { return body; },
      get tiles() { return tiles; }, set tiles(value) { tiles = value; },
      get view() { return view; },
      get up() { return up; },
      get CHECK() { return CHECK; },
      get px() { return px; },
      get fail() { return fail; }
    };
    env.templateLib('read-figure/_shades-tiles').install(BASE, scope, undefined);
    env.templateLib('read-figure/_shades-frame').install(BASE, scope, undefined);
    ({ D, P } = env.templateDesign('read-figure/shades', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    return {
      render(nextCtx) {
        ctx = nextCtx;
        ensureStyle();
        const { spec, util, rng } = ctx;
        panel = util.el('div', 'up-panel', ctx.stage);
        panel.style.setProperty('--up-r', `${rng.pick([6, 10, 12, 16])}px`);
        const head = util.el('div', 'up-head', panel);
        util.el('span', 'up-badge', head).innerHTML = EYE;
        util.el('span', 'up-title', head, rng.pick(['Shade sorter', 'Color tiles']));
        util.el('span', 'up-meta', head, `Task ${rng.int(2, 9)} of 10`);
        body = util.el('div', 'up-body', panel);
        const recover = !!spec.recoverable,
          B = P.budget(ctx, recover);
        let bar = null;
        up = (patch) => {
          ctx.update({ ...ctx.model, ...patch });
          view.sync(ctx.model);
          if (bar) bar.sync(ctx.model);
        };
        const inner = P.shades(ctx, body, up, B);
        if (recover) bar = P.resultBar(ctx, panel, up);
        view = {
          sync(m) {
            inner.sync(m);
            if (bar) bar.sync(m);
          },
          locate(t) {
            return t.undo ? (bar ? bar.locate() : fail(t)) : inner.locate(t);
          },
        };
        view.sync(ctx.model);
        P.beforeFit(ctx, panel, body);
        P.place(ctx, panel, P.fit(ctx, panel));
        P.rendered(ctx, panel);
        return { anchors: [panel], sync: (m) => view.sync(m) };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) fail(t);
        return p;
      },
    };
  }, { uses: ['read-figure/_styles', 'read-figure/_shades-tiles', 'read-figure/_shades-frame'] });
})();
