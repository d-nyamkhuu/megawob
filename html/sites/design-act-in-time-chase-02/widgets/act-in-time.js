// Uses title-cased metric labels and places its side panel first in the footer.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-02',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    elapsedLabel: 'Time Elapsed',
    insideLabel: 'Time Inside Circle',
    sideTarget: '.ds-footer',
    sidePlacement: 'prepend',
  },
});
