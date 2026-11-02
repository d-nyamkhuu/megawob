// This design adds the site's Clear All control to the shared odd-even renderer.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-07',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Clear All',
  },
});
