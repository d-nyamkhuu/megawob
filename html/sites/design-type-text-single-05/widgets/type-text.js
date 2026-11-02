// Single-field design: use the shared heading and stacked layout, with fixed labels and no placeholders.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-05',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    label: 'Your answer',
    placeholderField: false,
  },
});
