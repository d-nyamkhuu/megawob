// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded
// from it and restyled through site.css); the design draws a fixed row pane, so the widget fixes layout 'pane'.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-checkout-02',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  traits: { layout: 'pane' },
  template: 'use-shop/base',
  design: {
    parts: {
      // The cart button joins the footer's end controls, so a long end label or the decoy cannot cover it.
      'buildCheckout': (base) => (ctx, body, fr, mode) => {
        for (const n of document.querySelectorAll('.design-footer>.co-cart')) n.remove(); // a re-render builds it again
        const view = base(ctx, body, fr, mode);
        document.querySelector('.design-footer').prepend(fr.top.querySelector('.co-cart'));
        return view;
      },
    },
  },
});
