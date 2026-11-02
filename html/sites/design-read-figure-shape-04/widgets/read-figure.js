// Swiss shape design; tolerate page frame without a menu.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-04',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    optionalMenu: true,
  },
});
