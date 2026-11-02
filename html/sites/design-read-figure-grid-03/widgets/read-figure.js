// Preserve this site's grid scaling behavior from its original widget.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-03',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    gridAspect: 'none',
  },
});
