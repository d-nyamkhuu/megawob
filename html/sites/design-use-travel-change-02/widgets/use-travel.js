// Portal defaults cover both date and seat changes.
env.widget({
  task: 'use-travel',
  site: 'design-use-travel-change-02',
  name: 'design',
  split: 'train',
  scenarios: ['change'],
  template: 'use-travel/portal',
  design: {
    parts: {
      manage: (base, S) => (main, m) => {
        const P = S.P, s = S.spec, d = S.details;
        const date = value => { const m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m[2])-1]} ${m[1]}` : String(value || ''); };
        const title = P.el('div', 'legacy-booking-title', main);
        P.el('strong', '', title, `Booking  ${s.reference}`);
        P.el('span', '', title, 'Status:  Ticketed');
        const tabs = P.el('div', 'legacy-tabs', main);
        for (const label of ['Itinerary', 'Passenger Details', 'Seats & Services', 'Payment', 'Documents', 'History']) {
          P.el('span', label === 'Itinerary' ? 'active' : '', tabs, label);
        }
        const pane = P.newPane(main);
        const summary = P.el('section', 'legacy-panel legacy-summary', pane);
        P.el('h3', '', summary, 'Booking Summary');
        const facts = P.el('div', 'legacy-summary-body', summary);
        const left = P.el('div', 'legacy-facts', facts);
        const row = (label, value, strong) => {
          const line = P.el('div', 'legacy-fact', left);
          P.el('span', '', line, `${label}:`);
          P.el(strong ? 'strong' : 'span', '', line, value);
        };
        row('Booking Reference', s.reference, true);
        row('Passenger', s.passenger, true);
        row('Departure Date', date(m.date), true);
        const seat = P.el('div', 'legacy-seatline', left);
        P.el('span', '', seat, 'Seat:'); P.el('strong', '', seat, m.seat || s.original.seat);
        P.button(seat, 'Change Seat...', {control: 'edit'}, 'legacy-edit', true);
        const flight = P.el('div', 'legacy-flight', facts);
        P.el('strong', 'legacy-route', flight, `${s.origin.iata}   →   ${s.dest.iata}`);
        P.el('div', '', flight, `${s.origin.city} (${s.origin.iata}) to ${s.dest.city} (${s.dest.iata})`);
        P.el('div', '', flight, `${d.flight.no}  ·  ${d.flight.airline}`);
        P.el('div', '', flight, date(m.date));
        P.el('div', 'legacy-times', flight, 'Depart 10:20   Arrive 13:05');
        const carrier = P.el('div', 'legacy-carrier', facts);
        P.el('div', 'legacy-carrier-mark', carrier);
        P.el('strong', '', carrier, d.flight.airline);
        const itinerary = P.el('section', 'legacy-panel legacy-itinerary', pane);
        P.el('h3', '', itinerary, 'Flight Itinerary');
        const table = P.el('div', 'legacy-table', itinerary);
        const headers = ['Date', 'From', 'To', 'Flight', 'Class', 'Seat', 'Status'];
        const values = [date(m.date), `${s.origin.city} (${s.origin.iata})`, `${s.dest.city} (${s.dest.iata})`, d.flight.no, 'Economy (Y)', m.seat || s.original.seat, 'Ticketed'];
        const head = P.el('div', 'legacy-tr head', table), data = P.el('div', 'legacy-tr data', table);
        headers.forEach(x => P.el('span', '', head, x)); values.forEach(x => P.el('span', '', data, x));
        const bottom = P.el('div', 'legacy-bottom', pane);
        const seatPanel = P.el('section', 'legacy-panel legacy-seatpanel', bottom);
        P.el('h3', '', seatPanel, 'Seat Information');
        const seatDetails = P.el('div', 'legacy-detail-list', seatPanel);
        for (const [label, value] of [['Current Seat', m.seat || s.original.seat], ['Cabin', 'Economy'], ['Seat Type', 'Standard'], ['Amenities', 'None']]) {
          const r = P.el('div', '', seatDetails); P.el('span', '', r, `${label}:`); P.el('strong', '', r, value);
        }
        const service = P.el('section', 'legacy-panel legacy-services', bottom);
        P.el('h3', '', service, 'Other Services');
        for (const [icon, label, value] of [['♜', 'Meals', 'Standard meal'], ['▣', 'Baggage Allowance', '1 piece (23 kg)'], ['◉', 'In-flight Services', 'Wi-Fi (fee applies)']]) {
          const r = P.el('div', 'legacy-service', service); P.el('b', '', r, icon); const txt = P.el('div', '', r); P.el('strong', '', txt, label); P.el('span', '', txt, value);
        }
      }
    }
  },
});
