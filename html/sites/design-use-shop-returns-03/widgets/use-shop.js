// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-returns-03',
  name: 'design',
  split: 'train',
  scenarios: ['returns'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingReturnOrders': (base, S) => function (view, m) {
        const { F, productArt } = S;
        const { util, s, cash, pane, button } = view;
        util.el('div', 'ax-muted', pane, 'Select an order, then choose the item you would like to return.');
        const columns = util.el('div', 'ax-return-columns', pane);
        const orderList = util.el('section', 'ax-return-orders', columns);
        const itemList = util.el('section', 'ax-return-items', columns);
        util.el('h3', '', orderList, 'Your Orders');
        const shownOrder = m.order === null ? 0 : m.order;
        util.el('h3', '', itemList, `Items in Order (${s.orders[shownOrder].items.length})`);
        const orderHead = util.el('div', 'ax-return-head', orderList);
        ['Order #', 'Date', 'Items'].forEach((label) => util.el('span', '', orderHead, label));
        s.orders.forEach((o, i) => {
          const card = util.el('div', 'ax-order' + (m.order === i ? ' on' : ''), orderList);
          const info = util.el('div', 'ax-order-info', card);
          util.el('b', '', info, o.no);
          util.el('span', 'ax-order-date', info, F().fmtDate(o.date, 'mdy'));
          util.el('span', 'ax-order-count', info, String(o.items.length));
          button(card, m.order === i ? 'Selected' : 'Select order', `order:${i}`);
        });
        s.orders[shownOrder].items.forEach((id) => {
          const product = s.products[id];
          const item = button(itemList, '', `item:${id}`, 'ax-return-item' + (m.order !== null && m.item === id ? ' on' : ''));
          item.setAttribute('aria-pressed', String(m.order !== null && m.item === id));
          util.el('span', 'ax-return-name', item, product.name);
          util.el('span', 'ax-return-price', item, cash(product.price));
          util.el('span', 'ax-return-art', item).innerHTML = productArt(product.name, 45 + id * 62);
        });
        button(pane, 'Continue to return options', 'details', 'primary', m.order === null || m.item === null);
      },
      'shoppingToolbar': (base, S) => function (view) {
        const { F } = S;
        const { util, s, shell } = view;
        if (s.scenario === 'returns') {
                  const order = s.orders[0];
                  const overview = util.el('section', 'ax-return-overview', shell);
                  const summary = util.el('div', 'ax-return-overview-main', overview);
                  util.el('h1', '', summary, `Order ${order.no}`);
                  util.el('div', '', summary, `Date:   ${F().fmtDate(order.date, 'mdy')}`);
                  util.el('div', '', summary, 'Status:   Delivered');
                  const ship = util.el('div', 'ax-return-overview-side', overview);
                  util.el('b', '', ship, 'Order status:');
                  util.el('div', '', ship, 'Delivered');
                  util.el('div', '', ship, 'Eligible for return');
                }
      },
    },
  },
});
