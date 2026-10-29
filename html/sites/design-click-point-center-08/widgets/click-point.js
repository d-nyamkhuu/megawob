// Center board design: fill the available stage area and enable the frame's Clear control.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-08',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  template: 'click-point/board',
  design: {
    fitMargin: [16, 32],
    fillBoard: true,
    clear: true,
  },
});
