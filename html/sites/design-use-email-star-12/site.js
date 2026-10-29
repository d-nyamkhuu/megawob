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
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const legacy = er.bool(0.5);
              const placement = legacy ? 'ribbon' : er.pick(['title', 'status']);
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = legacy ? 'Submit' : labelOf(er.pick(labels));
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
                const choices = [...new Set(labels.map(labelOf).filter((x) => !same(x)))];
                if (choices.length) {
                  const text = cr.pick(choices);
                  const decoy = E('button', 'end-xtra', document.body, text);
                  decoy.type = 'button';
                  decoy.dataset.placement = placement === 'status' ? 'title' : 'status';
                  decoy.setAttribute('aria-label', text);
                  decoy.title = text;
                  decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
                }
              }
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
