// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-returns-04',
  name: 'design',
  split: 'train',
  scenarios: ['returns'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingOrderItems': (base, S) => function (view, m, o, i, card) {
        const { productArt } = S;
        const { util, s, cash, button } = view;
        const itemRows = util.el('div', 'ax-order-items', card);
        o.items.forEach((id) => {
          const p = s.products[id], row = util.el('div', 'ax-order-item', itemRows);
          util.el('span', 'ax-item-check', row, '□');
          util.el('span', 'ax-item-art', row).innerHTML = productArt(p.name, 45 + id * 62);
          const label = util.el('span', 'ax-item-label', row);
          util.el('b', '', label, p.name);
          util.el('small', '', label, p.category || 'Outdoor gear');
          util.el('span', 'ax-item-options', row, `${p.size ? 'Size: ' + p.size + '　' : ''}${p.colour ? 'Color: ' + p.colour : ''}`);
          util.el('span', 'ax-item-price', row, cash(p.price));
          util.el('span', 'ax-item-qty', row, '1');
          util.el('span', 'ax-item-total', row, cash(p.price));
        });
        button(card, m.order === i ? 'Selected' : 'Select order', `order:${i}`);
        if (m.order === i) {
          const items = util.el('div', 'ax-chips', card);
          o.items.forEach((id) => {
            const b = button(items, s.products[id].name, `item:${id}`, 'ax-chip');
            b.setAttribute('aria-pressed', String(m.item === id));
          });
        }
      },
    },
  },
});
