// Keep the fixed inline form; site.css supplies its single-column password design.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-07',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    layout: 'inline',
    disabled: 'subtle',
    subtitle: '',
    hint: '',
    foot: false,
    optional: true,
    vars: {
      '--ft-w': '100%',
      '--ft-h': '38px',
      '--ft-gap': '12px',
      '--ft-pad': '26px',
      '--ft-r': '3px',
      '--ft-fs': '16px',
      '--ft-align': 'left',
    },
    title: '',
    cardWidth: '100%',
    sample: null,
  },
});
