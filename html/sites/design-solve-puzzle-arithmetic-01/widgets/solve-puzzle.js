// This arithmetic design uses the shared equation widget without site-specific behavior changes.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-01',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {},
});
