// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-combobox-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-combobox-04',
        brand: 'CivicSupply',
        title: 'Order #10048',
        instruction: 'top',
        rail: '',
        menu: 'Orders|Products|Customers|Reports',
        briefTitle: 'Task',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { top, u } = _c;
            u.el('div', 'ds-search', top, '⌕　 Search orders, products, or customers');
            u.el('div', 'ds-user', top, '◉　 Taylor Kim　⌄');
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const rail = u.el('aside', 'ds-rail', body);
            u.el('h2', '', rail, 'Recent Orders');
            [
              '#10048|Riverside Community Center|$352.80|Apr 24, 2017',
              '#10047|Maple Grove Library|$129.50|Apr 22, 2017',
              '#10046|Lakeside Senior Center|$678.15|Apr 20, 2017',
              '#10045|Pinecrest Elementary|$249.00|Apr 18, 2017',
              '#10044|Cedar Falls Food Bank|$412.35|Apr 17, 2017',
              '#10043|Oakridge Community Center|$98.00|Apr 15, 2017',
              '#10042|Fairview Recreation|$560.20|Apr 14, 2017',
              '#10041|Northside Youth Program|$310.00|Apr 12, 2017',
            ].forEach((item, i) => {
              const row = u.el('div', 'ds-order' + (!i ? ' selected' : ''), rail);
              const [num, name, total, date] = item.split('|');
              u.el('b', '', row, num);
              u.el('span', '', row, total);
              u.el('div', '', row, name);
              u.el('small', '', row, date);
            });
            Object.assign(_c, { rail });
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { contentRoot, u } = _c;
            const record = u.el('section', 'ds-record', contentRoot);
            const rd = u.el('div', '', record);
            u.el('h1', '', rd, 'Order #10048');
            u.el('h2', '', rd, 'Riverside Community Center');
            u.el('div', '', rd, '742 Oak Street');
            u.el('div', '', rd, 'Riverton, CA 95642');
            const details = u.el('div', 'ds-details', record);
            [
              ['Order Date', 'Apr 24, 2017'],
              ['Requested By', 'Jamie Carter'],
              ['Department', 'Community Programs'],
              ['Status', 'Pending'],
              ['Total (est.)', '$352.80'],
            ].forEach((a) => {
              u.el('span', '', details, a[0]);
              u.el('b', '', details, a[1]);
            });
            u.el('div', 'ds-task-heading', contentRoot, 'Add Item to Order');
            const main = u.el('div', 'ds-main', contentRoot);
            Object.assign(_c, { details, main, rd, record });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const extras = u.el('div', 'ds-extra-fields', main, 'Quantity\nUnit Price\nNotes');
            const items = u.el('div', 'ds-items', main);
            u.el('h3', '', items, 'Items in this Order');
            const table = u.el('div', 'ds-table', items);
            u.el(
              'div',
              'ds-table-head',
              table,
              'Product　　　　　　　　　　　　　　 Quantity　　　　 Unit Price　　　　 Total',
            );
            u.el('div', '', table, 'No items added yet.');
            const stage = u.el('main', 'ds-stage', main);
            Object.assign(_c, { extras, items, stage, table });
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
                _c.label = 'Confirm';
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
