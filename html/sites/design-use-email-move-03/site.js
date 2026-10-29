// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-move-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'fluent',
        'brand': 'Outlook',
        'nav': '',
        'bg': '#f4f6f8',
        'surface': '#fff',
        'fg': '#171b24',
        'line': '#d8dfe6',
        'title': 'linear-gradient(110deg,#eaf1f7,#d9e3ed)',
        'control': '#fff',
        'accent': '#0878d1',
        'accentfg': '#fff',
        'sel': '#d8eafa',
        'selfg': '#0759a5',
        'font': 'Segoe UI,Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'site': 'design-use-email-move-03',
        'scenario': 'move',
        'platform': 'desktop',
        'account': '',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Items',
          'drafts': 'Drafts',
          'junk': 'Junk Email',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'foot': true,
        'dock': ['▣  Mail', '▦  Calendar', '♙  People', '▤  Files', '☑  Tasks'],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const actions = E('div', 'action-strip', bar);
            for (const [ico, label] of [
              ['▤', 'Delete'],
              ['▣', 'Archive'],
              ['⬡', 'Report'],
              ['▱', 'Move to⌄'],
              ['◇', 'Categorize⌄'],
              ['✉', 'Mark as read'],
              ['•••', '•••'],
            ]) {
              const a = E('span', 'action-item', actions);
              E('span', 'action-icon', a, ico);
              E('span', '', a, label);
            }
            Object.assign(_c, { actions });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, footer } = _c;
            if (C.foot)
              for (const t of C.dock) {
                const d = E('span', 'dock-item', footer, t);
                if (t.indexOf('Mail') === -1) d.className += ' dock-muted';
              }
          },
      },
    },
  });
})();
