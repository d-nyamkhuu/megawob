// Uses the shared generate widget with no site-specific widget behavior.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-08',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {},
});
