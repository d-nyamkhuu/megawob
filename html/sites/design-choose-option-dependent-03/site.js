// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-dependent-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-dependent-03',
        brand: 'Travel Planner',
        title: 'Destination',
        instruction: 'top',
        rail: '',
        menu: 'File|Edit|View|Tools|Bookmarks|Help',
        briefTitle: 'Task information',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { top, u } = _c;
            u.el('span', 'ds-appicon', top, '➤');
            u.el('span', 'ds-brand', top, C.brand);
            u.el('span', 'ds-window-controls', top, '−　□　×');
          },
        'frame.7': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { u } = _c;
            const toolbar = u.el('nav', 'ds-toolbar', document.body);
            ['⌂　Home', '⚲　Search', '▦　Flights', '▰　Hotels', '🚘　Cars', '🗺　Destinations'].forEach((t) =>
              u.el('span', 'ds-tool', toolbar, t),
            );
            const body = u.el('div', 'ds-body', document.body);
            const rail = u.el('aside', 'ds-rail', body);
            [
              '⌂　Travel Planner',
              '✈　Flights',
              '▰　Hotels',
              '🚘　Car Rental',
              '🗺　Destinations',
              '────────────',
              '📁　My Trips',
              '♙　Profile',
              '⚙　Preferences',
            ].forEach((t, i) => {
              const n = u.el('div', 'ds-rail-item', rail, t);
              if (i === 0) n.classList.add('active');
            });
            Object.assign(_c, { body, rail, toolbar });
          },
        'frame.10': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { contentRoot, u } = _c;
            const hero = u.el('section', 'ds-hero', contentRoot);
            u.el('h1', '', hero, 'Explore the World');
            u.el('div', '', hero, 'Flights　•　Hotels　•　Car Rental');
            const main = u.el('div', 'ds-main', contentRoot);
            Object.assign(_c, { hero, main });
          },
        'frame.20': (base, S) =>
          function (_c) {
            const { contentRoot, main, marker, u } = _c;
            u.el('strong', '', marker, 'Plan Your Trip');
            const help = u.el('aside', 'ds-help', main);
            u.el('h2', '', help, 'Helpful Information');
            u.el(
              'div',
              'ds-helpbody',
              help,
              'Select a country to see the available cities.\n\nThe city list will be enabled after you choose a country.\n\nYou can search for flights, hotels and car rental after selecting your destination.',
            );
            const recent = u.el('section', 'ds-recent', contentRoot);
            u.el('h2', '', recent, 'Recent Searches');
            const table = u.el('div', 'ds-table', recent);
            [
              ['Date', 'Country', 'City', 'Type'],
              ['May 10, 2003', 'France', 'Paris', 'Hotels'],
              ['May 03, 2003', 'United Kingdom', 'London', 'Flights'],
              ['Apr 28, 2003', 'Italy', 'Rome', 'Hotels'],
              ['Apr 15, 2003', 'Spain', 'Barcelona', 'Car Rental'],
            ].forEach((row, i) => {
              const tr = u.el('div', 'ds-row' + (i === 0 ? ' head' : ''), table);
              row.forEach((c) => u.el('span', '', tr, c));
            });
            Object.assign(_c, { help, recent, table });
          },
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { ctx, endRng, labels } = _c;
            if (!ctx.finish) {
              if (endRng.bool(0.5)) {
                _c.placement = 'footer';
                _c.label = 'Continue';
              } else {
                _c.placement = endRng.pick(['footer', 'link', 'header']);
                const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
                _c.label = alternatives.length ? endRng.pick(alternatives) : 'Done';
              }
            }
          },
      },
    },
  });
})();
