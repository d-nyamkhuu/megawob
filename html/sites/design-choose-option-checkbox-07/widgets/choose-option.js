// This design fixes checkbox rows to two columns and uses a plural-aware prompt.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-07',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    choiceRows: 2,
    parts: {
      label: (base, S) => (ctx, field) =>
        ctx.util.el(
          'div',
          'fp-label',
          field,
          'Choose from the list of ' + (ctx.spec.plural || ctx.spec.label.toLowerCase()) + ' below:',
        ),
    },
  },
});
