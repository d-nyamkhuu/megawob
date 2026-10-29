// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-compare-01',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'use-shop/base',
  design: {
    parts: {
      // A search and sort bar over product cards instead of the specification table.
      'shoppingCompareProducts': () => function (view, m) {
        const { util, s, cash, pane, button } = view;
        const tools = util.el('div', 'ax-compare-tools', pane);
        util.el('span', 'ax-search-label', tools, 'Search:');
        const query = util.el('div', 'ax-tool-field ax-query', tools, 'backpack');
        query.setAttribute('aria-label', 'Search products');
        util.el('div', 'ax-tool-field ax-brand-filter', tools, 'All brands　▾');
        util.el('div', 'ax-tool-button', tools, 'Search');
        util.el('span', 'ax-sort-label', tools, 'Sort by:');
        util.el('div', 'ax-tool-field ax-sort-filter', tools, 'Relevance　▾');
        const cards = util.el('div', 'ax-product-cards', pane);
        s.products.forEach((p) => {
          const card = util.el('article', 'ax-compare-card', cards);
          util.el('b', 'ax-compare-name', card, p.name);
          util.el('div', `ax-pack-art ax-pack-photo photo-${(p.id % 4) + 1}`, card);
          const facts = util.el('dl', 'ax-compare-facts', card);
          [['Price', cash(p.price)], ['Capacity', p.capacity + ' L'], ['Weight', p.weight + ' g'], ['Warranty', p.warranty + ' year(s)']]
            .forEach(([label, value]) => { util.el('dt', '', facts, label + ':'); util.el('dd', '', facts, value); });
          const b = button(card, m.selected === p.id ? 'Selected' : 'Select', `select:${p.id}`, 'ax-chip');
          b.setAttribute('aria-pressed', String(m.selected === p.id));
        });
      },
    },
  },
});
