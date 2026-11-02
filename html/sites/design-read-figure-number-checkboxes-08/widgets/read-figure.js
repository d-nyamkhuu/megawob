// This design uses larger pixel grids and labels its reset control “Clear All”.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-08',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear All',
    pixelMax: 54,
    pixelGap: 7,
  },
});
