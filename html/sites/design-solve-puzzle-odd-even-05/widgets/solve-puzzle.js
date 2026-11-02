// This design uses the default odd-even rows and adds the site's Clear All reset button.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-05',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: { resetLabel: 'Clear All' },
});
