// Keep the password form's sampled sizing while rendering every trial in the inline layout.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-05',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    sample: { layout: 'inline' },
  },
});
