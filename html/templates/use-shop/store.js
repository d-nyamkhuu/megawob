// Implementations: _store-*.js parts and styles; _common.js controls; _shared-*.js identical sibling parts.
/*
 * use-shop/store: the live search, flight and ticket builders of lineage L2 (24 sites).
 * Defaults with design {} reproduce design-use-shop-search-10 (medoid), design-use-shop-flight-04 and
 * design-use-shop-ticket-06, including seeded draws, DOM, oracle trajectories and site-frame integration.
 * The original wrapper registered only one builder; food, checkout and cart builders were dead and are omitted.
 *
 * Tokens (default -> purpose): placeholder (null -> keep sampled hint), goLabel ('Search' -> search caption;
 * null retains the sampled caption), backLabel ('← Back to results' -> preview back caption), ticketGap (1 ->
 * row gap px), buyLabel ('Buy' -> purchase caption), boughtLabel ('Bought' -> purchased caption),
 * fieldLabels ({from:'From',to:'To',date:'Depart'} -> flight labels), fromPlaceholder ('City or airport'),
 * dateIcon (null -> ICON.cal), calendarInBody (false -> calendar stays inside its field), searchLabel ('Search'),
 * dateFormat ('us' -> date formatter style), bookLabel ('Book'), bookedLabel ('Booked').
 * Presets: search uses the base unchanged; ticket uses 'Buy ticket', route/date/passenger fields, a bus pictogram,
 * a taller row pitch, recovery controls in .order-slot and the 'Change search' sort caption (ticket-06);
 * flight uses Date, Search Flights, long dates, passenger fields, a summary field grid, comparison column heads,
 * airline marks and .pv-text/.pv-total booking summary (flight-04). Each can be wrapped or replaced by a design.
 *
 * design.parts entries are (base, S) => replacement. S.ctx is the live context, S.def the widget definition,
 * S.D the resolved tokens, S.P the resolved parts, S.H the helpers (F, hashStr, where, money, whole, btn,
 * trackFocus, listPane, pitchFor, mirrorPitch, ICON, FAV, WORD_COLORS). All mutable state is per factory.
 * V holds an episode's ctx, util, spec, rng, body and its live elements/model callbacks; V.x is design state.
 * Build parts mutate V and return nothing unless specified; locate parts return a point or null; paint parts
 * redraw from m. Calling through S.P preserves nested overrides. Keep every replaced part's rng draws in order.
 *
 * Parts (signature -> default behavior; scenario presets may wrap/replace these):
 *   frameOptions(ctx) -> The app frame (brand bar and body) options of a scenario: brand, logo, nav, right-hand pill.
 *   frame(ctx, o) -> The app frame: width, insets and alignment sampled per episode from ctx.size.
 *   built() -> After a view is built and first painted (V is the view state of the scenario).
 *   paintEnd() -> After a flight or search repaint (default: nothing).
 *   searchBar(V) -> The search bar: search box (input) and Search button (the sampled word draws stay with the default).
 *   searchPanes(V) -> The result count line, the result list, the pager and the page preview.
 *   searchSizing(V) -> Result row height (V.cardH) and description lines (V.lines) from the body height.
 *   searchSide(V) -> The related searches column on wide stages.
 *   searchWire(V) -> The text field, focus tracking and the Search action (button and Enter).
 *   searchVisit(V, m) -> The preview of the picked result (Back to results, the page's address, a few paragraphs).
 *   searchReset() -> Before the result view is emptied (state of an earlier build a design has to release).
 *   searchHide(V, m) -> Which parts of the result view are hidden while the preview shows.
 *   searchEmpty(V, m) -> Before the first search: an empty-state prompt. Returns true when the view is done.
 *   searchMeta(V, m, res) -> The result count line (res = all results of the query).
 *   searchCard(V, r, i, res, m, parent = V.list) -> One result row i (r = res[i]) in `parent`; registers its title link in V.titles.
 *   searchRows(V, m, res) -> The rows of the current page. A design that draws the whole result view itself returns true (no pager).
 *   searchPager(V, m) -> The pager buttons: previous, 1..pages, next.
 *   searchRebuild(V, m) -> updates searchRebuild state or elements
 *   searchPaint(V, m) -> updates searchPaint state or elements
 *   searchLocate(V, t) -> updates searchLocate state or elements
 *   searchCommit(V) -> updates searchCommit state or elements
 *   buildSearch(ctx, body) -> builds Search view and returns {paint, locate}
 *   flightHeading(V) -> The headline and sub line of the search form (two rng draws).
 *   fieldDecor() -> no-op hook
 *   flightField(V, f) -> The From / To autocomplete field f.
 *   flightDate(V) -> The Depart field with its calendar popup (env.ui.calendar).
 *   flightStatics() -> Fixed fields after the date field (default: none).
 *   flightEmpty() -> A comparison table shown before the first search (default: none).
 *   flightDeals(V) -> updates flightDeals state or elements
 *   flightForm(V) -> updates flightForm state or elements
 *   flightSummary(V) -> The summary bar of the results screen: Modify search, route, date, Cancel booking.
 *   flightColumns() -> Column heads between the count line and the flight pane (default: none).
 *   flightTable(V) -> The count line, the flight pane, the fare note and the loading cover.
 *   resultsSummary(V, s) -> The route and date texts of the summary bar for the searched trip s.
 *   flightPitch(V) -> Row pitch of the flight pane (once per page): sets V.pitch, the pane height and the mirrored pitch.
 *   flightRow(V, i, fl, flights, s) -> One flight row i (fl = flights[i]) of the searched trip s.
 *   flightResults(V, m) -> Rebuild the flight list for the searched trip (m.searched).
 *   flightCal(V, m) -> updates flightCal state or elements
 *   paintScreen(V, m) -> Which screen shows.
 *   paintResultsHead(V, m) -> The count line and the loading cover over the flight pane.
 *   paintBookRow(V, m, i, b) -> updates paintBookRow state or elements
 *   flightPaint(V, m) -> updates flightPaint state or elements
 *   flightLocate(V, t) -> updates flightLocate state or elements
 *   buildFlight(ctx, body) -> builds Flight view and returns {paint, locate}
 *   ticketTitle(V) -> The title line of the head (the rng draw stays with the default).
 *   ticketHeadMid() -> Hook between the head's sub line and its sort dropdown.
 *   ticketHead(V) -> Head: title, subtitle and the "Sort by" dropdown (env.ui.dropdown).
 *   ticketColumns() -> Between the head and the pane (column heads of designs that have them).
 *   ticketFoot() -> Hook after the footer note and Cancel purchase exist, before the pitch is computed.
 *   ticketPitch(V) -> Row pitch of the ticket pane: sets V.pitch and the pane height, mirrors the pitch into the model.
 *   ticketPane(V) -> The pane, the footer note, the purchase receipt with Cancel purchase.
 *   ticketRow(V, i) -> One ticket row i; registers V.rowsEl[i] and V.buyEl[i].
 *   ticketList(V, m) -> updates ticketList state or elements
 *   ticketDialog(V) -> The Confirm purchase dialog (spec.confirm).
 *   paintSort(V, m) -> The sort dropdown's value and options after a model change.
 *   paintBuyRow(V, m, i, b) -> One row's Buy button after a model change.
 *   paintDialogBody(V, p) -> The summary lines of the pending purchase in the dialog.
 *   ticketPaint(V, m) -> updates ticketPaint state or elements
 *   ticketLocate(V, t) -> updates ticketLocate state or elements
 *   ticketSetup() -> Hook after the buy action exists, before the dialog is built (state a design's rows need).
 *   buildTicket(ctx, body) -> builds Ticket view and returns {paint, locate}
 */

(function () {
  'use strict';



  const ICON = {
    search:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>',
    left: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    right:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
    plane:
      '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M15 8c0-.6-.5-1-1.1-1H10L6.6 1.5H5.2L6.9 7H3.6L2.4 5.4H1.2L2 8l-.8 2.6h1.2L3.6 9h3.3l-1.7 5.5h1.4L10 9h3.9c.6 0 1.1-.4 1.1-1z"/></svg>',
    pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 14.5s4.8-4.4 4.8-8a4.8 4.8 0 0 0-9.6 0c0 3.6 4.8 8 4.8 8z"/><circle cx="8" cy="6.5" r="1.7"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M5.2 1.6v2.6M10.8 1.6v2.6"/></svg>',
    ticket:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M1.8 4.5h12.4v2.2a1.4 1.4 0 0 0 0 2.6v2.2H1.8V9.3a1.4 1.4 0 0 0 0-2.6z"/></svg>',
    user: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="5.3" r="2.7"/><path d="M2.8 14.2c.5-3 2.6-4.6 5.2-4.6s4.7 1.6 5.2 4.6"/></svg>',
  };
  const FAV = ['#1c7ed6', '#e8590c', '#2f9e44', '#7048e8', '#c2255c', '#0c8599', '#f08c00', '#495057'];
  const WORD_COLORS = ['#1c7ed6', '#e03131', '#f2a400', '#2f9e44'];

  // The brand bar of each scenario.
  const FRAMES = {
    search: (spec) => ({
      brand: spec.engine,
      word: true,
      nav: ['All', 'Images', 'News', 'Maps', 'Videos'],
      on: 0,
      right: '<span>Settings</span><span class="as-ava">JD</span>',
    }),
    ticket: (spec) => ({
      brand: spec.brand,
      icon: ICON.ticket,
      nav: ['Trains', 'Buses', 'Events', 'My tickets'],
      on: { train: 0, bus: 1, event: 2 }[spec.kind],
      right: `<span class="pill">${ICON.user}<span>Sign in</span></span>`,
    }),
    flight: (spec) => ({
      brand: spec.airline,
      icon: ICON.plane,
      nav: ['Flights', 'Hotels', 'Cars', 'My trips'],
      on: 0,
      right: `<span class="pill">${ICON.user}<span>Sign in</span></span>`,
    }),
  };

  // Which builder part draws each scenario.
  const BUILD = { search: 'buildSearch', ticket: 'buildTicket', flight: 'buildFlight' };

  // What the sites of one scenario share: the look of the scenario's representative site (design-use-shop-ticket-06,
  // design-use-shop-flight-04). search has none: design-use-shop-search-10 is the template's defaults.

  const TOKENS = {
    // search
    placeholder: null,
    goLabel: 'Search',
    backLabel: '← Back to results',
    // ticket
    ticketGap: 1,
    buyLabel: 'Buy',
    boughtLabel: 'Bought',
    // flight
    fieldLabels: { from: 'From', to: 'To', date: 'Depart' },
    fromPlaceholder: 'City or airport',
    dateIcon: null,
    calendarInBody: false,
    searchLabel: 'Search',
    dateFormat: 'us',
    bookLabel: 'Book',
    bookedLabel: 'Booked',
  };

  env.template('use-shop/store', (design, def) => {
    const { F, hashStr, where, money, whole, btn, trackFocus, listPane, pitchFor, mirrorPitch } = env.templateLib('use-shop/_common');
    const { CSS } = env.templateLib('use-shop/_store-style');
    const SCENARIOS = {
      ticket: {
        buyLabel: 'Buy ticket',
        parts: {
          ticketHeadMid: () => (V) => {
            const { util, spec, fam, hl } = V;
            const fields = util.el('div', 'tk-fields', hl);
            const route = spec.tickets[0].place.split(/\s*→\s*/);
            for (const [label, value, cls] of [
              ['From', route[0], 'from'],
              ['To', route[1] || route[0], 'to'],
              ['Date', fam.fmtDate(spec.tickets[0].date), 'date'],
              ['Passengers', '1 adult', 'passengers'],
            ]) {
              const field = util.el('div', 'tk-field ' + cls, fields);
              util.el('span', '', field, label);
              util.el('b', '', field, value);
            }
            util.el('span', 'tk-route-arrow', fields, '→');
            const calendar = util.el('span', 'tk-calendar', fields);
            calendar.innerHTML =
              '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="6" width="26" height="23" rx="3"/><path d="M3 12h26M9 2v8M23 2v8"/><path d="M9 17h3m5 0h3m-11 6h3m5 0h3"/></svg>';
          },
          ticketFoot: () => (V) => {
            const { foot } = V;
            const recoverySlot = document.querySelector('.order-slot');
            if (recoverySlot) recoverySlot.append(foot);
          },
          ticketPitch: (base, S) => (V) => {
            const { ctx, spec, rng, body, pane, main, gap } = V;
            const sampledPitch = rng.int(80, 92);
            V.pitch = pitchFor(pane, body, spec.rows, gap, 42, Math.max(sampledPitch, 180), -14);
            main.style.setProperty('--ticket-pitch', V.pitch + 'px');
            pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
            mirrorPitch(ctx, V.pitch);
          },
          ticketRow: () => (V, i) => {
            const { util, spec, fam, fmt, ev, rowsEl, buyEl, buy } = V;
            const t = spec.tickets[i];
            const r = util.el('div', 'tk-row');
            r.dataset.role = 'ticket';
            const d = util.el('div', 'tk-date', r);
            util.el('div', 'tk-dw', d, fam.fmtDate(t.date).slice(0, 3));
            util.el('div', 'tk-dd', d, String(+t.date.slice(8)));
            util.el('div', 'tk-dm', d, fam.MONTHS[+t.date.slice(5, 7) - 1].slice(0, 3));
            const bus = util.el('span', 'tk-bus-icon', d);
            bus.innerHTML =
              '<svg viewBox="0 0 40 44" fill="none"><rect x="5" y="3" width="30" height="34" rx="6" fill="white"/><rect x="8" y="7" width="24" height="15" rx="2" fill="currentColor"/><circle cx="11" cy="29" r="3" fill="currentColor"/><circle cx="29" cy="29" r="3" fill="currentColor"/><path d="M10 36v5m20-5v5" stroke="white" stroke-width="5" stroke-linecap="round"/></svg>';
            const info = util.el('div', 'tk-info', r);
            util.el('div', 'tk-name', info, t.name);
            util.el('div', 'tk-place', info, ev ? `${t.place} · ${t.code}` : `${t.code} · ${fam.fmtDate(t.date)}`);
            const w = util.el('div', 'tk-when', r);
            const tm = util.el('div', 'tk-time', w);
            if (ev) tm.textContent = `Starts ${fam.fmtTime(t.time)}`;
            else {
              tm.textContent = `${fam.fmtTime(t.time)} → ${fam.fmtTime(t.time + t.dur)}`;
              if (t.time + t.dur >= 1440) util.el('sup', '', tm, '+1');
            }
            util.el('div', 'tk-dur', w, fam.fmtDur(t.dur));
            util.el('div', 'tk-price', r, fmt(t.price));
            const b = btn(util, 'as-btn primary tk-buy', r, 'Buy ticket', 'buy');
            b.addEventListener('click', () => buy(i));
            rowsEl[i] = r;
            buyEl[i] = b;
            return r;
          },
          paintSort: () => (V, m) => {
            const { fam, trig } = V;
            V.dd.set({ value: m.sort });
            V.tval.textContent = 'Change search';
            trig.setAttribute('aria-label', 'Change search, sort by ' + fam.SORTS.find(([k]) => k === m.sort)[1]);
            for (const [k, el] of Object.entries(V.optEls)) el.classList.toggle('sel', k === m.sort);
          },
        },
      },
      flight: {
        fieldLabels: { from: 'From', to: 'To', date: 'Date' },
        searchLabel: 'Search Flights',
        dateFormat: 'long',
        parts: {
          flightStatics: () => (V) => {
            const { util, row } = V;
            const passengers = util.el('div', 'fl-field passengers', row);
            util.el('span', 'fl-lab', passengers, 'Passengers');
            util.el('div', 'fl-ctl passenger-value', passengers, '1 Adult');
          },
          flightEmpty: () => (V) => {
            const { util, form } = V;
            const emptyLedger = util.el('div', 'fl-empty-ledger', form);
            const emptyHead = util.el('div', 'fl-thead', emptyLedger);
            for (const h of ['Airline', 'Departure', 'Arrival', 'Duration', 'Stops', 'Price', ''])
              util.el('span', '', emptyHead, h);
          },
          flightSummary: () => (V) => {
            const { ctx, util, body, step } = V;
            V.res = util.el('div', 'fl-res', V.body);
            V.sum = util.el('div', 'fl-sum', V.res);
            const resultFields = util.el('div', 'fl-result-fields', V.sum);
            V.x.resultValues = {};
            for (const [key, label] of [
              ['from', 'From'],
              ['to', 'To'],
              ['date', 'Date'],
              ['passengers', 'Passengers'],
            ]) {
              const field = util.el('div', 'fl-field ' + key, resultFields);
              util.el('span', 'fl-lab', field, label);
              V.x.resultValues[key] = util.el('div', 'fl-ctl fl-summary-value', field);
            }
            V.back = btn(util, 'as-btn fl-back', V.sum, undefined, 'back');
            V.back.innerHTML = `${ICON.left}<span>Modify search</span>`;
            V.back.addEventListener('click', () => step({ click: { back: true } }));
            V.route = util.el('span', 'fl-route', V.sum);
            V.sdate = util.el('span', 'fl-sdate', V.sum);
            V.cancelBook = btn(util, 'as-btn sm fl-cancel', V.sum, 'Cancel booking', 'cancel-booking');
            V.cancelBook.addEventListener('click', () => {
              if (ctx.model.booked) step({ click: { cancelBook: true } });
            });
          },
          flightColumns: () => (V) => {
            const { util, res } = V;
            const thead = util.el('div', 'fl-thead', res);
            for (const h of ['Airline', 'Departure', 'Arrival', 'Duration', 'Stops', 'Price', ''])
              util.el('span', '', thead, h);
          },
          resultsSummary: (base) => (V, s) => {
            const { fam } = V;
            base(V, s);
            V.x.resultValues.from.textContent = s.from;
            V.x.resultValues.to.textContent = fam.airport(s.to).city + ' (' + s.to + ')';
            V.x.resultValues.date.textContent = fam.fmtDate(s.date, 'long');
            V.x.resultValues.passengers.textContent = '1 Adult';
          },
          flightPitch: () => (V) => {
            const { ctx, spec, rng, body, pane, gap } = V;
            V.pitch = pitchFor(pane, V.body, spec.rows, gap, 24, rng.int(84, 100), 4);
            V.res.classList.toggle('compact-results', V.pitch < 60);
            pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
            mirrorPitch(ctx, V.pitch);
          },
          flightRow: () => (V, i, fl, flights, s) => {
            const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
            const r = util.el('div', 'fl-frow');
            r.dataset.role = 'flight';
            const air = util.el('div', 'fl-air', r);
            const mark = util.el('span', 'air-mark', air);
            mark.setAttribute('aria-hidden', 'true');
            if (/delta/i.test(fl.airline))
              mark.innerHTML =
                '<svg viewBox="0 0 44 44"><path fill="#ac173b" d="M22 3 42 38 22 28 2 38Z"/><path fill="#761129" d="M22 3v25L2 38Z"/><path fill="#e5a2a6" d="m2 40 20-9 20 9-20-4Z"/></svg>';
            else if (/american/i.test(fl.airline))
              mark.innerHTML =
                '<svg viewBox="0 0 44 44"><path fill="#087ba3" d="M1 2h14l17 23H18Z"/><path fill="#c21b27" d="M19 24h14l10 19H28Z"/><path fill="#aab3b4" d="m19 21 15-2 7 4-11 1-5 8Z"/></svg>';
            else if (/united/i.test(fl.airline))
              mark.innerHTML =
                '<svg viewBox="0 0 44 44"><path fill="#11518a" d="M1 1h42v42H1Z"/><g fill="none" stroke="#f7f1e6" stroke-width="1.1"><circle cx="3" cy="43" r="12"/><circle cx="3" cy="43" r="19"/><circle cx="3" cy="43" r="26"/><circle cx="3" cy="43" r="33"/><circle cx="3" cy="43" r="40"/><path d="M2 3q38 12 39 39M2 10q29 14 29 32M2 20q20 10 20 22M2 4l39 38M2 17l26 25M2 29l13 13"/></g></svg>';
            else if (/jetblue/i.test(fl.airline)) {
              mark.textContent = 'jetBlue';
              mark.classList.add('jetblue');
            } else {
              mark.textContent = fl.airline.slice(0, 2);
              mark.classList.add('initials');
            }
            util.el('b', '', air, fl.airline);
            util.el('span', '', air, fl.no);
            const times = util.el('div', 'fl-times', r);
            util.el('span', 'fl-t', times, fam.fmtTime(fl.dep));
            util.el('small', 'fl-airport departure-airport', times, s.from);
            const line = util.el('div', 'fl-line', times);
            util.el('span', '', line, fam.fmtDur(fl.dur));
            util.el('i', '', line);
            util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
            const arr = util.el('span', 'fl-t', times, fam.fmtTime(fl.dep + fl.dur));
            util.el('small', 'fl-airport arrival-airport', times, s.to);
            if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
            const fare = util.el('div', 'fl-fare', r);
            fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
            util.el('br', '', fare);
            if (((fl.price / 100) * 7 + fl.dur) % 3 === 0)
              util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
            else fare.append('Carry-on included');
            util.el('div', 'fl-fp', r, fmt(fl.price));
            const b = btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
            b.addEventListener('click', () => {
              if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } });
            });
            bookEls[i] = b;
            rowEls[i] = r;
            return r;
          },
          paintScreen: (base) => (V, m) => {
            const { fam, spec } = V;
            const preview = document.querySelector('.pv-text');
            const total = document.querySelector('.pv-total b');
            if (preview && total) {
              const flight = m.booked && m.searched ? fam.flightsFor(spec, m.searched)[m.booked.index] : null;
              preview.querySelector('b').textContent = flight ? flight.airline + ' · ' + flight.no : 'No flight selected';
              preview.querySelector('span').textContent = flight
                ? m.searched.from +
                  ' → ' +
                  m.searched.to +
                  ' · ' +
                  fam.fmtDur(flight.dur) +
                  ' · ' +
                  fam.fmtDate(m.searched.date, 'long')
                : 'Choose a flight and click Book to see your trip details here.';
              total.textContent = flight ? V.fmt(flight.price) : '$0';
            }
            base(V, m);
          },
        },
      },
    };

    let D, P; // tokens and parts, resolved below
    let st = null; // live episode: { ctx, view }
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
      H: { F, hashStr, where, money, whole, btn, trackFocus, listPane, pitchFor, mirrorPitch, ICON, FAV, WORD_COLORS },
    };

    function ensureStyle() {
      if (document.getElementById('as-style')) return;
      const s = document.createElement('style');
      s.id = 'as-style';
      s.textContent = CSS;
      document.head.append(s);
    }

    // ---------------------------------------------------------------- frame

    // The app frame (brand bar and body) options of a scenario: brand, logo, nav, right-hand pill.
    BASE.frameOptions = (ctx) => FRAMES[ctx.spec.scenario](ctx.spec);

    // The app frame: width, insets and alignment sampled per episode from ctx.size.
    BASE.frame = (ctx, o) => {
      const { util } = ctx;
      const W = ctx.size.width;
      const H = ctx.size.height;
      const r = ctx.rng.fork('frame');
      const padY = r.int(6, 14);
      const padX = r.int(8, 20);
      let width = W - 2 * padX;
      const maxW = r.pick([0, 0, 1180, 1080, 1000]);
      if (maxW && width > maxW + 40) width = maxW;
      const align = r.pick(['left', 'center', 'center', 'right']);
      const left = align === 'left' ? padX : align === 'right' ? W - padX - width : Math.round((W - width) / 2);
      // A site end control floating over the stage (position: fixed) would cover the app's bottom corner: keep
      // that strip free.
      let reserve = 0;
      const sub = env.submitEl;
      if (sub && getComputedStyle(sub).position === 'fixed') {
        const a = sub.getBoundingClientRect();
        const s = ctx.stage.getBoundingClientRect();
        if (a.top < s.bottom && a.bottom > s.top) reserve = Math.max(0, Math.ceil(s.bottom - a.top) + 6 - padY);
      }
      const app = util.el('div', 'as-app', ctx.stage);
      app.dataset.role = 'app';
      Object.assign(app.style, {
        left: left + 'px',
        width: width + 'px',
        top: padY + 'px',
        bottom: padY + reserve + 'px',
      });
      const top = util.el('div', 'as-top', app);
      const brand = util.el('div', 'as-brand', top);
      if (o.word) {
        const w = util.el('span', 'as-word', brand);
        w.style.fontSize = '21px';
        [...o.brand].forEach((ch, i) => {
          util.el('span', '', w, ch).style.color = WORD_COLORS[i % WORD_COLORS.length];
        });
      } else {
        const logo = util.el('span', 'as-logo', brand);
        logo.innerHTML = o.icon || '';
        util.el('span', '', brand, o.brand);
      }
      if (o.nav) {
        const nav = util.el('nav', 'as-nav', top);
        o.nav.forEach((n, i) => util.el('span', i === o.on ? 'on' : '', nav, n));
      }
      if (o.right) util.el('div', 'as-right', top).innerHTML = o.right;
      const body = util.el('div', 'as-body', app);
      return { app, top, body, brand };
    };

    // After a view is built and first painted (V is the view state of the scenario).
    BASE.built = () => {};

    // After a flight or search repaint (default: nothing).
    BASE.paintEnd = () => {};

    // ---------------------------------------------------------------- search

    // The page-state object V of a search view: ctx, util, spec, rng, body, commit, paint and what the stages create
    // (main, col, bar, box, input, go, meta, list, pager, visit, cardH, lines, tf, shown, titles, pages, prev, next,
    // back). V.x is free for a design's own state.

    // The search bar: search box (input) and Search button (the sampled word draws stay with the default).
    env.templateLib('use-shop/_store-search').install(BASE, S);

    env.templateLib('use-shop/_store-flight').install(BASE, S);

    env.templateLib('use-shop/_store-ticket').install(BASE, S);

    ({ D, P } = env.templateDesign('use-shop/store', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));

    return {
      render(ctx) {
        ensureStyle();
        const o = P.frameOptions(ctx);
        const fr = P.frame(ctx, o);
        const view = P[BUILD[ctx.spec.scenario]](ctx, fr.body, fr);
        st = { ctx, view };
        let last = ctx.model;
        return {
          anchors: [fr.app],
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
        if (!at) throw new Error(`use-shop/store cannot locate ${JSON.stringify(t)}`);
        return at;
      },
    };
  }, { uses: ["use-shop/_common","use-shop/_store-style","use-shop/_store-search","use-shop/_store-flight","use-shop/_store-ticket"] });
})();
