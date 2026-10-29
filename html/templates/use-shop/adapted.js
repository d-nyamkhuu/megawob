// Implementations: _adapted-*.js parts and styles; _common.js controls; _shared-*.js identical sibling parts.
/*
 * templates / use-shop / adapted: the shared widget code of the 24 design-use-shop-* sites whose widget is "a local design
 * implementation adapted from the reference behavioral builders" (lineage use-shop/L1: food 12 sites, flight,
 * search and ticket 4 each). Those widgets are the reference store widget cut down to one builder per scenario, with the
 * design's changes made inside the builder; the sites differ in tokens (brand, texts, css) and in what they draw
 * differently inside a builder. A site's widgets/use-shop.js is only its design:
 *
 *   env.widget({ task: 'use-shop', site, name: 'design', split, scenarios: ['food'], traits?: {...},
 *              template: 'use-shop/adapted', design: { menuTitle: 'Cafeteria Ordering', parts: { ... } } });
 *
 * Scenarios: food (a delivery app: menu cards with inline size/quantity controls, cart column, options dialog),
 * flight (From / To autocompletes, Depart calendar, results list, booking), search (search bar, ordered result list,
 * pager, page preview) and ticket (sorted ticket list, Buy, optional Confirm purchase dialog).
 *
 * With `design: {}` the template plus its scenario's preset reproduces, exactly: design-use-shop-food-02 (food),
 * design-use-shop-flight-02, design-use-shop-search-02 and design-use-shop-ticket-02. That includes
 * their look (the preset: brand text and the design rules appended to the generic fit rules) and their reliance on site frame
 * (food: .order-slot, .clear-basket, .basket-state; flight: [data-trip], [data-role=trip-selection]; search:
 * .side-detail; ticket: .design-footer, [data-role=selection-*]); a design on another site sets tokens or
 * replaces the parts that touch the frame.
 *
 * Every builder is a sequence of parts called through P with the view state V (see each section): a design replaces
 * the part it draws differently (`parts: { name: (base, S) => replacement }`, the replacement takes the part's
 * arguments and may call base(...)). S: S.ctx (live episode ctx), S.def, S.D (tokens), S.P (parts, overrides
 * included), S.H (helpers: F, hashStr, where, money, whole, btn, trackFocus, listPane, pitchFor, mirrorPitch, ICON,
 * TAG_COLOR, FAV). V.x is free for a design's own state. An override must keep the rng draws of the part it
 * replaces (rng.int / pick / sample calls, in order), or episodes change for every seed.
 *
 * Tokens (defaults in TOKENS):
 *   brand      text of the brand bar; css: the design's CSS rules appended after the generic fit rules; extraCss:
 *              more rules after them (all three come from the scenario's preset: the look of the sites above)
 *   reveal     null | 'ticket' | 'flight': the controls hide behind a "Show controls" / "Expand tools" button
 *              (class design-reveal; the stage gets design-collapsed until it is pressed; locate() of a hidden
 *              control returns the button). Used by the -12 designs.
 *   icons      { <name>: '<svg markup>' } replaces entries of the icon table (search, chev, left, right, plus, cart,
 *              plane, pin, cal, ticket, bowl, bag, user, check)
 *   food       menuTitle (text of the menu band; null: no band), menuColumns (labels of the column-head row of each
 *              menu grid; null: none), cartTitle, cartColumns (labels of the basket column heads; null: none),
 *              cartTitleDraw (true: the sampled title is drawn first, then replaced by cartTitle), orderHost
 *              ('slot': Place order in the frame's .order-slot (emptied first) and .clear-basket as Clear; 'slotKeep':
 *              same without emptying the slot; 'cart': Place order alone at the end of the basket), totalLabel, emptyText (empty basket text), emptyHtml (markup instead
 *              of emptyText), addLabel (Add button text), cardMax (max card height px),
 *              photoSheet (file in the site's assets), photoMap ([[regexp, tile], ...] on the lower-cased dish
 *              name, first hit wins), photoDefault (tile when none hits), photoSize (css size), photoPos(tile)
 *              (css position)
 *   flight     fieldLabels {from, to, date}, fromPlaceholder, dateIcon (svg markup), calendarInBody (true: the
 *              calendar popup moves to the app body and counts as inside for outside presses), searchLabel (Search
 *              button), dateFormat (fmtDate style of the Date field), bookLabel, bookedLabel
 *   search     placeholder(spec) (search box hint), goLabel (Search button text; null: the sampled word),
 *              sizing ('stacked': eight-row density with sizing variables on the column; 'base': rows fill the
 *              body), pageNav (wheel over the list and dragging the pager change the page),
 *              markSelected (the picked result's row gets class selected), sideDetail (the preview opens in the site's
 *              .side-detail pane when it shows one), pagerAria (page buttons carry data-page and aria-label),
 *              pagerSync (after paging the list scrolls to the page and the title counts the visible rows)
 *   ticket     ticketGap (px between rows), headInFooter (the head moves into the site's .design-footer),
 *              selectionPane (the purchase state is mirrored into [data-role=selection-status|details]), buyLabel,
 *              boughtLabel
 *
 * Parts (signatures; V state and return conventions are described in the scenario sections):
 *   frameBefore() -> no-op hook
 *   frameTop() -> no-op hook
 *   frame(ctx) -> The app frame: width, insets and alignment sampled per episode from ctx.size.
 *   built() -> After a view is built and first painted (V is the view state of the scenario).
 *   prepare(ctx) -> Token reveal: the design hides its controls behind a "Show controls" / "Expand tools" button.
 *   intercept(t) -> A target behind the reveal button is located at the button while the controls are hidden.
 *   foodWrap(V) -> The page-state object V of a food view: ctx, util, spec, rng, fam, fmt, body, commit, step, paint and what the stages create (wrap, menu, band, cart, strip, tabEls, panels, addEls, cols, ch, fee, tabs, cnt, lines, totV, order, clear, done, cancelOrder, lineEls, dd). V.x is free for a design's own state.
 *   menuBand(V) -> updates menuBand state or elements
 *   foodMenu(V) -> updates foodMenu state or elements
 *   foodHero(V) -> updates foodHero state or elements
 *   foodColumns(V, cw) -> updates foodColumns state or elements
 *   foodSection(V, c, ci) -> updates foodSection state or elements
 *   foodSectionsInit() -> Hook before the grid columns are decided (state a design's sections need).
 *   foodSections(V) -> updates foodSections state or elements
 *   foodSectionsDone() -> Hook after every category has its tab and grid.
 *   foodPhoto(V, card, it) -> updates foodPhoto state or elements
 *   photoExtra() -> no-op hook
 *   cardText(V, card, it) -> updates cardText state or elements
 *   inlineControls(V, card, it) -> The size and quantity controls inside a card; the add click reads `.inline-size` and `.inline-quantity`.
 *   cardFoot(V, card, it, id) -> updates cardFoot state or elements
 *   foodCard(V, c, ci, id) -> updates foodCard state or elements
 *   foodCards(V) -> updates foodCards state or elements
 *   addClick(V, k) -> Clicking Add: the options dialog opens for items with an option group (the task decides).
 *   foodTabs(V) -> updates foodTabs state or elements
 *   cartHead(V) -> updates cartHead state or elements
 *   cartSummary(V) -> The delivery and total rows; V.totV shows the total.
 *   orderControls(V) -> Place order and Clear basket: in the site's frame slots (orderHost 'slot': the slot is emptied first and V.clear is the frame's button; 'slotKeep': the slot is kept and the click is added) or Place order alone at the end of the basket (orderHost 'cart').
 *   orderDone(V) -> updates orderDone state or elements
 *   foodDialog(V) -> The options dialog (items with an option group); V.dd holds its state.
 *   paintPre() -> no-op hook
 *   clearLines(V) -> updates clearLines state or elements
 *   cartLine(V, l, m) -> One cart line: name, price, - / + / Remove buttons (registered in V.lineEls by line key).
 *   paintBasketState(V, m) -> updates paintBasketState state or elements
 *   paintTotals(V, m) -> updates paintTotals state or elements
 *   paintControls(V, m) -> updates paintControls state or elements
 *   paintDialog(V, m) -> updates paintDialog state or elements
 *   foodPaint(V, m) -> updates foodPaint state or elements
 *   locateTab(V, k) -> updates locateTab state or elements
 *   locateAdd(V, k) -> updates locateAdd state or elements
 *   foodLocate(V, t) -> updates foodLocate state or elements
 *   buildFood(ctx, body) -> builds Food view and returns {paint, locate}
 *   flightTrip(V) -> Display-only trip information in the site's frame. The fields and scoring keep their seeded state.
 *   flightHeading(V) -> updates flightHeading state or elements
 *   fieldDecor() -> no-op hook
 *   flightField(V, f) -> The From / To autocomplete field f.
 *   flightDate(V) -> The Depart field with its calendar popup (env.ui.calendar).
 *   flightStatics(V) -> The fixed Trip Type / Passengers fields.
 *   flightEmpty(V) -> The comparison table's frame is visible before a search, without invented flights.
 *   flightDeals(V) -> updates flightDeals state or elements
 *   flightForm(V) -> updates flightForm state or elements
 *   flightSummary(V) -> The summary bar of the results screen: Modify search, route, date, Cancel booking.
 *   flightTable(V) -> The column heads, the count line, the flight pane, the fare note and the loading cover.
 *   resultsSummary(V, s) -> The route and date texts of the summary bar for the searched trip s.
 *   flightPitch(V) -> Row pitch of the flight pane (once per page): sets V.pitch, the pane height and the mirrored pitch.
 *   flightRow(V, i, fl, flights, s) -> One flight row i (fl = flights[i]) of the searched trip s.
 *   flightResults(V, m) -> Rebuild the flight list for the searched trip (m.searched).
 *   flightCal(V, m) -> updates flightCal state or elements
 *   paintScreen(V, m) -> Which screen shows, and the trip information in the site's frame.
 *   paintResultsHead(V, m) -> The count line and the loading cover over the flight pane.
 *   paintBookRow(V, m, i, b) -> updates paintBookRow state or elements
 *   paintEnd() -> no-op hook
 *   flightPaint(V, m) -> updates flightPaint state or elements
 *   flightLocate(V, t) -> updates flightLocate state or elements
 *   buildFlight(ctx, body) -> builds Flight view and returns {paint, locate}
 *   searchBar(V) -> The search bar: section title, search box (input), Search button.
 *   searchSort(V) -> The (inert) sort control and the result count line.
 *   searchPanes(V) -> The result list, the pager and the page preview (the site's side detail pane when it shows one).
 *   searchSizing(V) -> Result row height (V.cardH), description lines (V.lines) and the row sizing variables on the column.
 *   searchSide(V) -> The related searches column on wide stages.
 *   searchWire(V) -> The text field, focus tracking and the Search action (button and Enter).
 *   searchNav(V) -> Wheel over the list and dragging the pager move between result pages.
 *   searchVisit(V, m) -> The preview of the picked result (Back to results, the page's address, a few paragraphs).
 *   searchPick(V, m) -> Opening the preview: the side detail pane when the site has one. Returns true when the view is the preview.
 *   searchHide(V, m) -> Which parts of the result view are hidden while the preview shows.
 *   searchMeta(V, m, res) -> The result count line (res = all results of the query).
 *   searchCard(V, r, i, res, m, parent = V.list) -> One result row i (r = res[i]) in V.list; registers its title link in V.titles.
 *   searchRows(V, m, res) -> The rows of the result list. Default: every result in one scrolling list. Returns true when a design drew the whole result view itself (no pager).
 *   searchPager(V, m, res) -> The pager buttons (previous, 1..pages, next) and the page position afterwards.
 *   searchReset() -> Before the result view is emptied (state of an earlier build a design has to release).
 *   searchRebuild(V, m) -> updates searchRebuild state or elements
 *   searchPaint(V, m) -> updates searchPaint state or elements
 *   searchLocate(V, t) -> updates searchLocate state or elements
 *   searchCommit(V) -> updates searchCommit state or elements
 *   buildSearch(ctx, body) -> builds Search view and returns {paint, locate}
 *   ticketTitle(V) -> The title line of the head (the rng draw stays with the default).
 *   ticketHeadHook() -> Hook after the head's left block exists, before its title (frame texts a design fills in).
 *   ticketHead(V) -> Head: title, subtitle and the "Sort by" dropdown (env.ui.dropdown).
 *   ticketColumns() -> Between the head and the pane (column heads of designs that have them).
 *   ticketPitch(V) -> Row pitch of the ticket pane: sets V.pitch and the pane height, mirrors the pitch into the model.
 *   ticketPane(V) -> The pane, the footer note, the purchase receipt with Cancel purchase.
 *   ticketRow(V, i) -> One ticket row i; registers V.rowsEl[i] and V.buyEl[i].
 *   ticketList(V, m) -> updates ticketList state or elements
 *   ticketDialog(V) -> The Confirm purchase dialog (spec.confirm).
 *   paintBuyRow(V, m, i, b) -> One row's Buy button after a model change.
 *   paintSelection(V, m, t) -> The separate selection pane of the site's frame (t = the bought ticket or null).
 *   paintDialogBody(V, p) -> The summary lines of the pending purchase in the dialog.
 *   ticketPaint(V, m) -> updates ticketPaint state or elements
 *   ticketLocate(V, t) -> updates ticketLocate state or elements
 *   buildTicket(ctx, body) -> builds Ticket view and returns {paint, locate}
 */

(function () {
  'use strict';



  // The generic fit rules every design-* design starts from (full-stage frame, no brand bar, flat controls); a design
  // adds its own rules after them (token css).


  // What the sites of one scenario share (tokens brand, css, extraCss): the look of the scenario's representative site.
  const SCENARIOS = {
    food: {
      brand: 'Campus Café – Food Ordering',
      css: '\n.design-header{background:linear-gradient(#bed0e5,#91afd0)}.task-note{font-size:21px;background:#e5e9ed}.task-note h2{background:#a8c3df;margin:-20px -26px 20px;padding:10px 15px}.fd-card{display:grid;grid-template-columns:1fr auto;border:1px solid #a4aab2;padding:12px;height:75px!important}.fd-grid{grid-template-columns:1fr!important;gap:0}.fd-name{grid-column:1}.fd-foot{grid-column:2;grid-row:1/4;gap:15px}.fd-tags{display:none}.fd-add{background:linear-gradient(#f3f4f5,#c4c9ce);color:#111;border:2px outset #ddd;border-radius:9px}.fd-cart{border:1px solid #8b929b;width:29%!important}.fd-hero{display:none}.fd-tabs{margin-top:0}.end-control{background:linear-gradient(#f6f7fa,#bec4cd);color:#111;border:2px outset #fff;border-radius:8px}.fd-menu{padding:10px}.fd-desc{font-size:12px}',
      extraCss:
        '\n.fd-card,.fd-card.compact{position:relative;padding-left:90px!important}.fd-photo{position:absolute;left:8px;top:8px;bottom:8px;width:70px;border-radius:2px}.fd-card.compact .fd-tags{display:none}.fd-card.compact{gap:0}.fd-card.compact .fd-name{font-size:14px}.fd-card.compact .fd-foot{font-size:12px}.fd-card.compact .fd-opts{display:none}',
    },
    flight: {
      brand: 'SkyWays Travel',
      css: '\n.design-header{background:linear-gradient(#444,#202020);color:#fff}.design-nav{color:#ddd}.task-note{background:#d0d0d0;font-size:21px;border:4px ridge #757575;margin:8px}.task-note h2{font-size:23px}.stage{margin:8px;border:3px ridge #737373}.as-btn,.end-control{background:linear-gradient(#ddd,#aaa);color:#111;border:2px outset #ddd;border-radius:0}.fl-form{background:#c2c2c2}',
      extraCss: '',
    },
    search: {
      brand: 'MarketFind 2.1',
      css: '\n.design-header,.design-footer{background:#3c281b;color:#fff5dd;border:3px ridge #916e3d}.design-brand{font:23px Georgia}.design-nav{color:#fff5dd}.task-note{font-weight:400;background:#f2eee3}.end-control{background:linear-gradient(#f2d684,#957329);color:#15110d;border:3px ridge #d4b867}.se-title{color:#17110b}.se-card{display:flex;flex-direction:column}.se-box{border:2px inset #ddd}.stage{border:3px ridge #a78d5a}\n.se-card{position:relative;padding-left:40px}.result-number{position:absolute;left:8px;top:12px;font:700 17px var(--font)}',
      extraCss: '',
    },
    ticket: {
      brand: 'T R A V E L   N E X U S',
      css: '\n.task-note{font-size:22px;padding:32px;background:#f7f6f3}.task-note h2{letter-spacing:3px;text-transform:uppercase;font-size:13px;padding-top:20px;border-top:4px solid #ed640e}.tk-row{background:#fff;border:1px solid #e1e1df;margin-bottom:0;border-radius:4px}.tk-date{display:none}.tk-buy{background:#ef6815;border:0;color:#fff}.tk-title{font-size:28px}.design-header,.design-footer{background:#efeff2}.end-control{background:#ef6815;border:0}\n.tk-date{display:none}.tk-info{min-width:150px}.tk-sort{font-size:12px}',
      extraCss: '',
    },
  };

  const ICONS = {
    search:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>',
    left: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    right:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>',
    cart: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2h2l1.6 8h7.4l1.5-5.5H4.3"/><circle cx="6.2" cy="13.2" r="1"/><circle cx="11.8" cy="13.2" r="1"/></svg>',
    plane:
      '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M15 8c0-.6-.5-1-1.1-1H10L6.6 1.5H5.2L6.9 7H3.6L2.4 5.4H1.2L2 8l-.8 2.6h1.2L3.6 9h3.3l-1.7 5.5h1.4L10 9h3.9c.6 0 1.1-.4 1.1-1z"/></svg>',
    pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 14.5s4.8-4.4 4.8-8a4.8 4.8 0 0 0-9.6 0c0 3.6 4.8 8 4.8 8z"/><circle cx="8" cy="6.5" r="1.7"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M5.2 1.6v2.6M10.8 1.6v2.6"/></svg>',
    ticket:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M1.8 4.5h12.4v2.2a1.4 1.4 0 0 0 0 2.6v2.2H1.8V9.3a1.4 1.4 0 0 0 0-2.6z"/></svg>',
    bowl: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1.8 7.5h12.4a6.2 5.6 0 0 1-12.4 0z"/><path d="M5 5.2c0-1 1-1 1-2M8.5 5.2c0-1 1-1 1-2"/></svg>',
    bag: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 5h10l-.8 9H3.8z"/><path d="M5.6 5V4a2.4 2.4 0 0 1 4.8 0v1"/></svg>',
    user: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="5.3" r="2.7"/><path d="M2.8 14.2c.5-3 2.6-4.6 5.2-4.6s4.7 1.6 5.2 4.6"/></svg>',
    check:
      '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',
  };
  const TAG_COLOR = {
    vegan: '#2f9e44',
    vegetarian: '#66a80f',
    'gluten-free': '#e8590c',
    spicy: '#e03131',
    nuts: '#8d5524',
  };
  const FAV = ['#1c7ed6', '#e8590c', '#2f9e44', '#7048e8', '#c2255c', '#0c8599', '#f08c00', '#495057'];

  // Which builder part draws each scenario.
  const BUILD = { food: 'buildFood', flight: 'buildFlight', search: 'buildSearch', ticket: 'buildTicket' };

  const FOOD_PHOTOS = [
    [/veggie|vegetarian.*burger/, 1],
    [/burger/, 0],
    [/fries/, 2],
    [/salad/, 3],
    [/wing|popper/, 4],
    [/dip|bread/, 5],
    [/pasta|noodle/, 7],
    [/brownie|cake|dessert/, 8],
  ];

  const TOKENS = {
    brand: '',
    css: '',
    extraCss: '',
    reveal: null,
    icons: {},
    // food
    menuTitle: 'Menu',
    menuColumns: ['Item', 'Size', 'Price', 'Quantity', 'Add'],
    cartTitle: 'Your Basket',
    cartTitleDraw: false,
    orderHost: 'slot',
    cartColumns: ['Item', 'Qty', 'Price'],
    totalLabel: 'Total',
    emptyText: '(No items yet)',
    emptyHtml: null,
    addLabel: 'Add to basket',
    cardMax: 124,
    photoSheet: 'menu-foods.webp',
    photoMap: FOOD_PHOTOS,
    photoDefault: 6,
    photoSize: '300% 300%',
    photoPos: (tile) => (tile % 3) * 50 + '% ' + Math.floor(tile / 3) * 50 + '%',
    // flight
    fieldLabels: { from: 'From:', to: 'To:', date: 'Date:' },
    fromPlaceholder: 'City or airport',
    dateIcon:
      '<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="6" width="22" height="20" rx="1" fill="#fff" stroke="#101c91" stroke-width="2"/><path d="M3 7h22v6H3z" fill="#e32026"/><path d="M8 3v7M20 3v7" stroke="#d99b14" stroke-width="4"/><path d="M8 14v10M14 14v10M20 14v10M5 18h18M5 23h18" stroke="#112288" stroke-width="1.5"/></svg>',
    calendarInBody: true,
    searchLabel: 'Search Flights',
    dateFormat: 'us',
    bookLabel: 'Book',
    bookedLabel: 'Booked',
    // search
    placeholder: () => '',
    goLabel: 'Search',
    sizing: 'stacked',
    pageNav: true,
    markSelected: true,
    sideDetail: true,
    pagerAria: true,
    pagerSync: true,
    // ticket
    ticketGap: 12,
    headInFooter: true,
    selectionPane: true,
    buyLabel: 'Buy',
    boughtLabel: 'Bought',
  };

  env.template('use-shop/adapted', (design, def) => {
    const { F, hashStr, where, money, whole, btn, trackFocus, listPane, pitchFor, mirrorPitch } = env.templateLib('use-shop/_common');
    const { CSS, FIT_CSS } = env.templateLib('use-shop/_adapted-style');
    let D, P; // tokens and parts, resolved below
    let ICON; // icon markup: ICONS with the design's icons token
    let st = null; // live episode: { ctx, view }
    // The reveal button of token reveal (state of this page).
    let revealEl = null;
    let revealOpen = false;
    let revealFocus = null;
    const BASE = {};
    const S = {
      get ctx() {
        return st && st.ctx;
      },
      def,
      get D() {
        return D;
      },
      get P() {
        return P;
      },
      H: {
        F,
        hashStr,
        where,
        money,
        whole,
        btn,
        trackFocus,
        listPane,
        pitchFor,
        mirrorPitch,
        get ICON() {
          return ICON;
        },
        TAG_COLOR,
        FAV,
      },
    };

    function ensureStyle() {
      if (document.getElementById('as-style')) return;
      const s = document.createElement('style');
      s.id = 'as-style';
      s.textContent = CSS + FIT_CSS + D.css + D.extraCss;
      document.head.append(s);
      const local = document.querySelector('link[href$="site.css"]');
      if (local) document.head.append(local);
    }

    // ---------------------------------------------------------------- frame and hooks

    BASE.frameBefore = () => {};
    BASE.frameTop = () => {};

    // The app frame: width, insets and alignment sampled per episode from ctx.size.
    BASE.frame = (ctx) => {
      const app = ctx.util.el('section', 'as-app', ctx.stage);
      app.dataset.role = 'app';
      P.frameBefore(ctx, app);
      const top = ctx.util.el('div', 'as-top', app);
      P.frameTop(ctx, top);
      const brand = ctx.util.el('b', 'as-brand', top, D.brand);
      const body = ctx.util.el('div', 'as-body', app);
      return { app, top, brand, body };
    };

    // After a view is built and first painted (V is the view state of the scenario).
    BASE.built = () => {};

    // Token reveal: the design hides its controls behind a "Show controls" / "Expand tools" button.
    BASE.prepare = (ctx) => {
      revealOpen = !!ctx.model.designOpen;
      if (!D.reveal) return;
      ctx.stage.classList.toggle('design-collapsed', !revealOpen);
      let host = ctx.stage;
      if (D.reveal === 'ticket') {
        const controlRow = document.querySelector('.task-ctl');
        if (
          controlRow &&
          !controlRow.closest('[hidden]') &&
          getComputedStyle(controlRow).display !== 'none' &&
          ctx.display !== 'toast'
        )
          host = controlRow;
      }
      revealEl = ctx.util.el('button', 'design-reveal', host, D.reveal === 'ticket' ? 'Show controls' : 'Expand tools');
      revealEl.type = 'button';
      revealEl.hidden = revealOpen;
      revealEl.addEventListener('click', () => {
        revealOpen = true;
        ctx.stage.classList.remove('design-collapsed');
        revealEl.hidden = true;
        ctx.update({ ...ctx.model, designOpen: true });
        if (revealFocus) {
          const input = ctx.stage.querySelector(revealFocus);
          if (input) input.focus({ preventScroll: true });
        }
      });
    };

    // A target behind the reveal button is located at the button while the controls are hidden.
    BASE.intercept = (t) => {
      if (revealOpen || !revealEl) return null;
      const needs =
        D.reveal === 'ticket'
          ? t.buy !== undefined || t.sort || t.sortBy
          : D.reveal === 'flight' && (t.field || t.nav || t.day || t.button || t.suggestion !== undefined);
      if (!needs) return null;
      revealFocus = D.reveal === 'flight' ? '[data-role="' + (t.field || 'from') + '-field"]' : null;
      return env.util.center(revealEl);
    };

    // ---------------------------------------------------------------- food

    // The page-state object V of a food view: ctx, util, spec, rng, fam, fmt, body, commit, step, paint and what the
    // stages create (wrap, menu, band, cart, strip, tabEls, panels, addEls, cols, ch, fee, tabs, cnt, lines, totV,
    // order, clear, done, cancelOrder, lineEls, dd). V.x is free for a design's own state.
    env.templateLib('use-shop/_adapted-food').install(BASE, S);

    env.templateLib('use-shop/_adapted-flight').install(BASE, S);

    env.templateLib('use-shop/_adapted-search').install(BASE, S);

    env.templateLib('use-shop/_adapted-ticket').install(BASE, S);

    ({ D, P } = env.templateDesign('use-shop/adapted', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    ICON = { ...ICONS, ...D.icons };

    return {
      render(ctx) {
        ensureStyle();
        const fr = P.frame(ctx);
        const view = P[BUILD[ctx.spec.scenario]](ctx, fr.body, fr);
        st = { ctx, view };
        P.prepare(ctx);
        return {
          anchors: [fr.app],
          sync(m) {
            if (view.sync) view.sync(m);
            else if (view.paint) view.paint(m);
          },
        };
      },
      locate(t) {
        const dp = P.intercept(t);
        if (dp) return dp;
        const p = st && st.view.locate(t);
        if (!p) throw new Error('Cannot locate ' + JSON.stringify(t));
        return p;
      },
    };
  }, { uses: ["use-shop/_common","use-shop/_adapted-style","use-shop/_adapted-food","use-shop/_adapted-flight","use-shop/_adapted-search","use-shop/_adapted-ticket"] });
})();
