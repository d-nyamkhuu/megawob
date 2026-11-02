// Keeps this site's Reset Game control from the original guess widget.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-12',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: { resetLabel: 'Reset Game' },
});
