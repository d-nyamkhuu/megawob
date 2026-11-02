// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-validation-fix-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-type-text-validation-fix-01',
        'brand': 'College Supply Catalog - Orders',
        'title': '',
        'instruction': 'top',
        'rail': '',
        'menu': 'File|Edit|View|Records|Tools|Help',
        'briefTitle': 'Task note',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { top, u } = _c;
            u.el('span', 'ds-window-controls', top, '−　□　×');
          },
        'frame.9': (base, S) =>
          function (_c) {
            const { u } = _c;
            const toolbar = u.el('div', 'ds-toolbar', document.body);
            ['▤', '📂', '?', '▧', '⌕', '▤'].forEach((icon, i) => {
              const item = u.el('span', 'ds-tool', toolbar, icon);
              item.setAttribute('aria-hidden', 'true');
            });
            const body = u.el('div', 'ds-body', document.body);
            Object.assign(_c, { body, toolbar });
          },
        'frame.10': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { u, main } = _c;
            const stage = u.el('main', 'catalog-stage', main);
            Object.assign(_c, { stage });
          },
        'frame.20': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const records = u.el('section', 'ds-records', content);
            u.el('h2', '', records, 'Recent Orders');
            const head = u.el('div', 'ds-table-head', records);
            ['Order #', 'Customer', 'Date', 'Status'].forEach((v) => u.el('span', '', head, v));
            [
              ['004321', 'Northwood University', '04/10/1995', 'Shipped'],
              ['004322', 'Lakeside College', '04/11/1995', 'Processing'],
              ['004323', 'Riverside College', '04/12/1995', 'Open'],
              ['004324', 'Pine Valley College', '04/12/1995', 'Processing'],
              ['004325', 'Maple Grove University', '04/13/1995', 'Open'],
            ].forEach((row, i) => {
              const r = u.el('div', 'ds-order' + (i === 2 ? ' selected' : ''), records);
              row.forEach((v) => u.el('span', '', r, v));
            });
            const foot = u.el('footer', 'ds-footer', content);
            Object.assign(_c, { foot, head, records });
          },
      },
    },
  });
})();
