// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-signup-01',
  name: 'design',
  split: 'train',
  scenarios: ['signup'],
  template: 'complete-wizard/stepper',
  design: {
    look: {
      flat: true, title: false, stepHead: false,
      inline: true, foot: 'right', width: 850,
      h: 42, pad: 26, gap: 16, stars: false, hints: false,
    },
    labelWidth: '190px',
    cardRadius: '0px',
  },
});
