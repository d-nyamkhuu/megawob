// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-variantpick-02',
  name: 'design',
  split: 'train',
  scenarios: ['variantpick'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingArt': (base, S) => function (view, parent, large = false, product = view.s.products[0]) {
        const { productArt } = S;
        const { util } = view;
        const a = util.el('div', large ? 'ax-art' : 'ax-mini', parent);
        const hues = { Ocean: 209, Clay: 15, Moss: 95, Ink: 224 };
        if (large) {
          a.classList.add('ax-shirt-photo');
          a.innerHTML = '<img src="sites/design-use-shop-variantpick-02/assets/moss-button-down.webp" alt="Moss green button-down shirt">';
        } else a.innerHTML = productArt(product.name, 45 + product.id * 62);
        return a;
      },
      // Photos of the shirt as thumbnails, and a sustainability label under the product copy.
      'shoppingProductThumbs': () => (view, thumbs) => {
        [0, 1, 2, 3].forEach((n) => {
          const thumb = view.util.el('div', 'photo-thumb view-' + n, thumbs);
          thumb.innerHTML = '<img src="sites/design-use-shop-variantpick-02/assets/moss-button-down.webp" alt="">';
        });
      },
      'shoppingProductHeading': (base, S) => (view, m, parent) => {
        const head = base(view, m, parent);
        S.iconLabel(view.util, head.lastChild, 'leaf', 'Sustainable choice', 'ax-sustainable');
        return head;
      },
      'shoppingProductAfter': (base, S) => function (view, m) {
        const { ICON } = S;
        const { util, pane } = view;
        const benefits = util.el('div', 'ax-bottom-benefits', pane);
        [['leaf', 'Recycled blend', 'Lower impact materials'], ['shield', 'Durable design', 'Made to last'], ['truck', 'Free shipping', 'On orders over $50']].forEach(([icon, title, copy]) => {
          const item = util.el('div', 'ax-benefit', benefits);
          util.el('span', 'as-inline-icon', item).innerHTML = ICON[icon] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 3C9 3 4 8 4 15a6 6 0 0 0 6 6C17 21 21 13 20 3Z"/><path d="M4 21c3-6 7-9 12-12"/></svg>';
          const label = util.el('div', '', item);
          util.el('b', '', label, title);
          util.el('span', '', label, copy);
        });
      },
    },
  },
});
