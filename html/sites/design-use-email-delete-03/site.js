// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Windows Mail',
        'nav': '',
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
        'site': 'design-use-email-delete-03',
        'scenario': 'delete',
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
        'frame.3': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const endLabels = (ctx.content && ctx.content.END_LABELS) || [
              'Submit',
              'Done',
              'Finish',
              'Continue',
              'Save',
              'OK',
              'Confirm',
              'Apply',
              'Complete',
              "I'm done",
            ];
            const sampledEnd = endR.pick(endLabels),
              keepEnd = endR.bool(0.5),
              alternatePlacement = ctx.finish ? null : endR.pick(['footer', 'link', 'icon']),
              baseEnd = keepEnd ? 'Submit' : sampledEnd,
              placement = ctx.finish ? null : keepEnd ? 'header' : alternatePlacement;
            const bar = E('header', 'desktop-bar', document.body);
            const brand = E('span', 'brand', bar);
            brand.innerHTML =
              '<svg viewBox="0 0 26 26" aria-hidden="true"><path fill="#fff" stroke="#8296a3" d="M4 2h16l3 4v18H3V2z"/><path fill="#dde9ef" stroke="#8296a3" d="M19 2v5h4"/><path fill="#76a2bc" stroke="#52768d" d="M2 13h17v10H2z"/><path fill="#fff" stroke="#52768d" d="m3 14 7 5 8-5"/><path fill="#fff" stroke="none" d="M8 8h9v2H8z"/></svg>';
            E('span', 'brand-label', brand, C.brand);
            Object.assign(_c, {
              alternatePlacement,
              bar,
              baseEnd,
              brand,
              collideR,
              endLabels,
              endR,
              keepEnd,
              placement,
              sampledEnd,
            });
          },
        'frame.4': () => () => {},
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const acc = E('span', 'account', bar);
            for (const [t, c] of [
              ['–', 'min'],
              ['▢', 'max'],
              ['✕', 'close'],
            ])
              E('span', 'wc ' + c, acc, t);
            Object.assign(_c, { acc });
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
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, baseEnd, collideR, ctx, endLabels, placement } = _c;
            if (!ctx.finish) {
              const actualLabel =
                baseEnd && typeof baseEnd === 'object' ? baseEnd.label || baseEnd.text || baseEnd.name : baseEnd;
              const icon = placement === 'icon';
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control ' +
                  (placement === 'footer' ? 'end-footer' : '') +
                  (placement === 'link' ? ' end-link' : '') +
                  (icon ? ' end-icon' : ''),
                document.body,
                icon ? '✓' : placement === 'link' ? actualLabel + ' ›' : actualLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', actualLabel);
              _c.submit.title = actualLabel;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              if (collideR.bool(0.3)) {
                const pool = endLabels
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => String(x).trim().toLowerCase() !== String(actualLabel).trim().toLowerCase());
                if (pool.length) {
                  const d = E('button', 'chrome-xtra', bar, collideR.pick(pool));
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
