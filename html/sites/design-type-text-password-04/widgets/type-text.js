// This design uses the shared sampled password form look without additional overrides.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-04',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    floating: false,
    labelWithPlaceholder: false,
  },
});
