// This design keeps the transform field's site-specific “Your answer” label.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-11',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: { label: 'Your answer' },
});
