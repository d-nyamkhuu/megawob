// Places this site's Reset control in its button row.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-color-06',
  name: 'design',
  split: 'train',
  scenarios: ['color'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Reset',
    resetParent: '.btns',
  },
});
