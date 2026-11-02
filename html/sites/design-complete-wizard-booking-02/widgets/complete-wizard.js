// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-booking-02',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-wizard/stepper',
  design: {
    title: null,
    titleSize: '20px',
    cardRadius: '0px',
    labelWidth: '185px',
    bodySlack: 18,
    look: {
      ind: 'circles', flat: true, title: false, stepHead: true, tiles: false,
      switches: false, rowRadios: true, stars: false, hints: true,
      foot: 'right', cols: 1, inline: true, width: 840, h: 46,
      r: 0, pad: 0, gap: 18,
    },
  },
});
