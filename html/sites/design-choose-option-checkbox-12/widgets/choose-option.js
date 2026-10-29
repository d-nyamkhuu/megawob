// This design fills checkbox columns top to bottom and places the field label above the card.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-12',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    choiceFlow: 'column',
    parts: {
      decorated: (base) => (ctx, card, field) => {
        base(ctx, card, field);
        const heading = field.querySelector('.fp-label');
        const content = ctx.stage.closest('.ds-content');
        content.insertBefore(heading, content.firstChild);
      },
    },
  },
});
