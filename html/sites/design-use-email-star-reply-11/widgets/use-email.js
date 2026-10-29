// RISC OS presentation, with this site's folder set and an unstacked message view.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-11',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      style: 'risc',
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'junk'],
      stack: false,
    },
  });
})();
