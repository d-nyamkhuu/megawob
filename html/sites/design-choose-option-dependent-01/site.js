// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-dependent-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-dependent-01',
        brand: 'Address Book',
        title: 'Address Book',
        instruction: 'top',
        rail: '',
        menu: 'File|Edit|View|Card|Window|Help',
        briefTitle: 'Instructions',
      },
      parts: {
        'frame.5': (base, St) =>
          function (_c) {
            const { C } = St;
            const { u } = _c;
            const nav = u.el('nav', 'ds-menu', document.body);
            u.el('span', 'ds-apple', nav);
            C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
            u.el('span', 'ds-clock', nav, '▣　10:24 AM');
            const top = u.el('header', 'ds-top', document.body);
            u.el('span', 'ds-window-box', top, '□');
            u.el('span', 'ds-brand', top, C.brand);
            u.el('span', 'ds-window-controls', top, '□　▤');
            Object.assign(_c, { nav, top });
          },
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.18': (base, St) =>
          function (_c) {
            const { C } = St;
            const { main, u } = _c;
            const inspector = u.el('aside', 'ds-inspector', main);
            const contacts = u.el('div', 'ds-contact-list', inspector);
            [
              'Carter, Evelyn',
              'Chen, Raymond',
              'Diaz, Maria',
              'Foster, Alan',
              'Garcia, Luis',
              'Henderson, Patricia',
              'Ito, Ken',
              'Kim, Sarah',
              'Lopez, Javier',
              'Miller, Anne',
              'Nguyen, Thomas',
              'Patel, Priya',
            ].forEach((n, i) => {
              const row = u.el('div', `ds-contact${i === 2 ? ' selected' : ''}`, contacts);
              u.el('span', 'ds-doc-icon', row);
              u.el('span', '', row, n);
            });
            u.el('div', 'ds-scroll-thumb', contacts);
            const details = u.el('section', 'ds-details', inspector);
            u.el('h2', '', details, 'Diaz, Maria');
            [
              ['Company', 'Soluciones S.A.'],
              ['Phone', '(55) 555-0187'],
              ['Email', 'maria.diaz@soluciones.mx'],
              ['Address', '—'],
            ].forEach(([k, v]) => {
              const row = u.el('div', 'ds-detail-row', details);
              u.el('b', '', row, k + ':');
              u.el('span', '', row, v);
            });
            if (C.rail) {
              /* retained as a site token; no rail in this design */
            }
            const stage = u.el('main', 'ds-stage', main);
            const marker = u.el('div', 'ds-swiss-label', stage);
            Object.assign(_c, { contacts, details, inspector, marker, stage });
          },
        'frame.19': () => () => {},
        'frame.35': (base, St) =>
          function (_c) {
            const { foot, u } = _c;
            [
              ['▣', 'Contacts'],
              ['♧', 'Groups'],
              ['✉', 'Mail'],
              ['▤', 'Settings'],
            ].forEach(([icon, label], i) => {
              const item = u.el('div', `ds-dock-item${i === 0 ? ' active' : ''}`, foot);
              u.el('span', 'ds-dock-icon', item, icon);
              u.el('span', '', item, label);
            });
          },
        'frame.36': () => () => {},
      },
    },
  });
})();
