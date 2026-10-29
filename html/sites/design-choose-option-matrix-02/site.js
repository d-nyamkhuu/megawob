// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-matrix-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-matrix-02',
        brand: 'Wellbeing',
        title: 'Wellbeing',
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
            const traffic = u.el('div', 'ds-traffic', top);
            ['red', 'amber', 'green'].forEach((c) => u.el('i', 'ds-light ' + c, traffic));
            const brand = u.el('div', 'ds-brand-wrap', top);
            const leaf = u.el('span', 'ds-leaf', brand);
            leaf.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 3.4C12 3.4 5.2 6.3 4.1 12.6c-.7 4.1 1.8 7.4 5.8 7.1 6.8-.5 10.3-7.8 10.3-16.3Z"/><path d="M3.4 21c3-5.4 7.2-9.9 13-13.7"/></svg>';
            u.el('span', 'ds-brand', brand, C.brand);
            const systemTools = u.el('div', 'ds-system-tools', top);
            const sun = u.el('span', 'ds-tool ds-appearance', systemTools);
            sun.setAttribute('aria-label', 'Appearance');
            sun.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1m10.2 10.2 2.1 2.1m0-14.4-2.1 2.1M6.9 17.1l-2.1 2.1"/></svg>';
            const search = u.el('span', 'ds-tool ds-search', systemTools);
            search.setAttribute('aria-label', 'Search');
            search.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7.1"/><path d="m16.1 16.1 5 5"/></svg>';
            const more = u.el('span', 'ds-tool ds-more', systemTools);
            more.setAttribute('aria-label', 'More options');
            more.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="4" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="20" cy="12" r="1.7"/></svg>';
            Object.assign(_c, { brand, leaf, more, search, sun, systemTools, traffic });
          },
        'frame.7': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const stage = u.el('main', 'ds-stage', main);
            const help = u.el('aside', 'ds-help', main);
            u.el('div', 'ds-info-icon', help, 'i');
            u.el('h2', '', help, 'About these ratings');
            u.el('p', '', help, 'Choose how often you typically do each activity.');
            const legend = [
              ['Never', 'I do this activity almost never.', 'never'],
              ['Rarely', 'I do this activity once in a while.', 'rarely'],
              ['Sometimes', 'I do this activity from time to time.', 'sometimes'],
              ['Often', 'I do this activity regularly.', 'often'],
              ['Always', 'I do this activity very frequently.', 'always'],
            ];
            const legendList = u.el('div', 'ds-legend', help);
            legend.forEach(([name, desc, color]) => {
              const row = u.el('div', 'ds-legend-row', legendList);
              u.el('i', 'ds-dot ' + color, row);
              const text = u.el('div', '', row);
              u.el('strong', '', text, name);
              u.el('span', '', text, desc);
            });
            Object.assign(_c, { help, legend, legendList, stage });
          },
        'frame.20': () => () => {},
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
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
