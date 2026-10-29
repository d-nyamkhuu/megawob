/*
 * use-shop / flight: search a one-way flight (airports, date) and book the one the criterion picks.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { addMonths, C, days, fmtDate, fmtTime, fromDays, hhmm, levelOf, listStep, monthDiff, monthName, monthOf, MONTHS, norm, reveal, sayIt, USD } = fam.lib;
  const { hash32 } = env.util;

  const AIRPORTS = [
    ['Albany', 'NY', 'ALB'], ['Albuquerque', 'NM', 'ABQ'], ['Anchorage', 'AK', 'ANC'], ['Atlanta', 'GA', 'ATL'],
    ['Austin', 'TX', 'AUS'], ['Baltimore', 'MD', 'BWI'], ['Billings', 'MT', 'BIL'], ['Boise', 'ID', 'BOI'],
    ['Boston', 'MA', 'BOS'], ['Buffalo', 'NY', 'BUF'], ['Burlington', 'VT', 'BTV'], ['Charleston', 'SC', 'CHS'],
    ['Charlotte', 'NC', 'CLT'], ['Chicago', 'IL', 'ORD'], ['Cincinnati', 'OH', 'CVG'], ['Cleveland', 'OH', 'CLE'],
    ['Columbus', 'OH', 'CMH'], ['Dallas', 'TX', 'DFW'], ['Denver', 'CO', 'DEN'], ['Des Moines', 'IA', 'DSM'],
    ['Detroit', 'MI', 'DTW'], ['El Paso', 'TX', 'ELP'], ['Fresno', 'CA', 'FAT'], ['Hartford', 'CT', 'BDL'],
    ['Honolulu', 'HI', 'HNL'], ['Houston', 'TX', 'IAH'], ['Indianapolis', 'IN', 'IND'], ['Jacksonville', 'FL', 'JAX'],
    ['Kansas City', 'MO', 'MCI'], ['Las Vegas', 'NV', 'LAS'], ['Little Rock', 'AR', 'LIT'], ['Los Angeles', 'CA', 'LAX'],
    ['Louisville', 'KY', 'SDF'], ['Memphis', 'TN', 'MEM'], ['Miami', 'FL', 'MIA'], ['Milwaukee', 'WI', 'MKE'],
    ['Minneapolis', 'MN', 'MSP'], ['Nashville', 'TN', 'BNA'], ['New Orleans', 'LA', 'MSY'], ['Newark', 'NJ', 'EWR'],
    ['Oakland', 'CA', 'OAK'], ['Oklahoma City', 'OK', 'OKC'], ['Omaha', 'NE', 'OMA'], ['Orlando', 'FL', 'MCO'],
    ['Philadelphia', 'PA', 'PHL'], ['Phoenix', 'AZ', 'PHX'], ['Pittsburgh', 'PA', 'PIT'], ['Portland', 'OR', 'PDX'],
    ['Raleigh', 'NC', 'RDU'], ['Reno', 'NV', 'RNO'], ['Richmond', 'VA', 'RIC'], ['Sacramento', 'CA', 'SMF'],
    ['Salt Lake City', 'UT', 'SLC'], ['San Antonio', 'TX', 'SAT'], ['San Diego', 'CA', 'SAN'],
    ['San Francisco', 'CA', 'SFO'], ['San Jose', 'CA', 'SJC'], ['Savannah', 'GA', 'SAV'], ['Seattle', 'WA', 'SEA'],
    ['Spokane', 'WA', 'GEG'], ['St. Louis', 'MO', 'STL'], ['Syracuse', 'NY', 'SYR'], ['Tampa', 'FL', 'TPA'],
    ['Tucson', 'AZ', 'TUS'], ['Tulsa', 'OK', 'TUL'], ['Akron', 'OH', 'CAK'], ['Allentown', 'PA', 'ABE'],
    ['Appleton', 'WI', 'ATW'], ['Asheville', 'NC', 'AVL'], ['Aspen', 'CO', 'ASE'], ['Bangor', 'ME', 'BGR'],
    ['Baton Rouge', 'LA', 'BTR'], ['Bellingham', 'WA', 'BLI'], ['Birmingham', 'AL', 'BHM'], ['Bismarck', 'ND', 'BIS'],
    ['Bozeman', 'MT', 'BZN'], ['Cedar Rapids', 'IA', 'CID'], ['Chattanooga', 'TN', 'CHA'], ['Columbia', 'SC', 'CAE'],
    ['Dayton', 'OH', 'DAY'], ['Duluth', 'MN', 'DLH'], ['Eugene', 'OR', 'EUG'], ['Evansville', 'IN', 'EVV'],
    ['Fairbanks', 'AK', 'FAI'], ['Fargo', 'ND', 'FAR'], ['Flint', 'MI', 'FNT'], ['Fort Myers', 'FL', 'RSW'],
    ['Fort Wayne', 'IN', 'FWA'], ['Grand Rapids', 'MI', 'GRR'], ['Great Falls', 'MT', 'GTF'],
    ['Green Bay', 'WI', 'GRB'], ['Greensboro', 'NC', 'GSO'], ['Greenville', 'SC', 'GSP'], ['Gulfport', 'MS', 'GPT'],
    ['Harrisburg', 'PA', 'MDT'], ['Hilo', 'HI', 'ITO'], ['Huntsville', 'AL', 'HSV'], ['Jackson', 'MS', 'JAN'],
    ['Juneau', 'AK', 'JNU'], ['Kahului', 'HI', 'OGG'], ['Key West', 'FL', 'EYW'], ['Knoxville', 'TN', 'TYS'],
    ['Lansing', 'MI', 'LAN'], ['Lexington', 'KY', 'LEX'], ['Lincoln', 'NE', 'LNK'], ['Lubbock', 'TX', 'LBB'],
    ['Madison', 'WI', 'MSN'], ['Manchester', 'NH', 'MHT'], ['Medford', 'OR', 'MFR'], ['Missoula', 'MT', 'MSO'],
    ['Monterey', 'CA', 'MRY'], ['Montgomery', 'AL', 'MGM'], ['Myrtle Beach', 'SC', 'MYR'], ['Norfolk', 'VA', 'ORF'],
    ['Palm Springs', 'CA', 'PSP'], ['Pensacola', 'FL', 'PNS'], ['Peoria', 'IL', 'PIA'], ['Providence', 'RI', 'PVD'],
    ['Rapid City', 'SD', 'RAP'], ['Roanoke', 'VA', 'ROA'], ['Rochester', 'NY', 'ROC'], ['Sarasota', 'FL', 'SRQ'],
    ['Sioux Falls', 'SD', 'FSD'], ['Wichita', 'KS', 'ICT'], ['Abilene', 'TX', 'ABI'], ['Alexandria', 'LA', 'AEX'],
    ['Alpena', 'MI', 'APN'], ['Amarillo', 'TX', 'AMA'], ['Arcata', 'CA', 'ACV'], ['Augusta', 'GA', 'AGS'],
    ['Bakersfield', 'CA', 'BFL'], ['Beaumont', 'TX', 'BPT'], ['Bentonville', 'AR', 'XNA'], ['Binghamton', 'NY', 'BGM'],
    ['Bloomington', 'IL', 'BMI'], ['Brownsville', 'TX', 'BRO'], ['Brunswick', 'GA', 'BQK'], ['Butte', 'MT', 'BTM'],
    ['Champaign', 'IL', 'CMI'], ['Dothan', 'AL', 'DHN'], ['Durango', 'CO', 'DRO'], ['Eau Claire', 'WI', 'EAU'],
    ['Elmira', 'NY', 'ELM'], ['Erie', 'PA', 'ERI'], ['Fayetteville', 'NC', 'FAY'], ['Flagstaff', 'AZ', 'FLG'],
    ['Fort Smith', 'AR', 'FSM'], ['Gainesville', 'FL', 'GNV'], ['Grand Forks', 'ND', 'GFK'], ['Gunnison', 'CO', 'GUC'],
    ['Harlingen', 'TX', 'HRL'], ['Helena', 'MT', 'HLN'], ['Hilton Head', 'SC', 'HHH'], ['Idaho Falls', 'ID', 'IDA'],
    ['Ithaca', 'NY', 'ITH'], ['Kalamazoo', 'MI', 'AZO'], ['Kalispell', 'MT', 'FCA'], ['Ketchikan', 'AK', 'KTN'],
    ['Killeen', 'TX', 'GRK'], ['Lafayette', 'LA', 'LFT'], ['Lake Charles', 'LA', 'LCH'], ['Laredo', 'TX', 'LRD'],
    ['Lawton', 'OK', 'LAW'], ['Lewiston', 'ID', 'LWS'], ['Lihue', 'HI', 'LIH'], ['Long Beach', 'CA', 'LGB'],
    ['Lynchburg', 'VA', 'LYH'], ['Manhattan', 'KS', 'MHK'], ['McAllen', 'TX', 'MFE'], ['Midland', 'TX', 'MAF'],
    ['Minot', 'ND', 'MOT'], ['New York', 'NY', 'JFK'], ['Ontario', 'CA', 'ONT'], ['Pasco', 'WA', 'PSC'],
    ['Pocatello', 'ID', 'PIH'], ['Santa Fe', 'NM', 'SAF'], ['Shreveport', 'LA', 'SHV'], ['Sioux City', 'IA', 'SUX'],
    ['Springfield', 'MO', 'SGF'], ['Tallahassee', 'FL', 'TLH'], ['Bethel', 'AK', 'BET'], ['Burbank', 'CA', 'BUR'],
    ['Dubuque', 'IA', 'DBQ'], ['Eagle', 'CO', 'EGE'], ['Joplin', 'MO', 'JLN'], ['Kodiak', 'AK', 'ADQ'],
    ['La Crosse', 'WI', 'LSE'], ['Moline', 'IL', 'MLI'], ['Montrose', 'CO', 'MTJ'], ['Mosinee', 'WI', 'CWA'],
    ['New Haven', 'CT', 'HVN'], ['Nome', 'AK', 'OME'], ['North Bend', 'OR', 'OTH'], ['Owensboro', 'KY', 'OWB'],
    ['Paducah', 'KY', 'PAH'], ['Pullman', 'WA', 'PUW'], ['Redding', 'CA', 'RDD'], ['Redmond', 'OR', 'RDM'],
    ['Santa Rosa', 'CA', 'STS'], ['Sitka', 'AK', 'SIT'], ['Walla Walla', 'WA', 'ALW'], ['Waterloo', 'IA', 'ALO'],
    ['Wenatchee', 'WA', 'EAT'], ['Yakima', 'WA', 'YKM'],
  ].map(([city, st, code]) => ({ city, st, code, label: `${city}, ${st} (${code})` }));
  const AIRPORT = Object.fromEntries(AIRPORTS.map((a) => [a.code, a]));
  const MAX_SUGGEST = 6;

  function suggest(text) {
    const t = norm(text);
    if (!t) return [];
    const rank = (a) => (a.code.toLowerCase() === t ? 0 : a.city.toLowerCase().startsWith(t) ? 1 : a.label.toLowerCase().startsWith(t) ? 1 : 2);
    return AIRPORTS.filter((a) => a.label.toLowerCase().includes(t))
      .map((a, i) => [rank(a), i, a])
      .sort((x, y) => x[0] - y[0] || x[1] - y[1])
      .slice(0, MAX_SUGGEST)
      .map((x) => x[2].code);
  }
  const exactAirport = (text) => {
    const t = norm(text);
    const a = AIRPORTS.find((x) => x.label.toLowerCase() === t);
    return a ? a.code : '';
  };
  const typedFor = (spec, which) => {
    const a = AIRPORT[which === 'from' ? spec.origin : spec.dest];
    return (which === 'from' ? spec.askFrom : spec.askTo) === 'city' ? a.city : a.code;
  };

  const FLIGHT_CRIT = { cheapest: (f) => f.price, shortest: (f) => f.dur, earliest: (f) => f.dep, latest: (f) => -f.dep };
  function makeFlights(rng, n, criterion, csplit) {
    const lines = C.split(C.AIRLINES, csplit);
    const carriers = rng.sample(lines, Math.min(lines.length, 6));
    for (;;) {
      const flights = [];
      for (let i = 0; i < n; i++) {
        const a = rng.pick(carriers);
        const stops = rng.pick([0, 0, 1, 1, 2]);
        flights.push({ airline: a.name, no: `${a.code} ${rng.int(100, 2999)}`, dep: 5 * rng.int(66, 270),
          dur: 5 * rng.int(14 + stops * 12, 70 + stops * 40), stops, price: rng.int(79, 1200) * 100 });
      }
      if (!criterion) return flights;
      const k = FLIGHT_CRIT[criterion];
      const vals = flights.map(k).sort((a, b) => a - b);
      if (vals[0] !== vals[1]) return flights;
    }
  }
  function flightRankErr(spec, i) {
    const k = FLIGHT_CRIT[spec.criterion];
    const v = k(spec.flights[i]);
    const better = spec.flights.filter((f) => k(f) < v).length;
    return better / Math.max(1, spec.flights.length - 1);
  }

  function sampleFlight(rng, opts) {
    const [o, d] = rng.sample(AIRPORTS, 2);
    const today = fromDays(days('2026-01-05') + rng.int(0, 900));
    const lv = levelOf(opts);
    const date = fromDays(days(today) + (lv === 'easy' ? rng.int(2, 25) : lv === 'medium' ? rng.int(2, 60) : opts.ood ? rng.int(120, 300) : rng.int(2, 100)));
    const criterion = lv === 'easy' ? 'cheapest' : rng.pick(['cheapest', 'shortest', 'cheapest', 'shortest', 'earliest', 'latest']);
    const n = lv === 'easy' ? rng.int(3, 4) : lv === 'medium' ? rng.int(4, 5) : opts.ood ? rng.int(10, 16) : rng.int(3, 8);
    const flights = makeFlights(rng, n, criterion, opts.csplit);
    const k = FLIGHT_CRIT[criterion];
    const best = Math.min(...flights.map(k));
    const spec = {
      airline: rng.pick([
        'FlyFinder', 'Skyscout', 'Jetset', 'AirDeal', 'Wayfare', 'Farecompass', 'Tripwing', 'Aviorbit', 'Fareviax',
        'Tripwisp', 'Skyrovia', 'Paxelune', 'Tavemint', 'Milivane'
      ]),
      origin: o.code, dest: d.code, askFrom: rng.pick(['city', 'code']), askTo: rng.pick(['city', 'code']),
      today, date, start: monthOf(today), maxMonth: addMonths(monthOf(today), opts.ood ? 11 : 6),
      dateFmt: rng.pick(['us', 'us', 'mdy', 'long']), criterion, rows: rng.int(4, 5), flights,
      target: flights.findIndex((f) => k(f) === best), salt: rng.int(1, 1e9), money: USD,
      loadMs: rng.pick([0, 0, 600, 1500, 2200]), route: rng.bool(0.5) ? 'wheel' : 'thumb',
    };
    if (opts.traits && opts.traits.sort) spec.sortable = true; // widgets with a results sort control
    return spec;
  }

  // Sort control of the results list (widget trait sort; spec.sortable): the list shows flightOrder(spec, searched, sort),
  // a permutation of indices into flightsFor(spec, searched); plan targets { book: i } keep the flight index.
  const FLIGHT_SORTS = [['recommended', 'Recommended'], ['price', 'Price: low to high'], ['duration', 'Duration: shortest'],
    ['departure', 'Departure: earliest']];
  const FLIGHT_SORT_KEY = { price: (f) => f.price, duration: (f) => f.dur, departure: (f) => f.dep };
  const FLIGHT_UNHELPFUL = { cheapest: 'duration', shortest: 'price', earliest: 'price', latest: 'departure' };
  function flightOrder(spec, searched, sort) {
    const fl = flightsFor(spec, searched);
    const idx = fl.map((f, i) => i);
    const k = spec.sortable && FLIGHT_SORT_KEY[sort];
    return k ? idx.sort((a, b) => k(fl[a]) - k(fl[b]) || a - b) : idx;
  }

  const isRealSearch = (spec, s) => !!s && s.from === spec.origin && s.to === spec.dest && s.date === spec.date;
  function flightsFor(spec, s) {
    if (isRealSearch(spec, s)) return spec.flights;
    const rng = new env.Rng(hash32(`${spec.salt}|${s.from}|${s.to}|${s.date}`));
    return makeFlights(rng, rng.int(3, 8), null, spec.csplit);
  }
  const flightRight = (spec, b) => !!b && b.real && b.index === spec.target;

  function flightSearch(m, spec) {
    const invalid = ['from', 'to', 'date'].filter((f) => !m[f]);
    if (invalid.length) return { ...m, invalid, ac: null, calOpen: false };
    return { ...m, invalid: [], ac: null, calOpen: false, screen: 'results', scroll: 0, loading: spec.loadMs || 0,
      searched: { from: m.from, to: m.to, date: m.date } };
  }

  const FLIGHT = [
    'Book the {crit} one-way flight from {from} to {to} on {date}.',
    'Find a one-way flight from {from} to {to} on {date} and book the {crit2} one.',
    'Flying from {from} to {to} on {date}: book the {crit2} option.',
    'Search flights from {from} to {to} departing {date}, then book whichever is {crit2}.',
    'Book me on the {crit} flight from {from} to {to}, {date}.',
    'On {date}, what is the {crit} flight from {from} to {to}? Book it.',
    'Get a one-way ticket {from} → {to} for {date}; pick the {crit} flight.',
    'For my {date} trip {from} → {to}, book a one-way flight that is {crit2}.',
    'Arrange one-way travel for {date}, {from} → {to}: book the {crit} flight.',
    'Make the {crit} flight a one-way booking: {from} → {to}, {date}.',
    'Check flights from {from} to {to} on {date}; book the {crit2} one way.',
    'Which flight is {crit2} from {from} to {to} on {date}? Book it one way.',
    'One way, {from} → {to}, {date}: I want the {crit} flight booked.',
    'Use {date} for a one-way booking from {from} to {to}: the {crit} flight.',
    'Can you book a one-way ticket on the {crit} flight from {from} to {to}, {date}?',
  ];

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { flightsFor, suggest, airport: (code) => AIRPORT[code], AIRPORTS, exactAirport, flightOrder,
    FLIGHT_SORTS });

  env.scenario('use-shop', {
    name: 'flight',
    sample: sampleFlight,
    init(spec, r) {
      const mode = spec.startMode;
      const m = { fromText: '', from: '', toText: '', to: '', ac: null, date: '', calOpen: false, calView: spec.start,
        screen: 'form', invalid: [], searched: null, loading: 0, scroll: 0, booked: null, wrongs: 0 };
      if (spec.sortable) m.sort = 'recommended';
      const fill = (f, code) => Object.assign(m, { [f + 'Text']: AIRPORT[code].label, [f]: code });
      if (mode === 'partial') {
        fill('from', spec.origin);
        fill('to', spec.dest);
        if (r.bool(0.4)) m.date = spec.date;
      } else if (mode === 'scene') {
        // The reference screen: the real route and date searched, the flights listed, none booked.
        fill('from', spec.origin);
        fill('to', spec.dest);
        Object.assign(m, { date: spec.date, calView: monthOf(spec.date), screen: 'results',
          searched: { from: spec.origin, to: spec.dest, date: spec.date } });
      } else if (mode === 'wrong') {
        const k = r.pick(['swap', 'date', 'search', spec.recoverable ? 'booked' : 'search']);
        fill('from', k === 'swap' ? spec.dest : spec.origin);
        fill('to', k === 'swap' ? spec.origin : spec.dest);
        m.date = k === 'date' || k === 'search' ? fromDays(days(spec.date) + r.int(1, 3)) : spec.date;
        if (k === 'search' || k === 'booked') {
          Object.assign(m, { screen: 'results', searched: { from: m.from, to: m.to, date: m.date } });
          if (k === 'booked') {
            const others = spec.flights.map((f, i) => i).filter((i) => i !== spec.target);
            Object.assign(m, { booked: { real: true, index: r.pick(others) }, wrongs: 1 });
          }
          if (spec.sortable) m.sort = FLIGHT_UNHELPFUL[spec.criterion];
        }
      }
      return m;
    },
    error(m, spec) {
      let s = 0;
      if (m.from === spec.origin) s += 3;
      if (m.to === spec.dest) s += 3;
      if (m.date === spec.date) s += 3;
      if (isRealSearch(spec, m.searched)) s += 4;
      if (m.booked && m.booked.real) s += 7 * (1 - flightRankErr(spec, m.booked.index));
      return 1 - s / 20;
    },
    purchased: (m) => !!m.booked,
    prepared(m, spec, e) {
      if (m.booked) return e;
      let s = 0;
      if (m.from === spec.origin) s += 3;
      if (m.to === spec.dest) s += 3;
      if (m.date === spec.date) s += 3;
      if (isRealSearch(spec, m.searched)) s += 4 + (m.screen === 'results' && !(m.loading > 0) ? 7 : 0);
      return 1 - s / 20;
    },
    ended: (m, spec, last) => (m.booked && !flightRight(spec, m.booked) && last ? 'wrong-choice' : null),
    plan(m, spec) {
      if (m.screen === 'results') {
        if (m.booked) return { click: { cancelBook: true } };
        if (!isRealSearch(spec, m.searched)) return { click: { back: true } };
        if (m.loading > 0) return { wait: true };
        const pos = spec.sortable ? flightOrder(spec, m.searched, m.sort).indexOf(spec.target) : spec.target;
        return reveal(m, spec, pos, spec.flights.length, spec.rows) || { click: { book: spec.target } };
      }
      for (const f of ['from', 'to']) {
        const code = f === 'from' ? spec.origin : spec.dest;
        if (m[f] === code) continue;
        const typed = typedFor(spec, f);
        if (m.ac === f && norm(m[f + 'Text']) === norm(typed)) return { click: { suggestion: code, field: f } };
        return { type: [{ field: f }, typed] };
      }
      if (m.date !== spec.date) {
        if (!m.calOpen) return { click: { field: 'date' } };
        const d = monthDiff(m.calView, monthOf(spec.date));
        if (d) return { click: { nav: d > 0 ? 'next' : 'prev' } };
        return { click: { day: spec.date } };
      }
      return { click: { button: 'search' } };
    },
    apply(m, spec, step) {
      const done = listStep(m, spec, step, (mm) => (mm.searched ? flightsFor(spec, mm.searched).length : 0));
      if (done) return done;
      if (step.type) {
        const [t, text] = step.type;
        m[t.field + 'Text'] = text;
        m[t.field] = exactAirport(text);
        m.ac = suggest(text).length ? t.field : null;
        m.calOpen = false;
        return m;
      }
      const t = step.click;
      if (!t) return m;
      if (t.suggestion !== undefined) {
        return { ...m, [t.field]: t.suggestion, [t.field + 'Text']: AIRPORT[t.suggestion].label, ac: null,
          invalid: m.invalid.filter((f) => f !== t.field) };
      }
      if (t.field === 'from' || t.field === 'to') return { ...m, calOpen: false, ac: m.ac === t.field ? m.ac : null };
      if (t.field === 'date') return { ...m, ac: null, calOpen: !m.calOpen, calView: m.date ? monthOf(m.date) : spec.start };
      if (t.nav) {
        const v = addMonths(m.calView, t.nav === 'next' ? 1 : -1);
        return monthDiff(spec.start, v) < 0 || monthDiff(v, spec.maxMonth) < 0 ? m : { ...m, calView: v };
      }
      if (t.day) return { ...m, date: t.day, calOpen: false, invalid: m.invalid.filter((f) => f !== 'date') };
      if (t.button === 'search') return flightSearch(m, spec);
      if (t.back) return { ...m, screen: 'form', loading: 0 };
      if (t.book !== undefined) {
        const booked = { real: isRealSearch(spec, m.searched), index: t.book };
        return { ...m, booked, wrongs: m.wrongs + (flightRight(spec, booked) ? 0 : 1) };
      }
      if (t.cancelBook) return { ...m, booked: null };
      if (t.sortBy && spec.sortable) return { ...m, sort: t.sortBy, scroll: 0 };
      return m;
    },
    instruction(spec, rng) {
      const from = typedFor(spec, 'from');
      const to = typedFor(spec, 'to');
      const crit = { cheapest: 'cheapest', shortest: 'shortest', earliest: 'earliest-departing', latest: 'latest-departing' }[spec.criterion];
      const crit2 = { cheapest: 'cheapest', shortest: 'quickest', earliest: 'earliest', latest: 'latest' }[spec.criterion];
      const date = fmtDate(spec.date, spec.dateFmt);
      return sayIt(spec, rng, FLIGHT, { from, to, crit, crit2, date }, { terse: `${from} → ${to}, ${date}, ${crit}`,
        steps: [`search one-way flights from ${from} to ${to} on ${date}`, `book the ${crit} one`] });
    },
    confirmVerb: 'book it',
    confirmAsk: 'book this flight',
    ambiguous(jr, spec) {
      const a = spec.target;
      const b = jr.pick(spec.flights.map((f, i) => i).filter((i) => i !== a));
      const A = spec.flights[a];
      const B = spec.flights[b];
      const key = { cheapest: 'price', shortest: 'dur', earliest: 'dep', latest: 'dep' }[spec.criterion];
      B[key] = A[key];
      const words = (f) => [f.no, f.no.split(' ')[1], ...(A.dep !== B.dep ? [fmtTime(f.dep), hhmm(f.dep)] : [])];
      const crit = { cheapest: 'cheapest', shortest: 'shortest', earliest: 'earliest', latest: 'latest' }[spec.criterion];
      const rest = spec.flights.filter((f, i) => i !== a && i !== b && f.no !== A.no && f.no !== B.no).map((f) => [f.no]);
      return { mode: 'ambiguous', cands: [words(A), words(B)], others: rest,
        message: `Two flights tie for the ${crit}: ${A.no} and ${B.no}. Which one should I book?` };
    },
    impossible(jr, spec) {
      // A date past the last month the site offers.
      const beyond = fromDays(days(`${addMonths(spec.maxMonth, 1)}-01`) + jr.int(2, 25));
      spec.date = beyond;
      const [, mm, dd] = beyond.split('-');
      return { mode: 'impossible', what: [...new Set([fmtDate(beyond, spec.dateFmt), fmtDate(beyond, 'long'), fmtDate(beyond, 'mdy'), fmtDate(beyond, 'us'),
        `${MONTHS[+mm - 1]} ${+dd}`, beyond])], message: `I can't do that: the site only offers dates up to ${monthName(spec.maxMonth)}, and ${fmtDate(beyond, 'long')} is later than that.` };
    },
    parts: (m) => [{ name: 'From field', aliases: ['Origin', 'Departure city'], value: m.from },
      { name: 'To field', aliases: ['Destination', 'Arrival city'], value: m.to },
      { name: 'Date', aliases: ['Depart date', 'Departure date'], value: m.date },
      { name: 'Flight search', value: m.searched }, { name: 'Booking', value: m.booked }],
    // selfTest: every other flight is a sorted one
    testTraits: (seed) => (seed % 2 === 0 ? { sort: true } : {}),
    checkSpec(spec, traits, tag, fails) {
      if (traits.sort) {
        const o = flightOrder(spec, { from: spec.origin, to: spec.dest, date: spec.date }, 'price');
        if (o.length !== spec.flights.length || o.some((i, j) => j && spec.flights[o[j - 1]].price > spec.flights[i].price)) fails.push(`${tag}: price order`);
      }
      for (const f of ['from', 'to']) {
        const code = f === 'from' ? spec.origin : spec.dest;
        if (!suggest(typedFor(spec, f)).includes(code)) fails.push(`${tag}: ${f} not among the suggestions`);
      }
    },
  });
})();
