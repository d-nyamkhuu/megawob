// Keeps the original fixed inline form look and disables the password scenario's sampled layout.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-11',
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
    gridClass: 'stacked',
    sample: null,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      },
    },
  },
});
