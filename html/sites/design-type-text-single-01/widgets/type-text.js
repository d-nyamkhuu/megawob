env.widget({
  task: 'type-text',
  site: 'design-type-text-single-01',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    layout: 'inline',
    optional: false,
    vars: { '--ft-w': '31.8vw', '--ft-h': '2.75vw', '--ft-r': '2px' },
    title: 'Verification Code',
    label: 'Verification Code:',
  },
});
