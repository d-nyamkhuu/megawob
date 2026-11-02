// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the product grid fixed to the page layout.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-checkout-01',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  traits: { layout: 'page' },
  template: 'use-shop/base',
  design: {},
});
