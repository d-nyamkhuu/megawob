// Design: personalize the email intro with the sampled radio field label.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-05',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      heading: (base) => (ctx, card) => {
        base(ctx, card);
        card.querySelector('.ds-email-heading p').textContent =
          'Choose a ' + ctx.spec.label.toLowerCase() + ' for Acme Notes.';
      },
    },
  },
});
