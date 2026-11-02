env.widget({
  task: 'use-travel',
  site: 'design-use-travel-seat-04',
  name: 'design',
  split: 'train',
  scenarios: ['seat'],
  template: 'use-travel/portal',
  design: {
    parts: {
      passengerRail: (base, S) => (m) => {
        const P = S.P;
        const legend = P.el('aside', 'at-rail seat-info irix-seat-legend', S.content);
        P.el('h3', '', legend, 'Seat Map Legend');
        for (const [cls, label] of [['', 'Available seat'], ['occ', 'Occupied seat'], ['sel', 'Selected seat'], ['exit', 'Exit row (no selection)'], ['aisle', 'Aisle'], ['facility', 'Lavatory / galley'], ['unavailable', 'Unavailable']]) {
          const row = P.el('div', 'irix-legend-row', legend);
          P.el('i', `irix-swatch ${cls}`, row);
          P.el('span', '', row, label);
        }
      },
      seatRow: (base, S) => (cabin, row, m) => {
        base(cabin, row, m);
        const label = cabin.lastElementChild.querySelector('.at-rownum');
        if (label) label.dataset.row = String(row);
      },
      seats: (base, S) => (main, m) => {
        const P = S.P, s = S.spec, details = S.details;
        const info = P.el('div', 'at-seat-infohead irix-flight-strip', main);
        P.el('strong', '', info, 'Flight');
        P.el('span', '', info, details.flight.no);
        P.el('span', '', info, `${s.origin.city} (${s.origin.iata})`);
        P.el('b', '', info, '→');
        P.el('span', '', info, `${s.dest.city} (${s.dest.iata})`);
        P.el('span', 'irix-flight-date', info, s.original.date);
        const passenger = P.el('div', 'irix-passenger-strip', main);
        P.el('strong', '', passenger, 'Passenger');
        const who = P.el('div', 'irix-passenger-name', passenger);
        P.el('span', '', who, s.passenger);
        const selector = P.el('span', 'irix-select-arrow', who, '▾');
        selector.setAttribute('aria-hidden', 'true');
        if (s.goal.near) P.el('span', 'irix-companion', passenger, `Companion: ${s.goal.near}`);
        P.el('span', 'irix-cabin', passenger, 'Cabin: Economy');

        const pane = P.newPane(main);
        pane.classList.add('irix-seat-pane', 'irix-aircraft');
        Object.assign(pane.style, { display: 'block', overflow: 'auto', padding: '0', minHeight: '120px' });
        const cabin = P.el('div', 'at-seat-wrap irix-seat-wrap', pane);
        Object.assign(cabin.style, { width: '76%', maxWidth: 'none', height: 'max-content', minHeight: '100%', maxHeight: 'none', overflow: 'visible', margin: '0 auto', padding: '8px 18px', borderRadius: '0', background: 'transparent' });
        P.el('div', 'at-cockpit', cabin, 'FRONT OF AIRCRAFT');
        const head = P.el('div', 'at-seat-head', cabin);
        for (const label of ['A', 'B', 'C', '', 'D', 'E', 'F']) P.el('span', '', head, label);
        for (const row of [...new Set(s.seats.map(x => x.row))]) P.seatRow(cabin, row, m);
        P.el('div', 'irix-map-tail', cabin, 'REAR GALLEY  ·  LAVATORY');

        const selection = P.el('section', 'irix-selection', main);
        P.el('h3', '', selection, 'Selection Information');
        const fields = P.el('div', 'irix-selection-fields', selection);
        const selected = s.seats.find(x => x.id === m.seat);
        for (const [label, value] of [['Passenger', s.passenger], ['Seat', m.seat || '—'], ['Row', selected ? String(selected.row) : '—'], ['Seat Type', selected ? selected.kind : '—'], ['Status', m.seat ? 'Seat selected' : 'No seat selected']]) {
          const field = P.el('div', '', fields);
          P.el('span', '', field, label);
          P.el('strong', '', field, value);
        }

        const related = P.el('section', 'irix-related', main);
        P.el('h3', '', related, 'Related Passengers and Segments');
        const table = P.el('div', 'irix-table-scroll', related);
        const grid = P.el('table', '', table);
        const thead = P.el('thead', '', grid), hr = P.el('tr', '', thead);
        for (const label of ['Name', 'Segment', 'Date', 'From', 'To', 'Seat', 'Status']) P.el('th', '', hr, label);
        const tbody = P.el('tbody', '', grid);
        const row = (name, seat, status) => {
          const tr = P.el('tr', '', tbody);
          for (const value of [name, details.flight.no, S.spec.original.date, `${s.origin.city} (${s.origin.iata})`, `${s.dest.city} (${s.dest.iata})`, seat || '—', status]) P.el('td', '', tr, value);
        };
        row(s.passenger, m.seat, m.seat ? 'Seat assigned' : 'No seat selected');
        if (s.goal.near) row('Travel companion', s.goal.near, 'Seat assigned');
      },
    },
  },
});
