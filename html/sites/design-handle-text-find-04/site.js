// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-find-04',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': 'Docs',
        'theme': 'material',
        'layout': 'paper',
        'tools': 'Documents       Shared with me       Starred       Trash',
        'side':
          'All Documents|Weekend Getaway Plan|Family Budget|Hiking Packing List|Summer Vacation Ideas|Recipes to Try|Home Improvement Notes|Book Recommendations|Garden Plan|Movie Watchlist|New Laptop Research',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
            }
          },
        'frame.24': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', i === 0 ? '' : 'record', _c.aside, s));
            }
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
        'frame.47': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { foot, u } = _c;
            if (cfg.foot) {
              const dock = u.el('div', 'dock-sections', foot);
              cfg.foot.split('|').forEach((s) => {
                const d = u.el('section', 'dock-section', dock);
                u.el('strong', '', d, s);
              });
            } else u.el('span', 'ready', foot, 'Ready.');
          },
      },
    },
  });
})();
