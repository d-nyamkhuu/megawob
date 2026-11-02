// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-compare-05',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'use-shop/base',
  design: {
    parts: {
      shoppingCompare: (base, S) =>
        function (view, m) {
          const { util, s, cash, pane, button } = view;
          pane.classList.add('tc-pane');
          const grid = util.el('div', 'tc-grid', pane);
          const BRANDS = ['AlpineTrail', 'TerraPeak', 'TrailVista', 'Northcraft'];
          s.products.forEach((p) => {
            const card = util.el('div', 'tc-card' + (m.selected === p.id ? ' is-sel' : ''), grid);
            const art = util.el('div', 'tc-art', card);
            art.style.setProperty('--ph', String(p.id % 4));
            art.innerHTML = S.productArt(p.name, [215, 0, 105, 2][p.id % 4], 'pack');
            util.el('div', 'tc-name', card, p.name);
            util.el('div', 'tc-brand', card, BRANDS[p.id % 4]);
            const rate = util.el('div', 'tc-rate', card);
            util.el('span', 'tc-stars', rate, '★★★★★');
            util.el('span', '', rate, `(${18 + p.id * 7})`);
            const spec = util.el('div', 'tc-spec', card);
            [['Capacity', p.capacity + ' L'], ['Weight', p.weight + ' g'], ['Warranty', p.warranty + (p.warranty === 1 ? ' year' : ' years')]].forEach(([a, b]) => {
              const r = util.el('div', '', spec);
              util.el('span', '', r, a);
              util.el('span', '', r, b);
            });
            const foot = util.el('div', 'tc-foot', card);
            util.el('b', 'tc-price', foot, cash(p.price));
            const b = button(foot, m.selected === p.id ? 'Selected' : 'Select', `select:${p.id}`, 'ax-chip');
            b.setAttribute('aria-pressed', String(m.selected === p.id));
            b.classList.add('tc-btn');
          });
          const actions = util.el('div', 'tc-actions', pane);
          util.el('span', '', actions, m.selected === null ? 'No pack selected' : s.products[m.selected].name);
          button(actions, m.picked ? 'Update bag' : 'Add selected to bag', 'add', 'primary', m.selected === null);
        },
    },
  },
});
