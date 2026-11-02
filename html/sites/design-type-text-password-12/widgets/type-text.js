// Keep the seeded sampled look, with password fields rendered in the original inline layout.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-12',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    sample: { layout: 'inline' },
  },
});
