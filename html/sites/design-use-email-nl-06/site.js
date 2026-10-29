// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Riverton Public Library',
        'nav': 'Catalog  Services  Events  My Account',
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
        'site': 'design-use-email-nl-06',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': '',
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
            const { C } = S;
            const { E, bar } = _c;
            const logo = E('span', 'logo', bar);
            logo.innerHTML =
              '<svg viewBox="0 0 96 72" aria-hidden="true"><g fill="none" stroke="#54241f" stroke-width="2"><path d="M3 15v52h39q6 5 12 0h39V15M7 11v51h33q8 0 8 5 0-5 8-5h33V11M12 6v52q22-4 36 6 14-10 36-6V6"/><path fill="#faf7ed" d="M12 6q24-7 36 7 12-14 36-7v48q-23-6-36 8-13-14-36-8z"/><path d="M48 13v49M53 15q12-9 25-3M53 21q12-8 25-3M53 27q12-7 25-2M53 33q12-6 25-2M15 58q20-3 29 6M52 64q9-9 29-6M42 67q6 3 12 0"/></g></svg>';
            const tb = E('span', 'titleblock', bar);
            E('span', 'brand', tb, C.brand);
            E('span', 'tagline', tb, 'KNOWLEDGE BUILDS BRIGHTER TOMORROWS');
            Object.assign(_c, { logo, tb });
          },
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            if (C.account) E('span', 'account', bar, C.account);
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue']).map(labelOf);
            const placement = er.pick(['palette', 'palette', 'toolbar', 'link']);
            const endLabel = placement === 'palette' ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
            const pal = E('aside', 'palette', document.body);
            pal.dataset.display = ctx.display;
            const pt = E('div', 'palette-title', pal, 'Task');
            const minimize = E('span', 'pal-min', pt, '–');
            Object.assign(_c, { cr, endLabel, endWords, er, labelOf, minimize, pal, placement, pt });
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { E, ctx, pal } = _c;
            if (ctx.display !== 'hidden') {
              const separate = ctx.display === 'panel' || ctx.display === 'toast';
              const holder = separate ? E('aside', 'episode-note episode-note-' + ctx.display, document.body) : pal;
              if (separate)
                E(
                  'div',
                  'episode-note-title',
                  holder,
                  ctx.display === 'panel' ? 'Reading desk · Task' : 'Library mail · Task',
                );
              _c.note = E('div', 'task-note', holder);
              _c.note.dataset.display = ctx.display;
              E('div', 'instruction', _c.note, ctx.instruction);
            }
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { E, cr, ctx, endLabel, endWords, minimize, pal, placement, pt } = _c;
            if (!ctx.finish) {
              if (placement === 'palette') E('div', 'palette-rule', pal);
              _c.submit = E(
                'button',
                'end-control end-' + placement,
                placement === 'toolbar' ? pt : placement === 'link' ? document.body : pal,
                endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
              if (placement === 'toolbar') minimize.remove();
            }
            if (cr.bool(0.3)) {
              const pool = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (pool.length) {
                const label = cr.pick(pool),
                  b = E('button', 'chrome-xtra', pal, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            if (!pal.querySelector('.task-note,button')) pal.remove();
          },
        'frame.22': (base, S) =>
          function (_c) {
            for (const e of document.body.querySelectorAll('.obstruction')) {
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
      },
    },
  });
})();
