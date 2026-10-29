// This design uses the shared odd-even renderer without site-specific part overrides.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-02',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {},
});
