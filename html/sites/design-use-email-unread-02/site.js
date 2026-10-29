// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-unread-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'StarMail',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#081b3d',
        'line': '#9bb8d7',
        'title': 'linear-gradient(105deg,#0753a4,#1680c8)',
        'control': 'linear-gradient(#edf5fb,#c5d9ee)',
        'accent': '#f6d84a',
        'accentfg': '#092b62',
        'sel': '#d5e8fa',
        'selfg': '#081b3d',
        'font': 'Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-unread-02',
        'scenario': 'unread',
        'platform': 'desktop',
        'account': 'Your Email Online',
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
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            E('span', 'mailmark', bar, '✉');
            E('span', 'brand', bar, C.brand);
          },
        'frame.5': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const menu = E('nav', 'app-menubar', document.body);
            for (const label of ['File', 'Edit', 'View', 'Message', 'Tools', 'Help']) E('span', '', menu, label);
            const actions = E('div', 'actionbar', document.body);
            for (const [icon, label] of [
              ['✎', 'Compose'],
              ['↶', 'Reply'],
              ['↶', 'Reply All'],
              ['➜', 'Forward'],
              ['▤', 'Delete'],
              ['✉', 'Mark Unread'],
              ['📁', 'Move To'],
              ['▣', 'Print'],
            ]) {
              const b = E('button', 'action-button', actions);
              E('b', 'action-icon', b, icon);
              E('span', '', b, label);
            }
            Object.assign(_c, { actions, menu });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const help = E('aside', 'help-panel', document.body);
            E('h2', 'help-title', help, '❔　Mail Help');
            E('h3', '', help, 'Working with your mail');
            E('p', '', help, 'Use the checkboxes to select messages, then choose an action from the toolbar above.');
            E('hr', '', help);
            E('h3', '', help, 'Tips');
            for (const tip of [
              'Click a message to read it.',
              'Use Search to find messages by sender, subject or keywords.',
              'To mark a message as unread, select it and click Mark Unread on the toolbar.',
              'Move messages to organize your mailbox.',
            ])
              E('p', 'tip', help, tip);
            E('hr', '', help);
            E('h3', '', help, 'Folders');
            E('p', '', help, 'Your folders are across the top of the inbox. Click a folder to view those messages.');
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { footer, help });
          },
      },
    },
  });
})();
