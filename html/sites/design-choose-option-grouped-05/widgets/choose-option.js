// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-grouped-05',
  name: 'design',
  split: 'train',
  scenarios: ['grouped'],
  template: 'choose-option/base',
  design: {},
});
