// Design on templates/solve-puzzle/base.js: the base site's solve-puzzle widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-compute-03',
  name: 'design',
  split: 'train',
  scenarios: ['compute'],
  template: 'solve-puzzle/base',
  design: {},
});
