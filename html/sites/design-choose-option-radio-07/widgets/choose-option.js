// Riverton Journal copy replaces the default email note and content section.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-07',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    emailNote: 'Choose how often you’d like to receive email updates from the Riverton Journal.',
    parts: {
      emailContent: (base, S) => (ctx, card) => {
        const decoys = ctx.util.el('section', 'ds-email-content', card);
        ctx.util.el('p', '', decoys, 'You can change your preferences at any time.');
      },
    },
  },
});
