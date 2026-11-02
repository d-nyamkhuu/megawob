// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-media-05',
  name: 'design',
  split: 'train',
  scenarios: ['media'],
  template: 'set-slider/base',
  design: {},
});
