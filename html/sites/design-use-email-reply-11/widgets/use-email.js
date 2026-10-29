// Swiss mail layout with this site's visible folders and tall message rows.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-11',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      style: 'swiss',
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'spam', 'trash'],
      rowHeight: 112,
    },
  });
})();
