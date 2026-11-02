// Academic mail design: retain this site's sparse layout and its original folder names and row scale.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-11',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      style: 'academic',
      rowHeight: 67,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      folderLabels: { sent: 'Sent' },
    },
  });
})();
