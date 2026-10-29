// Thunderbird design with Spam in the folder list and taller rows scaled to the mail surface.
env.widget({
  task: 'use-email',
  site: 'design-use-email-important-06',
  name: 'design',
  split: 'train',
  scenarios: ['important'],
  template: 'use-email/mail',
  design: {
    folderList: ['inbox', 'sent', 'drafts', 'spam', 'trash'],
    rowHeight: 53.5,
    rowBasis: 'root',
  },
});
