env.widget({
  task: 'use-travel',
  site: 'design-use-travel-flights-01',
  name: 'design',
  split: 'train',
  scenarios: ['flights'],
  template: 'use-travel/portal',
  design: {
    brand: 'SkyWays Travel', appLabel: 'SkyWays Travel flights',
    accent: '#087e9c', panel: '#fffdf3', foreground: '#073b7e', muted: '#15568b', line: '#8bc5d2',
    fontSize: '16px', fontFamily: 'Arial, sans-serif', inset: '4px', radius: '3px',
    workspaceRailWidth: '0px', summaryRailWidth: '31%', railWidth: '226px',
    parts: {
      topbar: (base) => () => {},
      route: (base, S) => (app) => {
        base(app);
        const title = app.querySelector('.at-route h2');
        if (title) title.textContent = 'Find Flights';
        const s = S.spec, F = env.taskDef, P = S.P;
        const box = P.el('section', 'sky-route-fields', app);
        P.el('strong', 'sky-route-title', box, 'Route Details');
        const fields = P.el('div', 'sky-route-grid', box);
        const field = (label, value, icon) => {
          const cell = P.el('div', 'sky-route-field', fields);
          P.el('b', '', cell, label);
          const input = P.el('span', '', cell, value);
          if (icon) P.el('i', '', input, icon);
        };
        field('From', `${s.origin.city} (${s.origin.iata})`, '▦');
        field('To', `${s.dest.city} (${s.dest.iata})`, '▦');
        field('Depart Date', F.helpers.fmtDate(s.original.date), '▦');
      },
      resultCard: (base, S) => (pane, x, m) => {
        if (S.spec.scenario !== 'flights') return base(pane, x, m);
        const s = S.spec, P = S.P, F = env.taskDef;
        const row = P.el('article', `sky-flight-row${m.selected === x.id ? ' chosen' : ''}`, pane);
        P.el('span', `sky-airline-mark sky-logo-${x.airline.toLowerCase().replace(/[^a-z]+/g, '-')}`, row, x.no.slice(0, 2));
        P.el('strong', 'sky-airline', row, x.airline);
        P.el('span', 'sky-flight-no', row, x.no);
        P.el('strong', 'sky-departure', row, F.helpers.time(x.dep));
        P.el('span', 'sky-stops', row, x.stops ? '1 stop' : 'Nonstop');
        P.el('span', 'sky-duration', row, `${Math.floor(x.duration / 60)}h ${String(x.duration % 60).padStart(2, '0')}m`);
        P.el('strong', 'sky-price', row, F.helpers.money(x.price));
        P.button(row, 'View', {select: x.id}, 'sky-view', true);
        P.cardBuilt(row, x, m);
      },
      resultFilters: (base) => (rail, m) => {
        base(rail, m);
        const heading = rail.querySelector('h3');
        if (heading && heading.firstChild) heading.firstChild.textContent = 'Filter Flights';
      },
      resultToolbar: (base, S) => (main, m, rows) => {
        base(main, m, rows);
        if (S.spec.scenario !== 'flights') return;
        const P = S.P, head = P.el('div', 'sky-table-head', main);
        for (const label of ['', 'Airline', 'Flight #', 'Departure ▲', 'Stops', 'Duration', 'Price (USD)', '']) P.el('span', '', head, label);
      },
    },
  },
});
