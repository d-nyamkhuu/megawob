// Developer mail layout with taller message rows on the shared forward preset.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-11',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      style: 'developer',
      rowHeight: 110,
    },
  });
})();
