// This design shortens the sample caption to match the site's original page.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-05',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    sampleLabel: 'Sample',
  },
});
