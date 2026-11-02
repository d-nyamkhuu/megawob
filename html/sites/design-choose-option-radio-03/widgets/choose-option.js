// Design on choose-option/radio with shipping copy and card-position-aware scaling.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-03',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      heading: () => (ctx, card) => {
        const { util } = ctx;
        const head = util.el('header', 'ds-email-heading', card);
        util.el('div', 'ds-step', head, 'Step 2 of 3');
        util.el('h1', '', head, 'Shipping & Delivery');
        util.el('p', '', head, 'Choose how you want to receive your order.');
      },
      scale: () => (ctx, card) => {
        const height = card.offsetHeight;
        const ratio = Math.min(1, (ctx.size.height - card.offsetTop - 8) / height);
        if (ratio < 1) {
          card.style.transformOrigin = 'top left';
          card.style.transform = `scale(${ratio})`;
        }
      },
    },
  },
});
