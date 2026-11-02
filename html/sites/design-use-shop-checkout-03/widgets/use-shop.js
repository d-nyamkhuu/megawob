// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded
// from it and restyled through site.css); the design draws a fixed row pane, so the widget fixes layout 'pane'.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-checkout-03',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  traits: { layout: 'pane' },
  template: 'use-shop/base',
  design: {
    parts: {
      // Horizontal filters leave less vertical room than the template's sidebar.
      'pitchFor': (base) => (pane, bottom, rows, gap, lo, hi, reserve) =>
        base(pane, bottom, rows, gap, 1, hi, reserve),
      // The top-bar controls stand in for the frame's static search box, cart tile and rail items (they hide).
      'buildCheckout': (base) => (ctx, body, fr, mode) => {
        for (const n of document.querySelectorAll('.slot-live')) n.remove(); // a re-render builds them again
        const view = base(ctx, body, fr, mode);
        const slot = (live, old, icon) => {
          live.classList.add('slot-live');
          if (icon) live.prepend(Object.assign(document.createElement('span'), { className: 'rail-icon', textContent: icon }));
          old.before(live);
          old.classList.add('slot-hide');
        };
        const [shop, order, track] = fr.top.querySelectorAll('.co-nb');
        const [, oShop, oDeals, oOrders] = document.querySelectorAll('.rail-item');
        slot(fr.top.querySelector('.co-search'), document.querySelector('.search-box'));
        slot(fr.top.querySelector('.co-cart'), document.querySelector('.cart-summary'));
        slot(shop, oShop, '◇'); slot(order, oDeals, '▣'); slot(track, oOrders, '➜');
        return view;
      },
    },
  },
});
