// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-dependent-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-dependent-04',
        brand: 'Global Offices',
        title: 'Add Office',
        instruction: 'header',
        rail: 'Offices|Employees|Contacts|Reports|Settings',
        menu: '',
        briefTitle: 'Instructions',
      },
      parts: {
        'frame.8': (base, St) =>
          function (_c) {
            const { u } = _c;
            const shelf = u.el('nav', 'ds-menu', document.body);
            ['＋', '▰', '▤', '▮'].forEach((t) => u.el('span', '', shelf, t));
            Object.assign(_c, { shelf });
          },
        'frame.20': (base, St) =>
          function (_c) {
            const { main, marker, stage, u } = _c;
            u.el('h1', '', marker, 'Add Office');
            const extras = u.el('div', 'ds-office-extras', stage);
            u.el('div', 'ds-office-rule', extras);
            [
              ['Office Name', ''],
              ['Address', ''],
              ['Time Zone', 'Select a time zone'],
            ].forEach((row, i) => {
              const line = u.el('div', 'ds-office-line', extras);
              u.el('span', '', line, row[0]);
              const value = u.el('div', 'ds-office-value', line, row[1]);
              if (i === 1) value.classList.add('address');
              if (i === 2) value.classList.add('timezone');
            });
            const records = u.el('aside', 'ds-records', main);
            u.el('h2', '', records, 'Existing Offices');
            u.el('div', 'ds-search', records, '⌕　 Search offices...');
            const table = u.el('div', 'ds-record-table', records);
            u.el('div', 'ds-record-head', table, 'OFFICE NAME　　　　　　 CITY　　　　　 COUNTRY');
            [
              ['New York', 'New York', 'United States'],
              ['London', 'London', 'United Kingdom'],
              ['Berlin', 'Berlin', 'Germany'],
              ['Paris', 'Paris', 'France'],
              ['Toronto', 'Toronto', 'Canada'],
              ['Sydney', 'Sydney', 'Australia'],
              ['Tokyo', 'Tokyo', 'Japan'],
              ['Singapore', 'Singapore', 'Singapore'],
              ['São Paulo', 'São Paulo', 'Brazil'],
              ['Dubai', 'Dubai', 'United Arab Emirates'],
            ].forEach((r) => u.el('div', 'ds-record-row', table, r.join('　　　　 ')));
            Object.assign(_c, { extras, records, table });
          },
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
