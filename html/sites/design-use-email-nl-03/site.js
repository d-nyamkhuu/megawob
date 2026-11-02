// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Toolchest   Desktop   Windows   Applications   Help',
        'nav': '',
        'bg': 'linear-gradient(#777f9a,#414e68)',
        'surface': '#bdbec7',
        'fg': '#08090b',
        'line': '#575b69',
        'title': 'linear-gradient(#b7b2d5,#9791ba)',
        'control': 'linear-gradient(#dddde4,#a3a5b2)',
        'accent': '#aba3cc',
        'accentfg': '#111',
        'sel': '#aca5cf',
        'font': '"Arial Narrow",Arial,sans-serif',
        'bar': 25,
        'note': 'right:1%;top:5%;width:15%;background:#fff0bd;font-size:16px',
        'end': 'right:1%;bottom:3%;width:8%;padding:10px',
        'geo': {
          'folders': 'left:1%;top:2%;width:6%;height:60%',
          'ledger': 'left:7.5%;top:2%;width:41.5%;height:67%',
          'document': 'left:50%;top:2%;width:33%;height:45%',
          'editor': 'left:48%;top:49%;width:42%;height:48%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-nl-03',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'archive', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const brandEl = E('span', 'brand', bar, '');
            brandEl.innerHTML =
              '<svg viewBox="0 0 24 18" style="width:26px;height:20px;fill:#2f8ae8;stroke:none"><path d="M0 1h24v16H0z"/><path d="M1 2l11 8 11-8" fill="none" stroke="#fff" stroke-width="1.8"/></svg><span>KMail</span>';
            E('span', 'win-title', bar, 'Inbox — KMail');
            Object.assign(_c, { brandEl });
          },
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const acc = E('span', 'account', bar, '');
            acc.innerHTML =
              '<svg viewBox="0 0 20 20"><path d="M4 10h12"/></svg><svg viewBox="0 0 20 20"><path d="M6 7h8v8H6z M8 7V5h8v8h-2"/></svg><svg viewBox="0 0 20 20"><path d="M4 4l12 12 M16 4 4 16"/></svg>';
            Object.assign(_c, { acc });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, stage } = _c;
            delete document.body.dataset.instruction;
            const roomy = stage.getBoundingClientRect().width >= 1260;
            _c.display = ctx.display;
            if (
              (_c.display === 'panel' && !roomy) ||
              (_c.display === 'toast' && stage.getBoundingClientRect().height < 660)
            )
              _c.display = 'header';
            document.body.dataset.instruction = _c.display;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'episode-note-title', note, 'Task');
              if (_c.display === 'toast') E('div', 'episode-note-title', note, 'KMail — Task');
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            // Keep the corner most common while varying the utility-strip home.
            if (_c.submit && _c.submit.classList.contains('end-home') &&
                _c.ctx.rng.fork('chrome/site').bool(0.35)) {
              _c.submit.classList.replace('end-home', 'end-offset');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const headerNote = document.querySelector('.task-note[data-display=header]');
            document.body.style.setProperty(
              '--episode-note-height',
              headerNote ? Math.ceil(headerNote.getBoundingClientRect().height) + 'px' : '0px',
            );
            for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
            Object.assign(_c, { headerNote });
          },
      },
    },
  });
})();
