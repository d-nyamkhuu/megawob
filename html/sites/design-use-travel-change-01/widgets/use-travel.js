// Portal defaults cover both date and seat changes.
env.widget({
  task: 'use-travel',
  site: 'design-use-travel-change-01',
  name: 'design',
  split: 'train',
  scenarios: ['change'],
  template: 'use-travel/portal',
  design: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    accent: '#003f91', panel: '#d5d3cc', foreground: '#101010',
    muted: '#42433f', line: '#80807b', summaryWidth: 0,
    parts: {
      frame: (base, S) => (ctx) => {
        const P = S.P;
        S.app = P.app(ctx);
        S.progress = P.el('div', 'at-progress', S.app);
        S.content = P.el('div', 'at-content', S.app);
        S.footer = P.el('footer', 'at-footer', S.app);
      },
      progress: (base, S) => (m) => {
        S.app.classList.toggle('mx-managing', m.page === 'manage');
      },
      worknav: () => () => {},
      passengerRail: () => () => {},
      manage: (base, S) => (main, m) => {
        const P = S.P, s = S.spec, F = env.taskDef;
        const date = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][env.content.dayOfWeek(m.date)]}, ${F.helpers.fmtDate(m.date)}`;
        P.el('h2', 'mx-heading', main, 'Manage Booking');
        const pane = P.newPane(main);
        const form = P.el('div', 'mx-booking-form', pane);
        const identity = P.el('div', 'mx-identity', form);
        for (const [label, value] of [['Booking Reference', s.reference], ['Passenger', s.passenger]]) {
          P.el('div', 'mx-label', identity, label);
          P.el('div', 'mx-value mx-input-value', identity, value);
        }
        const schedule = P.el('div', 'mx-schedule', form);
        const seatType = /[AF]$/.test(m.seat) ? 'Window' : /[CD]$/.test(m.seat) ? 'Aisle' : 'Middle';
        for (const [label, value] of [['Departure Date', date], ['Seat', `${m.seat} (${seatType})`]]) {
          P.el('div', 'mx-label', schedule, label);
          P.el('div', 'mx-value', schedule, value);
        }
        P.el('span', '', schedule);
        P.button(schedule, 'Edit Booking', {control:'edit'}, 'mx-edit', true);
        const flight = P.el('div', 'mx-flights', pane);
        P.el('h3', 'mx-flight-title', flight, 'Flight Details');
        const table = P.el('table', 'mx-flight-table', flight);
        const head = P.el('tr', '', P.el('thead', '', table));
        for (const label of ['Date','From','To','Flight','Class','Seat','Status']) P.el('th', '', head, label);
        const row = P.el('tr', 'mx-selected', P.el('tbody', '', table));
        for (const value of [date, `${s.origin.iata} – ${s.origin.city}`, `${s.dest.iata} – ${s.dest.city}`, S.details.flight.no, 'Economy', m.seat, 'Confirmed']) P.el('td', '', row, value);
      },
      sidepanel: (base, S) => (m) => {
        const P = S.P, s = S.spec, d = S.details, F = env.taskDef;
        const side = P.el('div', 'mx-inspector', S.content);
        side.setAttribute('role', 'complementary');
        side.setAttribute('aria-label', 'Passenger & Booking Details');
        const note = S.app.motifTaskNote || document.querySelector('.ref-panel');
        if (note) {
          S.app.motifTaskNote = note;
          side.append(note);
        }
        P.el('h2', 'mx-heading', side, 'Passenger & Booking Details');
        const section = (title, cls) => {
          const box = P.el('div', `mx-inspector-section ${cls}`, side);
          P.el('h3', 'mx-section-title', box, title);
          return box;
        };
        const facts = (box, rows) => {
          const list = P.el('dl', 'mx-facts', box);
          for (const [label, value] of rows) {
            P.el('dt', '', list, label); P.el('dd', '', list, value);
          }
        };
        const passenger = section('Passenger', 'mx-passenger');
        facts(passenger, [['Name', s.passenger], ['Date of Birth', 'Mar 14, 1985'],
          ['Frequent Flyer', `${d.flight.no.split(' ')[0]} ${d.member}${d.card}1`],
          ['Document', `Passport  XH${d.card}10`], ['Contact', d.email], ['', '+33 6 12 34 56 78']]);
        const booking = section('Booking Summary', 'mx-booking');
        facts(booking, [['Reference', s.reference], ['Status', 'Confirmed'], ['Booked On', 'Jan 12, 1991'], ['Last Modified', 'Jan 12, 1991']]);
        const itinerary = section('Itinerary', 'mx-itinerary');
        const viewport = P.el('div', 'mx-itinerary-viewport', itinerary);
        const table = P.el('table', 'mx-itinerary-table', viewport);
        const head = P.el('tr', '', P.el('thead', '', table));
        for (const label of ['Date','From','To','Flight']) P.el('th', '', head, label);
        const row = P.el('tr', 'mx-selected', P.el('tbody', '', table));
        const date = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][env.content.dayOfWeek(m.date)]}, ${F.helpers.fmtDate(m.date)}`;
        for (const value of [date, s.origin.iata, s.dest.iata, d.flight.no]) P.el('td', '', row, value);
        const scroll = P.el('div', 'mx-scrollbar', viewport);
        P.el('span', 'mx-scroll-up', scroll, '▲');
        P.el('span', 'mx-scroll-thumb', scroll);
        P.el('span', 'mx-scroll-track', scroll);
        P.el('span', 'mx-scroll-down', scroll, '▼');
      },
      footer: (base, S) => (m) => {
        if (m.page !== 'manage') base(m);
      },
    },
  },
});
