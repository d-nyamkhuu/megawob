// Design of this site on the use-email/mail template (templates/use-email/mail.js).
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-02',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      style: 'riso',
      rowHeight: 66,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
    },
  });
})();
