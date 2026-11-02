// XP styling, compact message rows and the site's custom mailbox list.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-11',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      style: 'xp',
      rowHeight: 40,
      folderList: ['inbox', 'sent', 'drafts', 'junk', 'trash'],
      folderLabels: {
        sent: 'Sent',
        drafts: 'Drafts',
        junk: 'Junk',
        spam: 'Spam',
        templates: 'Templates',
        compose: 'Compose',
      },
    },
  });
})();
