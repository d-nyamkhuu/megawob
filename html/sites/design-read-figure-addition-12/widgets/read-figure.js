// This design uses blue cube faces with a dark blue outline.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-addition-12',
  name: 'design',
  split: 'train',
  scenarios: ['addition'],
  template: 'read-figure/scene',
  design: {
    cubeFaces: ['#4c7cf3', '#2456d8', '#1747b9'],
    cubeStroke: '#174bc5',
  },
});
