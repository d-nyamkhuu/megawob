// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-coupon-01',
  name: 'design',
  split: 'train',
  scenarios: ['coupon'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingPainted': (base, S) => function (view, m) {
        const { s, pane, summary } = view;
        if (s.scenario === 'coupon') {
          const direct = (selector) => pane.querySelector(`:scope > ${selector}`);
          const headings = [...pane.querySelectorAll(':scope > h3')];
          const promoHeading = headings.find((el) => el.textContent.includes('promo code'));
          const offersHeading = headings.find((el) => el.textContent === 'Your offers');
          const form = direct('.ax-form');
          const notice = direct('.ax-notice');
          const offers = [...pane.children].filter((el) => el.classList.contains('ax-order'));
          summary.prepend(...[offersHeading, ...offers, promoHeading, form, notice].filter(Boolean));
        }
      },
    },
  },
});
