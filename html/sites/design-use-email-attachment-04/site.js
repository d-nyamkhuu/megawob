// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-attachment-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'aurora',
        'brand': 'Aurora Mail',
        'nav': '',
        'bg': '#e9e9e9',
        'surface': '#fff',
        'fg': '#12151a',
        'line': '#d8dadd',
        'title': '#fff',
        'control': '#fff',
        'accent': '#a4f05c',
        'accentfg': '#10140d',
        'sel': '#e7f7db',
        'selfg': '#12151a',
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
        'site': 'design-use-email-attachment-04',
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
        'frame.15': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            _c.display = ctx.display || 'header';
            if (_c.display === 'panel' && window.innerWidth < 1260) _c.display = 'header';
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (_c.display !== 'hidden') {
              _c.note = E('aside', 'task-note', document.body);
              _c.note.dataset.display = _c.display;
              if (C.noteTitle && _c.display !== 'toast') E('div', 'note-title', _c.note, C.noteTitle);
              E('div', 'instruction', _c.note, ctx.instruction);
            }
          },
      },
    },
  });
})();
