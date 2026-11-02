// This design uses a gray canvas and keeps the original aspect trait.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-09',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.95 },
  template: 'crop-image/box',
  design: {
    background: '#bfc1c3',
  },
});
