// Login design: use colon labels and hide field placeholders.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-11',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  scrollable: (spec) => !!spec.long,
  template: 'type-text/fields',
  design: {
    optional: false,
    labelSuffix: ':',
    placeholderField: false,
  },
});
