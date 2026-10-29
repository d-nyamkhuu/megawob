// This design places the answer field inside the addition scene.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-addition-05',
  name: 'design',
  split: 'train',
  scenarios: ['addition'],
  template: 'read-figure/scene',
  design: {
    additionInputParent: 'scene',
  },
});
