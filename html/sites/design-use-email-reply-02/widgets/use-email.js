// Precision mail with taller message rows and sender avatar initials.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-02',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      style: 'precision',
      rowHeight: 95,
      parts: {
        rowSender: (base) => (r, e, i) => {
          const sender = base(r, e, i);
          sender.dataset.initial = e.name[0];
          return sender;
        },
      },
    },
  });
})();
