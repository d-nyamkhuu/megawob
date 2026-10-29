// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-chips-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-chips-04',
        brand: 'Global Travel',
        title: 'Create Trip',
        instruction: 'top',
        rail: '',
        menu: '',
        briefTitle: 'Instructions',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { top, u } = _c;
            u.el('span', 'ds-brand', top, '✚　' + C.brand);
            u.el('span', 'ds-app-icons', top, '⌕　▦　♟　● JD');
          },
        'frame.7': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { main, u } = _c;
            const records = u.el('aside', 'ds-records', main);
            u.el('div', 'ds-record-head', records, 'Trips　　　　　　　　　12 records');
            const table = u.el('div', 'ds-record-table', records);
            u.el(
              'div',
              'ds-record-row ds-record-columns',
              table,
              'Trip Name　　　　　　　 Departure City　　　 Departure Date',
            );
            [
              ['Q2 Customer Visit', 'Nanjing', 'Apr 12, 2016'],
              ['APAC Partner Summit', 'Singapore', 'Apr 18, 2016'],
              ['Product Training', 'Tucson', 'May 3, 2016'],
              ['EMEA Sales Tour', 'Munich', 'May 16, 2016'],
              ['LATAM Outreach', 'Santiago', 'Jun 7, 2016'],
              ['MENA Partner Meeting', 'Manama', 'Jun 21, 2016'],
              ['US West Coast', 'San Francisco', 'Jul 11, 2016'],
              ['Japan Customer Visit', 'Tokyo', 'Aug 2, 2016'],
              ['India Roadshow', 'Bangalore', 'Aug 16, 2016'],
              ['ANZ Channel Meet', 'Sydney', 'Sep 5, 2016'],
              ['China User Conference', 'Nanjing', 'Sep 20, 2016'],
              ['Fall Product Launch', 'Tucson', 'Oct 3, 2016'],
            ].forEach((row) => {
              const r = u.el('div', 'ds-record-row', table);
              u.el('span', '', r, row[0]);
              u.el('span', '', r, row[1]);
              u.el('span', '', r, row[2]);
            });
            if (C.rail) {
              /* retained as a site token; no rail in this design */
            }
            Object.assign(_c, { records, table });
          },
        'frame.20': (base, S) =>
          function (_c) {
            const { C } = S;
            const { main, marker, u } = _c;
            u.el('span', 'ds-trip-icon', marker, '✈');
            u.el('h1', '', marker, C.title);
            const tripForm = u.el('div', 'ds-trip-form', main);
            const fauxField = (name, cls, value) => {
              const f = u.el('div', 'ds-faux-field ' + (cls || ''), tripForm);
              u.el('label', '', f, name);
              const v = u.el('div', 'ds-faux-input', f, value || '');
              return v;
            };
            fauxField('Trip Name', 'name', '');
            fauxField('Trip Type', 'type', 'Customer Visit');
            fauxField('Departure city', 'target', '');
            fauxField('Departure date', 'date', 'Apr 12, 2016');
            fauxField('Return city', 'return', 'Select cities');
            fauxField('Return date', 'date2', 'Apr 15, 2016');
            fauxField('Purpose', 'purpose', 'Customer Meeting');
            fauxField('Travel class', 'class', 'Economy');
            const notes = u.el('div', 'ds-faux-field ds-notes', tripForm);
            u.el('label', '', notes, 'Notes');
            u.el('div', 'ds-faux-input', notes, '');
            Object.assign(_c, { fauxField, notes, tripForm });
          },
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
