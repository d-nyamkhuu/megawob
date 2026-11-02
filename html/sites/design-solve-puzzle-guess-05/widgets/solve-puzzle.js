// Adds this site's reference reset control to the shared guess design.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-05',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: { resetLabel: 'Reset Game' },
});
