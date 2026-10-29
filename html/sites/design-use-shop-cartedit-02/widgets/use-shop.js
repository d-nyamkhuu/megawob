// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-cartedit-02',
  name: 'design',
  split: 'train',
  scenarios: ['cartedit'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingLinesHeading': (base, S) => function (view, m) {
        const { iconLabel } = S;
        const { util, s, pane } = view;
        util.el('h2', '', pane, `Your Bag (${m.lines.filter((l) => l.status === 'cart').length} items)`);
        if (s.scenario === 'cartedit') {
          const columns = util.el('div', 'ax-cart-columns', pane);
          util.el('span', '', columns, 'Item');
          util.el('span', '', columns, 'Price');
          util.el('span', '', columns, 'Total');
        }
        util.el('div', 'ax-muted', pane, `Free returns · maximum ${s.maxQty} units per item`);
        const msg = util.el('div', 'ax-bag-message', pane);
        iconLabel(util, msg, 'truck', 'Items are reserved at checkout. Delivery options are shown before payment.');
      },
      'shoppingLineProduct': (base, S) => function (view, m, l, status, p, row) {
        const { util, s, cash, art } = view;
        const top = util.el('div', 'ax-line-top', row);
        art(top, false, p);
        if (s.scenario === 'cartedit') {
          const kind = /shoe|boot|trainer/i.test(p.name) ? 'shoe' : /goggle|glass|snorkel/i.test(p.name) ? 'goggles' : /paddle/i.test(p.name) ? 'paddle' : /glove/i.test(p.name) ? 'glove' : /kettle|weight/i.test(p.name) ? 'weight' : 'pack';
          const drawings = {
            pack: '<path d="M39 15Q49 5 59 15l5 12 5 48q-15 10-30 0l5-48z" fill="#1689bd" stroke="#173b5b" stroke-width="3"/><path d="M43 28h22M44 35h20M45 42h18M48 19v43M58 20v44" fill="none" stroke="#d6eff8" stroke-width="2"/><path d="M40 33Q31 40 36 57l6 4M63 33q9 7 4 24l-6 4" fill="none" stroke="#173b5b" stroke-width="4"/>',
            shoe: '<path d="M19 54q13 0 22-20l9 5q5 11 18 12l14 8q4 4-1 8H20q-8-2-1-13z" fill="#42483f" stroke="#202820" stroke-width="3"/><path d="M44 35q7 5 13 3l7 11-13 1-12-7z" fill="#b2d532"/><path d="M20 62h60" stroke="#d7d8c8" stroke-width="5"/>',
            goggles: '<path d="M14 39q4-12 20-11l13 5 13-5q18-2 20 12l-4 18q-3 9-14 7-10-2-15-15-5 13-16 15-11 2-14-7z" fill="#151b20" stroke="#07090b" stroke-width="4"/><ellipse cx="32" cy="46" rx="12" ry="10" fill="#37b9e8" stroke="#b9e5f5" stroke-width="3"/><ellipse cx="62" cy="46" rx="12" ry="10" fill="#37b9e8" stroke="#b9e5f5" stroke-width="3"/>',
            weight: '<path d="M34 34V25q0-17 15-17t15 17v9" fill="none" stroke="#16191b" stroke-width="9"/><path d="M30 32q19-9 38 0l7 34q-2 15-26 16-24-1-26-16z" fill="#22272a" stroke="#080a0c" stroke-width="3"/><text x="49" y="59" text-anchor="middle" fill="#eee" font-size="9">KG</text>',
            paddle: '<path d="M49 9q-15 0-16 21-1 18 16 18t17-18Q65 9 49 9z" fill="#50a7bb" stroke="#263e50" stroke-width="4"/><path d="M48 46v35" stroke="#63472c" stroke-width="7"/><path d="M39 20h20" stroke="#d8eef0" stroke-width="3"/>',
            glove: '<path d="M30 70q-8-5-5-17l4-20q1-5 5-4 4 1 3 7l1-20q1-6 5-5 5 0 4 7l1-11q1-6 5-5 5 1 4 7v11l3-7q3-5 7-2 3 2 1 7l-3 19q-1 18-11 29z" fill="#35443c" stroke="#1b2922" stroke-width="3"/><path d="M32 61h31" stroke="#bfd432" stroke-width="4"/>'
          };
          top.querySelector('.ax-mini').innerHTML = `<svg viewBox="0 0 100 90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${drawings[kind]}</svg>`;
        }
        const info = util.el('div', '', top);
        util.el('b', '', info, p.name);
        util.el('div', 'ax-muted', info, s.store);
        if (s.scenario === 'cartedit') {
          const prices = util.el('div', 'ax-line-prices', row);
          util.el('span', '', prices, cash(p.price));
          util.el('strong', '', prices, cash(p.price * l.qty));
        }
        util.el('span', 'ax-tag', top, status === 'cart' ? 'In stock' : status === 'saved' ? 'Saved' : 'Removed');
      },
      'SHOPPING_CART_ACTIONS': () => [['Remove', 'removed'], ['Save for later', 'saved']],
      'shoppingSummaryTotals': (base, S) => function (view, m, t, pair) {
        const { s, cash } = view;
        pair('Items in bag', String(t.count));
        pair('Subtotal', cash(t.subtotal));
        if (s.scenario === 'cartedit') pair('Shipping', cash(0));
        if (s.scenario === 'coupon') pair('Discount', '−' + cash(t.discount));
        pair('Cart total', cash(t.total), true);
      },
      'shoppingPainted': (base, S) => function (view, m) {
        const { s, pane, summary } = view;
        if (s.scenario === 'cartedit') pane.append(summary);
      },
    },
  },
});
