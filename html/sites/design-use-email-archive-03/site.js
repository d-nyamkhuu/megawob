// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-archive-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'File   Edit   Message   Window',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#111',
        'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
        'control': '#fff',
        'accent': '#fff',
        'accentfg': '#000',
        'sel': '#050505',
        'selfg': '#fff',
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
        'site': 'design-use-email-archive-03',
        'scenario': 'archive',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
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
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E, stage } = _c;
            const menu = E('nav', 'workbench-menu', stage);
            for (const t of ['Mail', 'Edit', 'View', 'Message', 'Help']) E('span', '', menu, t);
            const help = E('aside', 'workbench-help', stage);
            E('div', 'help-head', help, 'Help');
            E('p', '', help, 'Use the folders to organize your mail.');
            E('p', '', help, 'Select a message to read it in the panel on the right.');
            E('p', '', help, 'You can reply, forward, delete or archive messages using the buttons above the message.');
            E('p', '', help, 'Use the search box to find messages by sender, subject or keyword.');
            const footer = E('footer', 'desktop-footer workbench-dock', stage);
            footer.hidden = false;
            for (const [icon, label] of [
              ['✉', 'Mail'],
              ['🌐', 'Web'],
              ['▣', 'Contacts'],
              ['▦', 'Calendar'],
              ['☑', 'Tasks'],
            ]) {
              const d = E('div', 'dock-item', footer);
              E('b', '', d, icon);
              E('span', '', d, label);
            }
            Object.assign(_c, { footer, help, menu });
          },
        'frame.13': () => () => {},
        'frame.14': () => () => {},
      },
    },
  });
})();
