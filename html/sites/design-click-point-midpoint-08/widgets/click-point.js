// The midpoint preset reproduces this site's black points, labels and sampled construction grid.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-08',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  template: 'click-point/board',
  design: {},
});
