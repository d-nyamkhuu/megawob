// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-compose-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'lisa',
        'brand': 'Web Mail',
        'nav': 'Mail   Contacts   Calendar   Workspaces   Settings',
        'bg': '#f4f2e9',
        'surface': '#f7f6f0',
        'fg': '#111',
        'line': '#222',
        'title': 'linear-gradient(#f8f7f1,#e8e6de)',
        'control': '#f7f6f0',
        'accent': '#e5e2d9',
        'accentfg': '#111',
        'sel': '#c9c7c0',
        'selfg': '#111',
        'font': 'Georgia,serif',
        'site': 'design-use-email-compose-04',
        'scenario': 'compose',
        'platform': 'desktop',
        'account': '',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const win = E('div', 'window-controls', bar);
            for (const glyph of ['−', '□', '×']) E('span', 'window-control', win, glyph);
            const tabs = E('nav', 'app-tabs', document.body);
            if (C.nav) {
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav', tabs, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
            }
            Object.assign(_c, { tabs, win });
          },
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
