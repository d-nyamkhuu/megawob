// Keeps the side panel in the arena and ignores synthetic stationary pointer events.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-12',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    sideTarget: null,
    motionOnly: true,
  },
});
