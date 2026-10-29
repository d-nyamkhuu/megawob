// Aqua mail with 41px rows, the full folder list, and no IRIX decorations.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-11',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      style: 'aqua',
      decor: null,
      rowHeight: 41,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
    },
  });
})();
