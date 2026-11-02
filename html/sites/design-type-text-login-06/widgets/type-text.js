// Sign In heading on the shared stacked login form.
(function () {
  'use strict';

  env.widget({
    task: 'type-text',
    site: 'design-type-text-login-06',
    name: 'design',
    split: 'train',
    scenarios: ['login'],
    scrollable: (spec) => !!spec.long,
    template: 'type-text/fields',
    design: { title: 'Sign In' },
  });
})();
