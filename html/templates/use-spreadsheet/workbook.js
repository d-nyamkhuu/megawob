/*
 * use-spreadsheet/workbook: shared spreadsheet for condfmt, fillhandle, filter, formula, range and sort.
 * With design: {}, each scenario reproduces its classic-renderer pilot:
 *   condfmt: design-use-spreadsheet-condfmt-01; fillhandle: design-use-spreadsheet-fillhandle-01;
 *   filter: design-use-spreadsheet-filter-01; formula: design-use-spreadsheet-formula-01;
 *   range: design-use-spreadsheet-range-01; sort: design-use-spreadsheet-sort-01.
 * Scenario presets: none; all six scenarios share the same widget.
 * The optional canvas renderer retains reference canvas painting and the same hit testing.
 * Tokens (object/array tokens replace the whole value; all sizes are px):
 *   renderer = 'classic': DOM cells; 'canvas' selects the reference single-canvas renderer and field-ID prefix.
 *   font = 'Arial': workbook and cell font.
 *   alternateFont = 'Georgia': font-picker alternative.
 *   cellFontSize = 11: cell font size in px.
 *   largeFontSize = 12: enlarged cell font size in px.
 *   canvasAccent = '#20856a': canvas workbook accent; classic uses the site's --accent.
 *   errorColor = '#d14848': formula error text and corner marker.
 *   colors = { red: ['#fce3e3', '#852828'], green: ['#daf1e2', '#195a36'], blue: ['#dfebff', '#214d8c'] }: rule fill/text pairs.
 *   statusTones = { Paid: '#2d8a62', Review: '#b68429', other: '#487ac1' }: status pill colors.
 *   icons = ICONS below: SVG path table, shared by DOM and canvas.
 *   tabs = ['Home', 'Insert', 'Page layout', 'Formulas', 'Data', 'Review', 'View', 'Help']: classic navigation.
 *   canvasTabs = ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help']: canvas navigation.
 *   sheets = ['Summary', 'Budget', 'Vendors', 'Lookups', 'Archive']: reference tabs after spec.sheet.
 *   breadcrumb = 'Team drive  /  Workbooks  /  Monthly operations': classic subtitle.
 *   canvasBreadcrumb = 'Workspace / Finance / Shared workbooks': canvas subtitle.
 *   shortHeight = 430: stage height below which the dialog compacts.
 *   roomyWidth = 1180: stage width at which workspace labels appear.
 *   wideWidth = 1380: stage width at which activity appears.
 *   compactWidth = 800: stage width below which ribbon extras hide.
 *   gutter = 34: classic row-header width in px.
 *   canvasGutter = 39: canvas row-header width in px.
 *   headerHeight = 23: classic column-letter header height in px.
 *   canvasHeaderHeight = 25: canvas column-letter header height in px.
 *   rowHeight = 22: maximum classic row height in px.
 *   canvasRowHeight = 24: maximum canvas row height in px.
 *   minRowHeight = 15: minimum row height in px.
 *   scrollbarWidth = 11: scrollbar track width in px.
 *   columnWeights = [1.55, 1.3, .65, .9, 1, .85, .95, .8]: classic column proportions.
 *   canvasColumnWeights = [1.45, 1.25, .65, .9, 1, .9, .95, .9]: canvas column proportions.
 * Parts (calls go through P; overrides are (base, S) => replacement):
 *   css() -> string: structural CSS using resolved tokens.
 *   frame(ctx) -> el: style installation and fixed workbook anchor, responsive to ctx.size.
 *   icon(parent, key, size = 16) -> SVG el: path from D.icons, falling back to sheet.
 *   button(p, text, key, fn, cls = '', glyph) -> el: labeled click control; registers controls[key] when key is set.
 *   info(title, text) -> void: populate and show the information popover.
 *   title(ctx, book) -> el: workbook identity, save state, collaboration controls and avatar.
 *   navigation(ctx, book) -> el: renderer-specific navigation labels.
 *   group(tools, label, cls = '') -> [el, el]: ribbon group with two control rows and caption.
 *   pick(parent, text, fn, cls = '') -> el: ribbon dropdown-styled button with a down icon.
 *   style(key, value) -> void: update an unscored sheetStyle property and redraw.
 *   clipboard(tools) -> void: Clipboard group; set S.undo, bind Undo and history/paste information.
 *   fontTools(tools) -> void: Font group; set S.fontPick, bind font, size and text styling.
 *   alignmentTools(tools) -> void: Alignment group with wrap information and disabled Merge.
 *   numberTools(tools) -> void: Number group; set S.numberPick, bind number/currency/percent/decimals.
 *   formatTools(tools) -> void: Styles & data group; open rule editor and bind Clear filter/Functions.
 *   tableTools(tools) -> void: Table tools group with border styling and freeze information.
 *   editingTools(tools) -> void: Editing group with Find information and Sort & filter menu.
 *   ribbon(ctx, book) -> el: build the seven ribbon groups through P.
 *   sheetCell(p, m = ctx.model) -> [row, col]: map source cell to its displayed sorted address.
 *   sourceCell(p) -> [row, col]: map displayed address to a source cell.
 *   formulaSource(value) -> string: translate a displayed formula back to source coordinates.
 *   formulaBar(ctx, book) -> void: set S.nameBox and S.formula; bind address navigation and formula editing.
 *   context(ctx, book) -> el: table name, S.tableInfo and frozen-row indicator.
 *   workarea(ctx, book) -> el: flex container for workspace, grid and activity.
 *   workspace(ctx, workarea) -> el: workspace links, projects and shared drives.
 *   workspaceItem(workspace, glyph, label, active) -> el: one sidebar row with icon, label and active state.
 *   grid(ctx, workarea) -> el: set S.grid and S.canvas (null for classic), roles and focusability.
 *   activity(ctx, workarea) -> el: seeded activity feed.
 *   activityItem(activity, who, what, when) -> el: one activity article with author, text and time.
 *   bottom(ctx, book) -> el: sheet list, tabs, Add sheet and zoom decoration.
 *   sheetTab(bottom, label) -> el: one tab; current sheet closes popover, reference sheets show information.
 *   status(ctx, book) -> el: set S.ready/count/sum/records/total and draw saved indicator.
 *   overlays(ctx, book) -> void: set S.popover/menu/shade, initially hidden.
 *   dialog(ctx) -> el: set S.dialog/rangeField/threshold/preview; rule choices and actions.
 *   field(label, key) -> input el: labeled rule-draft field, registered in S.controls.
 *   snapshot(m) -> object: clone undoable cells, order, sort, filter and rule.
 *   update(n) -> void: ctx.update then P.draw.
 *   commit(n) -> void: append undo history, keep the last 16 entries, then P.update.
 *   calc() -> geometry: size grid from live element dimensions, column widths and visible rows.
 *   cellBox(p) -> {x, y, w, h}: cell rectangle in grid coordinates.
 *   selectionBox() -> {x, y, w, h}: current selection rectangle using P.cellBox.
 *   draw(m) -> void: mirror visibleRows, sync formula/status/dialog and call the grid/menu painters.
 *   visual(m, p) -> {text, numeric, inRule, error}: evaluate and format one source cell.
 *   pieces(m, emit) -> void: emit(x,y,w,h,text,type,pos) for letters, row headers and visible cells in order.
 *   paintDOM(m) -> void: clear grid, call P.cellDOM for pieces, then selection and scrollbar.
 *   scrollbar(m) -> {y, h}: thumb geometry from visible-row capacity and scroll position.
 *   paintCanvas(m) -> void: size/clear canvas, call P.cellCanvas for pieces, paint frozen line/selection/bar.
 *   drawMenu(m) -> void: cache menu column, call P.menuItems when it changes, position menu.
 *   cellDOM(m, x, y, w, h, text, type, p) -> el: one positioned cell/header/pill with styling, accessibility and P.cell hook.
 *   selectionDOM(m) -> void: clipped selection rectangle and fill handle.
 *   scrollbarDOM(m) -> void: visible scrollbar thumb using P.scrollbar.
 *   cellCanvas(m, p, palette, x, y, w, h, text, type, pos) -> void: one clipped canvas cell/header/pill; palette has fg/panel/line/muted/accent.
 *   selectionCanvas(m, p, accent) -> void: clip and paint canvas selection and fill handle.
 *   scrollbarCanvas(m, p, panel, muted) -> void: paint track and thumb using P.scrollbar.
 *   menuItems(m) -> void: column heading, sort controls, unique filter options and Show all records.
 *   local(e) -> [x, y]: pointer event in grid coordinates.
 *   hit(x, y) -> [row, col]: source cell under a grid coordinate.
 *   select(p, shift = false) -> void: commit active edit, set or extend selection, close menu.
 *   bind(ctx) -> void: attach pointer, fill, resize, wheel, keyboard and menu-dismiss interactions.
 *   scrollTo(row) -> void: clamp scroll row and redraw.
 *   locate(t) -> [x, y]: oracle target in viewport coordinates; never mutates DOM or model.
 *   cell(ctx, el, m, pos, type) -> void: default-noop decoration hook after each DOM cell.
 *   rendered(ctx, book) -> void: default-noop decoration hook after initial draw, before anchor capture.
 * S exposes live ctx/spec/task/util/isCanvas, D/P, all constructed controls/panels and geometry.
 * Mutable fields have setters so replacement builders can supply the references used by draw-shape/locate;
 * see S below for the complete field list. Keep registered controls when restyling the controls.
 * Part installers live in _chrome.js, _grid.js and _input.js; _theme.js holds CSS/icons/tokens.
 * No DOM is built in the factory. The fixed book is the only anchor. The reference draws no rng
 * values here; overrides needing randomness must use ctx.rng.fork('<label>').
 */
(function () {
  'use strict';
  env.template('use-spreadsheet/workbook', (design, def) => {
    let D, P;
    let ctx, F, U, s, isCanvas, book, workarea;
    let grid, canvas, controls, optionEls, opEls, colorEls, undo;
    let fontPick, numberPick, nameBox, formula, tableInfo, ready, count;
    let sum, records, total, popover, menu, shade, dialog;
    let rangeField, threshold, preview, geometry, gesture, menuKey, suppressClick;
    let resumeEdit = null;
    const BASE = {};
    const S = {
      get ctx() { return ctx; },
      get task() { return F; },
      get util() { return U; },
      get spec() { return s; },
      get isCanvas() { return isCanvas; },
      get book() { return book; },
      set book(value) { book = value; },
      get workarea() { return workarea; },
      set workarea(value) { workarea = value; },
      get grid() { return grid; },
      set grid(value) { grid = value; },
      get canvas() { return canvas; },
      set canvas(value) { canvas = value; },
      get controls() { return controls; },
      set controls(value) { controls = value; },
      get optionEls() { return optionEls; },
      set optionEls(value) { optionEls = value; },
      get opEls() { return opEls; },
      set opEls(value) { opEls = value; },
      get colorEls() { return colorEls; },
      set colorEls(value) { colorEls = value; },
      get undo() { return undo; },
      set undo(value) { undo = value; },
      get fontPick() { return fontPick; },
      set fontPick(value) { fontPick = value; },
      get numberPick() { return numberPick; },
      set numberPick(value) { numberPick = value; },
      get nameBox() { return nameBox; },
      set nameBox(value) { nameBox = value; },
      get formula() { return formula; },
      set formula(value) { formula = value; },
      get tableInfo() { return tableInfo; },
      set tableInfo(value) { tableInfo = value; },
      get ready() { return ready; },
      set ready(value) { ready = value; },
      get count() { return count; },
      set count(value) { count = value; },
      get sum() { return sum; },
      set sum(value) { sum = value; },
      get records() { return records; },
      set records(value) { records = value; },
      get total() { return total; },
      set total(value) { total = value; },
      get popover() { return popover; },
      set popover(value) { popover = value; },
      get menu() { return menu; },
      set menu(value) { menu = value; },
      get shade() { return shade; },
      set shade(value) { shade = value; },
      get dialog() { return dialog; },
      set dialog(value) { dialog = value; },
      get rangeField() { return rangeField; },
      set rangeField(value) { rangeField = value; },
      get threshold() { return threshold; },
      set threshold(value) { threshold = value; },
      get preview() { return preview; },
      set preview(value) { preview = value; },
      get geometry() { return geometry; },
      set geometry(value) { geometry = value; },
      get gesture() { return gesture; },
      set gesture(value) { gesture = value; },
      get menuKey() { return menuKey; },
      set menuKey(value) { menuKey = value; },
      get suppressClick() { return suppressClick; },
      set suppressClick(value) { suppressClick = value; },
      get D() { return D; },
      get P() { return P; },
    };

    const { CSS, TOKENS } = env.templateLib('use-spreadsheet/_theme');
    env.templateLib('use-spreadsheet/_chrome').frameParts(S, BASE, CSS);
    env.templateLib('use-spreadsheet/_chrome').ribbonParts(S, BASE);
    env.templateLib('use-spreadsheet/_chrome').workspaceParts(S, BASE);
    env.templateLib('use-spreadsheet/_grid').stateParts(S, BASE);
    env.templateLib('use-spreadsheet/_grid').paintParts(S, BASE);
    env.templateLib('use-spreadsheet/_input').inputParts(S, BASE);

    ({ D, P } = env.templateDesign('use-spreadsheet/workbook', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(nextCtx) {
        if (resumeEdit) document.removeEventListener('keydown', resumeEdit);
        ctx = nextCtx; F = env.taskDef; U = ctx.util; s = ctx.spec; isCanvas = D.renderer === 'canvas';
        controls = {}; optionEls = {}; opEls = {}; colorEls = {};
        geometry = undefined; gesture = null; menuKey = ''; suppressClick = false;
        book = P.frame(ctx);
        P.title(ctx, book);
        P.navigation(ctx, book);
        P.ribbon(ctx, book);
        P.formulaBar(ctx, book);
        P.context(ctx, book);
        workarea = P.workarea(ctx, book);
        P.workspace(ctx, workarea);
        P.grid(ctx, workarea);
        P.activity(ctx, workarea);
        P.bottom(ctx, book);
        P.status(ctx, book);
        P.overlays(ctx, book);
        P.dialog(ctx);
        P.bind(ctx);
        // Dismissing a notice or overlay mid-edit drops focus to the body; Enter there still commits the pending edit.
        resumeEdit = (e) => {
          if (e.key !== 'Enter' || e.defaultPrevented || !ctx.model.editing || !book.isConnected) return;
          if (document.activeElement && document.activeElement !== document.body) return;
          e.preventDefault(); P.commit(F.helpers.transition(ctx.model, s, 'formula', P.formulaSource(formula.value))); grid.focus();
        };
        document.addEventListener('keydown', resumeEdit);
        P.draw(ctx.model);
        P.rendered(ctx, book);
        return { anchors: [book], sync: () => P.draw(ctx.model) };
      },
      locate: (t) => P.locate(t),
    };
  }, { uses: ['use-spreadsheet/_theme', 'use-spreadsheet/_chrome', 'use-spreadsheet/_grid', 'use-spreadsheet/_input'] });
})();
