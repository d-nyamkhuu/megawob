// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-attachment-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gnome',
        'brand': '✉   Mail',
        'nav': '',
        'bg': '#f4f6f8',
        'surface': '#fff',
        'fg': '#111827',
        'line': '#d8dee7',
        'title': 'linear-gradient(#edf0f3,#e5e9ed)',
        'control': '#fff',
        'accent': '#1769ed',
        'accentfg': '#fff',
        'sel': '#dbeafe',
        'selfg': '#111827',
        'font': '"DejaVu Sans Mono",monospace',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-attachment-03',
        'scenario': 'attachment',
        'platform': 'desktop',
        'account': '☷    −    □    ×',
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
        'rowHeight': 76,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const summary = E('section', 'mail-summary', document.body);
            E('h1', '', summary, 'Welcome back!');
            E('p', '', summary, 'You have 12 unread messages in your inbox.');
            const cards = E('div', 'summary-cards', summary);
            for (const [icon, label, value] of [
              ['▱', 'Inbox', '12 unread'],
              ['➤', 'Sent', '342 messages'],
              ['▤', 'Drafts', '4 messages'],
              ['▢', 'Trash', '3 messages'],
            ]) {
              const card = E('div', 'summary-card', cards);
              E('span', 'summary-icon', card, icon);
              const txt = E('span', '', card);
              E('b', '', txt, label);
              E('strong', '', txt, value);
            }
            const tips = E('aside', 'tips-card', summary);
            E('b', '', tips, '♧  Tips');
            E(
              'p',
              '',
              tips,
              'You can forward a message to share it with others. Attachments are included automatically.',
            );
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { cards, footer, summary, tips });
          },
      },
    },
  });
})();
