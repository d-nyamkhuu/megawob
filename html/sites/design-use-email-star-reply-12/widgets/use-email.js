// BeOS mail design with a compact row height, custom mailbox list, and side-by-side message view.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-12',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      style: 'beos',
      stack: false,
      rowHeight: 34,
      folderList: ['inbox', 'sent', 'drafts', 'starred', 'trash'],
    },
  });
})();
