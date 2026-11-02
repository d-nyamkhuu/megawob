// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'SkyMail',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#000',
        'line': '#444',
        'title': '#fff',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#ddd',
        'font': '"Times New Roman",serif',
        'bar': 60,
        'note': 'left:2%;top:9%;width:96%;padding:8px 0;border:0;border-block:1px solid #111;font-size:20px',
        'end': 'right:2%;bottom:1.5%;padding:7px 32px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:2%;top:11%;width:25%;height:34%',
          'document': 'left:2%;top:11%;width:96%;height:45%;border:0;border-bottom:1px solid #111',
          'editor': 'left:2%;top:57%;width:96%;height:36%;border:0;border-bottom:1px solid #111',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-03',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Hi, Alex',
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
        'frame.3': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E } = _c;
            E('div', 'task-panel', document.body);
            E('div', 'task-head', document.body, 'Your Task');
            const bar = E('header', 'desktop-bar', document.body);
            E('span', 'logo', bar);
            E('span', 'brand', bar, C.brand);
            const fs = E('div', 'fake-search', bar);
            E('span', '', fs, 'Search mail');
            if (C.nav) {
              const n = E('nav', 'nav', bar);
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav', n, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
            }
            Object.assign(_c, { bar, fs });
          },
        'frame.4': () => () => {},
        'frame.5': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            let display = ctx.display || 'header';
            document.body.dataset.taskDisplay = display;
            if (display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { display });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (_base, S) =>
          function (_c) {
            _base(_c);
            if (_c.submit && _c.submit.classList.contains('end-home') &&
                _c.ctx.rng.fork('chrome/site').bool(0.25)) {
              _c.submit.classList.replace('end-home', 'end-center');
            }
            for (const button of _c.bar.querySelectorAll('.pq-xtra')) {
              button.className = 'end-xtra';
              document.body.appendChild(button);
            }
          },
      },
    },
  });
})();
