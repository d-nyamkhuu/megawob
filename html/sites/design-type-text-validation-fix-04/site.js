// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-validation-fix-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-type-text-validation-fix-04',
        'brand': 'Northwind Shop',
        'title': '',
        'instruction': 'top',
        'rail': '',
        'menu': 'Home|Accounts|Settings|Help|Sign out',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { top, u } = _c;
            u.el('span', 'ds-window-controls', top, '−　□　×');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const main = u.el('div', 'ds-main', content);
            const orders = u.el('aside', 'ds-orders', main);
            u.el('h2', '', orders, 'Orders');
            u.el('div', 'ds-searchbox', orders, '⌕　Search orders...');
            const table = u.el('div', 'ds-order-table', orders);
            const head = u.el('div', 'ds-order-row ds-order-head', table);
            ['Order #', 'Customer', 'Date'].forEach((x) => u.el('span', '', head, x));
            [
              ['10021', 'Taylor Brooks', 'Apr 2, 2020'],
              ['10022', 'Morgan Lee', 'Apr 3, 2020'],
              ['10023', 'Casey Martin', 'Apr 4, 2020'],
              ['10024', 'Riley Patel', 'Apr 5, 2020'],
              ['10025', 'Jamie Chen', 'Apr 6, 2020'],
              ['10026', 'Jordan Kim', 'Apr 7, 2020'],
              ['10027', 'Alex Rivera', 'Apr 8, 2020'],
              ['10028', 'Sam Wilson', 'Apr 9, 2020'],
              ['10029', 'Drew Parker', 'Apr 10, 2020'],
              ['10030', 'Quinn Davis', 'Apr 11, 2020'],
              ['10031', 'Cameron Blake', 'Apr 12, 2020'],
              ['10032', 'Reese Clark', 'Apr 13, 2020'],
              ['10033', 'Avery Scott', 'Apr 14, 2020'],
              ['10034', 'Peyton Moore', 'Apr 15, 2020'],
            ].forEach((data, i) => {
              const row = u.el('div', 'ds-order-row' + (i === 2 ? ' selected' : ''), table);
              data.forEach((x) => u.el('span', '', row, x));
            });
            const details = u.el('section', 'ds-order-details', orders);
            u.el('h2', '', details, 'Order Details');
            const card = u.el('div', 'ds-details-card', details);
            [
              ['Order #', '10023'],
              ['Customer', 'Casey Martin'],
              ['Date', 'Apr 4, 2020'],
              ['Status', 'Pending'],
              ['Total', '$125.50'],
            ].forEach((pair) => {
              const row = u.el('div', 'ds-detail-row', card);
              u.el('span', '', row, pair[0]);
              u.el('b', '', row, pair[1]);
            });
            Object.assign(_c, { card, details, head, main, orders, table });
          },
      },
    },
  });
})();
