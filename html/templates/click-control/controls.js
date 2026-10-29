/*
 * templates / click-control / controls: the shared widget code of the design-click-control-* sites (taken from the base widget
 * click-control/controls as those sites had it). A site's widgets/click-control.js is only its design:
 *
 *   env.widget({ task: 'click-control', site, name: 'design', split, scenarios: ['pie'], traits?: {...},
 *              template: 'click-control/controls', design: { pieMax: 464, parts: { pieDefs: () => (ctx, svg, S) => ... } } });
 *
 * One page frame (the site's frame supplies the application around it; the widget draws .uc-page > .uc-content in
 * the stage) holds the controls of one scenario; the template has one builder per scenario:
 *   button       text, labelled inputs and buttons on a dotted control surface (disabled buttons greyed out)
 *   sequence     ONE..FOUR (or short labels) on the control surface, with decoy buttons; pressed ones stay marked
 *   link         an article whose links are underlined phrases, or (mode 'list') a related-links list where some
 *                links are drawn as buttons or chips
 *   tab          a tab strip over panels (links inside in mode 'link')
 *   menu         mode 'bar': an always-visible vertical menu with fly-out submenus; mode 'button': a "Menu" button
 *                with a dropdown of icon items; submenus open on hover or click, spec.aim closes them after a delay
 *   collapsible  an accordion (one section open at a time)
 *   dialog       a modal over a page (dimmed backdrop; clicks on it are ignored); spec.opener: starts closed and
 *                opens from a page button
 *   pie          a spreader button in the middle of a ring of slices (click it, then a slice)
 *   widget       stacked form widgets (radio, checkbox, text, textarea, button), two columns when many
 *   focus        a form with text fields at jittered offsets (decoy read-only fields below)
 *   hover        squares on a board; the highlighted one moves (model.hl); a meter shows the hover time
 * Recoverable mode: a pending wrong choice shows an Undo toast, or (link, tab, collapsible) a "navigated" view with
 * a Back link; both map to { undo: true }. The page frame is the anchor; popups, dialogs, toasts and views are
 * overlays. The widget CSS is the template's (uc-* classes, colors from the site's --panel, --line, --accent,
 * --muted, --fg, --bg); a site restyles it in its site.css and styles the classes its own parts add.
 *
 * With design: {} the template behaves exactly like one existing site per scenario (a design file that is only
 * `design: {}`):
 *   pie design-click-control-pie-01 (the medoid)        button design-click-control-button-01      sequence design-click-control-sequence-01
 *   menu design-click-control-menu-01                   collapsible design-click-control-collapsible-01
 *   dialog design-click-control-dialog-01               widget design-click-control-widget-05      focus design-click-control-focus-01
 *   hover design-click-control-hover-01 (a widget without traits)
 *   link design-click-control-link-01                  tab design-click-control-tab-01
 * Designs keep the widget keys the template does not set (traits, scrollable, ...); a site that had no traits has none.
 *
 * Scenario presets (what most sites of one scenario share, applied to widgets that declare exactly that scenario):
 *   link    articleFit {}      shrink an article that outgrows the content area (7 of 12 sites; 3 more with a scenario)
 *           linkDecor          the notebook resource list and closing notes of design-click-control-link-01
 *   tab     tabButton/tabPanel line icons and overview/key-point panels of design-click-control-tab-01
 *   menu    menuLabel 'People' the menu button reads "People" (about half of the sites)
 *   widget  obstacle true      locate() clicks a visible .design-obstacle .dismiss-design first (8 of 12)
 *
 * design tokens (defaults in TOKENS):
 *   icons         { <name>: '<svg inner markup>' } replaces entries of the 16x16 line-icon table (menu items, tabs)
 *   hoverFill     { green, blue, red } fill of the highlighted hover square
 *   obstacle      true: locate() first targets a visible page obstacle's dismiss control
 *   articleFit    link: null | { room?: px kept free instead of the content padding, slack?: px tolerance }: shrink
 *                 the article font (and the heading, link gap) when it is taller than the content area
 *   outerInset    pie: outer radius = half the diameter minus this (6)
 *   gapOuter      pie: degrees trimmed from each slice edge at the outer radius (0)
 *   gapInner      pie: extra degrees trimmed at the inner radius (0)
 *   pieMin, pieMax, pieHMul, pieHSub, pieWMul, pieWSub
 *                 pie diameter = max(pieMin, min(pieMax, floor(h * pieHMul) - pieHSub, floor(w * pieWMul) - pieWSub))
 *                 for the content rect w x h (220, 320, 1, 34, 1, 0)
 *   innerFrac     pie: inner radius = diameter * innerFrac (null: 40 px)
 *   knobR         pie: hub circle radius (26; null: the inner radius)
 *   seqW, seqWFrac, seqH, seqHFrac
 *                 sequence: button width = min(seqW, surface width * seqWFrac), likewise the height (280, .24, 120, .24)
 *   seqSpots      sequence: [[x, y], ...] fractional positions of the buttons and decoys (six spots)
 *   seqDecoys     sequence: number of controls including decoy buttons (6; 0: no decoys)
 *   seqLabels     sequence: decoy button labels (those equal to a real label are skipped)
 *   helper        button: true: a hint line under the buttons ("After clicking the button, press Submit ...")
 *   menuLabel     menu: text of the "Menu" button ('Menu')
 *   decoysBefore, decoysAfter
 *                 menu: decoy entries before / after the real ones: [label | [label, icon]] (null: none)
 *   modTitle      collapsible: heading above the accordion ('Module Contents'; null: none)
 *   chevron       collapsible: header marker markup (a filled triangle)
 *   headings      widget: { text, textarea, radio, checkbox, button, other } caption before each widget by type
 *   intro         focus: paragraph above the form (null: none)
 *   extras        focus: labels of the decoy fields filling up to four rows
 *   rx            hover: corner radius of the squares (1)
 *   dlgIcon       dialog: markup of the icon in the dialog body (the archive icon)
 *   dlgName       dialog: [label, value] of the first decoy row in the dialog body
 *   dlgLocation, dlgReport   dialog: decoy row texts in the dialog body
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part; the replacement takes the part's arguments and
 * may call base(...) for the default. S reads the live state: S.ctx, S.spec, S.D (tokens), S.P (the parts), S.icon(name),
 * S.ICON_PATHS, S.FILE_COLORS, S.TRIANGLE, S.linkPoint. ctx is the render ctx, up(patch) updates the model. Hooks
 * default to doing nothing. An override must keep the rng draws of the part it replaces, in order. Parts:
 *   page      ensureStyle(id, css)  frame(ctx) -> { page, content, h1 }   box(ctx, content) -> el
 *             surface(ctx, content) -> { box, W, H }   paragraph(ctx, parent, segs, block, tag) -> links
 *             recovery(ctx, page, area, up, kind)   mount(ctx, page, content, builder)
 *             synced(ctx, m)  after each sync    rendered(ctx, page, content)  after the episode is drawn
 *   pie       pieSize(r, ctx) -> diameter   pieScale(S, r) -> factor on the drawn size (pointer geometry follows)
 *             pieInner(S, c) -> inner radius   pieAreaMade(ctx, area, S)   pieDefs(ctx, svg, S)  before the slices
 *             slicePath({ pt, a0, a1, outer, inner, w, S, i }) -> path data   sliceDecor(ctx, g, path, d, i)
 *             labelRadius(inner, outer, S)   labelPos(pt, start, i, w, inner, outer, S) -> [x, y]
 *             sliceLabel(ctx, g, text, path, label, i, x, y, S)   slicesDone(ctx, g, slices, S)
 *             knobRadius(S, inner)   plus(spread, c, S, inner) -> el   plusOrigin(c, S)   hubBefore / hubAfter(ctx,
 *             spread, c, S, inner)   hub(...) -> knob   pieShow(area) -> show(el, open)   pieBound(ctx, content, up)
 *   sequence  seqButton(ctx, s, e, i) -> el   seqPlace(el, index, { W, H, w, h, spots })
 *             seqDecoyLabel(ctx, k, labels, j) -> text   seqDecoyMade(ctx, el, label, j)   seqSynced(ctx, m)
 *   button    buttonHost(ctx, s, content) -> el where the controls go   buttonEl(ctx, host, e) -> el
 *             buttonBuilt(ctx, s, els, content)   buttonSynced(ctx, m) (mirrors clicks into .status-row)
 *   link      linkHead(ctx, art)   linkList(ctx, art, content) -> links   linkParagraphs(ctx, art) -> links
 *             linkDecor(ctx, art, links, content)  lays the article out   linkSynced(ctx, m, links)
 *             helpers: clearArticle(art), linkSpan(ctx, parent, text, key, links), linkResources(ctx, art, links,
 *             { intro, labels, after })
 *   tab       tabStrip(ctx, wrap, strip)   tabLabel(t, i)   tabButton(ctx, tb, t, i)   tabPanel(ctx, p, t, i, links)
 *             pushes its link elements onto links   tabsBuilt(ctx, wrap, strip, tabEls, panels)   tabsReady(ctx, wrap, strip)
 *   menu      menuPrelude(ctx, content)  page content before the menu (default: a contact list)
 *             menuWrapMade(ctx, wrap, content)   menuTrigger() -> button html   menuHead(ctx, wrap, trigger|null)
 *             menuPanel(panel, nodes)   itemIcon(el, n)   caret(el)   decoys(root, cls, list)
 *             menuBuilt(ctx, content, wrap, root, items)   menuSynced(ctx, m)
 *   collapsible  colStart(ctx, content)   colTitle(ctx, b)   colAcc(ctx, content, b, acc)
 *             colHeader(ctx, sec, h, s, i)   colBody(ctx, bd, s, i, links, h)   colSection(ctx, sec, h, bd, s, i)
 *             colBuilt(ctx, content, acc)   colSynced(ctx, m)
 *   dialog    dialogPage(ctx, content) -> opener|null (with dialogBefore(ctx, content), dialogOpener(ctx, settings),
 *             dialogStart(ctx, settings), dialogAfter(ctx, content, opener))   dialogTitleText(ctx, title)
 *             dialogClose(ctx, x)   dialogBody(ctx, dbox)   footButton(ctx, foot, label, i) -> el
 *             dialogWidth(r)   dialogPos(r, bw, bh, rng) -> [left, top]   dialogPlaced(ctx, content, dbox, r, opener,
 *             bh) -> opener   dialogDone(ctx, dlg, opener)   dialogSynced(ctx, m)
 *   widget    widgetCols(ctx, r)   widgetGrid(ctx, card, cols, r)   widgetsStart(ctx, card)
 *             widgetHeading(ctx, row, wd, i) -> el|null   widgetPlace(ctx, card, row, wd, i, heading)
 *             widgetsBuilt(ctx, card, rows, r)
 *   focus     focusStart(ctx, content)   focusForm(ctx, form)   fieldLabel(ctx, fld, f, i, id) -> label
 *             fieldAria(f, i) -> text|null   decoyLabel(ctx, row, i, text)   extraRows(spec) -> count
 *             focusExtras(ctx, form)   focusMore(ctx, form)
 *   hover     hoverSize(r, content) -> { W, H }   hoverRect(s, W, H) -> svg attributes   hoverBefore(ctx, b, rects, W, H)
 *             hoverMeter(ctx, b, W, H) -> update(m, rects)   hoverAfter(ctx, b, rects, W, H)
 */
(function () {
  'use strict';

  env.template('click-control/controls', (design, def) => {
    const { CSS, ICONS, DLG_ICON, HOVER_FILL, TRIANGLE, HAMBURGER, FILE_COLORS, PERSON, CONTACTS, SPOTS, SEQ_DECOYS, CALIBRATION_LOG, linkPoint, fail, must, fam, TOKENS, SCENARIOS } = env.templateLib('click-control/_controls-data');
    let D, P; // tokens and parts, resolved below
    let view = null; // live episode: { locate(t), sync(m) }
    let blankEl = null; // empty page space (the page title)
    let spec;
    let ctxRef;
    const iconPaths = () => ({ ...ICONS, ...D.icons });
    const icon = (name) => (name && iconPaths()[name]
      ? `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconPaths()[name]}</svg>`
      : '<svg viewBox="0 0 16 16"></svg>');
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; },
      get spec() { return spec; },
      get D() { return D; },
      get P() { return P; },
      get ICON_PATHS() { return iconPaths(); },
      icon, FILE_COLORS, TRIANGLE, linkPoint,
    };
    const scopeRef = {
      get HAMBURGER() { return HAMBURGER; },
      get PERSON() { return PERSON; },
      get CONTACTS() { return CONTACTS; },
      get CALIBRATION_LOG() { return CALIBRATION_LOG; },
      get linkPoint() { return linkPoint; },
      get fam() { return fam; },
      get D() { return D; },
      get P() { return P; },
      get blankEl() { return blankEl; },
      get spec() { return spec; },
      get ctxRef() { return ctxRef; },
      get icon() { return icon; },
    };

    // ---------------------------------------------------------------- page frame

    env.templateLib('click-control/_controls-frame').install(BASE, scopeRef);

    // ---------------------------------------------------------------- pie

    // Diameter of the pie in px from the content rect r.
    env.templateLib('click-control/_controls-pie').install(BASE, scopeRef);

    // ---------------------------------------------------------------- sequence

    // A numbered/labelled button on the control surface (before it is placed).
    env.templateLib('click-control/_controls-buttons').install(BASE, scopeRef);

    // ---------------------------------------------------------------- tab

    env.templateLib('click-control/_controls-navigation').install(BASE, scopeRef);

    // ---------------------------------------------------------------- dialog

    env.templateLib('click-control/_controls-dialog').install(BASE, scopeRef);

    // ---------------------------------------------------------------- widget

    env.templateLib('click-control/_controls-fields').install(BASE, scopeRef);

    // ---------------------------------------------------------------- widget

    const BUILD = {
      button: (...a) => P.buildButton(...a),
      sequence: (...a) => P.buildSequence(...a),
      link: (...a) => P.buildLink(...a),
      tab: (...a) => P.buildTab(...a),
      menu: (...a) => P.buildMenu(...a),
      collapsible: (...a) => P.buildCollapsible(...a),
      dialog: (...a) => P.buildDialog(...a),
      pie: (...a) => P.buildPie(...a),
      widget: (...a) => P.buildWidget(...a),
      focus: (...a) => P.buildFocus(...a),
      hover: (...a) => P.buildHover(...a),
    };

    ({ D, P } = env.templateDesign('click-control/controls', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));

    return {
      render(ctx) {
        spec = ctx.spec;
        ctxRef = ctx;
        const builder = BUILD[spec.scenario];
        if (!builder) throw new Error(`click-control/controls has no builder for variant '${spec.scenario}'`);
        P.ensureStyle('uc-style', CSS);
        const { page, content, h1 } = P.frame(ctx);
        blankEl = h1;
        view = P.mount(ctx, page, content, builder);
        P.rendered(ctx, page, content);
        return { anchors: [page], sync: (m) => view.sync(m) };
      },

      locate(t) {
        if (D.obstacle) {
          const obstacle = document.querySelector('.design-obstacle:not([hidden]) .dismiss-design');
          if (obstacle) return env.util.center(obstacle);
        }
        return must(view && view.locate(t), t);
      },
    };
  }, { uses: ['click-control/_controls-data', 'click-control/_controls-frame', 'click-control/_controls-pie', 'click-control/_controls-buttons', 'click-control/_controls-navigation', 'click-control/_controls-dialog', 'click-control/_controls-fields'] });
})();
