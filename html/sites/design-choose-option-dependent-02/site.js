// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-dependent-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-dependent-02',
        brand: 'Travel Planner',
        title: 'Destination',
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
            const brand = u.el('span', 'ds-brand', top);
            u.el('span', 'ds-brand-globe', brand);
            u.el('span', '', brand, C.brand);
            const controls = u.el('span', 'ds-window-controls', top);
            ['−', '□', '×'].forEach((t) => u.el('span', '', controls, t));
            const nav = u.el('nav', 'ds-menu', document.body);
            [
              ['◎', 'Destinations'],
              ['✈', 'Flights'],
              ['▰', 'Hotels'],
              ['◉', 'Activities'],
              ['▣', 'My Trips'],
            ].forEach((a, i) => {
              const item = u.el('span', 'ds-navitem' + (i === 0 ? ' active' : ''), nav);
              u.el('b', '', item, a[0]);
              u.el('span', '', item, a[1]);
            });
            Object.assign(_c, { brand, controls, nav });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const stage = u.el('main', 'ds-stage', main);
            const side = u.el('aside', 'ds-destination-panel', main);
            const info = u.el('section', 'ds-info-box', side);
            u.el('h2', '', info, 'Destination Information');
            const globe = u.el('div', 'ds-globe-row', info);
            u.el('span', 'ds-globe', globe);
            const counts = u.el('div', 'ds-counts', globe);
            [
              ['Countries', '24'],
              ['Cities', '112'],
              ['Popular Cities', '10'],
            ].forEach((x) => {
              const row = u.el('div', '', counts);
              u.el('span', '', row, x[0]);
              u.el('b', '', row, x[1]);
            });
            const popular = u.el('section', 'ds-popular-box', side);
            u.el('h2', '', popular, 'Popular Destinations');
            [
              ['', 'Sydney', '12,431 visits'],
              ['', 'London', '11,982 visits'],
              ['', 'New York', '11,049 visits'],
              ['', 'Paris', '10,337 visits'],
              ['', 'Tokyo', '9,876 visits'],
            ].forEach((x) => {
              const row = u.el('div', 'ds-poprow', popular);
              u.el('span', 'ds-city-thumb', row, x[0]);
              u.el('span', 'ds-city-name', row, x[1]);
              u.el('span', 'ds-visits', row, x[2]);
            });
            Object.assign(_c, { counts, globe, info, popular, side, stage });
          },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
      },
    },
  });
})();
