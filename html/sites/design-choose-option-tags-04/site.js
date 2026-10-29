// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tags-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-tags-04',
        brand: '◉  AeroPlaner Pro',
        title: 'Flight Search',
        instruction: 'header',
        rail: '✈|Routes|▦|Schedule|✈|Aircraft|▣|Airports|▥|Reports|◎|Maps|⚙|Settings',
        menu: 'File|Edit|View|Route|Tools|Window|Help',
        briefTitle: 'Flight Search',
      },
      parts: {
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            if (C.rail) {
              const rail = u.el('aside', 'ds-rail', body);
              C.rail.split('|').forEach((t, i) => {
                const n = u.el('div', i % 2 === 0 ? 'ds-rail-icon' : 'ds-rail-item', rail, t);
              });
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const upper = u.el('section', 'ds-upper', main),
              map = u.el('div', 'ds-map', upper);
            u.el('div', 'ds-map-label ds-map-tucson', map, '●  Tucson');
            u.el('div', 'ds-map-label ds-map-manama', map, '●  Manama');
            u.el('div', 'ds-map-label ds-map-nanjing', map, '●  Nanjing');
            const stats = u.el('section', 'ds-stats', upper);
            u.el('h2', '', stats, 'Route Network');
            [
              ['Total Airports', '142'],
              ['Total Routes', '368'],
              ['Active Aircraft', '54'],
              ['Scheduled Flights', '912'],
            ].forEach((a) => {
              const r = u.el('div', 'ds-stat-row', stats);
              u.el('span', '', r, a[0]);
              u.el('b', '', r, a[1]);
            });
            u.el('hr', '', stats);
            [
              ['Selected Route', '—'],
              ['Distance', '—'],
              ['Est. Flight Time', '—'],
              ['Aircraft', '—'],
            ].forEach((a) => {
              const r = u.el('div', 'ds-stat-row', stats);
              u.el('span', '', r, a[0]);
              u.el('b', '', r, a[1]);
            });
            const activity = u.el('section', 'ds-activity', upper);
            u.el('h2', '', activity, 'Airport Activity (Today)');
            const at = u.el('div', 'ds-table', activity);
            [
              ['Airport', 'Dep', 'Arr', 'Total'],
              ['Manama', '12', '11', '23'],
              ['Nanjing', '18', '16', '34'],
              ['Tucson', '9', '10', '19'],
              ['Frankfurt', '24', '28', '52'],
              ['Singapore', '26', '27', '53'],
              ['Toronto', '20', '18', '38'],
            ].forEach((row, i) => {
              const tr = u.el('div', 'ds-tr' + (!i ? ' head' : ''), at);
              row.forEach((c) => u.el('span', '', tr, c));
            });
            const lower = u.el('section', 'ds-lower', main),
              tabs = u.el('nav', 'ds-tabs', lower);
            ['Flight Search', 'Route Details', 'Aircraft Availability', 'Airport Information'].forEach((t, i) =>
              u.el('div', i === 0 ? 'active' : '', tabs, t),
            );
            const workspace = u.el('div', 'ds-workspace', lower),
              stage = u.el('main', 'ds-stage', workspace),
              marker = u.el('div', 'ds-swiss-label', stage);
            const extra = u.el('div', 'ds-extra-fields', workspace);
            const arrival = u.el('div', 'ds-extra-field', extra);
            u.el('label', '', arrival, 'Arrival city');
            u.el('div', 'ds-faux-control', arrival, '⌄');
            const dates = u.el('div', 'ds-date-row', extra);
            [
              ['Departure date', 'Tue, Apr 15, 2014'],
              ['Return date', 'Tue, Apr 22, 2014'],
            ].forEach((a) => {
              const f = u.el('div', 'ds-extra-field', dates);
              u.el('label', '', f, a[0]);
              const ctl = u.el('div', 'ds-faux-control', f, a[1]);
              u.el('span', 'ds-calendar', ctl, '▦');
            });
            const bottom = u.el('div', 'ds-bottom-row', extra);
            const pax = u.el('div', 'ds-extra-field ds-pax', bottom);
            u.el('label', '', pax, 'Passengers');
            u.el('div', 'ds-faux-control', pax, '1 　⌃⌄');
            const cabin = u.el('div', 'ds-extra-field ds-cabin', bottom);
            u.el('label', '', cabin, 'Cabin class');
            u.el('div', 'ds-faux-control', cabin, 'Economy　　⌄');
            const recent = u.el('aside', 'ds-recent', workspace);
            u.el('h2', '', recent, 'Recent Searches');
            const rt = u.el('div', 'ds-table', recent);
            [
              ['From', 'To', 'Date', 'Pax'],
              ['Tucson', 'Nanjing', 'Apr 15, 2014', '1'],
              ['Manama', 'Tucson', 'Apr 10, 2014', '2'],
              ['Singapore', 'Frankfurt', 'Apr 03, 2014', '1'],
              ['Nanjing', 'Manama', 'Mar 28, 2014', '1'],
              ['Toronto', 'Tucson', 'Mar 12, 2014', '1'],
            ].forEach((row, i) => {
              const tr = u.el('div', 'ds-tr' + (!i ? ' head' : ''), rt);
              row.forEach((c) => u.el('span', '', tr, c));
            });
            Object.assign(_c, {
              activity,
              arrival,
              at,
              bottom,
              cabin,
              dates,
              extra,
              lower,
              map,
              marker,
              pax,
              recent,
              rt,
              stage,
              stats,
              tabs,
              upper,
              workspace,
            });
          },
        'frame.19': () => () => {},
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
