env.widget({
  task: 'use-travel',
  site: 'design-use-travel-daterange-03',
  name: 'design',
  split: 'train',
  scenarios: ['daterange'],
  template: 'use-travel/portal',
  design: {
    parts: {
      calendar: (base, S) => (main, m) => {
        const P = S.P, F = S.ctx && env.taskDef, s = S.spec;
        const pane = P.newPane(main);
        const shell = P.el('section', 'tj-search-card', pane);
        const title = P.el('div', 'tj-form-title', shell);
        P.svg(title, 'hotel'); P.el('h1', '', title, 'Book a Hotel Stay');
        const columns = P.el('div', 'tj-form-columns', shell);
        const left = P.el('div', 'tj-form-left', columns), right = P.el('div', 'tj-form-right', columns);
        P.el('label', 'tj-field-label', left, 'Destination');
        const dest = P.el('div', 'tj-static-field', left); P.svg(dest, 'pin'); P.el('span', '', dest, `${s.dest.city}, ${s.dest.country || 'Malaysia'}`);
        P.el('label', 'tj-field-label', left, 'Traveler');
        const traveler = P.el('div', 'tj-static-field', left); P.svg(traveler, 'user'); P.el('span', '', traveler, s.passenger);
        P.el('label', 'tj-field-label', left, 'Guests');
        const guests = P.el('div', 'tj-static-field', left); P.el('span', '', guests, '1 adult'); P.svg(guests, 'down');
        P.el('h3', 'tj-date-heading', right, 'Stay Dates');
        const dateFields = P.el('div', 'tj-date-fields', right);
        const start = P.button(dateFields, '', {control: 'calendar'}, 'tj-date-button');
        P.el('small', '', start, 'Check-in'); P.el('span', '', start, m.start ? env.taskDef.helpers.fmtDate(m.start) : 'Select date'); P.svg(start, 'calendar');
        const end = P.button(dateFields, '', {control: 'calendar'}, 'tj-date-button');
        P.el('small', '', end, 'Check-out'); P.el('span', '', end, m.end ? env.taskDef.helpers.fmtDate(m.end) : 'Select date'); P.svg(end, 'calendar');
        P.button(right, '⌕　Search Hotels', {control:'calendar'}, 'tj-search-button', true);
        const quick = P.el('div', 'tj-quick-dates', right);
        for (const t of ['1 night','2 nights','3 nights','1 week']) P.el('span', '', quick, t);
        const results = P.el('div', 'tj-results', pane);
        const filters = P.el('div', 'tj-filter-row', results);
        for (const t of ['All Filters','Price','Guest Rating','Property Type','Amenities','Neighborhood']) P.el('span', '', filters, t);
        const firstHotels = (s.hotels || []).slice(0, 2);
        for (const h of firstHotels) {
          const row = P.el('article', 'tj-hotel-row', results);
          P.hotelArt(row, h.name);
          const info = P.el('div', 'tj-hotel-info', row);
          P.el('strong', '', info, h.name); P.el('span', 'tj-stars', info, '★★★★★');
          P.el('span', 'tj-rating', info, `${h.rating.toFixed(1)}　 Excellent (${h.reviews.toLocaleString()} reviews)`);
          P.el('span', 'tj-area', info, `⌖　${h.area}`);
          P.el('span', 'tj-amenities', info, '⌁　Free Wi-Fi　　 ♨　Restaurant　　 ◉　Fitness centre　　 Pool');
        }
        if (m.open) {
          const popup = P.el('div', 'tj-calendar-popup', shell);
          const bar = P.el('div', 'at-calbar', popup);
          const prev = P.button(bar, '', {nav:-1}, '', true); P.svg(prev,'chevron').style.transform='rotate(180deg)';
          P.el('span', 'at-muted', bar, m.start && !m.end ? 'Select check-out' : 'Select check-in');
          const next = P.button(bar, '', {nav:1}, '', true); P.svg(next,'chevron');
          const months = P.el('div', 'at-months', popup);
          P.month(months, m.view, m); P.month(months, F.helpers.addMonth(m.view, 1), m);
          P.line(popup, 'info', 'Check-in from 15:00 · Check-out by 11:00', 'at-calnote');
        }
      },
      sidepanel: (base, S) => (m) => {
        const P = S.P, s = S.spec, ctx = S.ctx;
        const side = P.el('aside', 'at-sidepanel tj-feature', S.content);
        P.hotelArt(side, (S.details || {}).property || s.dest.city);
        P.el('h2', '', side, s.dest.city);
        P.el('div', 'tj-country', side, s.dest.country || 'Malaysia');
        P.el('p', '', side, 'A vibrant city of modern skylines, rich culture and world-class dining. From the iconic towers to bustling markets and serene temples, this city offers something for every traveler.');
        P.el('div', 'at-rule', side);
        P.el('h3', '', side, '⌖　Popular Areas');
        for (const [name, note] of [['City Centre','Shopping, dining, attractions'],['Bukit Bintang','Nightlife, shopping, entertainment'],['Chinatown','Culture, food, markets'],['Brickfields','Temples, culture, local food']]) {
          const area = P.el('div', 'tj-area-row', side), thumb = P.el('span', 'tj-area-thumb', area); thumb.setAttribute('aria-hidden','true');
          P.el('strong', '', area, name); P.el('small', '', area, note);
        }
      },
    },
  },
});
