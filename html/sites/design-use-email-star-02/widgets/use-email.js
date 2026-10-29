// Human desktop mail with compact rows, Evolution folders and action-target scrolling.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-02',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      style: 'human',
      rowHeight: 35,
      folderList: ['inbox', 'drafts', 'sent', 'junk', 'trash', 'archive'],
      folderLabels: { sent: 'Sent' },
      scrollToRowIcon: true,
    },
  });
})();
