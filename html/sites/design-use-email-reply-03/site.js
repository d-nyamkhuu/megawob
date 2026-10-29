// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'RISC OS 3.10',
        'nav': 'Mailer',
        'bg': '#f4f8fb',
        'surface': '#fff',
        'fg': '#112039',
        'line': '#c4cdd7',
        'title': '#f1f4f7',
        'control': '#edf1f5',
        'accent': '#235d98',
        'sel': '#e8f0f8',
        'bar': 50,
        'note': 'right:1.2%;top:13%;width:22%;height:43%;font-weight:400',
        'end': 'right:3%;top:39%;width:18%',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:1%;top:29%;width:18%;height:42%;border:0;background:transparent',
          'document': 'left:20.5%;top:4%;width:54.5%;height:90%',
          'editor': 'left:20.5%;top:4%;width:54.5%;height:90%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-reply-03',
        'scenario': 'reply',
        'platform': 'web',
        'account': '✕',
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
        'rowHeight': 52,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar);
            E('span', 'brand-title', brand, C.brand);
            Object.assign(_c, { brand });
          },
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
            const help = E('button', 'risc-help', document.body);
            help.type = 'button';
            E('b', '', help, '?');
            E('span', '', help, 'Help');
            help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const endR = ctx.rng.fork('chrome/end');
            const endPool =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const alternatives = endPool.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
            const endLabel = endR.bool(0.5) || !alternatives.length ? 'Submit' : endR.pick(alternatives);
            const placement = endR.pick(['footer', 'footer', 'toolbar', 'link']);
            Object.assign(_c, { alternatives, endLabel, endPool, endR, help, labelOf, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endPool, labelOf, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control end-' + placement, document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideR.bool(0.3)) {
              const pool = endPool.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (pool.length) {
                const collide = E('button', 'pqs-xtra', document.body, collideR.pick(pool));
                collide.type = 'button';
                collide.dataset.role = 'xtra';
                collide.title = collide.textContent;
                collide.addEventListener('click', () =>
                  env.log('decoy', { label: collide.textContent, collide: true }),
                );
              }
            }
            Object.assign(_c, { collideR });
          },
      },
    },
  });
})();
