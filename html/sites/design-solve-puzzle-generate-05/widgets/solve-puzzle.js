// Plain generate design; the shared template defaults preserve this site's behavior.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-05',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {},
});
