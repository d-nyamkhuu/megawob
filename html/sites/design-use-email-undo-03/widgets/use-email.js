// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-email',
  site: 'design-use-email-undo-03',
  name: 'design',
  split: 'train',
  scenarios: ['undo'],
  template: 'use-email/base',
  design: {},
});
