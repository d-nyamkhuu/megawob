// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-12',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'ribbon',
        'brand': 'Inbox - Contoso Mail',
        'nav': 'Home  Send / Receive  Folder  View',
        'bg': '#d2e5f7',
        'surface': '#fff',
        'fg': '#132d50',
        'line': '#9bb8d6',
        'title': 'linear-gradient(#b8d8f3,#8ebce1)',
        'control': 'linear-gradient(#eff6ff,#c6dff6)',
        'accent': '#398ee6',
        'sel': '#d6e7fa',
        'bar': 44,
        'note':
          'left:.5%;top:25%;width:99%;height:9%;font-size:clamp(21px,2.3vw,39px);background:#fff6ca;text-align:center;padding:16px',
        'end': 'right:1.5%;top:12.5%;padding:17px 32px;font-size:25px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:4%;top:31%;width:95.5%;height:68%',
          'document': 'display:none',
          'editor': 'display:none',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-12',
        'scenario': 'star',
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
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 51,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, footer } = _c;
            if (C.style === 'pixel') {
              E('span', '', footer, 'Quick action:');
              const disabled = E('button', 'quick-disabled', footer, 'Star this message');
              disabled.disabled = true;
              const tools = E('div', 'footer-real-tools', footer);
              for (const op of ['Reply', 'Forward', 'Delete']) {
                const b = E('button', '', tools, op);
                b.type = 'button';
                b.addEventListener('click', () => {
                  const k = op.toLowerCase();
                  const target = document.querySelector('[data-target=\"toolbar:' + k + '\"]');
                  if (target) target.click();
                });
              }
            }
            if (!C.foot) footer.hidden = true;
          },
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
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            if (_c.submit && _c.submit.classList.contains('end-home') && _c.ctx.rng.fork('chrome/site').bool(0.2)) {
              _c.submit.classList.replace('end-home', 'end-center');
            }
            for (const button of _c.bar.querySelectorAll('.pq-xtra')) {
              button.classList.add('end-xtra');
              button.dataset.placement = _c.submit && _c.submit.classList.contains('end-menubar') ? 'title' : 'status';
              document.body.appendChild(button);
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
              const r = e.getBoundingClientRect(),
                roundSize = e.classList.contains('end-control') ? Math.ceil : Math.round;
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = roundSize(r.width) + 'px';
              e.style.height = roundSize(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
      },
    },
  });
})();
