// Extranet mail with 43-pixel rows, the standard folder list, and no Print toolbar button.
env.widget({
  task: 'use-email',
  site: 'design-use-email-delete-02',
  name: 'design',
  split: 'train',
  scenarios: ['delete'],
  template: 'use-email/mail',
  design: {
    style: 'extranet',
    rowHeight: 43,
    folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
    toolbarAfter: [],
  },
});
