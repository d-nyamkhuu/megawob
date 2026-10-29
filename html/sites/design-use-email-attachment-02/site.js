// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-attachment-02',
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
        'site': 'design-use-email-attachment-02',
        'scenario': 'attachment',
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
        'frame.3': (base, S) =>
          function (_c) {
            const { E } = _c;
            const title = E('header', 'desktop-bar', document.body);
            E('span', 'brand', title, 'Mail');
            const bar = E('nav', 'menu-bar', document.body);
            for (const label of ['File', 'Edit', 'View', 'Message', 'Tools', 'Help']) {
              const a = E('button', 'chrome-nav', bar, label);
              a.type = 'button';
              a.addEventListener('click', () => env.log('decoy', { label }));
            }
            const tools = E('div', 'app-toolbar', document.body);
            const glyphs = [
              ['Compose', '<path d="M3 17.5V21h3.5L19 8.5 15.5 5 3 17.5Z"/><path d="m13.8 6.7 3.5 3.5M3 4h9"/>'],
              ['Reply', '<path d="M9 7 3 12l6 5"/><path d="M4 12h8a6 6 0 0 1 6 6"/>'],
              ['Reply All', '<path d="m8 7-6 5 6 5M14 7l-6 5 6 5"/><path d="M9 12h5a5 5 0 0 1 5 5"/>'],
              ['Forward', '<path d="m12 7 6 5-6 5"/><path d="M18 12h-8a6 6 0 0 0-6 6"/>'],
              ['Delete', '<path d="M4 6h16M9 6V4h6v2m3 0-1 14H7L6 6m4 4v6m4-6v6"/>'],
              ['Move', '<path d="M3 7h6l2 2h10v10H3z"/><path d="M3 7V5h7l2 2"/>'],
              ['Label', '<path d="m3 11 8-8h7l3 3v7l-8 8-10-10Z"/><circle cx="15" cy="8" r="1"/>'],
              ['More', '<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>'],
            ];
            for (const [label, path] of glyphs) {
              const b = E('button', 'tool-item', tools);
              b.type = 'button';
              const icon = E('span', 'tool-icon', b);
              icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>';
              E('span', '', b, label);
            }
            Object.assign(_c, { bar, glyphs, title, tools });
          },
        'frame.4': () => () => {},
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const cols = E('div', 'column-head', document.body);
            E('span', '', cols, 'From');
            E('span', '', cols, 'Subject');
            E('span', '', cols, 'Date⌄');
            const recent = E('aside', 'recent-strip', document.body);
            E('h2', '', recent, 'Recent');
            for (const [ico, date] of [
              ['mail', '10:24 AM'],
              ['mail', '9:17 AM'],
              ['doc', '8:52 AM'],
              ['doc', 'Apr 22'],
              ['doc', 'Apr 21'],
              ['doc', 'Apr 21'],
              ['doc', 'Apr 20'],
              ['mail', 'Apr 19'],
            ]) {
              const row = E('div', 'recent-row', recent);
              const mark = E('span', 'recent-ico', row);
              mark.innerHTML =
                ico === 'mail'
                  ? '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>'
                  : '<svg viewBox="0 0 24 24"><path d="M6 2.5h8l5 5V21H6z"/><path d="M14 2.5V8h5M9 12h7M9 16h7"/></svg>';
              E('span', '', row, date);
            }
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { cols, footer, recent });
          },
      },
    },
  });
})();
