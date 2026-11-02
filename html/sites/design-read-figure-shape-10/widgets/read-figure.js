// Uses a three-row board and the Swiss menu labels.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-10',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    boardColumns: 5,
    boardRows: 3,
    menuLabels: ['File', 'Edit', 'View', 'Tools', 'Help'],
  },
});
