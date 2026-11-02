// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-10',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    rows: 3, labels: ['Brightness', 'Sharpness', 'Contrast'], max: 1000, order: 'swap',
    ticks: 8, fill: false, fillFirst: false, decorative: null,
  },
});
