// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-variantpick-01',
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
        if (/button[ -]down/i.test(product.name)) {
          if (large) { a.classList.add('ax-art-photo'); a.innerHTML = `<img src="sites/design-use-shop-variantpick-01/assets/clay-linen-shirt.webp" alt="${product.name}">`; }
          else a.innerHTML = productArt(product.name, 15);
        } else a.innerHTML = productArt(product.name, large ? 15 : 45 + product.id * 62);
        return a;
      },
      'shoppingProductHeading': (base, S) => function (view, m) {
        const { ICON, productArt } = S;
        const { util, s, cash, pane, art } = view;
        const p = s.products[0];
        const head = util.el('div', 'ax-product', pane);
        const gallery = util.el('div', 'ax-gallery', head);
        art(gallery, true);
        const thumbs = util.el('div', 'ax-gallery-thumbs', gallery);
        ['front', 'back', 'collar', 'linen'].forEach((view) => { const thumb=util.el('div', 'ax-thumb ax-thumb-'+view, thumbs); thumb.innerHTML = /button[ -]down/i.test(p.name) ? `<img src="sites/design-use-shop-variantpick-01/assets/clay-linen-shirt.webp" alt="${view} view">` : productArt(p.name, 15); });
        const info = util.el('div', 'ax-product-copy', head);
        util.el('div', 'ax-kicker', info, 'Everyday collection / responsibly made');
        util.el('h2', '', info, p.name);
        const rating = util.el('div', 'ax-rating', info);
        util.el('span', 'as-inline-icon', rating).innerHTML = ICON.star;
        util.el('span', '', rating, '★★★★★　(24 reviews)');
        util.el('div', 'ax-price', info, cash(p.price));
        util.el('p', 'ax-description', info, 'A classic button-down with a relaxed fit. Made for everyday wear, in natural fabrics and versatile colours.');
        const features = util.el('ul', 'ax-features', info);
        ['Relaxed fit', 'Button-down collar', 'Chest pocket', '100% linen', 'Machine wash cold', 'Imported'].forEach((text) => util.el('li', '', features, text));
      },
    },
  },
});
