/*
 * use-shop: search, pick and buy in small commerce apps. MiniWoB counterparts: search-engine,
 * buy-ticket, order-food, book-flight (+ -nodelay); checkout is new (a multi-page store). Inputs
 * ['pointer', 'keyboard', 'wheel']: queries, airports, coupons and addresses are typed, lists scroll inside
 * their pane (wheel or the pane's draggable scrollbar), and the checkout store may scroll as a whole page.
 *
 * scenarios
 *   search   a search engine: type spec.query into the search box, press Search (or Enter), get
 *            spec.perPage results per page over spec.pages pages (pager with page numbers and arrows),
 *            then click the result asked for: mode 'rank' (the Nth result overall, counted across pages)
 *            or mode 'url' (the one result whose host is spec.results[target].host). A query that does
 *            not match spec.query (trimmed, spaces collapsed, case-insensitive) shows fake results
 *            (resultsFor(spec, query), seeded from the query text); clicking any of them is wrong.
 *            A click opens the result's page (a preview with "Back to results").
 *            Widgets with traits.infinite (stream) list the results as one infinite-scroll pane instead of pages:
 *            spec.infinite { rows, batch, beat }: the pane shows spec.rows rows; spec.perPage (= batch, rows + 1-2)
 *            results are loaded at first; once the last loaded result is fully in view, a load of beat ms runs on
 *            the kit clock (tick) and the next batch appears (spec.pages batches in all). The target may be in
 *            any batch, so the oracle scrolls, waits, scrolls again. A new search resets to the first batch.
 *            Widgets with traits.corpus ('products' | 'people' | 'apps' | 'any', one of the three per episode) search a
 *            catalog instead of the web: spec.corpus, spec.query a product / person / app query, each result also has
 *            r.meta (see spec below; resultMeta(spec, r) formats it) and a rewritten title / snippet; hosts stay
 *            unique and the task, oracle and error are unchanged.
 *   ticket   a list of 6-12 tickets (train / bus departures between two cities of one country, or concert
 *            dates at venues) with name, place, date, time, duration and price in a pane showing spec.rows
 *            rows (scrollbar + wheel), with a "Sort by" dropdown. Buy the one that satisfies spec.criterion
 *            (cheapest, priciest, shortest, longest, earliest, latest), optionally among the tickets
 *            matching spec.filter (same name / place / date). spec.confirm: "Buy" opens a confirmation
 *            dialog (Pay / Cancel). A purchase shows a receipt banner with "Cancel purchase".
 *   food     a restaurant menu (dishes from env.content.DISHES): category tabs over item cards (name,
 *            note, price, diet tags, "Add"), a cart beside it (lines with - / + / remove, total, "Place
 *            order"). Items with an option group (size, protein, milk, spice, ...) open a dialog: pick
 *            the option, set the quantity (spinner), "Add to cart". Mode 'items': order exactly spec.order
 *            ([{ item, option, qty }]); mode 'type': order spec.count items (total quantity) that all
 *            carry tag spec.tag. A placed order shows "Cancel order".
 *   flight   book-flight: From / To autocompletes over an airport list ("City, ST (CODE)"; typing shows
 *            up to MAX_SUGGEST matches; the value is set by picking a suggestion or by typing a full
 *            label), a Depart date field that opens a month calendar (prev / next), "Search" (refuses
 *            and marks empty fields) -> a results screen that loads for spec.loadMs on the kit clock,
 *            then lists the flights (spec.rows rows visible, scrollbar + wheel) with a "Modify search"
 *            back button -> "Book" the flight satisfying spec.criterion (cheapest, shortest, earliest,
 *            latest departure). A search with any wrong field lists fake flights (flightsFor(spec,
 *            searched)); booking one is wrong. A booking shows "Cancel booking". Widgets with traits.sort
 *            (spec.sortable) also have a results "Sort by" control (FLIGHT_SORTS: recommended = provider order,
 *            price, duration, departure): the list shows flightOrder(spec, searched, model.sort); the oracle
 *            finds the target at its position in that order (it never changes the sort itself). Passenger
 *            counts and round-trip are not modelled (widgets may draw them as unscored decoration).
 *   checkout a store with pages that swap inside the app (partial observability): 'shop' (search box in
 *            the top bar with a loading state of spec.loadMs on the kit clock, category checkboxes, a
 *            two-thumb price-range slider (env.ui.slider), product rows or cards with a quantity stepper
 *            and Add to cart, disabled for out-of-stock products), 'product' (detail page: description,
 *            stock, quantity stepper, Add to cart, Back to results), 'cart' (line steppers, Remove, promo
 *            code field + Apply, Checkout), 'checkout' (saved address tiles or a new-address form, delivery
 *            method radios, order summary, Place order, Back to cart), 'order' (confirmation with the order
 *            number, Cancel order, Continue shopping), 'cancel' (reason radios, Cancel order / Keep order)
 *            and 'track' (type an order number, Track). Top bar: brand, search, Orders, Track order, Cart.
 *            Goal kinds: 'name' (buy spec.goal.qty of a named product; found with the search box),
 *            'cheapest' (the cheapest in-stock product of a category; the category checkbox), 'rated'
 *            (the best-rated in-stock product of a category under a price; checkbox + price slider).
 *            Extras: spec.coupon (code given in the goal or shown in the store banner), spec.ship (a
 *            delivery method), the shipping address (spec.addrMode 'saved': pick the tile named by city,
 *            name or street; 'new': type name, street, city, postcode), spec.track (afterwards read the
 *            order number on the confirmation and type it on the Track order page). spec.layout 'pane'
 *            (product rows in a fixed pane, scrollbar + wheel) or 'page' (a card grid; widgets can fix it with traits.layout; the widget is
 *            scrollable and the whole page scrolls). Place order is refused while another order is open.
 *
 * Purchases set model flags (pick, bought, ordered, booked, orders); the episode then ends on the site's end
 * control or finish. A wrong final purchase ends the episode at once (ended() -> 'wrong-choice' /
 * 'wrong-order'), scored normally at that moment, unless spec.recoverable: then the first wrong purchase
 * stays on screen with a way back (Back to results, Cancel purchase, Cancel order, Cancel booking, the
 * cancel-order page), its error carries the penalty until undone (wrongs counts wrong purchases), and the
 * second wrong purchase ends the episode. The oracle undoes a wrong purchase it finds.
 *
 * opts.route (input-route eval axis, undefined = today's mix): 'keyboard' presses Enter instead of the Search /
 * Apply / Track buttons (spec.enter), 'wheel' / 'pointer' force the wheel / scrollbar-thumb route of the scrolling
 * panes (spec.route); scenarios without that choice ignore it. Widget traits (opts.traits): infinite (search),
 * corpus (search), sort (flight), layout 'pane' | 'page' (checkout). Corpus and sort draw from their own rng
 * forks, so without the trait spec, model and every draw are as before.
 *
 * Episode fields on every spec: scenario, isplit, csplit, ood, startMode, recoverable (opts.recover ??
 * coin flip), money ({ code, locale }: prices are integer minor units formatted by fmtMoney(cents, money)).
 * spec   { scenario, brand, ... }
 *   search   mode, engine, query, perPage, pages, results: [{ title, host, path, desc }] (perPage * pages,
 *            hosts unique), target (index), salt, enter (oracle presses Enter instead of the button); with
 *            traits.corpus also corpus and results[i].meta: products { kind, brand, price, rating (x10), reviews,
 *            date }, people { kind, name, email, location, job, company, date (last active) }, apps { kind, type,
 *            publisher, version, size (MB), rating (x10), date (updated) }
 *   ticket   kind ('train' | 'bus' | 'event'), title, route (train/bus), today, rows,
 *            tickets: [{ name, place, code, date (ISO), time (min after midnight), dur (min), price }],
 *            criterion, filter (null | { key: 'name' | 'place' | 'date', value }), confirm, target, route
 *            ('wheel' | 'thumb': how the oracle scrolls the pane)
 *   food     restaurant, cats: [{ name, items: [item ids] }], items: [{ id, name, desc, price, tags: [..], cat,
 *            group: null | { name, values: [..], extra: [minor units per value] } }], startTab, mode,
 *            order: [{ item, option ('' when no group), qty }] (items) | tag, count (type)
 *   flight   airline, origin, dest (codes), askFrom / askTo ('city' | 'code'), today, date, start
 *            (month key the calendar opens on), maxMonth, dateFmt ('us' | 'mdy'), criterion, rows,
 *            flights: [{ airline, no, dep (min), dur (min), stops, price }], target, salt, loadMs, route,
 *            sortable (traits.sort only)
 *   checkout store, cats: [labels], products: [{ id, name, cat, price, was, rating (x10), reviews, stock, hue,
 *            sku }], goal: { kind, product, qty, cat, max }, query, sliderMax, sliderStep, account,
 *            saved: [{ name, line1, line2, city, region, postcode, country }], addrMode, addr (saved index),
 *            addrRef ('city' | 'name' | 'street'), want ({ name, line1, city, postcode } for 'new'),
 *            methods: [{ id, name, days, price }], ship (method id | null), coupon (null | { code, pct,
 *            where: 'instr' | 'banner' }), track, orderNos, loadMs, layout, rows, route, addRoute ('card' |
 *            'detail'), enter, salt
 * model
 *   search   { text, query (last searched text | null), page (0-based), pick: null | { real, index }, wrongs;
 *              infinite: loaded (results in the list), loading (ms to the next batch), scroll, pitch }
 *   ticket   { sort, scroll (first visible row, float), pitch, pending (ticket in the open confirm dialog |
 *              null), bought (ticket index | null), wrongs }
 *   food     { tab (category index), cart: [{ item, option, qty }], dialog: null | { item, option, qty },
 *              ordered, wrongs }
 *   flight   { fromText, from (code | ''), toText, to, ac ('from' | 'to' | null: open suggestion list),
 *              date (ISO | ''), calOpen, calView (month key), screen ('form' | 'results'),
 *              invalid ([field names marked by a refused search]), searched (null | { from, to, date }),
 *              loading (ms), scroll, pitch, booked (null | { real, index }), wrongs; sort ('recommended' | 'price' |
 *              'duration' | 'departure') only when spec.sortable }
 *   checkout { page, text, query, loading, cats: [cat indices checked], price: [lo, hi], qty: { id: n },
 *              scroll, pitch, view (product id), cart: [{ id, qty }], couponText, coupon (applied code |
 *              null), couponMsg, pick (saved index | 'new'), form: { name, line1, city, postcode },
 *              ship, invalid, orders: [{ no, lines, coupon, addr (index | form copy), ship, cancelled }],
 *              wrongs, reason, trackText, tracked (order no found by the last Track | '' | null), notice }
 *   UI state (ac, calOpen, calView, scroll, pitch, tab, dialog, pending, page, filters) is not graded by
 *   itself; plan() reads it to stay closed-loop. pitch (px per list row) is mirrored by the widget so wheel
 *   steps can be sized.
 * error  (tau 0 everywhere)
 *   search   1 while a wrong result is open; 0 after the right one; before a pick 1 - 0.15 [field holds the
 *            query] - 0.25 [the right query was searched] - 0.2 [and the target's page is shown; infinite: loaded]. sigma 0.5
 *   ticket   rank error of a ticket = (# eligible tickets strictly better under the criterion) /
 *            (# eligible - 1), 1 for an ineligible one. bought: its rank error; pending: 0.5 + 0.5 * its
 *            rank error; else 1. sigma 0.5
 *   food     cart error E: items mode 1 - sum over requested lines of min(q, want) / max(q, want) /
 *            (requested lines + extra lines) (a line = item + option); type mode
 *            1 - min(good, count) / (count + bad + max(0, good - count)) over total quantities.
 *            error = E once ordered, else 0.1 + 0.9 E. sigma 0.35
 *   flight   1 - subgoals / 20: from right 3, to right 3, date right 3, searched with all three right 4,
 *            booked a real flight 7 * (1 - its rank error). sigma 0.35
 *   checkout 1 - S / T over the open order (or, before one, the cart and checkout draft): cart lines 4 x
 *            (sum min(q, want) / max(q, want) / (1 + extra lines)), address 2 x (saved: right tile;
 *            new: fraction of the four fields), coupon 1, delivery method 1 (when asked), a right order
 *            placed 3, tracked its number 2 (when asked). An open wrong order: at least 0.7. sigma 0.35
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   search   { field: 'search' }, { button: 'search' }, { page: p }, { pager: 'prev' | 'next' },
 *            { result: i } (result index on the shown page list; only planned while shown), { back: true };
 *            infinite: { thumb: 'list' }, { scroll: s }, { pane: 'list' } as for tickets, { wait: true } for a load
 *   ticket   { thumb: 'list' } (scrollbar thumb), { scroll: s } (where the thumb's center sits when row s
 *            is the first visible row; linear, may lie past the track ends), { pane: 'list' } (wheel
 *            point), { buy: i } (ticket i's Buy button, only planned while its row is fully visible),
 *            { confirm: 'ok' | 'cancel' }, { cancelBuy: true }, { sort: 'open' } / { sortBy: key } (never planned)
 *   food     { tab: c }, { add: itemId } (the card's Add button), { choice: value } (option in the
 *            dialog), { qty: 'up' | 'down' } (dialog spinner), { dialog: 'add' | 'cancel' },
 *            { line: key, op: 'inc' | 'dec' | 'remove' } (cart line, key = lineKey(item, option)),
 *            { order: true } (Place order), { cancelOrder: true }
 *   flight   { field: 'from' | 'to' | 'date' }, { suggestion: code, field }, { nav: 'prev' | 'next' },
 *            { day: ISO }, { button: 'search' }, { back: true }, { thumb: 'list' }, { scroll: s },
 *            { pane: 'list' }, { book: i } (only planned while its row is fully visible), { cancelBook: true },
 *            { sortBy: key } (sortable; never planned)
 *   checkout { nav: 'shop' | 'cart' | 'order' | 'track' } (top bar), { field: 'search' | 'coupon' | 'track' |
 *            'name' | 'line1' | 'city' | 'postcode' }, { button: 'search' | 'coupon' | 'track' }, { cat: c }
 *            (checkbox), { price: 'thumb', j } / { price: value, j } (range slider thumb j), { pane: 'list' },
 *            { thumb: 'list' }, { scroll: s }, { open: id } (product link), { cardQty: id, dir: 'up' |
 *            'down' }, { add: id }, { detailQty: 'up' | 'down' }, { addDetail: true }, { back: 'shop' |
 *            'cart' }, { line: id, op }, { checkout: true }, { addr: index | 'new' }, { ship: id },
 *            { place: true }, { cancelOrder: true }, { reason: key }, { confirmCancel: true }, { keep: true }
 * plan steps: { click }, { type: [{ field }, text] }, { key: 'Enter', on: field } (search / coupon / track,
 * spec.enter, only while model.focus says the field has focus: the widget mirrors focus into the model), { wait: true } (loading), { drag: [{ thumb: 'list' }, { scroll: s }] } or { wheel: [{ pane:
 * 'list' }, dy] } (spec.route; wheel only once the widget mirrored model.pitch) and the price-slider drag.
 *
 * start modes: off, partial, wrong, solved (all scenarios), scene (search, flight, checkout; the other scenarios start as
 * off). scene is the reference screen's unsolved mid-task state and is not in the default training mix: search the
 * query submitted with its results listed on the target's page (infinite: the first batch) and nothing picked; flight
 * the real route and date searched, the flights listed, none booked; checkout the goal's search submitted (or its
 * category checked) with the matching products listed and an empty cart. It draws nothing. partial: search typed (or searched, wrong page),
 * ticket sorted usefully or the target pending, food part of the order in the cart, flight cities filled,
 * checkout product found / in the cart / at checkout with half the address. wrong: a wrong query searched or
 * (recoverable) a wrong result open; a wrong ticket pending, sorted the wrong way, or (recoverable) bought;
 * wrong dishes / options / quantities in the cart or (recoverable) a wrong order placed; swapped airports, a
 * wrong date, a wrong search, or (recoverable) a wrong flight booked; a wrong product or quantity in the
 * store cart, a wrong address at checkout, or (recoverable) a wrong order placed.
 * ood: more result pages (5-7), tickets (14-22), menu categories (5-6) and order lines (up to 4) with
 * bigger quantities, flights (10-16) up to 10 months out, store products (24-34) in 5-6 categories with
 * quantities up to 5.
 *
 * levels (opts.level easy | medium; normal is the task as above): search 2 / 3 result pages (easy: rank mode,
 * the target on page 1; medium: the first two pages); ticket 4-5 / 5-7 tickets (easy: cheapest or priciest, no filter,
 * no confirm dialog); food 3 categories of 4, easy 1 line x 1 without options, medium 2 lines; flight 3-4 / 4-5 flights
 * (easy: cheapest, a date within 25 days); checkout 2 / 3 categories of 4-10 products, quantity 1 (medium 1-2), easy: a
 * named product to a saved address, no coupon / delivery / tracking; medium: no rated goal, no delivery / tracking.
 *
 * judge modes (judgeModes ambiguous, impossible, confirm; spec.judge = { mode, message, cands: [[names]], need?,
 * others: [[names]], what: [names], templates?, vars? }; the kit grades the reply, see kit/runtime/reply.js:
 * ambiguous -> status ask, one option per candidate, none of others; impossible -> status impossible, what names the
 * missing thing; confirm -> status confirm). ambiguous / impossible start on the untouched page (startMode off) and their error is 0 until
 * something is bought / ordered / booked / opened (search) -- then 1 and the episode ends (ended()):
 *   ambiguous   search: two results share a title (open "<title>"); ticket / flight: two entries tie for the criterion
 *               (the normal instruction); food: an item with options ordered without saying which; checkout: two
 *               products "<name> (Blue)" / "<name> (Red)"; cands are what tells them apart on the page (host, code
 *               and time, flight number, option value, colour, SKU, order number, coupon code), others the other
 *               same-kind names (other results' hosts, tickets' codes, other menu options, other products...)
 *   impossible  search: a host that is not among the results; ticket: an operator / artist with no ticket; food: a dish
 *               not on the menu; flight: a date past the site's last month; checkout: a product not sold; shop
 *               scenarios: a sold-out combination, a capacity no pack has, an order number not in the history, a
 *               quantity past the limit, an expired coupon (all seeded per episode); what names it
 *   confirm     the normal task plus a worded "check with me before you <open it | pay | place the order | book it>"; the
 *               error treats the final press as done (ticket: confirm dialog forced and the target pending; food: the
 *               right cart; flight: the real search listed; checkout: the right draft at checkout; search: the target
 *               page shown), so the oracle prepares and asks; the widget flags 'irreversible' on the final press
 *
 * Content: env.content COMPANIES, LINK_TEXTS, SENTENCES, TOPICS, PRODUCTS (search results and queries),
 * CITIES, VENUES (tickets), DISHES (food), AIRLINES (flight), PRODUCTS, PRODUCT_CATEGORIES, COUPON_CODES,
 * SHIPPING_METHODS, orderId, personName, address (checkout), all with spec.csplit; prices in USD, GBP or EUR
 * formatted per locale.
 *
 * A12 shopping scenarios (no MiniWoB counterpart):
 *   variantpick: select size / colour / material, avoid unavailable combinations, add the requested quantity.
 *   compare: compare 3-4 products by price, capacity, weight and warranty; add the unique qualifying product.
 *   returns: choose order + item, reason, refund and drop-off; review and create a return, never pay.
 *   cartedit: edit quantities, remove a line and save another for later; removed lines can be restored.
 *   coupon: a prefilled bag with active and expired offers; invalid codes show an error, valid codes discount it.
 * New specs: products [{id,name,price,sku,capacity,weight,warranty}], want (scenario-specific goal),
 * sizes / colours / materials / unavailable (variantpick), orders [{no,items,date}] (returns),
 * offers [{code,pct,expired}] (coupon); level controls choices / quantities, ood widens ranges.
 * New model: selections, qty, picked {id,qty,selections}, selected; lines [{id,qty,status}], couponText,
 * applied, couponMsg; order, item, reason, refund, dropoff, step, returnCreated, returnNo; paid.
 * shopScroll / shopReveal are unscored pane geometry mirrored by the widget for wheel-based closed-loop plans.
 * Targets: {shop: key}; keys swatch:<axis>:<value>, qty:inc/dec, add, select:<id>,
 * line:<id>:inc/dec/cart/saved/removed, coupon, apply, order:<index>, item:<id>,
 * reason:<value>, refund:<value>, dropoff:<value>, details, review, create, back, pay, pane.
 * Error: average unmet subgoals (quantity uses relative distance); tau 0. Add/return completion also graded.
 * New judgeModes: ambiguous (missing choice / two matches), impossible (unavailable target), confirm
 * (stop before payment or issuing a return); flags on the final controls, no successful task-side ending.
 * facts(model,spec): visible cart total and item count, or return number / refund amount / return status.
 * parts(model,spec): preempt=cancel items by the name the page shows: search 'Search box' / 'Search results' / 'Opened
 * result'; ticket 'Sort by' / 'Ticket purchase'; food each menu item (its cart lines) and 'Order'; flight 'From' / 'To' /
 * 'Date' / 'Search' / 'Booking'; checkout each product (its cart quantity), 'Shipping address', 'Delivery method', 'Promo
 * code', 'Order'; shopping scenarios the selectors ('Size', 'Colour', 'Material', 'Quantity', 'Bag'; 'Selected pack';
 * 'Order', 'Item', 'Reason', 'Refund', 'Drop-off', 'Return request'; each bag line; 'Coupon code', 'Applied coupon').
 * silent(next,prev,spec,rng): copy with one improved quantity reverted; repeating the edit repairs it.
 * retarget(spec,model,rng): change goal within the same catalog, stock, offers or order history.
 *
 * Helpers (widget API, env.taskDef.helpers; the scenario files add theirs):
 *   here        fmtMoney(cents, money), fmtTime(min), fmtDur(min), fmtDate(iso, style), weekday(iso), days(iso),
 *               fromDays(n), monthDiff(a, b), MONTHS, hash32(text), apply(model, spec, step) (the model-space effect of a
 *               plan step, as the base widget implements it)
 *   search      resultsFor(spec, query) (the results a query lists), resultMeta(spec, r) ([[label, text], ...] of a corpus
 *               result)
 *   ticket      ticketOrder(spec, sort), SORTS
 *   food        lineKey(item, option), cartTotal(spec, cart), linePrice(spec, line), TAG_LABEL
 *   flight      flightsFor(spec, searched), flightOrder(spec, searched, sort), FLIGHT_SORTS, suggest(text), airport(code),
 *               AIRPORTS, exactAirport(text)
 *   checkout    coVisible(model, spec), coLive(model), coTotals(spec, lines, coupon, ship), coMaxQty(product),
 *               coQty(model, id), REASONS, ADDR_FIELDS, addrText(addr), cityLine(addr)
 *   shopping    shopApply, shopTotals, shopReasons, shopRefunds, shopDropoffs, shopAvailable (A12 scenarios)
 *
 * The self-test is in selftest.js (kit/selftest.js harness); it reads lib (instructionOf, weekday, days, fromDays) and
 * the scenario objects' testTraits / checkSpec / check.
 *
 * Deviations from MiniWoB: realistic content and prices in three currencies, recoverable purchases, start
 * modes, loading delays on the kit clock, and the checkout store (no MiniWoB counterpart).
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('use-shop', {...})
 * object per scenario; scenarios/shop.js holds the five A12 shopping scenarios and their shared store. This file holds
 * the shared helpers (lib: dates, money, list scrolling) and dispatches to the objects; the hooks an object has are
 * listed above the dispatch section.
 */
(function () {
  'use strict';

  const C = env.content;
  const I = env.instruct;

  // ---------------------------------------------------------------- dates (pure day arithmetic)

  const fdiv = Math.floor;
  const days = (iso) => civilToDays(+iso.slice(0, 4), +iso.slice(5, 7), +iso.slice(8, 10));
  const fromDays = (n) => {
    const [y, m, d] = daysToCivil(n);
    return `${y}-${pad2(m)}-${pad2(d)}`;
  };
  const weekday = (iso) => (((days(iso) % 7) + 11) % 7); // 0 = Sunday
  const monthOf = (iso) => iso.slice(0, 7);
  const addMonths = (key, n) => {
    const i = mIndex(key) + n;
    return `${fdiv(i / 12)}-${pad2((i % 12) + 1)}`;
  };
  const monthDiff = (a, b) => mIndex(b) - mIndex(a);
  const monthName = (key) => `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmtDate(iso, style = 'short') {
    const y = +iso.slice(0, 4);
    const m = +iso.slice(5, 7);
    const d = +iso.slice(8, 10);
    if (style === 'us') return `${pad2(m)}/${pad2(d)}/${y}`;
    if (style === 'long') return `${WEEKDAYS[weekday(iso)]}, ${MONTHS[m - 1]} ${d}, ${y}`;
    if (style === 'mdy') return `${MONTHS[m - 1]} ${d}, ${y}`;
    if (style === 'dm') return `${d} ${MONTHS[m - 1]}`;
    return `${WD[weekday(iso)]}, ${MONTHS[m - 1].slice(0, 3)} ${d}`; // 'short'
  }
  const fmtTime = (min) => {
    const t = ((min % 1440) + 1440) % 1440;
    return `${pad2(fdiv(t / 60))}:${pad2(t % 60)}`;
  };
  const fmtDur = (min) => (min % 60 ? `${fdiv(min / 60)}h ${pad2(min % 60)}m` : `${min / 60}h 00m`);
  const ORD = (n) => {
    const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
    return `${n}${s}`;
  };

  const { hash32, pad2, civilToDays, daysToCivil, clamp, clone, mIndex } = env.util;
  const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  // ---------------------------------------------------------------- money (integer minor units)

  const LOCALE_MONEY = { 'en-US': 'USD', 'en-GB': 'GBP', 'de-DE': 'EUR', 'fr-FR': 'EUR', 'nl-NL': 'EUR',
    'es-ES': 'EUR', 'it-IT': 'EUR' };
  const USD = { code: 'USD', locale: 'en-US' };
  const moneyFor = (locale) => ({ code: LOCALE_MONEY[locale] || 'USD', locale: LOCALE_MONEY[locale] ? locale : 'en-US' });
  function fmtMoney(cents, money) {
    const m = money || USD;
    return C.formatMoney(cents / 100, m.code, m.locale);
  }
  const perUSD = (money) => C.currency(money.code).perUSD;
  // A shelf price in minor units with a retail ending (.99, .49, .00 ...).
  const shelfPrice = (rng, usd, money) => Math.max(1, Math.floor(usd * perUSD(money))) * 100
    + rng.pick([99, 99, 95, 49, 0, 0, 50, 89, 79]);
  // A menu price rounded to 10 minor units.
  const menuPrice = (usd, money) => Math.round(usd * perUSD(money) * 10) * 10;

  // ---------------------------------------------------------------- shared instruction helpers

  function sayIt(spec, rng, templates, vars, extra = {}) {
    const core = I.phrase(rng, templates, vars, spec.isplit);
    return I.say(rng, core, { isplit: spec.isplit, terse: extra.terse, steps: extra.steps });
  }
  const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

  const levelOf = (opts) => (opts.level === 'easy' || opts.level === 'medium' ? opts.level : null);

  // ---------------------------------------------------------------- plan and apply helpers the scenarios share

  const EPS = 0.02;
  // Scroll step for a list showing `rows` rows: null when display position pos is fully visible. The wheel
  // route needs the widget's mirrored row pitch; without it the scrollbar thumb is dragged.
  function reveal(m, spec, pos, n, rows) {
    if (pos >= m.scroll - EPS && pos <= m.scroll + rows - 1 + EPS) return null;
    const s = clamp(pos - (rows - 1) / 2, 0, Math.max(0, n - rows));
    if (spec.route === 'wheel' && m.pitch > 0) return { wheel: [{ pane: 'list' }, Math.round((s - m.scroll) * m.pitch)] };
    return { drag: [{ thumb: 'list' }, { scroll: Math.round(s * 1000) / 1000 }] };
  }

  // apply() of the list scenarios (search, ticket, food, flight): the focus, loading waits and list scrolling.
  // len(m, spec) is the list length; inf ({ more, finish }: search with traits.infinite) loads batches. Returns the
  // next model for those steps, else undefined.
  function listStep(m, spec, step, len, inf) {
    if (step.type) m.focus = step.type[0].field;
    else if (step.click || step.drag) m.focus = null;
    if (step.wait) {
      if (inf) {
        inf.more(m, spec);
        if (m.loading > 0) inf.finish(m, spec);
      } else if (m.loading) m.loading = 0;
      return m;
    }
    if (step.wheel) {
      m.scroll = clamp(m.scroll + step.wheel[1] / (m.pitch || 80), 0, Math.max(0, len(m, spec) - spec.rows));
      return inf ? inf.more(m, spec) : m;
    }
    if (step.drag) {
      const s = step.drag[1].scroll;
      if (s !== undefined) m.scroll = clamp(s, 0, Math.max(0, len(m, spec) - spec.rows));
      return inf ? inf.more(m, spec) : m;
    }
    return undefined;
  }

  // A loading delay running down on the kit clock (tick()).
  const loadingTick = (m, dt) => (!(m.loading > 0) ? m : { ...m, loading: Math.max(0, m.loading - dt) });

  // silent: one improved cart quantity (food, checkout) put back.
  function cartSilent(n, next, prev, rng) {
    const changed = next.cart.filter((l, i) => prev.cart[i] && l.qty !== prev.cart[i].qty);
    if (!changed.length) return false;
    const l = rng.pick(changed), i = next.cart.indexOf(l);
    n.cart[i].qty = prev.cart[i].qty;
    return true;
  }

  const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('use-shop', { name, ... }); scenarios/shop.js registers the five A12
  // shopping scenarios, which share one store. A scenario object has
  //   sample(rng, opts), init(spec, rng), error(model, spec) (a normal episode), plan(model, spec),
  //   apply(model, spec, step) (model is a copy; the model-space effect of a step, as the base widget implements
  //   it), instruction(spec, rng), confirmVerb (instruction of a confirm episode), parts(model, spec)
  // judge modes: either purchased(model, spec) (the irreversible step: ambiguous / impossible episodes then have
  //   error 1 and end with 'wrong-choice'), prepared(model, spec, e) (confirm: the error with the final press counted
  //   as done), confirmAsk, prepareConfirm?(spec), ambiguous(jr, spec) and impossible(jr, spec) (the judge records),
  //   or judge(jr, spec, mode) (the whole record) with judgeError(model, spec) (the error of every judge episode)
  // and optionally ended(model, spec, last) (a wrong purchase; last = no recovery left), tick(model, spec, dt)
  //   (default: a loading delay runs down), sigma (tolerance, default 0.35), mirrored (model keys the widget mirrors,
  //   dropped by solve()), facts(model, spec), silent(n, next, prev, spec, rng) (edits the copy n; false = none),
  //   retarget(n, spec, model, rng) (edits the copy n; false = none) and, for the self-test, testTraits(seed),
  //   checkSpec(spec, traits, tag, fails) and check() (spot checks).

  const V = env.scenariosOf('use-shop');

  function initModel(spec, rng) {
    return V[spec.scenario].init(spec, rng || new env.Rng(spec.salt || 1));
  }

  function errorOf(m, spec) {
    const v = V[spec.scenario];
    const j = spec.judge;
    if (!j) return v.error(m, spec);
    if (v.judgeError) return v.judgeError(m, spec);
    if (j.mode !== 'confirm') return v.purchased(m, spec) ? 1 : 0; // the page is as it should stay until something is bought
    return preparedError(m, spec);
  }

  // confirm episodes: the error with the final press counted as done (the task up to it, done right, is 0).
  function preparedError(m, spec) {
    const v = V[spec.scenario];
    const e = v.error(m, spec);
    return v.prepared ? v.prepared(m, spec, e) : e;
  }

  // A wrong purchase ends the episode; in recoverable mode only the second one (wrongs counts them).
  function endedOf(m, spec) {
    const v = V[spec.scenario];
    if (spec.judge && spec.judge.mode !== 'confirm') return v.purchased && v.purchased(m, spec) ? 'wrong-choice' : null;
    const last = !spec.recoverable || (m.wrongs || 0) >= 2;
    return v.ended ? v.ended(m, spec, last) : null;
  }

  function planOf(m, spec) {
    if (errorOf(m, spec) <= 1e-9 || endedOf(m, spec)) return null;
    return V[spec.scenario].plan(m, spec);
  }

  const apply = (model, spec, step) => V[spec.scenario].apply(clone(model), spec, step);

  function solveOf(spec, model) {
    let m = clone(model);
    // Model-space solving has no live pane to refresh visibility after a wheel step.
    // Ignore the widget's geometry; the normal interactive oracle still uses it.
    for (const k of V[spec.scenario].mirrored || []) delete m[k];
    for (let i = 0; i < 80 && errorOf(m, spec) > 1e-9; i++) {
      const step = planOf(m, spec);
      if (!step) break;
      m = apply(m, spec, step);
    }
    return m;
  }

  const instructionOf = (spec, rng) => V[spec.scenario].instruction(spec, rng);

  // ---------------------------------------------------------------- judge modes

  function judgeOf(jr, spec, mode) {
    const v = V[spec.scenario];
    if (v.judge) return v.judge(jr, spec, mode);
    if (mode === 'confirm') {
      if (spec.startMode === 'scene') spec.startMode = 'off';
      if (v.prepareConfirm) v.prepareConfirm(spec);
      return { mode, message: `Everything is ready. Should I go ahead and ${v.confirmAsk}?` };
    }
    spec.startMode = 'off'; // the page is left alone: no head start
    return v[mode](jr, spec);
  }

  // ---------------------------------------------------------------- round 2 hooks

  function factsOf(m, s) {
    const v = V[s.scenario];
    return v.facts ? v.facts(m, s) : [];
  }

  // preempt=cancel: the page's named things and what each holds (names are not bare common words like "To" or "Order")
  function partsOf(m, s) {
    if (s.judge) return [];
    return V[s.scenario].parts(m, s);
  }

  function silentOf(next, prev, s, rng) {
    const v = V[s.scenario];
    const n = clone(next);
    if (!v.silent || !v.silent(n, next, prev, s, rng)) return null;
    return errorOf(n, s) > 0 ? n : null;
  }

  function retargetOf(s, m, rng) {
    if (s.judge) return null;
    const v = V[s.scenario];
    const n = clone(s);
    if (!v.retarget || !v.retarget(n, s, m, rng)) return null;
    return errorOf(m, n) > 0 ? n : null;
  }

  env.task({
    name: 'use-shop',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: ['search', 'ticket', 'food', 'flight', 'checkout', 'variantpick', 'compare', 'returns', 'cartedit', 'coupon'],
    files: ['scenarios/search.js', 'scenarios/ticket.js', 'scenarios/food.js', 'scenarios/flight.js',
      'scenarios/checkout.js', 'scenarios/shop.js'],
    inputs: ['pointer', 'keyboard', 'wheel'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],

    facts: factsOf, parts: partsOf, silent: silentOf, retarget: retargetOf,

    // Helpers the task's files share (they read env.taskOf('use-shop').lib), and the self-test.
    lib: {
      addMonths, C, cartSilent, days, fmtDate, fmtMoney, fmtTime, fromDays, hhmm, I, instructionOf, levelOf, list, listStep,
      loadingTick, menuPrice, moneyFor, monthDiff, monthName, monthOf, MONTHS, norm, ORD, perUSD, reveal, sayIt,
      shelfPrice, USD, weekday,
    },

    // The widget API (env.taskDef.helpers; the scenario files add theirs, see the header).
    helpers: {
      fmtMoney, fmtTime, fmtDur, fmtDate, weekday, days, fromDays, monthDiff, MONTHS, hash32, apply,
    },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const spec = { scenario, ...V[scenario].sample(rng, opts) };
      Object.assign(spec, { isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood,
        startMode: opts.startMode || 'off' });
      spec.recoverable = opts.recover ?? rng.fork('recover').bool(0.5);
      if (!spec.money) spec.money = USD;
      // opts.route: keyboard types / Enter where there is a choice, wheel / pointer pick how lists are scrolled.
      if (opts.route === 'keyboard' && 'enter' in spec) spec.enter = true;
      else if (opts.route === 'pointer' && 'enter' in spec) spec.enter = false;
      if ((opts.route === 'wheel' || opts.route === 'pointer') && (spec.route === 'wheel' || spec.route === 'thumb')) {
        spec.route = opts.route === 'wheel' ? 'wheel' : 'thumb';
      }
      if (this.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },
    init: initModel,
    error: errorOf,
    tolerance(spec) {
      return { tau: 0, sigma: V[spec.scenario].sigma ?? 0.35, minInitialError: 0.5 };
    },
    instruction(spec, rng) {
      const j = spec.judge;
      if (!j || (j.mode !== 'confirm' && !j.templates)) return instructionOf(spec, rng);
      if (j.mode === 'confirm') {
        const text = instructionOf(spec, rng).replace(/[.!?\s]+$/, '');
        const verb = V[spec.scenario].confirmVerb;
        return I.pick(rng, [`${text}, but check with me before you ${verb}.`, `${text}, but get my go-ahead before you ${verb}.`,
          `${text}. Before you ${verb}, check with me first.`, `${text}, but wait for my OK before you ${verb}.`], spec.isplit);
      }
      return sayIt(spec, rng, j.templates, j.vars, { terse: j.terse });
    },
    plan: planOf,
    solve: solveOf,
    ended: endedOf,
    tick(m, spec, dt) {
      const v = V[spec.scenario];
      return v.tick ? v.tick(m, spec, dt) : loadingTick(m, dt);
    },
    tickMs: 100,
  });
})();
