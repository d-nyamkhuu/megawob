// White canvas background; all crop behavior uses the shared default design.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-04',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.4 },
  template: 'crop-image/box',
  design: {
    background: '#fff',
  },
});
