// White canvas and reference crop geometry distinguish this design from the default-01 medoid.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-03',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.38, placement: 'center', startBox: { x: 0.33, y: 0.3, w: 0.32, h: 0.38 } },
  template: 'crop-image/box',
  design: {
    background: '#fff',
  },
});
