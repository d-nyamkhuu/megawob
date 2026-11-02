// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'Mail',
        'nav': 'File  Edit  View  Message  Tools  Help',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 72,
        'foot': 21,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-09',
        'scenario': 'forward',
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
        'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 100,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const tb = E('div', 'titlebar', bar);
            const lg = E('span', 'app-logo', tb);
            lg.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#e8f4ff" d="M2 5h20v14H2z"/><path d="M2 5l10 8 10-8"/></svg>';
            E('span', 'brand', tb, C.brand);
            const wc = E('span', 'wincontrols', tb);
            for (const [g, label] of [
              ['min', '–'],
              ['max', '□'],
              ['close', '×'],
            ])
              E('i', 'wc-' + g, wc, label);
            const n = E('nav', 'nav menubar', bar);
            for (const label of C.nav.split(/\s{2,}/)) {
              const a = E('button', 'chrome-nav', n, label);
              a.type = 'button';
              a.addEventListener('click', () => env.log('decoy', { label }));
            }
            Object.assign(_c, { lg, n, tb, wc });
          },
        'frame.5': () => () => {},
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
              const mn = E('aside', 'margin-notes', document.body);
              E('div', 'mn-title', mn, 'Mail help:');
              const ol = E('ol', '', mn);
              for (const t of [
                'Browse folders to view messages.',
                'Use the toolbar to manage your mail.',
                'Choose contacts or type an address.',
              ])
                E('li', '', ol, t);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base) =>
          function (_c) {
            base(_c);
            if (_c.submit) {
              const positions = _c.ctx.rng.fork('chrome/site/placement');
              const place = positions.bool(0.5) ? 'home' : positions.pick(['center', 'menubar']);
              _c.submit.classList.remove('end-home', 'end-center', 'end-menubar');
              _c.submit.classList.add('end-' + place);
            }
          },
      },
    },
  });
})();
