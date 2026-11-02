// Adds the empty-field caret marker used by this site's text inputs.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-01',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    emptyClass: 'ft-empty',
  },
});
