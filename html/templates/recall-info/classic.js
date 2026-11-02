/*
 * recall-info/classic: an app frame (title bar, work area) around the widget of the widget's scenario.
 * Scenarios; design: {} reproduces design-recall-info-<scenario>-01 of each:
 *   code: a request flow with a once-visible code.     compare: a catalog with separate product details.
 *   count: a virtual lazy-loading count table.         crossref: source tabs and a saved-values form.
 *   paginate: a selectable paginated results table.
 * Tokens, shared:
 *   width = 600: nominal frame width in px (seeded jitter remains -30..30).
 *   title = null: app title; null uses spec.title.
 *   users = ['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park']: seeded title-bar names.
 *   alignments = ['start', 'center', 'center', 'end']: seeded placement choices.
 *   tightHeight = 560: stage height below which work uses compact spacing.
 *   panel/fg/line/accent/muted/bg = 'var(--<name>)': stylesheet theme colors.
 *   frameRadius = '12px', fontSize = '14px', inputRadius = '6px': frame, text and input sizes.
 * Tokens, per scenario:
 *   code: fieldWidth = '240px': code input width.
 *   compare: detailsLabel = 'View details': catalog detail button text.
 *   count: minHeight = 420, maxHeight = 600: preferred frame height bounds in px.
 *     rowHeight = 32, footerHeight = 30: virtual row and end-row heights in px.
 *     columns = {orders: '40px 1.1fr 1.6fr 1fr 0.9fr', tickets: '40px 0.9fr 2.6fr 0.9fr 1fr', files: '40px 2.2fr 1fr 0.9fr 1.2fr'}:
 *     grid tracks per dataset.
 *   paginate: columns: result grid tracks (a string, from the preset).
 * Presets (VARIANTS): compare { width: 720, title: 'Store' }, count { width: 700, title: 'Workspace' },
 *   crossref { width: 640, title: 'Back office' },
 *   paginate { width: 740, title: 'Catalog', columns: 'minmax(0,2.6fr) minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.3fr) 104px' }.
 * Parts (overrides are (base, S) => replacement; calls always use P), shared:
 *   element(tag, cls, parent, text) -> el: env.util.el; shared element construction.
 *   center(el) -> [x,y]: live viewport center.
 *   styles(ctx): install the baseline CSS with token substitutions.
 *   usable(ctx) -> {x,y,w,h}: stage space excluding a floating end control.
 *   frame(ctx, title) -> {app,work}: frame with seeded flat style (one bool), P.bar and P.work.
 *   placeFrame(ctx, app, W, H): clamp and place in usable space (one alignment pick).
 *   naturalHeight(app, work) -> px: measure content without flex expansion.
 *   bar(ctx, app, title): build title bar, mark and seeded user name (one pick).
 *   work(ctx, app) -> work: build the work area.
 *   decorated(ctx, el, data): decoration hook per step panel, catalog tile, virtual row, source row or row slot; noop.
 *   build(ctx, work, app) -> view: the scenario's widget: wire task updates, rendering, measurement and read-only
 *     oracle helpers.
 *   render(ctx) -> {anchors,sync}: build and size the complete widget (one width int). count places the frame at a
 *     height within minHeight..maxHeight before build; the others build, then place at the natural height.
 *   rendered(ctx, app, work, view): decoration hook after sizing; default noop.
 *   anchors(ctx) -> [app]: fixed frame anchor.
 *   sync(model): paint the active view without rebuilding it.
 *   locate(target) -> [x,y]: delegate to the active view, never mutate DOM.
 * Parts, code:
 *   progress(ctx, work, s): build the progress text and bar.
 *   codeBox(ctx, p, s): build the once-visible code box.
 *   ack(ctx, p, st, i, s, apply): build and bind the agreement checkbox.
 *   choices(ctx, p, st, i, s, apply): build and bind the radio options.
 *   field(ctx, p, s, apply): build the code field and text controller.
 *   panel(ctx, body, st, i, s, apply) -> p: build a titled step and dispatch to its content part.
 *   confirmation(ctx, body, s, apply): build the saved-code panel and reopen link.
 *   controls(ctx, work, s, apply, next): build footer navigation and bind the supplied next callback.
 * Parts, compare:
 *   catalog(ctx, work) -> { bar, body, list, grid }: build title, choice bar and catalog grid.
 *   tile(ctx, grid, it, i, apply) -> { v, c }: build a catalog tile with detail and optional choice buttons.
 *   detail(ctx, body, apply) -> { det, back, dName, dPrice, dl, dBlurb, dBtn }: build the detail panel, back link and
 *     choice control.
 *   detailData(ctx, i, dName, dPrice, dl, dBlurb): fill the detail name, price, specs and description.
 *   choice(ctx, bar, m): draw the current catalog choice.
 * Parts, count:
 *   heading(ctx, work) -> subEl: build title and loading status.
 *   list(ctx, work) -> { pane, inner, track, thumb, endRow }: build column headings, scrolling pane, end row and
 *     scrollbar.
 *   answer(ctx, work) -> { input, btn, readout }: build the answer controls and saved-answer readout.
 *   row(ctx, inner, i) -> r: build a positioned virtual table row.
 *   readout(ctx, readout, m): draw the saved-answer readout.
 * Parts, crossref:
 *   tabs(ctx, work, apply) -> tb: build and bind the source/form tabs.
 *   source(ctx, p, t): build a read-only key/value source table.
 *   sourceRow(ctx, table, k, v): append one source key/value row.
 *   field(ctx, grid, f, apply) -> tf: build a labeled input and return its text controller.
 *   form(ctx, p, t, tfs, apply): build the form heading, grid and fields.
 *   controls(ctx, p, apply) -> { saveBtn, savedEl }: build Save and the saved-values readout.
 *   saved(ctx, savedEl, m): draw saved form values.
 * Parts, paginate:
 *   heading(ctx, work) -> total: build title and result count.
 *   table(ctx, work) -> { sel, tbl }: build the selection bar and table header.
 *   row(ctx, tbl, k, pick) -> { r, name, num, rate, cat: cat.firstChild, b, idx: null }: build one reusable row slot and
 *     bind its selection callback.
 *   pager(ctx, work, apply) -> { pb, pageText }: build numbered or previous/next navigation.
 *   rowData(ctx, sl, row, on): fill a row slot and its selected state.
 *   selection(ctx, sel, m): draw the selected result summary.
 * S.ctx/spec/app/work/view are live getters; S.D/P expose resolved tokens and parts.
 * Files: _classic-assets holds CSS/presets, _classic-frame the shared frame, and _classic-<scenario> the views.
 * All episode state belongs to the factory; view-local state is rebuilt each render.
 * Keep rng draws in order: frame bool, bar user pick, width int, placement pick.
 * Use ctx.rng.fork(label) for additional decoration randomness.
 */
(function () {
  'use strict';

  env.template('recall-info/classic', (design, def) => {
    const { CSS, TOKENS, SCENARIOS } = env.templateLib('recall-info/_classic-assets');
    const V = def.scenarios[0];
    let D, P;
    let ctxRef, app, work, view;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; },
      get spec() { return ctxRef && ctxRef.spec; },
      get app() { return app; },
      get work() { return work; },
      get view() { return view; },
      get D() { return D; },
      get P() { return P; },
    };
    BASE.element = (tag, cls, parent, text) => env.util.el(tag, cls, parent, text);
    BASE.center = (e) => env.util.center(e);
    const el = (...args) => P.element(...args);
    const center = (e) => P.center(e);

    // A build's action handler: apply a task action, then repaint.
    const actions = (ctx, paint) => {
      const fam = env.taskDef;
      const { spec } = ctx;
      return (act) => {
        const m = fam.helpers.apply(ctx.model, spec, act);
        if (m !== ctx.model) ctx.update(m);
        paint(ctx.model);
      };
    };

    // Size body to its tallest panel, each shown alone.
    const fitPanels = (body, panels) => {
      let hmax = 0;
      for (const p of panels) {
        for (const q of panels) q.hidden = q !== p;
        hmax = Math.max(hmax, p.offsetHeight);
      }
      body.style.height = `${hmax + 4}px`;
    };

    // A title line with a muted status (count, paginate).
    const titleLine = (ctx, work, status) => {
      const head = el('div', '', work);
      head.style.cssText = 'display:flex;align-items:baseline;gap:10px;flex:none';
      el('h2', 'ur-h', head, ctx.spec.title);
      return el('span', 'ur-sub', head, status);
    };

    const shared = { el, center, actions, fitPanels, titleLine };
    Object.assign(BASE, env.templateLib('recall-info/_classic-frame').parts(S, shared, CSS));
    const scenarios = {};
    for (const scenario of ['code', 'compare', 'count', 'crossref', 'paginate']) {
      const lib = env.templateLib(`recall-info/_classic-${scenario}`);
      scenarios[scenario] = { ...lib.parts(S, shared), build: lib.build(S, shared) };
      Object.assign(BASE, scenarios[scenario].parts);
    }

    // Parts two scenarios name alike, and the widget, by scenario.
    BASE.field = V === 'crossref' ? scenarios.crossref.crossrefField : scenarios.code.codeField;
    BASE.controls = V === 'crossref' ? scenarios.crossref.crossrefControls : scenarios.code.codeControls;
    BASE.heading = V === 'paginate' ? scenarios.paginate.paginateHeading : scenarios.count.countHeading;
    BASE.row = V === 'paginate' ? scenarios.paginate.paginateRow : scenarios.count.countRow;
    BASE.build = scenarios[V] && scenarios[V].build;
    if (!BASE.build) throw new Error(`recall-info/classic: unknown variant '${V}'`);

    BASE.render = (ctx) => {
      ctxRef = ctx;
      P.styles(ctx);
      ({ app, work } = P.frame(ctx, D.title ?? ctx.spec.title));
      if (ctx.size.height < D.tightHeight) work.classList.add('tight');
      const W = D.width + ctx.rng.int(-30, 30);
      app.style.width = `${Math.min(W, ctx.size.width - 16)}px`;
      if (V === 'count') {
        const box = P.usable(ctx);
        P.placeFrame(ctx, app, W, Math.max(D.minHeight, Math.min(box.h - 12, D.maxHeight)));
        view = P.build(ctx, work, app);
      } else {
        view = P.build(ctx, work, app);
        P.placeFrame(ctx, app, W, P.naturalHeight(app, work));
      }
      P.rendered(ctx, app, work, view);
      return { anchors: P.anchors(ctx), sync(m) { P.sync(m); } };
    };
    BASE.rendered = () => {};
    BASE.anchors = () => [app];
    BASE.sync = (m) => view.paint(m);
    BASE.locate = (t) => {
      if (!view) throw new Error('recall-info/classic not rendered');
      return view.locate(t);
    };

    ({ D, P } = env.templateDesign('recall-info/classic', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return { render: (ctx) => P.render(ctx), locate: (t) => P.locate(t) };
  }, { uses: ['recall-info/_classic-assets', 'recall-info/_classic-frame', 'recall-info/_classic-code',
    'recall-info/_classic-compare', 'recall-info/_classic-count', 'recall-info/_classic-crossref', 'recall-info/_classic-paginate'] });
})();
