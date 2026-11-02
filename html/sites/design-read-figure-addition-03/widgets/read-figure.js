// This design uses the site's blue cube faces and dark outline.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-addition-03',
  name: 'design',
  split: 'train',
  scenarios: ['addition'],
  template: 'read-figure/scene',
  design: {
    cubeFaces: ['#8fc8f4', '#5595d8', '#28639f'],
    cubeStroke: '#111820',
  },
});
