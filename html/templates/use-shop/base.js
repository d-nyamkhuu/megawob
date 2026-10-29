// use-shop/base: the base site's use-shop widgets (store, stream, market, sheet) as a template. This file is
// their source. Implementations live in _base-*.js; wrappers below retain every design unit and scope hook.
// The design-* sites that started from a copy of them, and the composite sites that embed them, are
// designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/use-shop.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/use-shop.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
// Shopping parts receive view = { ctx, util, s (spec), cash, shell, toolbar, work, pane, summary,
// button, link, chips, qty, art, update, paint, returnsPhoto, registerControl }; it belongs to one render, never the factory.
// registerControl(key, element) registers a custom control for locate and scroll mirroring, without binding its events.
// shoppingArt(view, parent, large=false, product): product illustration; shoppingReturnPhoto(view,node,product): order photo.
// shoppingProduct(view,m): product page = shoppingProductHeading(view,m,parent) -> head (gallery with
// shoppingProductThumbs(view,thumbs,product), copy) + shoppingProductOptions(view,m,parent) (chips, stock, add to bag,
// details) + shoppingProductAfter(view,m): decoration. A design can lay heading and options out in its own containers.
// shoppingCompare(view,m): comparison page around shoppingCompareProducts(view,m) (the products and their Select buttons).
// shoppingLinesHeading(view,m): bag heading and introduction. SHOPPING_CART_ACTIONS: a cart line's links, in order.
// shoppingLine(view,m,l,status): bag row; shoppingLineProduct / shoppingLineActions(view,m,l,status,p,row): row content/actions.
// shoppingLinesAfter(view,m): decoration below rows; shoppingCartFooter(view,m): cart services; shoppingOffers(view,m): offer cards/help.
// shoppingReturn(view,m): return steps under shoppingReturnHeading(view,m); shoppingReturnOrders(view,m): order picker;
// shoppingOrderItems(view,m,o,i,card): order selection and item controls (o=order, i=order index).
// shoppingSummary(view,m): inspector; shoppingSummaryHeading(view,m,t): heading;
// shoppingSummaryTotals(view,m,t,pair): bag amounts (t=totals, pair(label,value,total=false)); shoppingSummaryAfter(view,m): decoration.
// shoppingToolbar(view): decoration before department navigation (only ctx/util/s/cash/shell/toolbar available).
// shoppingBeforePaint / shoppingPainted(view,m): before clearing panes / after painting summary, before restoring scroll.
// Empty decoration parts do nothing by default; all other defaults reproduce reference, including DOM order.
// SHOPPING_STATUSES: bag group order, default ['cart','saved','removed'].
// productArt(name,hue,kind) frames productDrawing(text,kind,ink,pale); wrap productDrawing to draw more products.
// frame(ctx,o): frameCover(ctx) measures fixed site frame (end control, the toast note matched by NOTE) over the
// stage's bottom; framePlace(app,{flow,width,left,padY,H,cover}) positions the app clear of it.
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/use-shop.js`, HTML).href };
    /*
     * reference / use-shop / store: ten commerce apps inside one app frame (brand bar + body). The frame's
     * width, insets and alignment inside the stage are sampled per episode (sized from ctx.size).
     *   search   a search engine page: rounded search box + Search button (Enter also searches), a result
     *            count line, spec.perPage result cards (favicon, host › path, title link, snippet) and a
     *            pager (‹ 1 2 3 ›). Before the first search the result area shows an empty state; on wide
     *            viewports a "Related searches" side column. Clicking a result opens a preview of that page
     *            with "Back to results".
     *   ticket   a ticket shop: title + "Sort by" dropdown (env.ui.dropdown) over a fixed pane showing
     *            spec.rows rows; the list scrolls natively (wheel) with a custom track + thumb
     *            (env.ui.listbox scrollbar). Rows: date badge, name / place, times + duration, price, Buy.
     *            spec.confirm: Buy opens a modal "Confirm purchase" dialog (env.ui.dialog: Pay / Cancel / x).
     *            A purchase shows a receipt line under the list with "Cancel purchase".
     *   food     a delivery app: restaurant header, category tabs (env.ui.tabs, wrapping) over item cards with
     *            an Add button (env.ui.buttons), a cart column (on either side) with - / + / remove per line,
     *            total and Place order; a placed order shows a status box with "Cancel order". Items with an
     *            option group open a modal (env.ui.dialog) with option tiles (env.ui.choices), a quantity
     *            spinner (env.ui.spinner) and Add to cart.
     *   flight   a flight booking page: From / To autocompletes (env.ui.autocomplete, suggestions under the
     *            field, matched part bold), a Depart field opening a month calendar (env.ui.calendar,
     *            prev / next, in-month days only), Search (refused fields turn red with a message) -> a
     *            results screen with a summary bar, "Modify search", a loading cover while spec.loadMs runs on
     *            the kit clock, and a scrolling flight list as in ticket; a booking shows "Cancel booking".
     *            With spec.sortable (a widget with traits.sort; none of the base widgets declares it) the results screen has a
     *            "Sort by" dropdown beside the count and lists flights in flightOrder(). With spec.corpus (traits.corpus) the
     *            search cards show the result's metadata (brand / price / rating, role / location / email, type / publisher /
     *            updated) under the title. Both are rendered from the spec only.
     *   checkout a store whose pages swap inside the app: top bar with brand, search box + button, Shop /
     *            Orders / Track order and a Cart pill; shop page with an optional promo banner, a filter column
     *            (native category checkboxes via env.ui.choices, a two-thumb price range via env.ui.slider)
     *            and either a fixed pane of product rows (listbox scrollbar + wheel; spec.layout 'pane') or a
     *            card grid that makes the whole page scroll (spec.layout 'page': the widget is scrollable for
     *            those specs and only the top bar is an anchor); skeletons while a search loads. Product rows
     *            and cards have a quantity stepper and Add (disabled "Sold out" when out of stock). Product,
     *            cart (promo code field), checkout (address tiles, new-address form, delivery radios),
     *            confirmation (order number, Cancel order), cancel-order and tracking pages.
     * A12: variantpick (product details and size/colour/material swatches, stock, bag preview), compare
     * (3-4 specification columns), returns (order history, return options, review and return receipt),
     * cartedit (quantity steppers, saved/removed sections), coupon (offer cards, entry and applied/expired states).
     * All use native wheel panes, mirrored shopReveal geometry and a persistent totals/return summary.
     * Realism pass: account notifications, department navigation, SVG product galleries and dish art,
     * seller/fulfilment metadata, comparison product cards, order thumbnails and return process guidance,
     * coupon terms, recommendations and service disclosures. Secondary browsing content is unscored.
     * Payment and confirm-mode return issue buttons call ctx.flag('irreversible'). No network or timers.
     * Widgets (the same code, one builder per scenario; mode picks the extras)
     *   store    all of the above.
     *   stream   (scenarios: search; traits.infinite) the results are one infinite-scroll pane of spec.rows rows
     *            (scrollbar + wheel) without a pager; below the last loaded result a footer says "Scroll down for more
     *            results", then "Loading more results..." for the kit-clock beat (spec.infinite.beat) after the last row
     *            was fully in view, then the next batch is appended in place (scroll position kept); the end of the
     *            list says so. Plan targets: { thumb: 'list' }, { scroll }, { pane: 'list' } and { result }.
     *   market   (scenarios: checkout; traits.layout 'page') a marketplace: card grid (the page scrolls) with an ad
     *            leaderboard above the grid, a sponsored ad in the filter column and inert sponsored tiles between the
     *            product cards (clicks do nothing), and a Cart > Shipping > Payment > Review stepper (indicator only)
     *            on the cart, checkout and confirmation pages.
     *   sheet    (scenarios: checkout; traits.layout 'pane') a mobile-style store: top bar with brand and search only,
     *            a bottom tab bar (Shop, Orders, Track order, Cart with a count) and the cart as a bottom sheet over
     *            the shop page (scrim, grab handle, close x; the scrim and x go back to the shop; the tabs stay
     *            reachable); checkout and the other pages fill the app.
     * Mechanics: text fields env.ui.textField. Lists and popups never move the app frame (the anchor). The
     * whole widget renders from ctx.model, so a re-render (after the planted shortcut) shows any state; sync()
     * repaints after kit-clock ticks (loading states). Pane builders mirror the row pitch into model.pitch so the
     * oracle can size wheel steps.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get POLISH_CSS() { return POLISH_CSS; },
        get ICON() { return ICON; },
        get TAG_COLOR() { return TAG_COLOR; },
        get FAV() { return FAV; },
        get WORD_COLORS() { return WORD_COLORS; },
        get MARKET_ADS() { return MARKET_ADS; },
        get F() { return F; },
        get hashStr() { return hashStr; },
        get money() { return money; },
        get whole() { return whole; },
        get btn() { return btn; },
        get initials() { return initials; },
        get FRAMES() { return FRAMES; },
        get BUILDERS() { return BUILDERS; },
        get SHOPPING() { return SHOPPING; },
        get SHOPPING_STATUSES() { return SHOPPING_STATUSES; },
        get SHOPPING_CART_ACTIONS() { return SHOPPING_CART_ACTIONS; },
        get ALL() { return ALL; },
        get WIDGETS() { return WIDGETS; },
        get st() { return st; }, set st(v) { st = v; },
        get adLeader() { return adLeader; },
        get adCard() { return adCard; },
        get ensureStyle() { return ensureStyle; },
        get where() { return where; },
        get productArt() { return productArt; },
        get productDrawing() { return productDrawing; },
        get iconLabel() { return iconLabel; },
        get serviceDetails() { return serviceDetails; },
        get recommendations() { return recommendations; },
        get accountChrome() { return accountChrome; },
        get stageWidth() { return stageWidth; },
        get trackFocus() { return trackFocus; },
        get frame() { return frame; },
        get NOTE() { return NOTE; },
        get frameCover() { return frameCover; },
        get framePlace() { return framePlace; },
        get listPane() { return listPane; },
        get pitchFor() { return pitchFor; },
        get mirrorPitch() { return mirrorPitch; },
        get irreversible() { return irreversible; },
        get buildSearch() { return buildSearch; },
        get buildTicket() { return buildTicket; },
        get buildFood() { return buildFood; },
        get buildFlight() { return buildFlight; },
        get buildCheckout() { return buildCheckout; },
        get shoppingArt() { return shoppingArt; },
        get shoppingProduct() { return shoppingProduct; },
        get shoppingCompare() { return shoppingCompare; },
        get shoppingReturn() { return shoppingReturn; },
        get shoppingSummary() { return shoppingSummary; },
        get shoppingProductHeading() { return shoppingProductHeading; },
        get shoppingProductOptions() { return shoppingProductOptions; },
        get shoppingProductThumbs() { return shoppingProductThumbs; },
        get shoppingCompareProducts() { return shoppingCompareProducts; },
        get shoppingReturnHeading() { return shoppingReturnHeading; },
        get shoppingLinesHeading() { return shoppingLinesHeading; },
        get shoppingLineProduct() { return shoppingLineProduct; },
        get shoppingLineActions() { return shoppingLineActions; },
        get shoppingLine() { return shoppingLine; },
        get shoppingCartFooter() { return shoppingCartFooter; },
        get shoppingOffers() { return shoppingOffers; },
        get shoppingReturnOrders() { return shoppingReturnOrders; },
        get shoppingOrderItems() { return shoppingOrderItems; },
        get shoppingSummaryHeading() { return shoppingSummaryHeading; },
        get shoppingSummaryTotals() { return shoppingSummaryTotals; },
        get shoppingProductAfter() { return shoppingProductAfter; },
        get shoppingLinesAfter() { return shoppingLinesAfter; },
        get shoppingSummaryAfter() { return shoppingSummaryAfter; },
        get shoppingToolbar() { return shoppingToolbar; },
        get shoppingPainted() { return shoppingPainted; },
        get shoppingBeforePaint() { return shoppingBeforePaint; },
        get shoppingReturnPhoto() { return shoppingReturnPhoto; },
        get buildShopping() { return buildShopping; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('adLeader')) adLeader = __parts['adLeader'](adLeader, __scope);
      if (__has('adCard')) adCard = __parts['adCard'](adCard, __scope);
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('where')) where = __parts['where'](where, __scope);
      if (__has('productArt')) productArt = __parts['productArt'](productArt, __scope);
      if (__has('productDrawing')) productDrawing = __parts['productDrawing'](productDrawing, __scope);
      if (__has('iconLabel')) iconLabel = __parts['iconLabel'](iconLabel, __scope);
      if (__has('serviceDetails')) serviceDetails = __parts['serviceDetails'](serviceDetails, __scope);
      if (__has('recommendations')) recommendations = __parts['recommendations'](recommendations, __scope);
      if (__has('accountChrome')) accountChrome = __parts['accountChrome'](accountChrome, __scope);
      if (__has('stageWidth')) stageWidth = __parts['stageWidth'](stageWidth, __scope);
      if (__has('trackFocus')) trackFocus = __parts['trackFocus'](trackFocus, __scope);
      if (__has('frame')) frame = __parts['frame'](frame, __scope);
      if (__has('frameCover')) frameCover = __parts['frameCover'](frameCover, __scope);
      if (__has('framePlace')) framePlace = __parts['framePlace'](framePlace, __scope);
      if (__has('listPane')) listPane = __parts['listPane'](listPane, __scope);
      if (__has('pitchFor')) pitchFor = __parts['pitchFor'](pitchFor, __scope);
      if (__has('mirrorPitch')) mirrorPitch = __parts['mirrorPitch'](mirrorPitch, __scope);
      if (__has('irreversible')) irreversible = __parts['irreversible'](irreversible, __scope);
      if (__has('buildSearch')) buildSearch = __parts['buildSearch'](buildSearch, __scope);
      if (__has('buildTicket')) buildTicket = __parts['buildTicket'](buildTicket, __scope);
      if (__has('buildFood')) buildFood = __parts['buildFood'](buildFood, __scope);
      if (__has('buildFlight')) buildFlight = __parts['buildFlight'](buildFlight, __scope);
      if (__has('buildCheckout')) buildCheckout = __parts['buildCheckout'](buildCheckout, __scope);
      if (__has('shoppingArt')) shoppingArt = __parts['shoppingArt'](shoppingArt, __scope);
      if (__has('shoppingProduct')) shoppingProduct = __parts['shoppingProduct'](shoppingProduct, __scope);
      if (__has('shoppingCompare')) shoppingCompare = __parts['shoppingCompare'](shoppingCompare, __scope);
      if (__has('shoppingReturn')) shoppingReturn = __parts['shoppingReturn'](shoppingReturn, __scope);
      if (__has('shoppingSummary')) shoppingSummary = __parts['shoppingSummary'](shoppingSummary, __scope);
      if (__has('shoppingProductHeading')) shoppingProductHeading = __parts['shoppingProductHeading'](shoppingProductHeading, __scope);
      if (__has('shoppingProductOptions')) shoppingProductOptions = __parts['shoppingProductOptions'](shoppingProductOptions, __scope);
      if (__has('shoppingProductThumbs')) shoppingProductThumbs = __parts['shoppingProductThumbs'](shoppingProductThumbs, __scope);
      if (__has('shoppingCompareProducts')) shoppingCompareProducts = __parts['shoppingCompareProducts'](shoppingCompareProducts, __scope);
      if (__has('shoppingReturnHeading')) shoppingReturnHeading = __parts['shoppingReturnHeading'](shoppingReturnHeading, __scope);
      if (__has('shoppingLinesHeading')) shoppingLinesHeading = __parts['shoppingLinesHeading'](shoppingLinesHeading, __scope);
      if (__has('shoppingLineProduct')) shoppingLineProduct = __parts['shoppingLineProduct'](shoppingLineProduct, __scope);
      if (__has('shoppingLineActions')) shoppingLineActions = __parts['shoppingLineActions'](shoppingLineActions, __scope);
      if (__has('shoppingLine')) shoppingLine = __parts['shoppingLine'](shoppingLine, __scope);
      if (__has('shoppingCartFooter')) shoppingCartFooter = __parts['shoppingCartFooter'](shoppingCartFooter, __scope);
      if (__has('shoppingOffers')) shoppingOffers = __parts['shoppingOffers'](shoppingOffers, __scope);
      if (__has('shoppingReturnOrders')) shoppingReturnOrders = __parts['shoppingReturnOrders'](shoppingReturnOrders, __scope);
      if (__has('shoppingOrderItems')) shoppingOrderItems = __parts['shoppingOrderItems'](shoppingOrderItems, __scope);
      if (__has('shoppingSummaryHeading')) shoppingSummaryHeading = __parts['shoppingSummaryHeading'](shoppingSummaryHeading, __scope);
      if (__has('shoppingSummaryTotals')) shoppingSummaryTotals = __parts['shoppingSummaryTotals'](shoppingSummaryTotals, __scope);
      if (__has('shoppingProductAfter')) shoppingProductAfter = __parts['shoppingProductAfter'](shoppingProductAfter, __scope);
      if (__has('shoppingLinesAfter')) shoppingLinesAfter = __parts['shoppingLinesAfter'](shoppingLinesAfter, __scope);
      if (__has('shoppingSummaryAfter')) shoppingSummaryAfter = __parts['shoppingSummaryAfter'](shoppingSummaryAfter, __scope);
      if (__has('shoppingToolbar')) shoppingToolbar = __parts['shoppingToolbar'](shoppingToolbar, __scope);
      if (__has('shoppingPainted')) shoppingPainted = __parts['shoppingPainted'](shoppingPainted, __scope);
      if (__has('shoppingBeforePaint')) shoppingBeforePaint = __parts['shoppingBeforePaint'](shoppingBeforePaint, __scope);
      if (__has('shoppingReturnPhoto')) shoppingReturnPhoto = __parts['shoppingReturnPhoto'](shoppingReturnPhoto, __scope);
      if (__has('buildShopping')) buildShopping = __parts['buildShopping'](buildShopping, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('use-shop/_base-style').CSS);

      const POLISH_CSS = __has('POLISH_CSS') ? __parts['POLISH_CSS'](undefined, __scope) : (env.templateLib('use-shop/_base-style').POLISH_CSS);

      const ICON = __has('ICON') ? __parts['ICON'](undefined, __scope) : ({
        search: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>',
        chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>',
        left: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
        right: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
        plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>',
        cart: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2h2l1.6 8h7.4l1.5-5.5H4.3"/><circle cx="6.2" cy="13.2" r="1"/><circle cx="11.8" cy="13.2" r="1"/></svg>',
        plane: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M15 8c0-.6-.5-1-1.1-1H10L6.6 1.5H5.2L6.9 7H3.6L2.4 5.4H1.2L2 8l-.8 2.6h1.2L3.6 9h3.3l-1.7 5.5h1.4L10 9h3.9c.6 0 1.1-.4 1.1-1z"/></svg>',
        pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 14.5s4.8-4.4 4.8-8a4.8 4.8 0 0 0-9.6 0c0 3.6 4.8 8 4.8 8z"/><circle cx="8" cy="6.5" r="1.7"/></svg>',
        cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M5.2 1.6v2.6M10.8 1.6v2.6"/></svg>',
        ticket: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M1.8 4.5h12.4v2.2a1.4 1.4 0 0 0 0 2.6v2.2H1.8V9.3a1.4 1.4 0 0 0 0-2.6z"/></svg>',
        bowl: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1.8 7.5h12.4a6.2 5.6 0 0 1-12.4 0z"/><path d="M5 5.2c0-1 1-1 1-2M8.5 5.2c0-1 1-1 1-2"/></svg>',
        bag: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 5h10l-.8 9H3.8z"/><path d="M5.6 5V4a2.4 2.4 0 0 1 4.8 0v1"/></svg>',
        user: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="5.3" r="2.7"/><path d="M2.8 14.2c.5-3 2.6-4.6 5.2-4.6s4.7 1.6 5.2 4.6"/></svg>',
        check: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',
      });
      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else Object.assign(ICON, {
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0v7l-2 3h16l-2-3ZM10 21h4"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/></svg>',
        heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 2 10 8 15 6-5 12-11 8-15Z"/></svg>',
        truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 5h12v12H2ZM14 9h4l4 4v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5Z"/><path d="m8 12 3 3 5-6"/></svg>',
        tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h9l10 10-9 9L3 12Z"/><circle cx="8" cy="8" r="1.5"/></svg>',
        minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>',
        bag2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l1 14H4ZM8 7V5a4 4 0 0 1 8 0v2"/></svg>',
        city: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V9h6v12m0 0V3h7v18m0 0V12h5v9M1 21h22M11 7h3m-3 4h3m-3 4h3"/></svg>',
      });
      const TAG_COLOR = __has('TAG_COLOR') ? __parts['TAG_COLOR'](undefined, __scope) : ({ vegan: '#2f9e44', vegetarian: '#66a80f', 'gluten-free': '#e8590c', spicy: '#e03131', nuts: '#8d5524' });
      const FAV = __has('FAV') ? __parts['FAV'](undefined, __scope) : (['#1c7ed6', '#e8590c', '#2f9e44', '#7048e8', '#c2255c', '#0c8599', '#f08c00', '#495057']);
      const WORD_COLORS = __has('WORD_COLORS') ? __parts['WORD_COLORS'](undefined, __scope) : (['#1c7ed6', '#e03131', '#f2a400', '#2f9e44']);

      let st = __has('st') ? __parts['st'](undefined, __scope) : (null); // live episode: { ctx, view }


      // ---------------------------------------------------------------- market ads (inert decoys)

      const MARKET_ADS = __has('MARKET_ADS') ? __parts['MARKET_ADS'](undefined, __scope) : ([
        { brand: 'Vaultline VPN', art: 'V', color: '#1c7ed6', head: 'Browse privately for $2.49 a month', cta: 'Get deal' },
        { brand: 'Pinecrest Bank', art: 'P', color: '#2b8a3e', head: 'Earn 4.1% APY on your savings', cta: 'Open now' },
        { brand: 'StayNear Hotels', art: 'S', color: '#d9480f', head: 'Weekend rooms up to 40% off', cta: 'See rooms' },
        { brand: 'Lumen Learning', art: 'L', color: '#7048e8', head: 'Learn a language in 15 minutes a day', cta: 'Start free' },
        { brand: 'Fernwood Meals', art: 'F', color: '#c2255c', head: 'Fresh recipes at your door, $60 off', cta: 'Claim offer' },
        { brand: 'Orbit Phones', art: 'O', color: '#364fc7', head: 'Trade in your old phone for up to $600', cta: 'Trade in' },
      ]);
      function adLeader(...args) {
        return env.templateLib('use-shop/_base-frame').adLeader(__scope, ...args);
      }
      function adCard(...args) {
        return env.templateLib('use-shop/_base-frame').adCard(__scope, ...args);
      }

      function ensureStyle(...args) {
        return env.templateLib('use-shop/_base-frame').ensureStyle(__scope, ...args);
      }

      const F = __has('F') ? __parts['F'](undefined, __scope) : { F: () => env.taskDef.helpers }.F;
      const hashStr = __has('hashStr') ? __parts['hashStr'](undefined, __scope) : { hashStr: (s) => [...String(s)].reduce((h, c) => (Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0), 2166136261) }.hashStr;
      function where(...args) {
        return env.templateLib('use-shop/_base-frame').where(__scope, ...args);
      }
      const money = __has('money') ? __parts['money'](undefined, __scope) : { money: (spec) => (c) => F().fmtMoney(c, spec.money) }.money;
      // Whole amounts without the trailing zero cents ("$129", "45 €").
      const whole = __has('whole') ? __parts['whole'](undefined, __scope) : { whole: (spec) => (c) => F().fmtMoney(c, spec.money).replace(/([.,])00(?!\d)/, '') }.whole;
      const btn = __has('btn') ? __parts['btn'](undefined, __scope) : { btn: (util, cls, parent, text, role) => {
        const b = util.el('button', cls, parent, text);
        b.type = 'button';
        if (role) b.dataset.role = role;
        const symbol = { '−': ['minus', 'Decrease'], '+': ['plus', 'Increase'], '×': ['close', 'Close'],
          '‹': ['left', 'Previous'], '›': ['right', 'Next'], '← Back to results': ['left', 'Back to results'] }[text];
        if (symbol) {
          b.replaceChildren();
          b.innerHTML = ICON[symbol[0]];
          b.setAttribute('aria-label', symbol[1]);
          if (text === '← Back to results') util.el('span', '', b, 'Back to results');
        }
        return b;
      } }.btn;
      const initials = __has('initials') ? __parts['initials'](undefined, __scope) : { initials: (name) => name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') }.initials;

      // Product imagery is local inline SVG: no font-dependent pictograms or external assets.
      // A product picture: productDrawing's art in the shared frame.
      function productArt(...args) {
        return env.templateLib('use-shop/_base-frame').productArt(__scope, ...args);
      }
      // The drawing for a product (text: its lower-case name), first match wins. A design that draws more products
      // wraps it: (base) => (text, kind, ink, pale) => (/kayak/.test(text) ? `...` : base(text, kind, ink, pale)).
      function productDrawing(...args) {
        return env.templateLib('use-shop/_base-frame').productDrawing(__scope, ...args);
      }
      function iconLabel(...args) {
        return env.templateLib('use-shop/_base-frame').iconLabel(__scope, ...args);
      }
      function serviceDetails(...args) {
        return env.templateLib('use-shop/_base-frame').serviceDetails(__scope, ...args);
      }
      function recommendations(...args) {
        return env.templateLib('use-shop/_base-frame').recommendations(__scope, ...args);
      }
      function accountChrome(...args) {
        return env.templateLib('use-shop/_base-frame').accountChrome(__scope, ...args);
      }

      // ---------------------------------------------------------------- frame

      // The app frame: width, insets and alignment sampled per episode from ctx.size. flow: the frame sits in
      // the page flow (scrollable pages) instead of filling the stage.
      // Width the stage can take: in scrollable pages the site's stage is shrink-to-fit (flex: none in a row),
      // so measure its row and subtract the siblings (sidebar, side panel).
      function stageWidth(...args) {
        return env.templateLib('use-shop/_base-frame').stageWidth(__scope, ...args);
      }

      // Mirror which text field has focus (model.focus), so the oracle only presses Enter in a focused field.
      function trackFocus(...args) {
        return env.templateLib('use-shop/_base-frame').trackFocus(__scope, ...args);
      }

      // Selector of the site's toast instruction note: the reference frame draws .ref-note, design-* site chromes .task-note.
      const NOTE = __has('NOTE') ? __parts['NOTE'](undefined, __scope) : ('.ref-note, .task-note');

      // How far fixed site frame reaches up over the stage's bottom edge, in px (0: none). A site end control floating
      // over the stage (position: fixed) would cover the app's bottom corner, and so would the toast instruction note
      // (bottom-left): a long brief wraps to several lines and grows past the strip the site reserves for it.
      function frameCover(...args) {
        return env.templateLib('use-shop/_base-frame').frameCover(__scope, ...args);
      }

      // Places the app: a fixed frame inset in the stage that keeps the covered strip free, or (flow) a frame in the
      // page flow with room to scroll its content above the cover.
      function framePlace(...args) {
        return env.templateLib('use-shop/_base-frame').framePlace(__scope, ...args);
      }

      function frame(...args) {
        return env.templateLib('use-shop/_base-frame').frame(__scope, ...args);
      }

      // A fixed pane holding a natively scrolling list (wheel) and a custom scrollbar (env.ui.listbox).
      function listPane(...args) {
        return env.templateLib('use-shop/_base-frame').listPane(__scope, ...args);
      }

      function pitchFor(...args) {
        return env.templateLib('use-shop/_base-frame').pitchFor(__scope, ...args);
      }
      // The oracle sizes wheel steps from model.pitch (px per row): mirror the pane's row pitch.
      function mirrorPitch(...args) {
        return env.templateLib('use-shop/_base-frame').mirrorPitch(__scope, ...args);
      }

      // ---------------------------------------------------------------- search

      // confirm judge episodes: the irreversible press (open the result, Pay, Place order, Book) ends the episode with reward 0.
      function irreversible(...args) {
        return env.templateLib('use-shop/_base-frame').irreversible(__scope, ...args);
      }

      function buildSearch(...args) {
        return env.templateLib('use-shop/_base-search').buildSearch(__scope, ...args);
      }

      // ---------------------------------------------------------------- ticket

      function buildTicket(...args) {
        return env.templateLib('use-shop/_base-ticket').buildTicket(__scope, ...args);
      }

      // ---------------------------------------------------------------- food

      function buildFood(...args) {
        return env.templateLib('use-shop/_base-food').buildFood(__scope, ...args);
      }

      // ---------------------------------------------------------------- flight

      function buildFlight(...args) {
        return env.templateLib('use-shop/_base-flight').buildFlight(__scope, ...args);
      }

      // ---------------------------------------------------------------- checkout store

      // mode: 'store' (the reference store), 'market' (a marketplace grid with inert ads and a Cart > Shipping >
      // Payment > Review stepper on the cart / checkout / confirmation pages), 'sheet' (a mobile-style app: the nav
      // is a bottom tab bar and the cart opens as a bottom sheet over the shop page).
      function buildCheckout(...args) {
        return env.templateLib('use-shop/_base-checkout').buildCheckout(__scope, ...args);
      }

      // Cart groups are a data part; designs can move saved items to an inspector.
      const SHOPPING_STATUSES = __has('SHOPPING_STATUSES') ? __parts['SHOPPING_STATUSES'](undefined, __scope) : ['cart', 'saved', 'removed'];
      // The links of a bag line in the cart, in order: [label, status it moves the line to].
      const SHOPPING_CART_ACTIONS = __has('SHOPPING_CART_ACTIONS') ? __parts['SHOPPING_CART_ACTIONS'](undefined, __scope)
        : [['Save for later', 'saved'], ['Remove', 'removed']];

      // ---------------------------------------------------------------- shopping and returns (A12)
      function shoppingArt(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingArt(__scope, ...args);
      }

      function shoppingProduct(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingProduct(__scope, ...args);
      }

      // The option chips, availability, add-to-bag row and product details, appended to parent.
      function shoppingProductOptions(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingProductOptions(__scope, ...args);
      }

      function shoppingCompare(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingCompare(__scope, ...args);
      }

      // The products side by side (a specification table), each with a Select button (select:<id>).
      function shoppingCompareProducts(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingCompareProducts(__scope, ...args);
      }

      // The return flow's step strip and title.
      function shoppingReturnHeading(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingReturnHeading(__scope, ...args);
      }

      function shoppingReturn(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingReturn(__scope, ...args);
      }

      function shoppingSummary(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingSummary(__scope, ...args);
      }

      // The gallery's thumbnails of the product.
      function shoppingProductThumbs(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingProductThumbs(__scope, ...args);
      }

      // The gallery and product copy (head: gallery, info), appended to parent; returns head.
      function shoppingProductHeading(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingProductHeading(__scope, ...args);
      }

      function shoppingLinesHeading(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingLinesHeading(__scope, ...args);
      }

      function shoppingLineProduct(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingLineProduct(__scope, ...args);
      }

      function shoppingLineActions(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingLineActions(__scope, ...args);
      }

      function shoppingLine(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingLine(__scope, ...args);
      }

      function shoppingCartFooter(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingCartFooter(__scope, ...args);
      }

      function shoppingOffers(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingOffers(__scope, ...args);
      }

      function shoppingReturnOrders(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingReturnOrders(__scope, ...args);
      }

      function shoppingOrderItems(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingOrderItems(__scope, ...args);
      }

      function shoppingSummaryHeading(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingSummaryHeading(__scope, ...args);
      }

      function shoppingSummaryTotals(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingSummaryTotals(__scope, ...args);
      }

      function shoppingProductAfter(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingProductAfter(__scope, ...args);
      }

      function shoppingLinesAfter(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingLinesAfter(__scope, ...args);
      }

      function shoppingSummaryAfter(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingSummaryAfter(__scope, ...args);
      }

      function shoppingToolbar(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingToolbar(__scope, ...args);
      }

      function shoppingPainted(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingPainted(__scope, ...args);
      }

      function shoppingBeforePaint(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingBeforePaint(__scope, ...args);
      }

      function shoppingReturnPhoto(...args) {
        return env.templateLib('use-shop/_base-shopping').shoppingReturnPhoto(__scope, ...args);
      }

      function buildShopping(...args) {
        return env.templateLib('use-shop/_base-shopping').buildShopping(__scope, ...args);
      }

      // ---------------------------------------------------------------- widget

      const FRAMES = __has('FRAMES') ? __parts['FRAMES'](undefined, __scope) : ({
        search: (spec) => ({ brand: spec.engine, word: true, nav: ['All', 'Images', 'News', 'Maps', 'Videos'], on: 0,
          right: '<span>Settings</span><span class="as-ava">JD</span>' }),
        ticket: (spec) => ({ brand: spec.brand, icon: ICON.ticket, nav: ['Trains', 'Buses', 'Events', 'My tickets'],
          on: { train: 0, bus: 1, event: 2 }[spec.kind], right: `<span class="pill">${ICON.user}<span>Sign in</span></span>` }),
        food: () => ({ brand: 'Dishly', icon: ICON.bowl, nav: ['Restaurants', 'Groceries', 'Offers'], on: 0,
          right: `<span class="pill">${ICON.pin}<span>Deliver to 21 Elm Street</span></span>` }),
        flight: (spec) => ({ brand: spec.airline, icon: ICON.plane, nav: ['Flights', 'Hotels', 'Cars', 'My trips'], on: 0,
          right: `<span class="pill">${ICON.user}<span>Sign in</span></span>` }),
        checkout: (spec) => ({ brand: spec.store, icon: ICON.bag, flow: spec.layout === 'page' }),
      });
      const BUILDERS = __has('BUILDERS') ? __parts['BUILDERS'](undefined, __scope) : ({ search: buildSearch, ticket: buildTicket, food: buildFood, flight: buildFlight, checkout: buildCheckout });
      const SHOPPING = __has('SHOPPING') ? __parts['SHOPPING'](undefined, __scope) : (['variantpick', 'compare', 'returns', 'cartedit', 'coupon']);
      if (__has('stmt0.1')) __parts['stmt0.1'](undefined, __scope);
      else for (const v of SHOPPING) {
        BUILDERS[v] = buildShopping;
        FRAMES[v] = (s) => ({ brand: s.store, icon: ICON.bag, right: '<span>Shop</span><span>My account</span>' });
      }

      const ALL = __has('ALL') ? __parts['ALL'](undefined, __scope) : (['search', 'ticket', 'food', 'flight', 'checkout', ...SHOPPING]);
      // store: the base widget (every scenario). stream: search results as an infinite-scroll list. market: a
      // checkout store with a product grid, sponsored tiles and a checkout stepper (the page scrolls). sheet: a
      // checkout store with a bottom tab bar and the cart as a bottom sheet (product rows in a pane).
      const WIDGETS = __has('WIDGETS') ? __parts['WIDGETS'](undefined, __scope) : ({
        store: { scenarios: ALL, traits: {}, mode: 'store' },
        stream: { scenarios: ['search'], traits: { infinite: true }, mode: 'store' },
        market: { scenarios: ['checkout'], traits: { layout: 'page' }, mode: 'market' },
        sheet: { scenarios: ['checkout'], traits: { layout: 'pane' }, mode: 'sheet' },
      });

      if (__has('stmt0.2')) __parts['stmt0.2'](undefined, __scope);
      else for (const [name, def] of Object.entries(WIDGETS)) {
        env.widget({
          task: 'use-shop',
          site: 'base',
          name,
          split: 'train',
          scenarios: def.scenarios,
          traits: def.traits,
          // Long product grids scroll with the whole page.
          scrollable: (spec) => spec.scenario === 'checkout' && spec.layout === 'page',

          render(ctx) {
            ensureStyle();
            const v = ctx.spec.scenario;
            const o = FRAMES[v](ctx.spec);
            if (v === 'food') o.brand = ctx.rng.pick(['Dishly', 'Forkful', 'Bitebox', 'Platter', 'Tablespoon']);
            const fr = frame(ctx, o);
            accountChrome(ctx, fr.top);
            const view = BUILDERS[v](ctx, fr.body, fr, def.mode);
            st = { ctx, view, app: fr.app, flow: !!o.flow };
            let last = ctx.model;
            return {
              anchors: [o.flow ? fr.top : fr.app],
              sync(m) {
                if (view.sync) return view.sync(m);
                if (m !== last) {
                  last = m;
                  view.paint(m);
                }
              },
            };
          },

          locate(t) {
            const at = st && st.view.locate(t);
            if (!at) throw new Error(`use-shop/${name} cannot locate ${JSON.stringify(t)}`);
            // Scrolling page: a target under page frame (the sticky header, a floating end control) is reported
            // just off-screen on that side, so the kit wheels the page to bring it to the middle first.
            if (st.flow) {
              const H = window.innerHeight;
              const hit = at[1] >= 0 && at[1] <= H ? document.elementFromPoint(at[0], at[1]) : null;
              if (hit && !st.app.contains(hit)) return [at[0], at[1] < H / 2 ? -40 : H + 40];
            }
            return at;
          },
        });
      }
    })();

    return captured;
  }
  env.template('use-shop/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`use-shop/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('use-shop/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`use-shop/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`use-shop/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ["use-shop/_base-style","use-shop/_base-frame","use-shop/_base-search","use-shop/_base-ticket","use-shop/_base-food","use-shop/_base-flight","use-shop/_base-checkout","use-shop/_base-shopping"] });
})();
