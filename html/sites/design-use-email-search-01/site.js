// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-search-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'soft-mail',
        'brand': '✉    Mail',
        'nav': 'File   Edit   View   Message   Tools   Help',
        'bg': '#eaf1f6',
        'surface': '#ffffff',
        'fg': '#172033',
        'line': '#dbe5ed',
        'title': 'linear-gradient(#f8fbfd,#e6edf3)',
        'control': '#f7fafc',
        'accent': '#0878f9',
        'accentfg': '#fff',
        'sel': '#e5f1ff',
        'selfg': '#172033',
        'font': 'Arial,sans-serif',
        'site': 'design-use-email-search-01',
        'scenario': 'search',
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
            const { E } = _c;
            const n = E('nav', 'nav', document.body);
            for (const label of C.nav.split(/\s{2,}/)) {
              E('span', 'menu-item', n, label);
            }
            const actions = E('div', 'action-strip', document.body);
            for (const label of [
              '✎   New Email',
              '↶   Reply',
              '↶   Reply All',
              '➦   Forward',
              '▤   Delete',
              '✉   Mark as Read',
              '✉   Mark as Unread',
              '▣   Move⌄',
              '◇   Tags⌄',
              '•••',
            ])
              E('span', 'action-item', actions, label);
            Object.assign(_c, { actions, n });
          },
        'frame.6': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { E, summary } = _c;
            E('div', 'summary-heading', summary, 'Inbox');
            E('div', 'summary-count', summary, '18 messages');
            for (const [icon, num, label] of [
              ['✉', '18', 'Total'],
              ['●', '6', 'Unread'],
              ['↪', '2', 'Replied'],
              ['♧', '3', 'With attachments'],
            ]) {
              const card = E('div', 'summary-card', summary);
              E('span', 'summary-icon', card, icon);
              E('strong', '', card, num);
              E('span', '', card, label);
            }
          },
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
