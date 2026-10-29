// Match this widget's responsive CSS sizing of the choice card.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-06',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    freeze: false,
    parts: {
      scale: (base, S) => (ctx, card) => {
        card.style.setProperty('--fp-stage-h', Math.max(0, ctx.size.height - 4) + 'px');
        const ratio = Math.min(1, Math.max(0, ctx.size.height - 8) / card.offsetHeight);
        if (ratio < 1) card.style.setProperty('--fp-fit', ratio);
        card.style.height = card.offsetHeight + 'px';
      },
    },
  },
});
