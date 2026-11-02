// Filters synthetic stationary pointer events and places chase metrics in the header readout.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-03',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    metricsTarget: '.ds-readout',
    motionOnly: true,
  },
});
