// Center board design: use the broad workspace and clear control of this site.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-03',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  template: 'click-point/board',
  design: {
    fitMargin: [16, 16],
    fillBoard: true,
    clear: true,
  },
});
