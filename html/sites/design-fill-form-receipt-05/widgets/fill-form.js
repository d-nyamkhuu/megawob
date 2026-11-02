// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-receipt-05',
  name: 'design',
  split: 'train',
  scenarios: ['receipt'],
  template: 'fill-form/base',
  design: {},
});
