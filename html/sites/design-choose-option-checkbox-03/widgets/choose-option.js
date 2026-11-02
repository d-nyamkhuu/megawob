// This design moves the field label into the amenity heading and fits the card to the rendered stage.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-03',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      build: (base, S) => (field, ctx) => {
        base(field, ctx);
        const heading = ctx.stage.closest('.ds-amen').querySelector('.ds-amen-heading');
        heading.replaceChildren(field.querySelector('.fp-label'));
      },
      scale: () => (ctx, card) => {
        const rr = card.getBoundingClientRect();
        const available = Math.min(ctx.size.height, ctx.stage.getBoundingClientRect().height);
        const ratio = Math.min(1, Math.max(0, available - 10) / rr.height);
        if (ratio < 1) {
          card.style.transformOrigin = 'top left';
          card.style.transform = `scale(${ratio})`;
        }
      },
    },
  },
});
