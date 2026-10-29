// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-move-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gnome-human',
        'brand': 'Web Mail',
        'nav': '',
        'bg': '#f1eee7',
        'surface': '#fff',
        'fg': '#171717',
        'line': '#c8c0b4',
        'title': 'linear-gradient(#77604c,#4b382a)',
        'control': '#f6f3ed',
        'accent': '#e98332',
        'accentfg': '#171717',
        'sel': '#f5a052',
        'selfg': '#171717',
        'font': 'Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {},
        'site': 'design-use-email-move-01',
        'scenario': 'move',
        'platform': 'desktop',
        'account': '',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Spam',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'drafts', 'sent', 'spam', 'trash'],
        'rowHeight': 40,
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
