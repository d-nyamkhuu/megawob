// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-move-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mail',
        'brand': '✉  Mail',
        'nav': 'File   Edit   View   Message   Folder   Tools   Help',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#26364b',
        'line': '#dce1e7',
        'title': '#fff',
        'control': '#fff',
        'accent': '#168273',
        'accentfg': '#fff',
        'sel': '#e0f2ee',
        'selfg': '#14594f',
        'font': 'Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:0;top:0;width:20%;height:100%',
          'ledger': 'left:20%;top:0;width:80%;height:100%',
          'document': 'display:none',
          'editor': 'display:none',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-move-02',
        'scenario': 'move',
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
        'foot': true,
        'dock': ['Tip: Select one or more messages to move them to another folder using the Move to menu.'],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const tools = E('div', 'reference-tools', document.body);
            const toolItems = [
              ['▧', 'Compose'],
              ['↶', 'Reply'],
              ['↶', 'Reply All'],
              ['➜', 'Forward'],
              ['▤', 'Delete'],
              ['▱', 'Move to'],
              ['◇', 'More'],
            ];
            for (const [icon, label] of toolItems) {
              const b = E('button', 'reference-tool', tools);
              b.type = 'button';
              E('span', 'reference-tool-icon', b, icon);
              E('span', '', b, label);
              if (label === 'Move to' || label === 'More') E('span', 'reference-caret', b, '▾');
            }
            Object.assign(_c, { toolItems, tools });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
