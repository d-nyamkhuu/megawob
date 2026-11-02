// This design adds the site's Reset Game control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-08',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: { resetLabel: 'Reset Game' },
});
