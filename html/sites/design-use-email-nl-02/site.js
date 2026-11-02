// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'forum',
        'brand': 'MailZone',
        'nav': 'Mail   Address Book   Preferences   Help',
        'bg': '#eef5fa',
        'surface': '#edf5fa',
        'fg': '#0a1119',
        'line': '#93afcd',
        'title': '#9fbbd4',
        'control': '#d7e4ef',
        'accent': '#c6dbee',
        'accentfg': '#000',
        'sel': '#d3e4f2',
        'font': 'Verdana,Arial,sans-serif',
        'bar': 36,
        'note': 'right:1%;top:10%;width:25%;background:#fff8d9;font-size:17px;padding:13px',
        'end': 'right:10.5%;bottom:3%;font-size:15px;padding:8px 20px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:.5%;top:1%;width:72%;height:98%',
          'document': 'left:.5%;top:1%;width:72%;height:98%',
          'editor': 'right:.5%;top:1%;width:26%;height:98%;padding-top:160px',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-nl-02',
        'scenario': 'nl',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base) =>
          function (_c) {
            base(_c);
            if (_c.submit) {
              const placements = { home: 'bottom', center: 'header', menubar: 'link' };
              const original = Object.keys(placements).find((p) => _c.submit.classList.contains('end-' + p));
              const placement = original === 'home'
                ? 'bottom'
                : _c.ctx.rng.fork('chrome/site').pick(['header', 'link']);
              _c.submit.classList.replace('end-' + original, 'end-' + placement);
              const extra = _c.bar.querySelector('.pq-xtra');
              if (extra) {
                extra.className = 'pqd-xtra xtra-' + placement;
                document.body.appendChild(extra);
              }
            }
          },
      },
    },
  });
})();
