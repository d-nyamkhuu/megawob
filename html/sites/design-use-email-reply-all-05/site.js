// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-all-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Mail',
        'nav': '',
        'bg': '#eef3fa',
        'surface': '#f7f9fc',
        'fg': '#1d2430',
        'line': '#dde5ef',
        'title': '#eef3fa',
        'control': '#f3f6fb',
        'accent': '#e4eefc',
        'accentfg': '#1a6fe0',
        'sel': '#d9e8fb',
        'selfg': '#1a6fe0',
        'font': 'Arial,"Segoe UI",sans-serif',
        'note': 'right:2%;top:2%;width:36%',
        'end': 'right:2%;bottom:2%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-reply-all-05',
        'scenario': 'delete',
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
        'frame.8': () => (_c) => {
          const { E, summary } = _c;
          E('div', 'greeting', summary, 'Good morning');
        },
        'frame.9': () => (_c) => {
          const { E, summary } = _c;
          E('div', 'greeting-sub', summary, 'Here’s your mail for today.');
        },
        'frame.10': () => (_c) => {
          const { E, summary } = _c;
          for (const [ico, num, lab] of [['✉', '8', 'Unread'], ['➤', '12', 'Sent'], ['▤', '4', 'Drafts'], ['★', '3', 'Starred']]) {
            const s = E('div', 'summary-stat', summary);
            E('b', 'stat-icon', s, ico);
            E('span', 'stat-value', s, num);
            E('small', '', s, lab);
          }
        },
      },
    },
  });
})();
