// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-checkout-04',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  traits: { layout: 'page' },
  template: 'use-shop/base',
  design: {
    parts: {
      // The design draws a card grid that scrolls inside the window, so the widget fixes layout 'page'.
      // The inspector shows the first product; the top-bar controls sit over the toolbar's static buttons.
      'buildCheckout': (base, S) => (ctx, body, fr, mode) => {
        const view = base(ctx, body, fr, mode);
        const product = ctx.spec.products[0];
        const art = document.querySelector('.product-inspector .inspector-art');
        if (product && art) art.innerHTML = S.productArt(product.name, product.hue);
        const cover = (live, old, icon) => {
          if (icon) live.prepend(Object.assign(document.createElement('b'), { className: 'tool-icon', textContent: icon }));
          const r = old.getBoundingClientRect();
          for (const [k, v] of [['left', r.left], ['top', r.top], ['width', r.width], ['height', r.height]]) live.style.setProperty(k, v + 'px', 'important');
          live.classList.add('slot-live');
          old.classList.add('slot-hide');
        };
        const [shop, order, track] = fr.top.querySelectorAll('.co-nb');
        const [oHome, , oCats, oCart, oOrders] = document.querySelectorAll('.tool-button');
        cover(shop, oHome, '⌂'); cover(track, oCats, '▤'); cover(fr.top.querySelector('.co-cart'), oCart); cover(order, oOrders, '▤');
        return view;
      },
    },
  },
});
