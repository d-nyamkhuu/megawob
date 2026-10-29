// This design keeps the original password form's label-free placeholder layout.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-08',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    labelWithPlaceholder: false,
  },
});
