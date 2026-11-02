// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-cartedit-03',
  name: 'design',
  split: 'train',
  scenarios: ['cartedit'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingLinesHeading': (base, S) => function (view, m) {
        const { iconLabel } = S;
        const { util, s, pane } = view;
        const itemCount = m.lines.filter((l) => l.status === 'cart').length;
        util.el('h2', '', pane, `Your Shopping Bag (${itemCount} items)`);
        util.el('div', 'ax-muted', pane, `Free returns · maximum ${s.maxQty} units per item`);
        const msg = util.el('div', 'ax-bag-message', pane);
        iconLabel(util, msg, 'truck', 'Items are reserved at checkout. Delivery options are shown before payment.');
      },
      'shoppingLineProduct': (base, S) => function (view, m, l, status, p, row) {
        const { util, cash, art } = view;
        const top = util.el('div', 'ax-line-top', row);
        art(top, false, p);
        const info = util.el('div', '', top);
        util.el('b', '', info, p.name);
        util.el('div', 'ax-unit-price', info, cash(p.price));
        util.el('div', 'ax-muted ax-product-detail', info, `${p.sku} · Standard delivery`);
        if (status === 'cart') util.el('div', 'ax-line-total', row, cash(p.price * l.qty));
        util.el('span', 'ax-tag', top, status === 'cart' ? 'In stock' : status === 'saved' ? 'Saved' : 'Removed');
      },
    },
  },
});
