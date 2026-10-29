// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-all-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'win2k',
        'brand': 'Web Mail',
        'nav': 'New Message   │   Reply   │   Reply All   │   Forward   │   Delete   │   Print   │   Go Online',
        'bg': '#c0c0c0',
        'surface': '#fff',
        'fg': '#111',
        'line': '#808080',
        'title': 'linear-gradient(100deg,#061c83,#087dd1)',
        'control': '#d4d0c8',
        'accent': '#0a246a',
        'accentfg': '#111',
        'sel': '#c8d8f1',
        'selfg': '#111',
        'font': 'Tahoma,Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'right:2%;bottom:2%',
        'geo': {
          'folders': 'left:0;top:0;width:13%;height:100%',
          'ledger': 'left:13%;top:0;width:40%;height:100%',
          'document': 'left:53%;top:0;width:47%;height:100%',
          'editor': 'left:53%;top:48%;width:47%;height:52%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-reply-all-02',
        'scenario': 'reply-all',
        'platform': 'desktop',
        'account': '',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Items',
          'drafts': 'Drafts',
          'junk': 'Junk Mail',
          'spam': 'Junk Mail',
          'templates': 'Templates',
          'compose': 'New Message',
        },
        'folderList': ['inbox', 'drafts', 'sent', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'foot': true,
        'dock': ['❔', 'Tip: Select a message to read it. Use Reply, Reply All, or Forward to respond.'],
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E } = _c;
            if (C.nav) {
              const n = E('nav', 'nav', document.body);
              for (const label of C.nav.split(/\s+│\s+/)) {
                const a = E('button', 'chrome-nav', n, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
            }
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
