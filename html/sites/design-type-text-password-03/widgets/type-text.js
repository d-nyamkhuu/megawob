// Preserve this site's sampled forms, including its label-as-placeholder style.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-03',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    labelWithPlaceholder: false,
    placeholderLayout: 'label',
  },
});
