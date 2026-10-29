// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-bulk-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'win11',
        'brand': 'Outlook',
        'nav': '',
        'bg': '#0b0f14',
        'surface': '#171b21',
        'fg': '#e6eaf0',
        'line': '#30363f',
        'title': 'linear-gradient(110deg,#222831,#15191f)',
        'control': '#20252c',
        'accent': '#168eea',
        'accentfg': '#fff',
        'sel': '#12365c',
        'selfg': '#f2f7ff',
        'font': 'Segoe UI,Arial,sans-serif',
        'note': 'right:1%;top:7%;width:22%',
        'end': 'left:2%;bottom:8%',
        'geo': {},
        'site': 'design-use-email-bulk-04',
        'scenario': 'bulk',
        'platform': 'desktop',
        'account': '',
        'noteTitle': '',
        'folderLabels': {
          'sent': 'Sent Items',
          'drafts': 'Drafts',
          'junk': 'Junk Email',
          'spam': 'Junk Email',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 82,
        'stack': false,
        'foot': true,
        'dock': ['Mail', 'Calendar', 'People', 'Tasks', 'Apps'],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const tips = E('aside', 'tips-panel', document.body);
            tips.innerHTML =
              '<div class="tips-head"><span>♧</span><b>Tips</b><button type="button" aria-label="Close tips">×</button></div><section><strong>☑　 Select multiple messages</strong><p>Use the checkboxes in the message list to select one or more messages.</p></section><section><strong>☑　 Select all</strong><p>Use the checkbox at the top of the list to select all messages on this page.</p></section><section><strong>☆　 Manage messages</strong><p>After selecting messages, you can mark them as important, star them, move, or delete them using the toolbar above the list.</p></section><section><strong>⌕　 Find messages</strong><p>Use the search box to find messages by sender, subject, or keywords.</p></section><section><strong>▦　 Keyboard shortcuts</strong><p>Ctrl + A　　 Select all messages<br>Ctrl + Shift + I　 Mark as read<br>Ctrl + Shift + U　 Mark as unread<br>Ctrl + D　　 Delete</p></section><a>Learn more about Outlook　↗</a>';
            tips.querySelector('button').addEventListener('click', () => tips.remove());
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { footer, tips });
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, footer } = _c;
            if (C.foot) for (const t of C.dock) E('span', 'dock-item', footer, t);
          },
      },
    },
  });
})();
