// Restores this site's Reset Game control in the bottom action area.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-11',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: { resetLabel: 'Reset Game' },
});
