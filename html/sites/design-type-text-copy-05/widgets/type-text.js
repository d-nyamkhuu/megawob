// Design on templates/type-text/base.js: the base site's type-text widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'type-text',
  site: 'design-type-text-copy-05',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'type-text/base',
  design: {},
});
