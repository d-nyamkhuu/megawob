// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-returns-02',
  name: 'design',
  split: 'train',
  scenarios: ['returns'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingOrderItems': (base, S) => function (view, m, o, i, card) {
        const { productArt } = S;
        const { util, s, cash, button } = view;
        const items = util.el('div', 'ax-return-items', card);
        o.items.forEach((id) => {
          const row = util.el('div', 'ax-return-item' + (m.item === id ? ' picked' : ''), items);
          const thumb = util.el('div', 'ax-return-thumb', row);
          thumb.innerHTML = productArt(s.products[id].name, 45 + id * 62);
          const detail = util.el('div', 'ax-return-copy', row);
          util.el('b', '', detail, s.products[id].name);
          util.el('span', '', detail, `${s.products[id].colour || 'Standard'}　|　${s.products[id].size || 'One size'}`);
          util.el('span', 'ax-return-price', row, cash(s.products[id].price));
          button(row, m.item === id ? 'Selected' : (m.order === i ? 'Select item' : 'Return item'), m.order === i ? `item:${id}` : `order:${i}`, 'ax-return-action');
        });
        // Item-row actions also select their parent order on the first step.
        if (m.order === i) items.querySelectorAll('.ax-return-action').forEach((b, n) => b.setAttribute('aria-pressed', String(o.items[n] === m.item)));
      },
    },
  },
});
