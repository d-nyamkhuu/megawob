// Keeps the single-field form inline with no card padding.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-12',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  scrollable: (spec) => !!spec.long,
  template: 'type-text/fields',
  design: {
    layout: 'inline',
    vars: { '--ft-pad': '0px' },
  },
});
