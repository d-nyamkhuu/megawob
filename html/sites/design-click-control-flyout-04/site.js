// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-flyout-04',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Bookstore Explorer',
        'theme': 'win95',
        'layout': 'dock',
        'tools': 'File    Edit    View    Bookmarks    Tools    Help',
        'rail': 'Browse|Search|Cart|Orders|Account',
        'side':
          'Book Details|Title: The Sunny Day|Author: Jane Miller|Illustrator: Tom Clark|Format: Hardcover|Pages: 32|Age Range: 3 - 7|ISBN: 0-555-12345-6|Price: $12.95|Description: A cheerful story about a little girl and her dog who make the most of a sunny day.|Availability: In Stock|Ships in: 1 - 2 business days|Publisher: Riverview Books|Publication Date: Mar 1994|Dimensions: 9.0 x 11.0 in.',
        'foot': 'Task List|Status|Notes|Actions',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { title, u } = _c;
            if (
              ['qt', 'openlook', 'win95', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(
                cfg.theme,
              )
            ) {
              const controls = u.el('span', 'window-controls', title);
              controls.innerHTML =
                '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
            }
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, shell, u } = _c;
            const nav = u.el('div', 'classic-nav', head);
            [
              ['◀', 'Back'],
              ['▶', 'Forward'],
              ['⌂', 'Home'],
              ['⌕', 'Search'],
              ['▤', 'Cart'],
            ].forEach(([icon, label]) => {
              const b = u.el('div', 'classic-tool', nav);
              u.el('b', '', b, icon);
              u.el('span', '', b, label);
            });
            if (cfg.overview) {
              const ov = u.el('section', 'overview', shell);
              cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
            }
            Object.assign(_c, { nav });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => {
                if (i === 0) {
                  u.el('h2', '', _c.aside, s);
                  return;
                }
                const row = u.el('p', 'detail-row', _c.aside);
                const cut = s.indexOf(':');
                u.el('span', 'detail-label', row, cut < 0 ? s : s.slice(0, cut + 1));
                u.el('span', 'detail-value', row, cut < 0 ? '' : s.slice(cut + 1).trim());
              });
            }
          },
      },
    },
  });
})();
