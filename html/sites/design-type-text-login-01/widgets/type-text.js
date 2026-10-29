// Match the login site's stacked fields and scale the card to fit short stages.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-01',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  design: {
    fit: 'scale',
  },
});
