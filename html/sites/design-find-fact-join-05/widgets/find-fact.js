// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-join-05',
  name: 'design',
  split: 'train',
  scenarios: ['join'],
  template: 'find-fact/base',
  design: {},
});
