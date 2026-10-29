// Keeps Unicode actions limited to the form submit control and clear-text control.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-09',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  template: 'handle-text/editor',
  design: {
    unicodeControls: '.submit[data-placement="form"],.clear-text',
  },
});
