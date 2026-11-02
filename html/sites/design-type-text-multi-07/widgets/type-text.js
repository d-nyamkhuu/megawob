// Multi-field design: labels always use a colon, without optional markers.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-07',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    optional: false,
    labelSuffix: ':',
  },
});
