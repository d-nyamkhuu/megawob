// Adds this site's Clear All reset control to the shared odd-even widget.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-01',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Clear All',
  },
});
