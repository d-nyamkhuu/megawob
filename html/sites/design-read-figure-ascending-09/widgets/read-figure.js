// Places recovery and reset controls in the footer, with this site's Clear label.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-09',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear',
    recoveryParent: '.bottom',
  },
});
