// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'riso',
        'brand': 'Postline',
        'nav': 'Email for what matters',
        'bg': '#f5edde',
        'surface': '#f5edde',
        'fg': '#234d56',
        'line': '#a5b9b3',
        'title': '#d4e2da',
        'control': '#f5edde',
        'accent': '#782535',
        'sel': '#e0e8dc',
        'font': 'Georgia,"Times New Roman",serif',
        'bar': 105,
        'foot': 100,
        'note':
          'left:25%;top:1.5%;width:50%;height:8%;background:#cadcd6;border:0;font-size:clamp(22px,2.25vw,37px);padding:12px',
        'end': 'right:1.8%;bottom:2.5%;padding:12px 70px;font-size:34px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:.5%;top:12%;width:99%;height:87%',
          'document': 'display:none',
          'editor': 'display:none',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-important-02',
        'scenario': 'important',
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
        'rowHeight': 66,
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
            const { E, ctx, footer } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const positions = er.pick(['original', 'original', 'original', 'footer-mid', 'footer-left']);
              const endLabels = ctx.content.END_LABELS;
              const pickedEnd = er.pick(endLabels);
              const label = er.bool(0.5)
                ? 'Submit'
                : typeof pickedEnd === 'string'
                  ? pickedEnd
                  : pickedEnd.label || pickedEnd.text || pickedEnd.name || String(pickedEnd);
              _c.submit = E(
                'button',
                'end-control' + (positions === 'original' ? '' : ' ' + positions),
                document.body,
                label,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const labels = ctx.content.END_LABELS.map((x) =>
                typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
              );
              const current = _c.submit ? _c.submit.textContent.trim().toLowerCase() : '';
              const candidates = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== current);
              if (candidates.length) {
                const b = E('button', 'chrome-pq', footer, collideRng.pick(candidates));
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
