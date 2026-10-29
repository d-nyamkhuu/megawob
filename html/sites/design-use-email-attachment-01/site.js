// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-attachment-01',
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
        'site': 'design-use-email-attachment-01',
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
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const summary = E('aside', 'glass-summary', document.body);
            E('h3', '', summary, 'Account');
            const account = E('div', 'summary-account', summary);
            E('span', 'avatar', account, 'JS');
            const identity = E('div', '', account);
            E('strong', '', identity, 'Jamie Smith');
            E('span', 'summary-email', identity, 'jamie.smith@example.com');
            E('hr', '', summary);
            E('h3', '', summary, 'Mailbox');
            for (const [icon, label, count] of [
              ['<rect x="2.5" y="4" width="15" height="12" rx="1.5"/><path d="m3 5 7 5.5L17 5"/>', 'Inbox', '8'],
              ['<path d="m10 2 2.4 5 5.4.7-3.9 3.8.9 5.4L10 14.3l-4.8 2.6.9-5.4-3.9-3.8 5.4-.7z"/>', 'Starred', '2'],
              ['<path d="M17.5 2.5 8.6 11.4M17.5 2.5l-5.6 15-3.3-6.1-6.1-3.3z"/>', 'Sent', '24'],
              ['<path d="M5 2.5h6.5L15 6v11.5H5z"/><path d="M11.5 2.5V6H15"/>', 'Drafts', '1'],
              ['<path d="M3.5 5.5h13M8 5.5V3.5h4v2M5 5.5l1 11h8l1-11M8 8.5v5m4-5v5"/>', 'Trash', '4'],
              [
                '<rect x="2.5" y="3.5" width="15" height="4" rx="1"/><path d="M3.5 7.5v9h13v-9M8 11h4"/>',
                'Archive',
                '12',
              ],
            ]) {
              const row = E('div', 'summary-row', summary);
              const ico = E('span', 'summary-icon', row);
              ico.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${icon}</svg>`;
              E('span', '', row, label);
              E('span', 'summary-count', row, count);
            }
            E('hr', '', summary);
            E('h3', '', summary, 'Storage');
            const meter = E('div', 'storage-meter', summary);
            E('i', '', meter);
            E('div', 'storage-caption', summary, '6.2 GB of 15 GB used');
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { account, footer, identity, meter, summary });
          },
        'frame.22': (base, S) =>
          function (_c) {
            for (const e of document.body.querySelectorAll('.task-note,.obstruction')) {
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
      },
    },
  });
})();
