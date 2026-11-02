// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-toast-05',
  name: 'design',
  split: 'train',
  scenarios: ['toast'],
  template: 'act-in-time/base',
  design: {},
});
