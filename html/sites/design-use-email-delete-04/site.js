// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'The Daily Chronicle',
        'nav': 'Home  World  Business  Local  Arts  Life',
        'foot': true,
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
        'site': 'design-use-email-delete-04',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon, Apr 11, 2011',
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
        'frame.4': (_base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar);
            E('span', 'masthead', brand, 'The Daily Chrónicle');
            Object.assign(_c, { brand });
          },
        'frame.6': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const acc = E('span', 'account', bar, '');
            E('span', 'acc-date', acc, C.account);
            const accl = E('span', 'acc-links', acc);
            E('span', '', accl, 'Welcome, reader');
            E('span', 'red', accl, 'My Account');
            E('span', 'red', accl, 'Sign Out');
            Object.assign(_c, { acc, accl });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            if (C.foot) {
              const pp = E('img', 'newspaper', footer);
              pp.src = 'sites/' + C.site + '/assets/newspaper.svg';
              pp.alt = '';
              pp.setAttribute('aria-hidden', 'true');
              E('span', 'vrule', footer);
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (ctx.display === 'panel' && C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            base(_c);
            if (_c.submit) {
              const home = _c.submit.classList.contains('end-home');
              const placement = home ? 'footer' : ctx.rng.fork('chrome/site').pick(['toolbar', 'link']);
              _c.submit.className = 'end-control end-' + placement;
              const label = _c.submit.getAttribute('aria-label');
              _c.submit.textContent = '';
              E('span', '', _c.submit, placement === 'link' ? label + ' ›' : label);
              const extra = _c.bar.querySelector('.pq-xtra');
              if (extra) {
                extra.className = 'end-xtra';
                document.body.appendChild(extra);
              }
            }
          },
      },
    },
  });
})();
