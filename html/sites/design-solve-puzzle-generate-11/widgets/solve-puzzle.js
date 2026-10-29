// Plain generate design; the shared template preserves this site's behavior.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-11',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {},
});
