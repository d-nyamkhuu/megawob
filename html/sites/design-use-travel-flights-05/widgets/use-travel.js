env.widget({
  task: 'use-travel',
  site: 'design-use-travel-flights-05',
  name: 'design',
  split: 'train',
  scenarios: ['flights'],
  template: 'use-travel/portal',
  design: {
    brand: 'SkyWays Travel', appLabel: 'SkyWays Travel flights',
    accent: '#2874ff', panel: '#ffffff', foreground: '#0d1b3a', muted: '#626980', line: '#e3e6ed',
    fontSize: '14px', fontFamily: 'Arial, sans-serif', inset: '0px', radius: '6px',
    workspaceRailWidth: '0px', summaryRailWidth: '270px', railWidth: '226px',
    parts: {
      topbar: (base) => () => {},
      route: (base, S) => (app) => {
        base(app);
        const title = app.querySelector('.at-route h2');
        if (title) title.textContent = 'Search Flights';
        const s = S.spec, F = env.taskDef, P = S.P;
        const tabs = P.el('div', 'sky-tabs', app.querySelector('.at-route') || app);
        for (const [t, on] of [['Round trip', 0], ['One way', 1], ['Multi-city', 0]]) P.el('span', on ? 'on' : '', tabs, t);
        const note = document.querySelector('.ref-task > .ref-instruction');
        if (note) { note.classList.add('sky-task-note'); tabs.before(note); }
        const side = P.el('aside', 'sky-trips', app);
        const sh = P.el('div', 'sky-trips-head', side);
        P.el('b', '', sh, 'My Trips'); P.el('span', '', sh, 'View all');
        [['Quito Getaway', 'Jun 12 – Jun 16, 2024', 'UIO → UIO'], ['Galápagos Adventure', 'Jul 8 – Jul 15, 2024', 'UIO → GPS'],
          ['Cuenca Weekend', 'Aug 2 – Aug 5, 2024', 'UIO → CUE'], ['Business Trip', 'Sep 10 – Sep 12, 2024', 'GYE → UIO'],
          ['Montañita Escape', 'Oct 3 – Oct 7, 2024', 'GYE → MTT']].forEach((t, i) => {
          const r = P.el('div', 'sky-trip', side);
          P.el('div', `sky-trip-img sky-t${i}`, r);
          const d = P.el('div', '', r);
          P.el('b', '', d, t[0]); P.el('em', '', d, t[1]); P.el('em', '', d, t[2]);
        });
        app.closest('.ref-body').append(side);
        const box = P.el('section', 'sky-route-fields', app);
        P.el('strong', 'sky-route-title', box, 'Route Details');
        const fields = P.el('div', 'sky-route-grid', box);
        const field = (label, value, icon) => {
          const cell = P.el('div', 'sky-route-field', fields);
          P.el('b', '', cell, label);
          const input = P.el('span', '', cell, value);
          if (icon) P.el('i', '', input, icon);
          const mark = P.svg(cell, label === 'Depart' ? 'calendar' : label === 'Passengers' ? 'user' : 'plane');
          if (label === 'From' || label === 'To') {
            mark.setAttribute('viewBox', '0 0 40 32');
            mark.innerHTML = '<path fill="currentColor" stroke="none" d="m2 17 10 1 8-5L11 4l4-2 13 8 8-4c6-2 8 2 2 6L26 19l-5 12-4 1 2-10-6 3-4-4-7-1Z"/>';
          }
        };
        field('From', `${s.origin.city} (${s.origin.iata})`, '▦');
        field('To', `${s.dest.city} (${s.dest.iata})`, '▦');
        field('Depart', F.helpers.fmtDate(s.original.date), '▦');
        field('Passengers', '1 Adult', '⌄');
      },
      resultCard: (base, S) => (pane, x, m) => {
        if (S.spec.scenario !== 'flights') return base(pane, x, m);
        const s = S.spec, P = S.P, F = env.taskDef;
        const row = P.el('article', `sky-flight-row${m.selected === x.id ? ' chosen' : ''}`, pane);
        const logo = P.el('span', `sky-airline-mark sky-logo-${x.airline.toLowerCase().replace(/[^a-z]+/g, '-')}`, row);
        const index = [...new Set(s.flights.map(f => f.airline))].indexOf(x.airline) % 5;
        const symbols = [
          '<path fill="#009aff" d="M1 24C13-3 20 8 30 9c7 1 10-1 14-6-5 13-13 13-21 9S11 12 1 24Z"/><path fill="#0075ed" d="M4 26c10-18 15-13 25-10 6 2 10 0 14-4-4 11-13 13-21 9S12 18 4 26Z"/>',
          '<path fill="#ff2038" d="m2 25 17-18 6 6-11 12Zm16 0L30 8l14 17H32l-5-7-5 7Z"/>',
          '<path fill="#00acd3" d="m1 8 24 5 19-9-10 19-11 7L11 23l13-3-16-3Zm27 8 8-8-5 10Z"/><path fill="none" stroke="white" stroke-width="2" d="m7 14 23 9M23 13l-6 11"/>',
          '<path fill="#2f9e83" d="M3 28C9 7 29 10 43 1 38 22 25 30 3 28Z"/><path fill="none" stroke="white" stroke-width="1.8" d="M4 27C20 23 31 12 40 5"/>',
          '<path fill="#ed204b" d="m10 2 24 9-1 5L10 9Z"/><path fill="#26158b" d="m10 12 23 6-1 6-15 5v-6l13-4-20-3Zm7 20 11-4v5l-11 4Z"/>'
        ];
        logo.innerHTML = `<svg viewBox="0 0 46 38" aria-hidden="true">${symbols[index]}</svg>`;
        P.el('strong', 'sky-airline', row, x.airline);
        P.el('strong', 'sky-departure', row, F.helpers.time(x.dep));
        P.el('span', 'sky-flight-no', row, F.helpers.time(x.dep + x.duration));
        P.el('span', 'sky-stops', row, x.stops ? '1 stop' : 'Nonstop');
        P.el('span', 'sky-duration', row, `${Math.floor(x.duration / 60)}h ${String(x.duration % 60).padStart(2, '0')}m`);
        P.el('strong', 'sky-price', row, F.helpers.money(x.price));
        P.button(row, 'Book', {select: x.id}, 'sky-view', true);
        P.cardBuilt(row, x, m);
      },
      resultFilters: (base, S) => (rail, m) => {
        base(rail, m);
        const heading = rail.querySelector('h3');
        if (heading && heading.firstChild) heading.firstChild.textContent = 'Filters';
        const P = S.P;
        const check = rail.querySelector('.at-check');
        const fields = [...rail.querySelectorAll('.at-field')];
        const stops = P.el('section', 'sky-filter-group sky-stops-group', rail);
        P.el('h4', '', stops, 'Stops'); stops.append(check);
        for (const t of ['1 stop', '2+ stops']) {
          const line = P.el('div', 'sky-deco-row', stops); P.el('i', '', line); P.el('span', '', line, t);
        }
        const price = P.el('section', 'sky-filter-group sky-price-group', rail);
        P.el('h4', '', price, 'Price');
        const range = P.el('div', 'sky-fare-range', price, `$0 – $${m.filters.max}${m.filters.max === S.spec.maxPrice ? '+' : ''}`);
        price.append(fields[2]);
        const fareButton = fields[2].querySelector('button');
        fareButton.firstChild.textContent = range.textContent;
        const track = P.el('div', 'at-track', price);
        const thumbs = [P.el('div', 'at-thumb', track), P.el('div', 'at-thumb', track)];
        S.slider = env.ui.slider(track, {thumbs, min:0, max:S.spec.maxPrice, step:10, values:[m.filters.min,m.filters.max],
          place:(t,p,f)=>P.placeThumb(t,p,f), label:'Fare range',
          onInput:values=>{range.textContent=`$${values[0]} – $${values[1]}`;S.ctx.patch({filters:{...S.ctx.model.filters,min:values[0],max:values[1]},booked:false,scroll:0});},
          onChange:()=>P.paint()});
        const airlines = P.el('section', 'sky-filter-group sky-alliance-group', rail);
        airlines.append(fields[0]);
        const depart = P.el('section', 'sky-filter-group sky-depart-group', rail);
        P.el('h4', '', depart, 'Departure time');
        for (const t of ['Before 6:00', '6:00 – 12:00', '12:00 – 18:00', 'After 18:00']) {
          const line = P.el('div', 'sky-deco-row', depart); P.el('i', '', line); P.el('span', '', line, t);
        }
        depart.append(fields[1]);
        for (const node of [...rail.children]) if (node.tagName === 'DETAILS' || node.tagName === 'P') node.remove();
      },
      resultToolbar: (base, S) => (main, m, rows) => {
        base(main, m, rows);
        if (S.spec.scenario !== 'flights') return;
        const tb = main.querySelector('.at-toolbar strong');
        if (tb) tb.textContent = `Flights from ${S.spec.origin.city} to ${S.spec.dest.city}`;
        S.P.el('span', 'sky-result-count', tb.parentNode, `${rows.length} results`);
        main.style.setProperty('--flight-count', rows.length);
        const P = S.P, head = P.el('div', 'sky-table-head', main);
        const sort = main.querySelector('.at-toolbar .at-field');
        for (const label of ['Airline', 'Departure ⌄', 'Arrival', 'Stops', 'Duration']) P.el('span', '', head, label);
        head.append(sort);
        const trigger = sort.querySelector('button');
        trigger.firstChild.textContent = 'Price ';
        P.el('span', '', head, '');
      },
      footer: (base, S) => (m) => {
        base(m);
        S.footer.classList.toggle('sky-footer-idle', !m.selected && m.page !== 'review');
      },
      painted: (base, S) => (ctx) => {
        base(ctx);
        const check = S.app.querySelector('.at-check input');
        if (check) check.setAttribute('aria-label', 'Nonstop only');
      },
    },
  },
});
