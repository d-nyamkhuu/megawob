// Uses the shared color widget with this site's target caption.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-03',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: { sampleLabel: 'Target color:' },
});
