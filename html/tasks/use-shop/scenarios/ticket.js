/*
 * use-shop / ticket: buy the ticket that satisfies the criterion (sort, scroll, confirm dialog).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-shop');
  const { C, days, fmtDate, fmtTime, fromDays, hhmm, levelOf, listStep, moneyFor, perUSD, reveal, sayIt } = fam.lib;

  const OPERATORS = {
    train: ['Nordrail', 'Coastline', 'Valley Line', 'Metro Intercity', 'Bluebird Rail', 'Northstar Rail',
      'Riverside Express', 'Alpine Link', 'Heartland Rail', 'Silver Arrow', 'Cedarway Line', 'Westmere Rail',
      'Pinecrest Way', 'Ashgrove Link', 'Goldleaf Transit', 'Evergreen Way', 'Morrow Line', 'Lantern Vale',
      'Fernway Express', 'Crestwood Way', 'Thornfield Rail', 'Clearwater Link', 'Windrow Line'],
    bus: ['Greyfox', 'Bluebird Bus', 'Megaway', 'Polar Coach', 'Route 9 Lines', 'Sunline', 'Citylink Coaches',
      'Redline Bus', 'Hopper Express', 'Lakeshore Coach', 'Willowway Bus', 'Foxglove Coach', 'Crosswind Bus',
      'Openroad Coach', 'Maplewood Coach', 'Fairview Line', 'Suncrest Bus', 'Pinegate Way', 'Brookside Coach',
      'Hillcrest Bus', 'Daybreak Line', 'Windmere Line', 'Oakpath Coach'],
  };
  const ARTISTS = ['The Velvet Owls', 'Marta Lind Quartet', 'Neon Harbor', 'Echo Parade', 'Silver Pines',
    'Juno & the Gales', 'Kite Season', 'Brass Atlas', 'Low Orbit', 'The Paper Lanterns', 'Saltwater Choir',
    'Amara Diallo Trio', 'Northern Static', 'The Lemon Grove', 'Copper Moth', 'Hollow Hills', 'Mira Okonkwo',
    'Glass Animals Club', 'The Midnight Ferry', 'Aster & Vale', 'Cloud Atlas Ensemble', 'Rosa Ventura',
    'The Quiet Engines', 'Tidal Bloom', 'The Amber Index', 'Orchard Signal', 'Calder & June', 'Velvet Meridian',
    'Fable District', 'Juniper Static', 'Sunday Cartography', 'Ivo Reyes', 'Mosslight Assembly', 'Ruby Weather',
    'The Blue Hourglass', 'Larkspur Motel', 'The Kindly Ghosts', 'Porcelain Current', 'Orla Venn', 'The Orchard Keys',
    'Winter Tapestry', 'June Harbor Band', 'Harborlight Choir', 'August Kestrel', 'Poppy Lantern Band',
    'Junebug Theory', 'Mina Valez', 'Nocturne Orchard', 'Cobalt Sunday', 'Lumen Postcards', 'Sora Bell',
    'Velour Radio', 'The Small Comets', 'Dahlia North', 'The River Almanac', 'Silver Thistle Duo', 'Feverfew Station',
    'Cleo March Band', 'The Distant Kites', 'Nell Arlow', 'Saffron Relay', 'Cinder & Current', 'Lio Maren Quartet',
    'Foxglove Circuit', 'Etta Rowan Band', 'Moonlit Foundry', 'Caro Venn Quartet', 'The Tin Skylarks',
    'Peregrine Bloom', 'Moss & Mercury', 'The Daybreak Index', 'Quiet Voltage', 'The Brass Meadow', 'Atlas in Bloom',
    'Nara Sol Quartet', 'Dovetail Parade', 'Sylvan Radio'];
  const TICKET_BRANDS = { train: ['RailHub', 'TrackNow', 'Railway Direct', 'Platformly'],
    bus: [
      'CoachPass', 'BusBuddy', 'RoadTrip', 'FareBus', 'Farewhiz'
    ], event: ['TicketHub', 'Gigly', 'StageDoor', 'Encore'] };
  const TICKET_LOCALES = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'nl-NL', 'es-ES', 'it-IT'];
  const LOCALE_CC = { 'en-US': 'US', 'en-GB': 'GB', 'de-DE': 'DE', 'fr-FR': 'FR', 'nl-NL': 'NL', 'es-ES': 'ES',
    'it-IT': 'IT' };

  const SORTS = [['recommended', 'Recommended'], ['price', 'Price: low to high'], ['price-desc', 'Price: high to low'],
    ['duration', 'Duration'], ['departure', 'Date and time']];
  const ticketWhen = (t) => days(t.date) * 1440 + t.time;
  const CRIT = {
    cheapest: (t) => t.price, priciest: (t) => -t.price, shortest: (t) => t.dur, longest: (t) => -t.dur,
    earliest: (t) => ticketWhen(t), latest: (t) => -ticketWhen(t),
  };
  const HELPFUL_SORT = { cheapest: 'price', priciest: 'price-desc', shortest: 'duration', longest: 'duration',
    earliest: 'departure', latest: 'departure' };
  const UNHELPFUL_SORT = { cheapest: 'price-desc', priciest: 'price', shortest: 'recommended', longest: 'recommended',
    earliest: 'price', latest: 'price-desc' };

  function eligible(spec) {
    return spec.tickets.map((t, i) => i).filter((i) => !spec.filter || spec.tickets[i][spec.filter.key] === spec.filter.value);
  }
  function ticketRankErr(spec, i) {
    const el = eligible(spec);
    if (!el.includes(i)) return 1;
    const k = CRIT[spec.criterion];
    const v = k(spec.tickets[i]);
    const better = el.filter((j) => k(spec.tickets[j]) < v).length;
    return el.length > 1 ? better / (el.length - 1) : 0;
  }
  function ticketOrder(spec, sort) {
    const idx = spec.tickets.map((t, i) => i);
    const T = spec.tickets;
    const by = {
      price: (a, b) => T[a].price - T[b].price || a - b,
      'price-desc': (a, b) => T[b].price - T[a].price || a - b,
      duration: (a, b) => T[a].dur - T[b].dur || a - b,
      departure: (a, b) => ticketWhen(T[a]) - ticketWhen(T[b]) || a - b,
    }[sort];
    return by ? idx.sort(by) : idx;
  }

  function sampleTicket(rng, opts) {
    const cs = { csplit: opts.csplit };
    const kind = rng.pick(['train', 'bus', 'event']);
    const lv = levelOf(opts);
    const today = fromDays(days('2026-01-05') + rng.int(0, 900));
    const locale = rng.pick(TICKET_LOCALES);
    const money = moneyFor(locale);
    const per = perUSD(money);
    const towns = C.CITIES.filter((c) => c.countryCode === LOCALE_CC[locale]).map((c) => c.local || c.city);
    const venues = C.VENUES;
    for (;;) {
      const n = lv === 'easy' ? rng.int(4, 5) : lv === 'medium' ? rng.int(5, 7) : opts.ood ? rng.int(14, 22) : rng.int(6, 12);
      const rows = rng.int(4, 6);
      const dates = rng.sample([...Array(14).keys()], rng.int(3, 4)).sort((a, b) => a - b).map((d) => fromDays(days(today) + 1 + d));
      let route = null;
      let names;
      let places;
      if (kind === 'event') {
        names = C.sample(rng, ARTISTS, rng.int(2, 3), cs);
        places = C.sample(rng, venues, rng.int(2, 3), cs);
      } else {
        names = rng.sample(OPERATORS[kind], rng.int(2, 3));
        const pool = C.split(towns, opts.csplit);
        const [a, b] = rng.sample(pool.length >= 2 ? pool : towns, 2);
        route = `${a} → ${b}`;
        places = [route];
      }
      if (names.length < 2) continue;
      const unit = (lo, hi) => Math.max(1, Math.round(rng.int(lo, hi) * per)) * 100;
      const tickets = [];
      for (let i = 0; i < n; i++) {
        const name = rng.pick(names);
        const date = rng.pick(dates);
        if (kind === 'event') {
          tickets.push({ name, place: rng.pick(places), code: `Sec ${rng.pick(['A', 'B', 'C', 'Floor', 'Balcony'])}`,
            date, time: 17 * 60 + 15 * rng.int(4, 18), dur: 5 * rng.int(15, 40), price: unit(25, 220) });
        } else {
          tickets.push({ name, place: route, code: `${kind === 'train' ? 'Train' : 'Bus'} ${rng.int(100, 989)}`,
            date, time: 5 * rng.int(60, 270), dur: 5 * rng.int(kind === 'train' ? 9 : 14, kind === 'train' ? 96 : 120),
            price: kind === 'train' ? unit(19, 189) : unit(9, 99) });
        }
      }
      const criterion = lv === 'easy' ? rng.pick(['cheapest', 'priciest']) : rng.pick(Object.keys(CRIT));
      let filter = null;
      if (!lv && rng.bool(0.4)) {
        const keys = kind === 'event' ? ['name', 'place', 'date'] : ['name', 'date'];
        const key = rng.pick(keys);
        filter = { key, value: rng.pick(tickets)[key] };
      }
      const spec = { kind, brand: rng.pick(TICKET_BRANDS[kind]), route, today, rows, tickets, criterion, filter,
        confirm: lv === 'easy' ? false : rng.bool(0.5), money };
      const el = eligible(spec);
      if (el.length < 2 || (filter && el.length === n)) continue;
      const k = CRIT[criterion];
      const vals = el.map((i) => k(tickets[i])).sort((a, b) => a - b);
      if (vals[0] === vals[1]) continue;
      spec.target = el.find((i) => k(tickets[i]) === vals[0]);
      spec.route = rng.bool(0.5) ? 'wheel' : 'thumb';
      return spec;
    }
  }

  const TICKET = [
    'Buy the ticket with the {noun}.',
    'Find and buy the ticket with the {noun}.',
    'Purchase whichever ticket has the {noun}.',
    'Get me the {adj} ticket on this page.',
    'Which ticket is the {adj}? Buy that one.',
    'Look through all the listings and buy the {adj} {thing}.',
    'The {adj} {thing} is the one to buy. Go ahead and purchase it.',
    'Use the {noun} to pick which ticket to buy.',
    'The ticket I want to buy has the {noun}.',
    'My choice is the {adj} ticket. Please buy it.',
    'Arrange the purchase of the {adj} ticket.',
    'The ticket to purchase? The one with the {noun}.',
  ];
  const TICKET_F = [
    'Among the tickets {where}, buy the one with the {noun}.',
    'Buy the {adj} ticket {where}.',
    'Only consider tickets {where} and purchase the {adj} one.',
    'Of the {things} {where}, buy the one with the {noun}.',
    'Find the tickets {where} and buy whichever has the {noun}.',
    'Get a ticket {where}: the {adj} option.',
    'I want a ticket {where}: whichever has the {noun}.',
    'Buy a ticket {where}, choosing by the {noun}.',
    'Make my purchase the {adj} ticket {where}.',
    'I would like the {adj} option for a ticket {where}.',
    'For tickets {where}, the {noun} decides which to buy.',
    'Buy one of the tickets {where}. It must be the {adj}.',
    'The {noun} is my priority for a ticket {where}. Buy it.',
    'Tickets {where} only: buy whichever has the {noun}.',
    'Rank tickets {where} by {noun} and buy the best.',
    'Base my purchase of a ticket {where} on the {noun}.',
    'A ticket {where} with the {noun}, please.',
    'Compare {things} {where} for the {noun}, then buy.',
    'My purchase request: the {adj} ticket {where}.',
    'Use the {noun} to choose a ticket {where} to buy.',
    'Buy whichever of the {things} {where} has the {noun}.',
    'I ask you to buy whichever ticket {where} is {adj}.',
  ];

  // The widget API (fam.helpers).
  Object.assign(fam.helpers, { ticketOrder, SORTS });

  env.scenario('use-shop', {
    name: 'ticket',
    sample: sampleTicket,
    sigma: 0.5,
    init(spec, r) {
      const mode = spec.startMode;
      const m = { sort: 'recommended', scroll: 0, pending: null, bought: null, wrongs: 0 };
      const others = eligible(spec).filter((i) => i !== spec.target);
      if (mode === 'partial') {
        if (spec.confirm && r.bool(0.5)) m.pending = spec.target;
        else m.sort = HELPFUL_SORT[spec.criterion];
      } else if (mode === 'wrong') {
        const k = r.pick([spec.confirm ? 'pending' : 'sort', 'sort', spec.recoverable ? 'bought' : 'sort', spec.recoverable ? 'bought' : 'pending']);
        if (k === 'pending' && spec.confirm) m.pending = r.pick(others);
        else if (k === 'bought') Object.assign(m, { bought: r.pick(others), wrongs: 1 });
        else {
          m.sort = UNHELPFUL_SORT[spec.criterion];
          m.scroll = Math.max(0, spec.tickets.length - spec.rows);
        }
      }
      return m;
    },
    error(m, spec) {
      if (m.bought !== null) return ticketRankErr(spec, m.bought);
      if (m.pending !== null) return 0.5 + 0.5 * ticketRankErr(spec, m.pending);
      return 1;
    },
    purchased: (m) => m.bought !== null,
    prepared(m, spec) {
      if (m.bought !== null) return ticketRankErr(spec, m.bought);
      return m.pending !== null ? ticketRankErr(spec, m.pending) : 1;
    },
    ended: (m, spec, last) => (m.bought !== null && m.bought !== spec.target && last ? 'wrong-choice' : null),
    plan(m, spec) {
      if (m.bought !== null) return { click: { cancelBuy: true } };
      if (m.pending !== null) return { click: { confirm: m.pending === spec.target ? 'ok' : 'cancel' } };
      const pos = ticketOrder(spec, m.sort).indexOf(spec.target);
      return reveal(m, spec, pos, spec.tickets.length, spec.rows) || { click: { buy: spec.target } };
    },
    apply(m, spec, step) {
      const done = listStep(m, spec, step, () => spec.tickets.length);
      if (done) return done;
      if (step.type) return m;
      const t = step.click;
      if (!t) return m;
      const buy = (i) => ({ ...m, bought: i, pending: null, wrongs: m.wrongs + (i === spec.target ? 0 : 1) });
      if (t.buy !== undefined) return spec.confirm ? { ...m, pending: t.buy } : buy(t.buy);
      if (t.confirm) return t.confirm === 'ok' ? buy(m.pending) : { ...m, pending: null };
      if (t.cancelBuy) return { ...m, bought: null };
      if (t.sortBy) return { ...m, sort: t.sortBy, scroll: 0 };
      return m;
    },
    instruction(spec, rng) {
      const ev = spec.kind === 'event';
      const noun = { cheapest: 'lowest price', priciest: 'highest price', shortest: 'shortest duration',
        longest: 'longest duration', earliest: ev ? 'earliest start' : 'earliest departure',
        latest: ev ? 'latest start' : 'latest departure' }[spec.criterion];
      const adj = { cheapest: 'cheapest', priciest: 'most expensive', shortest: 'shortest', longest: 'longest',
        earliest: 'earliest', latest: 'latest' }[spec.criterion];
      const thing = ev ? 'show' : 'departure';
      if (!spec.filter) return sayIt(spec, rng, TICKET, { noun, adj, thing }, { terse: `${adj} ticket` });
      const f = spec.filter;
      const where = f.key === 'date' ? `on ${fmtDate(f.value, rng.pick(['short', 'dm', 'mdy']))}` : f.key === 'place' ? `at ${f.value}`
        : ev ? `for ${f.value}` : `operated by ${f.value}`;
      return sayIt(spec, rng, TICKET_F, { noun, adj, where, things: `${thing}s` }, { terse: `${adj} ticket ${where}` });
    },
    confirmVerb: 'pay',
    confirmAsk: 'pay for the ticket',
    prepareConfirm(spec) {
      spec.confirm = true; // the dialog's Pay is the irreversible press
    },
    ambiguous(jr, spec) {
      const a = spec.target;
      const el = eligible(spec).filter((i) => i !== a);
      const b = jr.pick(el);
      const A = spec.tickets[a];
      const B = spec.tickets[b];
      const key = { cheapest: 'price', priciest: 'price', shortest: 'dur', longest: 'dur', earliest: 'time', latest: 'time' }[spec.criterion];
      B[key] = A[key];
      if (spec.criterion === 'earliest' || spec.criterion === 'latest') B.date = A.date;
      if (spec.kind === 'event') while (B.code === A.code) B.code = `Sec ${jr.pick(['A', 'B', 'C', 'Floor', 'Balcony'])}`;
      else while (B.code === A.code) B.code = `${A.code.split(' ')[0]} ${jr.int(100, 989)}`;
      const num = (t) => (spec.kind === 'event' ? [] : [t.code.split(' ')[1]]);
      const words = (t) => [t.code, ...num(t), ...(A.time !== B.time ? [fmtTime(t.time), hhmm(t.time)] : [])];
      const adj = { cheapest: 'cheapest', priciest: 'most expensive', shortest: 'shortest', longest: 'longest', earliest: 'earliest', latest: 'latest' }[spec.criterion];
      const desc = (t) => `${t.code}${A.time !== B.time ? ` at ${fmtTime(t.time)}` : ''}`;
      const rest = spec.tickets.filter((t, i) => i !== a && i !== b && t.code !== A.code && t.code !== B.code).map((t) => [t.code]);
      return { mode: 'ambiguous', cands: [words(A), words(B)], others: rest,
        message: `Two tickets tie for the ${adj}: ${desc(A)} and ${desc(B)}. Which one should I buy?` };
    },
    impossible(jr, spec) {
      const ev = spec.kind === 'event';
      const have = new Set(spec.tickets.map((t) => t.name));
      const name = jr.pick((ev ? ARTISTS : OPERATORS[spec.kind]).filter((n) => !have.has(n)));
      const adj = jr.pick(['cheapest', 'shortest', 'earliest']);
      const noun = { cheapest: 'lowest price', shortest: 'shortest duration', earliest: ev ? 'earliest start' : 'earliest departure' }[adj];
      const where = ev ? `for ${name}` : `operated by ${name}`;
      return { mode: 'impossible', what: [name], message: `I can't do that: there are no tickets ${where} on this page.`,
        templates: TICKET_F, vars: { noun, adj, where, things: ev ? 'shows' : 'departures' }, terse: `${adj} ticket ${where}` };
    },
    parts: (m) => [{ name: 'Sort by', value: m.sort }, { name: 'Ticket purchase', value: [m.bought, m.pending] }],
    check() {
      const fails = [];
      const tk = { tickets: [{ price: 5 }, { price: 9 }, { price: 7 }], criterion: 'cheapest', filter: null };
      if (ticketRankErr(tk, 0) !== 0 || ticketRankErr(tk, 1) !== 1 || ticketRankErr(tk, 2) !== 0.5) fails.push('ticket: rank error');
      return fails;
    },
  });
})();
