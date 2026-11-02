// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-variantpick-04',
  name: 'design',
  split: 'train',
  scenarios: ['variantpick'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingSummary': (base, S) => function (view, m) {
        const { productArt } = S;
        const { util, s, cash, summary } = view;
        if (s.scenario === 'variantpick') {
          const head = util.el('h3', '', summary, 'Search Results');
          head.dataset.count = `${s.products.length} items`;
          const rows = util.el('div', 'ax-result-list', summary);
          s.products.forEach((p, i) => {
            const row = util.el('div', 'ax-result-row' + (i === 0 ? ' selected' : ''), rows);
            const thumb = util.el('div', 'ax-result-thumb', row);
            thumb.innerHTML = productArt(p.name, p.hue || 218);
            const text = util.el('div', 'ax-result-copy', row);
            util.el('div', 'ax-result-name', text, p.name);
            util.el('div', 'ax-result-price', text, cash(p.price));
          });
          return;
        }
        return base(view, m);
      },
    },
  },
});
