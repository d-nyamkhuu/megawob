// This design matches the hot-cold medoid; the shared template defaults preserve its behavior.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-hot-cold-10',
  name: 'design',
  split: 'train',
  scenarios: ['hot-cold'],
  template: 'solve-puzzle/hot-cold',
  design: {},
});
