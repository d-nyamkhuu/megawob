// Design on templates/click-point/base.js: the base site's click-point widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'click-point',
  site: 'design-click-point-axis-05',
  name: 'design',
  split: 'train',
  scenarios: ['axis'],
  template: 'click-point/base',
  design: {},
});
