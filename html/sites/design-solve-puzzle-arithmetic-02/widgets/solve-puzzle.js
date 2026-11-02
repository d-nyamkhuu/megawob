// Arithmetic uses the shared equation and answer field without site-specific changes.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-02',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {},
});
