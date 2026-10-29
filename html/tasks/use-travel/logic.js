/*
 * use-travel: pick seats, dates, flights and hotels, and change a booking in a travel app.
 * Fictional travel booking and self-service itinerary management.
 * Real-app counterparts: airline seat assignments, hotel stay calendars, flight metasearch,
 * accommodation filters and airline manage-booking portals. No MiniWoB counterpart.
 * Scenarios: seat (window/aisle, row bounds, companion, exit restrictions and occupied seats),
 * daterange (two-month check-in/out picker with unavailable nights), flights (nonstop, departure,
 * budget and fictional alliance constraints), hotels (price range, guest rating and amenities),
 * change (open an existing booking, edit its date or seat, review and save).
 * Spec: common scenario/level/ood/startMode/isplit/csplit, passenger, origin/dest, reference,
 * seats [{id,row,col,kind,exit,occupied,fare}], flights [{id,airline,alliance,dep,stops,price,no}],
 * hotels [{id,name,price,rating,amenities,area}], calendar {base,last,blocked[]}, goal (scenario
 * constraints), original {date,seat}, nightly, changeFee. All dates ISO; times minutes since midnight.
 * Model: seat, start/end (ISO or ''), date, selected (record id or null), booked, page
 * ('manage'|'edit'|'review'|'results'), open, view (left calendar month), menu, filters
 * {nonstop,alliance,before,max,min,rating,amenities[]}, sort, scroll, visible[], notice; the widget also mirrors
 * above[], filterVisible[], filterAbove[], filterScroll and the pane heights paneH/filterH (wheel step size).
 * UI fields are unscored except the hotel filters, which the goal explicitly requests.
 * Start modes: off, solved, partial (first date/filter/selection), wrong (recoverable saved selection).
 * Error: fraction of unmet constraints, range endpoints and committed booking; tau=0.
 * Targets: {seat:id}, {day:ISO}, {nav:-1|1}, {control:'edit'|'calendar'|'review'|'book'|'back'},
 * {filter:key,value}, {menu:key}, {option:value}, {select:id}, {thumb:0|1}, {price:value,j},
 * {pane:true}; plan is closed-loop, using the widget's visible target keys for wheel navigation.
 * Helpers (widget API, env.taskDef.helpers):
 *   apply(model, spec, target): pure interaction transitions.
 *   available(spec, start, end): whether all nights in the range are available.
 *   order(spec, model): filtered and sorted hotel or flight records.
 *   addMonth(month, delta): shift an ISO month.
 *   fmtDate(date): format an ISO date or the unselected placeholder.
 *   money(amount): format a USD amount.
 *   time(minutes): format minutes since midnight as HH:MM.
 *   nights(start, end): count nights in an ISO date range.
 *   key(target): serialize an oracle target.
 *   AMENITIES: hotel amenity labels.
 *   ALLIANCES: fictional airline alliance labels.
 *   HOTEL_NAMES: fictional lodging bank, split through env.content.
 * Self-test: none.
 * facts(model,spec): visible assignment/fare, nights/total, booking reference/status; 2–4 derived facts.
 * silent(next,prev,spec,rng): a seat selection fails to stick, a date shifts a day, or one filter reverts;
 * returns a copied, incorrect, normally shaped model repairable through the same controls.
 * retarget(spec,model,rng): new constraints/dates over the same seats, calendar and result records.
 * judgeModes: confirm prepares a review and asks before Book and pay; impossible requests flights
 * below every available fare, hotels below all nightly rates, occupied seats or unavailable dates.
 * The impossible episode leaves the page untouched; the reply has status impossible and names what cannot be had
 * (spec.judge.what: the out-of-range price, the seat kind, the blocked date or the taken seat). confirm: status confirm.
 * parts: none (no discrete named items the agent changes beyond the graded selection).
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, clone = env.util.clone;
  const SCENARIOS = ['seat', 'daterange', 'flights', 'hotels', 'change'];
  const ALLIANCES = ['Aurora Circle', 'Meridian Network', 'Horizon Partners'];
  const AMENITIES = ['Breakfast included', 'Pool', 'Airport shuttle', 'Free Wi-Fi', 'Parking'];
  const HOTEL_NAMES = ['Alder House', 'The Marlow', 'Juniper Court', 'Harbor & Pine', 'Linden Terrace',
    'Rowan Quay', 'The Bracken', 'Northline Suites', 'Paloma House', 'Stellan Hotel', 'Cedar Court',
    'Fieldstone Hotel', 'The Wren', 'Orchard & Co.', 'Mossbank Lodge', 'Elmbrook Hotel', 'The Larkspur',
    'Brindle House', 'Havenstone Suites', 'The Willowmere', 'Lantern Yard', 'Sable & Fern',
    'The Coppergate', 'Westhaven Hotel', 'Kingsmere Court', 'Birchlight House', 'The Tern',
    'Oriole Gardens', 'The Bellweather', 'Stonehaven Place', 'Ashford Terrace', 'The Silverbay', 'Amberwick House',
    'Cobalt Quarters', 'Mallow Court', 'Pineward Hotel', 'Maplecross Inn', 'Dovetail Suites', 'Foxglove Yard',
    'The Rill', 'Cairn & Cove', 'Brookmere Place', 'Silverfern Court', 'Moorlight Hotel', 'The Evern',
    'Merriton Court', 'Bluebell Quay', 'Peregrine Court', 'Sunward Lodge', 'The Ashcombe', 'Merewood Suites',
    'Tideglass Hotel', 'Glenward House', 'The Wistrel', 'Rosemere Court', 'Eastmere Suites', 'Hearthside Lodge',
    'Kestrel Court', 'Linen & Lark', 'The Oatfield', 'Larkstone Court', 'Wildermere Hotel', 'Clovergate House',
    'Meadowglass Inn', 'Northwick Court', 'Tallow & Reed', 'The Oakhaven', 'Wychwood Suites', 'Moorvale Court',
    'Cresswell Hotel', 'Honeyfern House', 'Elmspire Lodge', 'Wheatley Quay', 'Quietwater Lodge', 'Merefield Hotel',
    'Crownwell Court', 'Hawthorn & Vale', 'Dunewick Suites', 'Foxmere House', 'Willow & Flint', 'Garnet Quay',
    'Hollowfen Hotel', 'Rainford Court', 'Ashen Quay', 'Thornfield Inn', 'Calder & Crow', 'Whitecap Court',
    'Tansy & Timber', 'Greystone Quay', 'Loam & Lantern', 'Slatebrook Inn', 'Gorse & Gable']
    .flatMap(name => [name, `${name} Central`, `${name} Riverside`, `${name} at the Park`]);
  const money = n => C.formatMoney(n, 'USD', 'en-US');
  const fmtDate = d => d ? C.formatDate(d, 'en-US', 'medium') : 'Not selected';
  const time = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  const addMonth = (m, n) => {
    const [y, mo] = m.split('-').map(Number), z = y * 12 + mo - 1 + n;
    return `${Math.floor(z / 12)}-${String((z % 12) + 1).padStart(2, '0')}`;
  };
  const nights = (a, b) => {
    if (!a || !b || b <= a) return 0;
    let d = a, n = 0;
    while (d < b && n < 400) { d = C.addDays(d, 1); n++; }
    return n;
  };
  const key = t => JSON.stringify(t);
  function seatChecks(x, g, s) {
    if (!x) return [false, false, false, false, false];
    const near = s.seats.find(z => z.id === g.near);
    return [!x.occupied, x.kind === g.kind, x.row >= g.rows[0] && x.row <= g.rows[1],
      !g.avoidExit || !x.exit, !g.near || (near && x.row === near.row && Math.abs(x.col - near.col) === 1
        && Math.floor(x.col / 3) === Math.floor(near.col / 3))];
  }
  const seatMatch = (x, g, s) => seatChecks(x, g, s).every(Boolean);
  const flightMatch = (x, g) => !!x && (!g.nonstop || !x.stops) && x.dep < g.before && x.price <= g.max && x.alliance === g.alliance;
  const hotelMatch = (x, g) => !!x && x.price >= g.min && x.price <= g.max && x.rating >= g.rating && g.amenities.every(a => x.amenities.includes(a));
  const hotelChecks = (m, s) => [m.filters.min === s.goal.min, m.filters.max === s.goal.max,
    m.filters.rating === s.goal.rating, ...AMENITIES.map(a => m.filters.amenities.includes(a) === s.goal.amenities.includes(a))];
  function available(s, a, b) {
    return !!a && !!b && b > a && a >= s.calendar.base && b <= s.calendar.last
      && !s.calendar.blocked.some(d => d >= a && d < b);
  }
  function order(s, m) {
    const f = m.filters;
    const rows = s.scenario === 'hotels'
      ? s.hotels.filter(x => hotelMatch(x, f))
      : s.flights.filter(x => (!f.nonstop || !x.stops) && (!f.alliance || x.alliance === f.alliance) && x.dep < f.before && x.price <= f.max);
    return rows.slice().sort((a, b) => m.sort === 'price' ? a.price - b.price : m.sort === 'rating'
      ? b.rating - a.rating : m.sort === 'departure' ? a.dep - b.dep : a.id.localeCompare(b.id));
  }
  function sample(rng, opts) {
    const cr = rng.fork('content'), level = opts.level || 'normal', easy = level === 'easy';
    const count = easy ? 5 : level === 'medium' ? 8 : opts.ood ? 18 : 11;
    const cityPool = C.split(C.CITIES.filter(x => x.iata), opts.csplit);
    const countries = [...new Set(cityPool.map(x => x.countryCode))].filter(cc => cityPool.filter(x => x.countryCode === cc).length >= 2);
    const country = cr.pick(countries);
    const cities = cr.sample(cityPool.filter(x => x.countryCode === country), 2);
    const s = { scenario: opts.scenario || rng.pick(opts.scenarios || SCENARIOS), level, ood: !!opts.ood,
      startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
      passenger: C.personName(cr, opts).full, origin: cities[0], dest: cities[1], reference: C.alnum(cr, 6),
      nightly: rng.int(9, 22) * 10, changeFee: rng.pick([25, 40, 55]), maxPrice: opts.ood ? 2000 : 1000 };
    const month = rng.int(1, 11), base = `2027-${String(month).padStart(2, '0')}-01`;
    s.calendar = { base, last: C.addDays(base, 110), blocked: [] };
    const nr = easy ? 6 : opts.ood ? 14 : 9;
    s.seats = Array.from({length: nr * 6}, (_, i) => ({id: `${10 + Math.floor(i / 6)}${'ABCDEF'[i % 6]}`,
      row: 10 + Math.floor(i / 6), col: i % 6, kind: [0, 5].includes(i % 6) ? 'window' : [2, 3].includes(i % 6) ? 'aisle' : 'middle',
      exit: [12, 13].includes(10 + Math.floor(i / 6)), occupied: rng.bool(easy ? .12 : .3), fare: rng.pick([15, 22, 28, 35, 45])}));
    const seat = rng.pick(s.seats.filter(x => x.kind !== 'middle' && !x.exit));
    seat.occupied = false;
    const companion = s.seats.find(x => x.row === seat.row && x.col === (seat.col < 3 ? 1 : 4));
    companion.occupied = true;
    const airlines = C.sample(cr, C.AIRLINES, 5, opts);
    const directMinutes = rng.int(3, 8) * 30;
    s.flights = Array.from({length: count}, (_, i) => ({id: `f${i}`, airline: airlines[i % airlines.length].name,
      no: `${airlines[i % airlines.length].code} ${rng.int(100, 899)}`, alliance: ALLIANCES[i % 3],
      dep: rng.int(12, 40) * 30, stops: i % 3 ? 0 : 1, price: rng.int(12, opts.ood ? 80 : 45) * 10,
      duration: directMinutes + rng.int(0, 3) * 5 + (i % 3 ? 0 : 90)}));
    // Deliberate near-matches vary one constraint; exactly one normal flight meets the whole request.
    const winner = rng.pick(s.flights);
    const fg = {nonstop: true, before: rng.pick([660, 780, 900]), max: rng.pick([250, 350, 450]), alliance: winner.alliance};
    winner.stops = 0; winner.duration = directMinutes; winner.dep = fg.before - 60; winner.price = fg.max - 30;
    s.flights.forEach(x => { if (x !== winner && flightMatch(x, fg)) x.price = fg.max + 40; });
    const hotelNames = C.sample(cr, HOTEL_NAMES, count, opts);
    s.hotels = Array.from({length: count}, (_, i) => ({id: `h${i}`, name: hotelNames[i],
      area: rng.pick([
        'Old Town', 'Riverside', 'Station Quarter', 'City Centre', 'Garden Ward', 'Market Lane', 'Greenfield',
        'Foundry Row', 'Harbor Bay', 'Cedar Glen', 'Canal View', 'North Park', 'Pine Terrace', 'West End',
        'Mill Crossing', 'Maple Gardens'
      ]), price: rng.int(9, 40) * 10,
      rating: rng.pick([7.2, 7.8, 8, 8.5, 9, 9.4]), amenities: rng.sample(AMENITIES, rng.int(1, 4)), reviews: rng.int(80, 2100)}));
    const hg = {min: rng.pick([100, 150]), max: rng.pick([250, 300, 350]), rating: easy ? 8 : rng.pick([8, 8.5, 9]),
      amenities: rng.sample(AMENITIES, easy ? 1 : level === 'medium' ? 2 : 3)};
    const hotel = rng.pick(s.hotels);
    Object.assign(hotel, {price: hg.min + 50, rating: hg.rating, amenities: hg.amenities.slice()});
    s.hotels.forEach(x => { if (x !== hotel && hotelMatch(x, hg)) x.price = hg.max + 50; });
    const checkIn = C.addDays(base, easy ? rng.int(4, 14) : rng.int(24, opts.ood ? 83 : 53));
    const checkOut = C.addDays(checkIn, rng.int(2, easy ? 4 : opts.ood ? 14 : 8));
    if (!easy) s.calendar.blocked = [C.addDays(base, 2), C.addDays(checkOut, 3)];
    s.original = {seat: s.seats.find(x => !x.occupied && x.id !== seat.id).id, date: C.addDays(base, 3)};
    if (s.scenario === 'seat') s.goal = {kind: seat.kind, rows: easy ? [seat.row, seat.row] : [seat.row - 1, seat.row + 1],
      avoidExit: true, near: !easy && rng.bool(.6) ? companion.id : null};
    if (s.scenario === 'daterange') s.goal = {checkIn, checkOut};
    if (s.scenario === 'flights') s.goal = fg;
    if (s.scenario === 'hotels') s.goal = hg;
    if (s.scenario === 'change') s.goal = rng.bool() ? {changeKind: 'seat', seat: seat.id} : {changeKind: 'date', date: checkIn};
    if (opts.judge === 'confirm') s.judge = {mode: 'confirm', message: 'The booking is ready for review. Should I go ahead and book and pay?'};
    if (opts.judge === 'impossible') {
      if (s.scenario === 'flights') s.goal.max = Math.min(...s.flights.map(x => x.price)) - 10;
      if (s.scenario === 'hotels') { s.goal.min = 0; s.goal.max = Math.min(...s.hotels.map(x => x.price)) - 10; }
      if (s.scenario === 'seat') s.seats.forEach(x => { if (seatMatch(x, s.goal, s)) x.occupied = true; });
      if (s.scenario === 'daterange') s.calendar.blocked.push(s.goal.checkIn);
      if (s.scenario === 'change') {
        if (s.goal.changeKind === 'seat') s.seats.find(x => x.id === s.goal.seat).occupied = true;
        else s.calendar.blocked.push(s.goal.date);
      }
      const g = s.goal, what = s.scenario === 'flights' || s.scenario === 'hotels' ? [money(g.max), String(g.max)]
        : s.scenario === 'seat' ? [`${g.kind} seat`, g.kind]
        : s.scenario === 'daterange' ? [fmtDate(g.checkIn), g.checkIn]
        : g.changeKind === 'seat' ? [g.seat] : [fmtDate(g.date), g.date];
      s.judge = {mode: 'impossible', what, message: `I cannot book this: ${s.scenario === 'flights'
        ? 'no flight meets all the departure, alliance, nonstop and price constraints'
        : s.scenario === 'hotels' ? 'no hotel meets all the price, rating and amenity constraints'
        : s.scenario === 'seat' ? 'all seats meeting the constraints are occupied' : 'the requested booking option is unavailable'}.`};
    }
    return s;
  }
  function init(s) {
    const m = {seat: null, start: '', end: '', date: s.original.date, selected: null, booked: false,
      page: s.scenario === 'change' ? 'manage' : 'edit', open: s.scenario === 'daterange', view: s.calendar.base.slice(0, 7),
      menu: '', filters: {nonstop: false, alliance: '', before: 1440, min: 0, max: s.maxPrice, rating: 0, amenities: []},
      sort: 'recommended', scroll: 0, visible: [], notice: ''};
    if (s.scenario === 'change') m.seat = s.original.seat;
    if (s.judge && s.judge.mode === 'impossible') return m;
    if (s.startMode === 'partial') {
      if (s.scenario === 'seat') m.seat = s.seats.find(x => seatMatch(x, s.goal, s)).id;
      if (s.scenario === 'daterange') m.start = s.goal.checkIn;
      if (s.scenario === 'flights') m.filters.nonstop = true;
      if (s.scenario === 'hotels') m.filters.rating = s.goal.rating;
      if (s.scenario === 'change') m.page = 'edit';
    }
    if (s.startMode === 'wrong') {
      m.booked = true;
      if (s.scenario === 'seat') m.seat = s.seats.find(x => !x.occupied && !seatMatch(x, s.goal, s)).id;
      if (s.scenario === 'daterange') { m.start = C.addDays(s.goal.checkIn, 1); m.end = s.goal.checkOut; }
      if (s.scenario === 'flights') m.selected = s.flights.find(x => !flightMatch(x, s.goal)).id;
      if (s.scenario === 'hotels') m.selected = s.hotels.find(x => !hotelMatch(x, s.goal)).id;
      if (s.scenario === 'change') m.page = 'edit';
      m.notice = 'Saved to your itinerary';
    }
    return m;
  }
  function error(m, s) {
    if (s.judge && s.judge.mode === 'impossible') return m.selected !== null || m.booked || m.filters.nonstop || m.filters.alliance !== ''
      || m.filters.before !== 1440 || m.filters.max !== s.maxPrice || m.filters.min !== 0 || m.filters.rating !== 0
      || m.filters.amenities.length || m.start || m.end || m.date !== s.original.date
      || m.seat !== (s.scenario === 'change' ? s.original.seat : null) ? 1 : 0;
    const checks = [];
    if (s.scenario === 'seat') checks.push(...seatChecks(s.seats.find(x => x.id === m.seat), s.goal, s));
    if (s.scenario === 'daterange') checks.push(m.start === s.goal.checkIn, m.end === s.goal.checkOut, available(s, m.start, m.end));
    if (s.scenario === 'flights') {
      const x = s.flights.find(x => x.id === m.selected), g = s.goal;
      checks.push(!!x, !!x && (!g.nonstop || !x.stops), !!x && x.dep < g.before, !!x && x.price <= g.max, !!x && x.alliance === g.alliance);
    }
    if (s.scenario === 'hotels') checks.push(...hotelChecks(m, s), hotelMatch(s.hotels.find(x => x.id === m.selected), s.goal));
    if (s.scenario === 'change') checks.push(s.goal.changeKind === 'seat' ? m.seat === s.goal.seat : m.date === s.goal.date,
      s.goal.changeKind === 'seat' ? m.date === s.original.date : m.seat === s.original.seat);
    checks.push(s.judge && s.judge.mode === 'confirm' ? m.page === 'review' : m.booked);
    return checks.filter(x => !x).length / checks.length;
  }
  function apply(model, s, t) {
    const m = clone(model);
    m.notice = '';
    if (t.nav) m.view = addMonth(m.view, t.nav);
    if (t.menu) m.menu = m.menu === t.menu ? '' : t.menu;
    if (t.option !== undefined && m.menu) {
      if (m.menu === 'sort') m.sort = t.option;
      else m.filters[m.menu] = t.option;
      m.menu = ''; m.scroll = 0;
    }
    if (t.filter) {
      if (t.filter === 'amenities') m.filters.amenities = m.filters.amenities.includes(t.value)
        ? m.filters.amenities.filter(a => a !== t.value) : [...m.filters.amenities, t.value];
      else m.filters[t.filter] = t.value;
      m.scroll = 0; m.booked = false;
    }
    if (t.seat && s.seats.some(x => x.id === t.seat && !x.occupied)) { m.seat = t.seat; m.booked = false; }
    if (t.day && !s.calendar.blocked.includes(t.day)) {
      if (s.scenario === 'change') { m.date = t.day; m.open = false; }
      else if (!m.start || m.end || t.day <= m.start) { m.start = t.day; m.end = ''; }
      else if (available(s, m.start, t.day)) { m.end = t.day; m.open = false; }
      else m.notice = 'This stay includes an unavailable night. Choose another date.';
      m.booked = false;
    }
    if (t.select) { m.selected = t.select; m.booked = false; }
    if (t.control === 'calendar') m.open = !m.open;
    if (t.control === 'edit' || t.control === 'back') { m.page = 'edit'; m.booked = false; m.scroll = 0; }
    if (t.control === 'review') { m.page = 'review'; m.open = false; m.scroll = 0; }
    if (t.control === 'book') { m.booked = true; m.page = 'review'; m.notice = 'Saved to your itinerary'; }
    return m;
  }
  function plan(m, s) {
    const click = t => ({click: t});
    // Wheel at most half the pane per step: a short pane (tall instruction panel at 1024x640) would otherwise let a
    // fixed step jump a target from below the fold to above it and back forever.
    const step = (full, h) => h > 0 ? Math.max(20, Math.min(full, Math.floor(h / 2))) : full;
    const visible = t => m.visible.includes(key(t)) ? click(t) : {wheel: [{pane: true}, ((m.above || []).includes(key(t)) ? -1 : 1) * step(160, m.paneH)]};
    const filter = t => !m.filterVisible || m.filterVisible.includes(key(t)) ? click(t)
      : {wheel: [{pane: 'filters'}, ((m.filterAbove || []).includes(key(t)) ? -1 : 1) * step(130, m.filterH)]};
    if (m.page === 'review') return click({control: error({...m, booked: true}, s) > 0 ? 'back' : 'book'});
    if (m.page === 'manage') return visible({control: 'edit'});
    if (s.scenario === 'seat' || (s.scenario === 'change' && s.goal.changeKind === 'seat')) {
      const target = s.scenario === 'seat' ? s.seats.find(x => seatMatch(x, s.goal, s)).id : s.goal.seat;
      const right = s.scenario === 'seat' ? seatMatch(s.seats.find(x => x.id === m.seat), s.goal, s) : m.seat === target;
      if (!right) return visible({seat: target});
    }
    if (s.scenario === 'daterange' || (s.scenario === 'change' && s.goal.changeKind === 'date')) {
      const a = s.scenario === 'daterange' ? s.goal.checkIn : s.goal.date;
      const target = s.scenario === 'change' ? (m.date === a ? null : a)
        : m.start !== a ? a : m.end !== s.goal.checkOut ? (m.end ? a : s.goal.checkOut) : null;
      if (target) {
        if (!m.open) return click({control: 'calendar'});
        const month = target.slice(0, 7);
        if (month < m.view) return visible({nav: -1});
        if (month > addMonth(m.view, 1)) return visible({nav: 1});
        return visible({day: target});
      }
    }
    if (s.scenario === 'flights' || s.scenario === 'hotels') {
      const g = s.goal, f = m.filters;
      if (s.scenario === 'hotels') {
        if (f.max < g.min) return {drag: [{thumb: 1}, {price: g.max, j: 1}]};
        for (const j of [0, 1]) {
          const k = j ? 'max' : 'min';
          if (f[k] !== g[k]) return {drag: [{thumb: j}, {price: g[k], j}]};
        }
        if (f.rating !== g.rating) return m.menu === 'rating' ? click({option: g.rating}) : filter({menu: 'rating'});
        for (const a of AMENITIES) if (f.amenities.includes(a) !== g.amenities.includes(a)) return filter({filter: 'amenities', value: a});
      } else {
        if (f.nonstop !== g.nonstop) return filter({filter: 'nonstop', value: g.nonstop});
        for (const k of ['alliance', 'before', 'max']) if (f[k] !== g[k]) return m.menu === k ? click({option: g[k]}) : filter({menu: k});
      }
      const match = s.scenario === 'hotels' ? hotelMatch : flightMatch, rows = s.scenario === 'hotels' ? s.hotels : s.flights;
      if (!match(rows.find(x => x.id === m.selected), g)) return visible({select: rows.find(x => match(x, g)).id});
    }
    return click({control: 'review'});
  }
  function solve(s, model) {
    const m = clone(model || init(s));
    if (s.judge && s.judge.mode === 'impossible') return init({...s, startMode: 'off'});
    m.booked = !(s.judge && s.judge.mode === 'confirm'); m.page = 'review'; m.open = false;
    if (s.scenario === 'seat') m.seat = s.seats.find(x => seatMatch(x, s.goal, s)).id;
    if (s.scenario === 'daterange') { m.start = s.goal.checkIn; m.end = s.goal.checkOut; }
    if (s.scenario === 'flights') m.selected = s.flights.find(x => flightMatch(x, s.goal)).id;
    if (s.scenario === 'hotels') {
      Object.assign(m.filters, clone(s.goal)); m.selected = s.hotels.find(x => hotelMatch(x, s.goal)).id;
    }
    if (s.scenario === 'change') {
      m.seat = s.goal.changeKind === 'seat' ? s.goal.seat : s.original.seat;
      m.date = s.goal.changeKind === 'date' ? s.goal.date : s.original.date;
    }
    return m;
  }
  function instruction(s, rng) {
    const g = s.goal, route = `${s.origin.city} to ${s.dest.city}`;
    let text;
    if (s.scenario === 'seat') text = `Reserve an available ${g.kind} seat in rows ${g.rows[0]}–${g.rows[1]} for ${s.passenger}${g.near ? `, next to the companion in ${g.near}` : ''}${g.avoidExit ? ', avoiding exit rows' : ''}.`;
    if (s.scenario === 'daterange') text = `Book a stay in ${s.dest.city}, checking in ${fmtDate(g.checkIn)} and checking out ${fmtDate(g.checkOut)}, for ${s.passenger}.`;
    if (s.scenario === 'flights') text = `Book the ${g.nonstop ? 'nonstop ' : ''}flight from ${route} departing before ${time(g.before)}, costing at most ${money(g.max)}, with an airline in ${g.alliance}.`;
    if (s.scenario === 'hotels') text = `Find and book a hotel in ${s.dest.city} for ${money(g.min)}–${money(g.max)} per night, rated at least ${g.rating.toFixed(1)}. Keep my search preferences at that exact price range and rating, with only these required amenities: ${g.amenities.join(', ')}.`;
    if (s.scenario === 'change') text = `Update booking ${s.reference} for ${s.passenger}: change ${g.changeKind === 'seat' ? `the seat to ${g.seat}, keeping the departure date` : `the departure date to ${fmtDate(g.date)}, keeping the seat`}.`;
    const core = I.phrase(rng, [
      '{task}', 'For my next trip: {task}', 'Update my itinerary as follows: {task}',
      'Please arrange the following travel details: {task}', 'Travel request: {task}', 'Here is what I need: {task}',
      'Please help with this: {task}', 'Here are my trip requirements: {task}', 'The plan is this: {task}',
      'On my travel list: {task}'
    ], {task: text}, s.isplit);
    text = I.say(rng, core, {isplit: s.isplit});
    return s.judge && s.judge.mode === 'confirm' ? `${text} Get everything ready, but ask me before committing the booking or making a payment.` : text;
  }
  function facts(m, s) {
    const status = {label: 'Status', value: m.booked ? 'Confirmed' : 'Ready for review'};
    if (s.scenario === 'seat') return [{label: 'Seat', value: m.seat || 'Not selected'},
      {label: 'Seat fee', value: money((s.seats.find(x => x.id === m.seat) || {}).fare || 0)}, status];
    if (s.scenario === 'daterange') return [{label: 'Nights', value: String(nights(m.start, m.end))},
      {label: 'Stay total', value: money(nights(m.start, m.end) * s.nightly)}, status];
    if (s.scenario === 'change') return [{label: 'Change fee', value: money(s.changeFee)},
      s.goal.changeKind === 'date' ? {label: 'Seat', value: m.seat || 'Not selected'}
        : {label: 'Departure', value: fmtDate(m.date).replace(',', ''), aliases: [fmtDate(m.date), m.date]}, status];
    const x = (s.scenario === 'hotels' ? s.hotels : s.flights).find(x => x.id === m.selected);
    return [{label: s.scenario === 'hotels' ? 'Nightly rate' : 'Fare', value: money(x ? x.price : 0)},
      {label: 'Booking reference', value: m.booked ? s.reference : 'Pending'}, status];
  }
  function silent(next, prev, s, rng) {
    if (s.judge) return null;
    const m = clone(next);
    if (next.seat !== prev.seat) m.seat = prev.seat;
    else if (next.end && next.end !== prev.end) { m.end = C.addDays(next.end, -1); if (!available(s, m.start, m.end)) m.end = ''; }
    else if (next.date !== prev.date) m.date = C.addDays(next.date, -1);
    else if (next.selected !== prev.selected) m.selected = prev.selected;
    else if (key(next.filters) !== key(prev.filters)) m.filters = clone(prev.filters);
    else if (next.booked && !prev.booked) m.booked = false;
    else return null;
    m.notice = rng.pick(['Saved to your itinerary', 'Your changes have been saved']);
    return error(m, s) > 0 ? m : null;
  }
  function retarget(spec, m, rng) {
    if (spec.judge) return null;
    const s = clone(spec);
    if (s.scenario === 'seat') {
      const xs = s.seats.filter(x => !x.occupied && x.kind !== 'middle' && x.id !== m.seat);
      const x = rng.pick(xs); s.goal = {kind: x.kind, rows: [x.row, x.row], avoidExit: false, near: null};
    } else if (s.scenario === 'daterange') {
      s.goal = {checkIn: C.addDays(s.goal.checkIn, 1), checkOut: C.addDays(s.goal.checkOut, 1)};
      if (!available(s, s.goal.checkIn, s.goal.checkOut)) return null;
    } else if (s.scenario === 'flights') {
      const x = rng.pick(s.flights.filter(x => x.id !== m.selected && !flightMatch(x, s.goal)));
      s.goal = {nonstop: !x.stops, before: x.dep + 30, max: x.price, alliance: x.alliance};
    } else if (s.scenario === 'hotels') {
      const x = rng.pick(s.hotels.filter(x => x.id !== m.selected));
      s.goal = {min: Math.floor(x.price / 50) * 50, max: Math.ceil(x.price / 50) * 50 + 50,
        rating: x.rating, amenities: x.amenities.slice()};
    } else {
      s.goal = s.goal.changeKind === 'date' ? {changeKind: 'date', date: C.addDays(s.goal.date, 1)}
        : {changeKind: 'seat', seat: rng.pick(s.seats.filter(x => !x.occupied && x.id !== m.seat)).id};
    }
    return error(m, s) > 0 ? s : null;
  }
  env.task({name: 'use-travel', scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    inputs: ['pointer', 'wheel'], judgeModes: ['confirm', 'impossible'], sample, init, error,
    tolerance: () => ({tau: 0, sigma: .35, minInitialError: .1}), instruction, plan, solve, facts, silent, retarget,
    helpers: {apply, available, order,
      addMonth, fmtDate, money, time, nights, key, AMENITIES, ALLIANCES, HOTEL_NAMES}});
})();
