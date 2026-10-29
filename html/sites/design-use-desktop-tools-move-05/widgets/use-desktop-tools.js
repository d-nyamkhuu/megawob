// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-desktop-tools/base',
  design: {},
});
