// Design on templates/set-date/base.js: the base site's set-date widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-date',
  site: 'design-set-date-duration-05',
  name: 'design',
  split: 'train',
  scenarios: ['duration'],
  template: 'set-date/base',
  design: {},
});
