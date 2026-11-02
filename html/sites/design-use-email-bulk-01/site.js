// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-bulk-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'extranet',
        'brand': 'Acme Partners   Extranet',
        'nav': 'Home   Mail   Documents   Projects   Directory   Calendar   Admin',
        'bg': '#dce7ef',
        'surface': '#fff',
        'fg': '#10284a',
        'line': '#91a9c2',
        'title': 'linear-gradient(#f2f6f9,#dbe4ec)',
        'control': '#e5edf3',
        'accent': '#b54617',
        'accentfg': '#fff',
        'sel': '#c4ddfa',
        'selfg': '#10284a',
        'font': 'Arial,sans-serif',
        'note': 'right:2%;top:8%;width:27%',
        'end': 'right:2%;bottom:2%',
        'site': 'design-use-email-bulk-01',
        'scenario': 'bulk',
        'platform': 'desktop',
        'account': 'Welcome, Alex Turner　 |　 My Account　 |　 Help　 |　 Sign Out',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose Mail',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 42,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
