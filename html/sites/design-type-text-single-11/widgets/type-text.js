// This design keeps the single-field card stacked and uses its original lowercase, punctuated heading.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-11',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    title: 'Your answer:',
  },
});
