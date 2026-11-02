// Toggles the empty class on each field wrapper to match this site's original design.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-09',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    emptyClass: 'empty',
  },
});
