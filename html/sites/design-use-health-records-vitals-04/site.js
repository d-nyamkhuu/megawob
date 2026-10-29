// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const hospitalBrand = util.el('div', 'medical-brand', header);
      util.el('span', 'medical-brand-cross', hospitalBrand, '✚');
      util.el('span', '', hospitalBrand, 'Riverview Medical Center');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, hospitalBrand });
    },
    'frame.body': (base, S) => function (_c) {
      const { header, headerTools, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const hospitalRail = util.el('aside', 'medical-rail', body);
      const railIcons = [
        ['Patients', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 22v-3c0-5 16-5 16 0v3Z'],
        ['Schedule', 'M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16M14 14h3v3h-3Z'],
        ['Orders', 'M6 2h9l5 5v15H6ZM15 2v6h5'],
        ['Medications', 'M5 19a5 5 0 0 1 0-7l7-7a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7 0ZM8 9l7 7'],
        ['Nursing', 'M4 11h4v11H4ZM10 3h4v19h-4ZM16 8h4v14h-4Z'],
        ['Beds', 'M3 4v17M3 15h19v6M7 8h4v5H7ZM13 8h9v7H13Z'],
        ['Reports', 'M11 2v11h11A10 10 0 1 1 11 2ZM14 2a10 10 0 0 1 9 9h-9Z'],
      ];
      for (const [text, path] of railIcons) {
        const item = util.el('a', `medical-rail-item${text === 'Nursing' ? ' active' : ''}`, hospitalRail);
        const icon = util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, item);
        util.svg('path', {d:path}, icon);
        util.el('span', '', item, text);
        item.addEventListener('click', () => env.log('decoy', {what:'navigation', label:text}));
      }
      const search = util.el('div', 'medical-search', header);
      const searchIcon = util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, search);
      util.svg('path', {d:'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM15 15l6 6'}, searchIcon);
      util.el('span', '', search, 'Search patients, orders, etc.');
      header.insertBefore(search, headerTools);
      const utilities = util.el('div', 'medical-utilities', header);
      for (const path of ['M7 17V9a5 5 0 0 1 10 0v8l3 3H4ZM10 23h4', railIcons[0][1]]) {
        const icon = util.svg('svg', {viewBox:'0 0 24 24', 'aria-hidden':'true'}, utilities);
        util.svg('path', {d:path}, icon);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, hospitalRail, railIcons, search, searchIcon, utilities });
    },
  };

  env.site({
    name: 'design-use-health-records-vitals-04',
    template: 'site/base',
    design: { parts },
  });
})();
