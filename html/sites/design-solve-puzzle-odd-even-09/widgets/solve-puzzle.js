// Uses the site's CSS parity heading and adds its Clear All reset control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-09',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Clear All',
  },
});
