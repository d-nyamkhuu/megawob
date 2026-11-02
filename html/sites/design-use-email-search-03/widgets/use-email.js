// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'use-email',
  site: 'design-use-email-search-03',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'use-email/base',
  // The design hides the star, archive and delete row icons: those go through the open message's toolbar.
  traits: { search: true, rowIcons: ['important'] },
  design: {},
});
