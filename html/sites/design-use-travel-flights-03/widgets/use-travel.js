env.widget({
  task: 'use-travel',
  site: 'design-use-travel-flights-03',
  name: 'design',
  split: 'train',
  scenarios: ['flights'],
  template: 'use-travel/portal',
  design: {
    brand: 'Aurora Travel',
    appLabel: 'Aurora Travel flight search',
    accent: '#2c83e8', panel: '#ffffff', foreground: '#11182d', muted: '#566175', line: '#dae2ec',
    inset: '0', fontFamily: 'Arial, sans-serif',
    parts: {
      frame: (base, S) => (ctx) => {
        const P = S.P;
        S.app = P.app(ctx);
        S.app.classList.add('aurora-app');
        P.route(S.app);
        S.progress = P.el('div', 'at-progress', S.app);
        S.content = P.el('div', 'at-content', S.app);
        S.footer = P.el('footer', 'at-footer', S.app);
      },
      worknav: () => () => {},
      progress: () => () => {},
      route: (base, S) => (app) => {
        const P = S.P, s = S.spec, F = env.taskDef;
        const route = P.el('div', 'aurora-route', app);
        for (const [label, value, icon] of [
          ['From', `${s.origin.city} (${s.origin.iata})`, 'pin'],
          ['To', `${s.dest.city} (${s.dest.iata})`, 'pin'],
          ['Departure date', F.helpers.fmtDate(s.calendar.base), 'calendar'],
          ['Passengers', '1 Adult', 'user'],
        ]) {
          const field = P.plainButton(route, '', null, () => P.panel('Trip details'), 'aurora-route-field');
          P.svg(field, icon);
          const copy = P.el('div', '', field);
          P.el('small', '', copy, label); P.el('span', '', copy, value);
          P.svg(field, label === 'Passengers' ? 'down' : 'close');
        }
      },
      resultToolbar: (base, S) => (main, m, rows) => {
        const P = S.P, s = S.spec;
        P.el('h2', 'aurora-heading', main, `Flights from ${s.origin.city} to ${s.dest.city}`);
        const tool = P.el('div', 'at-toolbar', main);
        P.el('span', '', tool, `Showing ${rows.length} of ${s.flights.length} flights`);
        P.dropdown(tool, 'Sort by', 'sort', [['recommended', 'Recommended'], ['price', 'Lowest price'], ['departure', 'Departure time']], m.sort);
      },
      filterChips: (base, S) => (main, m) => {
        if (m.filters.nonstop || m.filters.alliance || m.filters.before < 1440 || m.filters.min > 0 || m.filters.max < S.spec.maxPrice) base(main, m);
      },
      resultCard: (base, S) => (p, x, m) => {
        const P = S.P, F = env.taskDef, s = S.spec;
        const card = P.el('article', `aurora-fare${m.selected === x.id ? ' chosen' : ''}`, p);
        const carrier = P.el('div', 'aurora-carrier', card);
        const brandIndex = [...new Set(s.flights.map(row => row.airline))].indexOf(x.airline);
        P.el('span', `aurora-airline-logo aurora-mark-${brandIndex % 4}`, carrier, '');
        const copy = P.el('div', '', carrier);
        P.el('strong', '', copy, x.airline); P.el('small', '', copy, x.no);
        const time = (value, code) => {
          const cell = P.el('div', 'aurora-time', card);
          P.el('strong', '', cell, value); P.el('small', '', cell, code);
        };
        time(F.helpers.time(x.dep), s.origin.iata);
        const line = P.el('div', 'aurora-flightline', card); P.el('span', '', line, '✈');
        time(F.helpers.time((x.dep + x.duration) % 1440), s.dest.iata);
        const duration = P.el('div', 'aurora-duration', card);
        P.el('span', '', duration, `${Math.floor(x.duration / 60)}h ${x.duration % 60}m`);
        P.el('span', '', duration, x.stops ? '1 stop' : 'Nonstop');
        P.el('strong', 'aurora-price', card, F.helpers.money(x.price).replace(/\.00$/, ''));
        P.button(card, m.selected === x.id ? 'Selected' : 'Book', {select: x.id}, 'aurora-book', true);
        P.cardBuilt(card, x, m);
      },
      resultFilters: (base, S) => (rail, m) => {
        const P = S.P, s = S.spec, F = env.taskDef;
        const head = P.el('div', 'aurora-filter-head', rail);
        P.el('strong', '', head, 'Filters');
        P.plainButton(head, 'Clear all', null, () => P.resetFilters(), 'aurora-clear');
        const group = (title) => {
          const g = P.el('section', 'aurora-filter-group', rail);
          const heading = P.el('h3', '', g, title); P.svg(heading, 'info'); return g;
        };
        const stops = group('Stops'); stops.classList.add('aurora-stops');
        P.checkbox(stops, `Any number of stops (${s.flights.length})`, 'nonstop', false, !m.filters.nonstop);
        P.checkbox(stops, `Nonstop only (${s.flights.filter(x => !x.stops).length})`, 'nonstop', true, m.filters.nonstop);
        const alliances = group('Airline alliance');
        P.dropdown(alliances, 'Airline alliance', 'alliance', [['', 'All alliances'], ...F.helpers.ALLIANCES.map(a => [a, a])], m.filters.alliance);
        const allianceMenu = alliances.querySelector('.at-field');
        allianceMenu.classList.add('aurora-alliance-menu');
        allianceMenu.querySelector('button').setAttribute('title', 'Choose airline alliance');
        for (const a of F.helpers.ALLIANCES) {
          const count = s.flights.filter(x => x.alliance === a).length;
          P.checkbox(alliances, `${a} (${count})`, 'alliance', a, m.filters.alliance === a);
        }
        const times = group('Departure time');
        const range = P.el('div', 'aurora-time-range', times);
        const from = P.el('div', 'aurora-anytime', range, 'Any time'); P.svg(from, 'down');
        P.el('span', 'aurora-time-arrow', range, '→');
        P.dropdown(range, 'Depart before', 'before', [...new Set([1440, 660, 780, 900, s.goal.before])].sort((a, b) => a - b).map(a => [a, a === 1440 ? 'Any time' : F.helpers.time(a)]), m.filters.before);
        const price = group('Maximum price (USD)'); price.classList.add('aurora-price-filter');
        P.dropdown(price, 'Maximum fare', 'max', [...new Set([s.maxPrice, 250, 350, 450, s.goal.max])].sort((a, b) => a - b).map(a => [a, F.helpers.money(a).replace(/\.00$/, '')]), m.filters.max);
        const priceField = price.querySelector('.at-field');
        const slider = P.el('input', 'aurora-max-slider', priceField);
        slider.type = 'range'; slider.min = '0'; slider.max = String(s.maxPrice); slider.step = '10'; slider.value = String(m.filters.max);
        slider.setAttribute('aria-label', 'Maximum price');
        slider.addEventListener('change', () => P.act({filter: 'max', value: Number(slider.value)}));
        priceField.prepend(slider);
      },
      footer: (base, S) => (m) => {
        base(m);
        S.footer.classList.toggle('aurora-footer-idle', !m.selected && m.page !== 'review');
      },
      painted: (base, S) => (ctx) => {
        base(ctx);
        const pop = S.app.querySelector(':scope > .at-pop');
        const trigger = S.refs.get(env.taskDef.helpers.key({menu: ctx.model.menu}));
        if (!pop || !trigger) return;
        const app = S.app.getBoundingClientRect(), button = trigger.getBoundingClientRect();
        const width = Math.min(Math.max(button.width, 180), app.width - 16);
        pop.style.width = `${width}px`;
        pop.style.left = `${Math.max(8, Math.min(button.left - app.left, app.width - width - 8))}px`;
        pop.style.top = `${Math.max(8, Math.min(button.bottom - app.top + 4, app.height - pop.getBoundingClientRect().height - 8))}px`;
      },
    },
  },
});
