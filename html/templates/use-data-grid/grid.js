/*
 * use-data-grid/grid: native operations workspace shared by all twelve scenarios.
 * Scenarios: bulk, cellEdit, colfilter, crm, filter, multirow, paginate, reorder, resize, select, sort, virtual.
 * design: {} reproduces each design-use-data-grid-<scenario>-01 pilot, using the reference grid widget.
 * No scenario presets: these scenarios share one widget; the spec selects its behavior.
 * AG Grid is a separate base widget and is not used by these pilots.
 *
 * Tokens (defaults):
 *   css = CSS: structural stylesheet; CSS constant below.
 *   extraCss = '': CSS appended after the structural stylesheet.
 *   font = '12px/1.4 system-ui,sans-serif': workspace font shorthand.
 *   dangerColor = '#c92a2a': destructive controls and red status tones.
 *   fallbackTone = '#868e96': status color when no palette entry matches.
 *   icons = ICON: SVG table defined below (whole-table replacement).
 *   tones = TONES: fallback status palette defined below.
 *   statusTones = STATUS_TONES: status-to-color map defined below.
 *   brand = 'Relay': workspace brand.
 *   expandedAt = 1000: stage width for expanded navigation.
 *   contextAt = 1280: stage width for activity context.
 *   contextHeight = 580: stage height for activity context.
 *   navWidth = 156: expanded navigation width in px.
 *   railWidth = 44: collapsed navigation width in px.
 *   contextWidth = 188: activity context width in px.
 *   cardInsetX = 18: width reserved outside the card, excluding panels.
 *   cardInsetY = 54: height reserved outside the card.
 *   cardTop = 36: card top within the shell in px.
 *   fixedHeight = 44 + 30 + 38 + 40 + 38 + 22 + 2: non-row height budget in px.
 *   rowMin = 18: minimum row height in px.
 *   rowMax = 32: maximum row height in px.
 *   decoys = ['Export', 'Columns', 'Share', 'Import', 'Refresh']: sampled heading action labels; preserve length/order for RNG equivalence.
 *   pageSizes = [5, 10, 20]: page-size controls.
 *   emptyTitle = 'No records found': empty-state heading.
 *   emptyText = 'Try a different search or remove a filter to see more records.': empty-state help.
 *
 * Parts: overrides are (base, S) => replacement, with the arguments below.
 * Parts return no value unless a return value is documented.
 * S.ctx/spec/rng/fam and S.D/P read live state. The getters below expose episode
 * elements and geometry directly on S; setters let replacement builders install
 * the nodes and geometry consumed by behavior and locate (S.card, S.body, S.hcells, etc.).
 * Builders must maintain the named element maps and data attributes used by locate.
 * Per-page state is created by gridState() and reassigned each render.
 * Modules: _theme has the constant assets/tokens; _input binds interactions; _draw syncs the grid;
 * _popovers builds menus/dialogs; _workspace builds frame; _records builds controls/rows; _common locates targets.
 * Preserve rng draws, including workspace fork draws, in order; additions use a new fork.
 *   showUtility(title, lines): replace the workspace utility panel and log its opening.
 *   mirrorScreenRows(): mirror fully visible paginated row IDs into the model.
 *   act(m, redraw = true): update the model, enforce confirmation and redraw.
 *   bindHeader(h, col): bind keyboard sorting and pointer reorder gestures.
 *   bindEdge(edge, col, keysOnly = false): bind keyboard/pointer column resizing.
 *   focusIs(f, leaving): mirror header/edge focus into the model.
 *   drawHeader(m): sync header order, widths, sorting and filter/menu state.
 *   cellField(cell, editing): build/focus the inline editor and bind draft/commit/cancel.
 *   decorate(cell, row, id, m): add person avatars and priority icons.
 *   drawRows(m): redraw the native body, preserve scroll and mirror visible rows.
 *   drawTools(m): sync facts, filter chips, selection controls, count and select-all state.
 *   drawFoot(m): sync showing-range/page size and rebuild pager.
 *   place(box, anchorEl, alignRight): position a popover by its anchor, clamped inside the card.
 *   drawPop(m): rebuild column/filter/status menus.
 *   drawToastDialog(m): rebuild undo toast and delete confirmation.
 *   draw(m): sync the complete widget.
 *   drawLite(m): sync header, body, tools and footer.
 *   sizeOf(m): return the model page size.
 *   el(tag, cls, parent, text): return a DOM element via ctx.util.el.
 *   px(w): return rounded scaled column width.
 *   fmtShow(a, b, n): return the showing-range label.
 *   navItem(label, image, count, current = false, project = false): append a navigation button and bind its utility panel.
 *   bulkButton(label, cls, key): return a bulk-action button.
 *   locate(t): return viewport coordinates for a task target, or null.
 *   appbar(): build the shell, app bar and utility actions.
 *   navigation(): build navigation and saved queues (four workspace int draws).
 *   contextPanel(): build the optional workspace overview/activity panel.
 *   card(): build the anchored card and choose uppercase headers (workspace bool draw).
 *   heading(): build the object title, count and actions (rng.sample draw).
 *   tabs(): build saved-view and activity tabs.
 *   toolbar(): build search, filters, bulk controls and undo.
 *   grid(): build header/body and bind virtual/paginated scrolling.
 *   stream(): build the filler activity stream.
 *   footer(): build range, pager and page-size controls (rng.bool draw).
 *   overlays(): initialize the overlay layer and element maps.
 *   workspaceData(): draw workspace content and choose navigation/context geometry.
 *   fit(): set card geometry and row height from ctx.size.
 *   column(c): build one column header, menu/filter controls and resize edge; register hcells/parts.
 *   row(r, m, sel): return one row, bind selection and call P.cell.
 *   rowSelection(row, r, m, sel): build the checkbox and bind row selection.
 *   cell(row, r, id, m): return one cell and bind inline editing, then draw content/decorations.
 *   cellContent(cell, r, id, m, text): draw a status pill or ordinary text.
 *   empty(): draw empty-state help and clear-filters control.
 *   pageButton(label, key, disabled, cls = ''): return a pager button and register pgButtons[key].
 *   menuItem(parent, key, label, fn, cls = 'to-mi'): return a menu action and register popItems[key].
 *   filterOption(key, label, checked, fn, partial): build a filter checkbox and register popItems[key]; partial is the select-all mixed state.
 *   pointOn(el): return an uncovered point inside an element, or null.
 *   icon(node, key, before = true): return/prepend or append an SVG icon holder.
 *   style(): install the structural stylesheet once per page.
 *   begin(ctx): no-op before any DOM work.
 *   rendered(ctx): no-op after the first complete draw.
 *   rowReady(row, r, m): no-op after each completed row.
 *   cellReady(cell, r, id, m): no-op after each non-editing cell.
 */
(function () {
  'use strict';

  function gridState() {
    let D, P;
    let ctx, util, spec, rng, fam, virtual, inline, admin;
    let W, H, wr, company, workspaceName, actor, expanded, contextual;
    let navW, contextW, shell, appbar, brand, org, globalSearch, notifications;
    let user, utility, nav, cardW, cardH, left, top, FIXED;
    let rowH, card, nominal, scale, toneOf, statusOpts, head, object;
    let title, count, decoys, nb, tabs, currentView, views, activityTab;
    let tools, input, chips, clearAll, selBar, selInfo, clearSelBtn, markBtn;
    let archBtn, delBtn, undoBtn, grid, hrow, hcb, allBox, rowpick;
    let hcells, parts, hfill, body, drawing, paneHeight, stream, foot;
    let info, pagerWrap, rpp, sizes, facts, layer, pop, toast;
    let scrim, popItems, editInput, pgButtons;
    const S = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; }, set ctx(value) { ctx = value; },
      get util() { return util; }, set util(value) { util = value; },
      get spec() { return spec; }, set spec(value) { spec = value; },
      get rng() { return rng; }, set rng(value) { rng = value; },
      get fam() { return fam; }, set fam(value) { fam = value; },
      get virtual() { return virtual; }, set virtual(value) { virtual = value; },
      get inline() { return inline; }, set inline(value) { inline = value; },
      get admin() { return admin; }, set admin(value) { admin = value; },
      get W() { return W; }, set W(value) { W = value; },
      get H() { return H; }, set H(value) { H = value; },
      get wr() { return wr; }, set wr(value) { wr = value; },
      get company() { return company; }, set company(value) { company = value; },
      get workspaceName() { return workspaceName; }, set workspaceName(value) { workspaceName = value; },
      get actor() { return actor; }, set actor(value) { actor = value; },
      get expanded() { return expanded; }, set expanded(value) { expanded = value; },
      get contextual() { return contextual; }, set contextual(value) { contextual = value; },
      get navW() { return navW; }, set navW(value) { navW = value; },
      get contextW() { return contextW; }, set contextW(value) { contextW = value; },
      get shell() { return shell; }, set shell(value) { shell = value; },
      get appbar() { return appbar; }, set appbar(value) { appbar = value; },
      get brand() { return brand; }, set brand(value) { brand = value; },
      get org() { return org; }, set org(value) { org = value; },
      get globalSearch() { return globalSearch; }, set globalSearch(value) { globalSearch = value; },
      get notifications() { return notifications; }, set notifications(value) { notifications = value; },
      get user() { return user; }, set user(value) { user = value; },
      get utility() { return utility; }, set utility(value) { utility = value; },
      get nav() { return nav; }, set nav(value) { nav = value; },
      get cardW() { return cardW; }, set cardW(value) { cardW = value; },
      get cardH() { return cardH; }, set cardH(value) { cardH = value; },
      get left() { return left; }, set left(value) { left = value; },
      get top() { return top; }, set top(value) { top = value; },
      get FIXED() { return FIXED; }, set FIXED(value) { FIXED = value; },
      get rowH() { return rowH; }, set rowH(value) { rowH = value; },
      get card() { return card; }, set card(value) { card = value; },
      get nominal() { return nominal; }, set nominal(value) { nominal = value; },
      get scale() { return scale; }, set scale(value) { scale = value; },
      get toneOf() { return toneOf; }, set toneOf(value) { toneOf = value; },
      get statusOpts() { return statusOpts; }, set statusOpts(value) { statusOpts = value; },
      get head() { return head; }, set head(value) { head = value; },
      get object() { return object; }, set object(value) { object = value; },
      get title() { return title; }, set title(value) { title = value; },
      get count() { return count; }, set count(value) { count = value; },
      get decoys() { return decoys; }, set decoys(value) { decoys = value; },
      get nb() { return nb; }, set nb(value) { nb = value; },
      get tabs() { return tabs; }, set tabs(value) { tabs = value; },
      get currentView() { return currentView; }, set currentView(value) { currentView = value; },
      get views() { return views; }, set views(value) { views = value; },
      get activityTab() { return activityTab; }, set activityTab(value) { activityTab = value; },
      get tools() { return tools; }, set tools(value) { tools = value; },
      get input() { return input; }, set input(value) { input = value; },
      get chips() { return chips; }, set chips(value) { chips = value; },
      get clearAll() { return clearAll; }, set clearAll(value) { clearAll = value; },
      get selBar() { return selBar; }, set selBar(value) { selBar = value; },
      get selInfo() { return selInfo; }, set selInfo(value) { selInfo = value; },
      get clearSelBtn() { return clearSelBtn; }, set clearSelBtn(value) { clearSelBtn = value; },
      get markBtn() { return markBtn; }, set markBtn(value) { markBtn = value; },
      get archBtn() { return archBtn; }, set archBtn(value) { archBtn = value; },
      get delBtn() { return delBtn; }, set delBtn(value) { delBtn = value; },
      get undoBtn() { return undoBtn; }, set undoBtn(value) { undoBtn = value; },
      get grid() { return grid; }, set grid(value) { grid = value; },
      get hrow() { return hrow; }, set hrow(value) { hrow = value; },
      get hcb() { return hcb; }, set hcb(value) { hcb = value; },
      get allBox() { return allBox; }, set allBox(value) { allBox = value; },
      get rowpick() { return rowpick; }, set rowpick(value) { rowpick = value; },
      get hcells() { return hcells; }, set hcells(value) { hcells = value; },
      get parts() { return parts; }, set parts(value) { parts = value; },
      get hfill() { return hfill; }, set hfill(value) { hfill = value; },
      get body() { return body; }, set body(value) { body = value; },
      get drawing() { return drawing; }, set drawing(value) { drawing = value; },
      get paneHeight() { return paneHeight; }, set paneHeight(value) { paneHeight = value; },
      get stream() { return stream; }, set stream(value) { stream = value; },
      get foot() { return foot; }, set foot(value) { foot = value; },
      get info() { return info; }, set info(value) { info = value; },
      get pagerWrap() { return pagerWrap; }, set pagerWrap(value) { pagerWrap = value; },
      get rpp() { return rpp; }, set rpp(value) { rpp = value; },
      get sizes() { return sizes; }, set sizes(value) { sizes = value; },
      get facts() { return facts; }, set facts(value) { facts = value; },
      get layer() { return layer; }, set layer(value) { layer = value; },
      get pop() { return pop; }, set pop(value) { pop = value; },
      get toast() { return toast; }, set toast(value) { toast = value; },
      get scrim() { return scrim; }, set scrim(value) { scrim = value; },
      get popItems() { return popItems; }, set popItems(value) { popItems = value; },
      get editInput() { return editInput; }, set editInput(value) { editInput = value; },
      get pgButtons() { return pgButtons; }, set pgButtons(value) { pgButtons = value; },
    };
    return {
      S,
      resolve(design, def, BASE) {
        ({ D, P } = env.templateDesign('use-data-grid/grid', design, def, { tokens: env.templateLib('use-data-grid/_theme'), base: BASE, state: S }));
      },
    };
  }

  function gridParts(S) {
    const units = Object.assign({},
      env.templateLib('use-data-grid/_input'), env.templateLib('use-data-grid/_draw'),
      env.templateLib('use-data-grid/_popovers'), env.templateLib('use-data-grid/_workspace'),
      env.templateLib('use-data-grid/_records'), env.templateLib('use-data-grid/_common'));
    const BASE = {};
    // Keep the original part order so design resolution remains identical.
    for (const name of [
      'showUtility',
      'mirrorScreenRows',
      'act',
      'bindHeader',
      'bindEdge',
      'focusIs',
      'drawHeader',
      'cellField',
      'decorate',
      'drawRows',
      'drawTools',
      'drawFoot',
      'place',
      'drawPop',
      'drawToastDialog',
      'draw',
      'drawLite',
      'sizeOf',
      'el',
      'px',
      'fmtShow',
      'navItem',
      'bulkButton',
      'locate',
      'appbar',
      'navigation',
      'contextPanel',
      'card',
      'heading',
      'tabs',
      'toolbar',
      'grid',
      'stream',
      'footer',
      'overlays',
      'workspaceData',
      'fit',
      'column',
      'row',
      'rowSelection',
      'cell',
      'cellContent',
      'empty',
      'pageButton',
      'menuItem',
      'filterOption',
      'pointOn',
      'icon',
      'style',
      'begin',
      'rendered',
      'rowReady',
      'cellReady',
    ]) BASE[name] = (...args) => units[name](S, ...args);
    return BASE;
  }

  function renderGrid(S, nextCtx) {
    S.ctx = nextCtx;
    ({ util: S.util, spec: S.spec, rng: S.rng } = S.ctx);
    S.fam = env.taskDef;
    S.virtual = S.spec.scenario === 'virtual';
    S.inline = ['cellEdit', 'crm', 'virtual'].includes(S.spec.scenario);
    S.admin = ['crm', 'colfilter', 'virtual'].includes(S.spec.scenario);
    S.W = S.ctx.size.width;
    S.H = S.ctx.size.height;
    S.P.begin(S.ctx);
    S.P.style();

    S.P.workspaceData();
    S.P.appbar();
    S.P.navigation();
    S.P.contextPanel();
    S.P.fit();
    S.P.card();
    S.nominal = S.spec.cols.reduce((a, c) => a + c.w, 0);
    S.scale = S.spec.scenario === 'resize' ? 1 : Math.max(0.55, Math.min(1.5, Math.floor(((S.cardW - 46) / S.nominal) * 100) / 100));
    S.toneOf = {};
    S.statusOpts = S.fam.helpers.statusOptions(S.spec);
    S.statusOpts.forEach((s, i) => {
      S.toneOf[s] = S.D.statusTones[s] || S.D.tones[i % S.D.tones.length];
      if (S.toneOf[s] === '#c92a2a') S.toneOf[s] = S.D.dangerColor;
    });

    S.P.heading();
    S.P.tabs();
    S.P.toolbar();
    S.P.grid();
    S.P.stream();
    S.P.footer();
    S.P.overlays();
    // Pressing outside an open popover closes it (the press itself still reaches its target).
    S.card.addEventListener('pointerdown', (e) => {
      const m = S.ctx.model;
      if (!(m.menu || m.markMenu)) return;
      if (S.pop && S.pop.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.ib, [data-key="status"]')) return;
      // Light redraw only: the element under the pointer must survive so its click still lands.
      S.ctx.update(S.fam.helpers.closeMenus(m));
      S.P.drawHeader(S.ctx.model);
      S.P.drawPop(S.ctx.model);
    }, true);

    S.editInput = null;
    S.pgButtons = {};
    S.P.draw(S.ctx.model);
    S.P.rendered(S.ctx);
    return { anchors: [S.card], sync: (m) => S.P.draw(m) };
  }

  env.template('use-data-grid/grid', (design, def) => {
    const { S, resolve } = gridState();
    resolve(design, def, gridParts(S));
    return {
      render: (nextCtx) => renderGrid(S, nextCtx),
      locate(t) {
        return S.P.locate(t) || (() => { throw new Error(`use-data-grid/grid cannot locate ${JSON.stringify(t)}`); })();
      },
    };
  }, { uses: ['use-data-grid/_theme', 'use-data-grid/_input', 'use-data-grid/_draw', 'use-data-grid/_popovers', 'use-data-grid/_workspace', 'use-data-grid/_records', 'use-data-grid/_common'] });
})();
