// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'Oakmail',
        'nav': '',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 63,
        'foot': 0,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-05',
        'scenario': 'forward',
        'platform': 'web',
        'account': 'Mon, Apr 4, 2011',
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
        'dock': ['Available contacts', 'Select the correct recipient for this task.'],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            E('span', 'logo', bar, '✉');
            E('span', 'brand', bar, C.brand);
            E('span', 'sub', bar, 'Mail for a calmer day');
            const wc = E('span', 'wincontrols', bar);
            for (const g of ['–', '□', '×']) E('span', '', wc, g);
            if (C.nav) {
              const n = E('nav', 'nav', bar);
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav', n, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
            }
            Object.assign(_c, { wc });
          },
        'frame.5': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { bar } = _c;
            bar.querySelector('.logo').innerHTML =
              '<svg viewBox="0 0 36 52" aria-hidden="true"><path d="M2 13h32v29H2z" fill="#ae8d50" stroke="#59482b"/><path d="M2 13l16 17 16-17M2 42l11-13m21 13L23 29" fill="none" stroke="#66502d"/><path d="m18 1 5 8 9 1-4 9 1 9-11-3-11 3 1-9-4-9 9-1z" fill="#f1efdf" stroke="#4e4130"/><path d="m9 14 9 8 9-8" fill="none" stroke="#494435" stroke-width="2"/></svg>';
          },
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
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = er.bool(0.5),
              placement = original ? 'composer' : er.pick(['header', 'footer']);
            const endLabel = original ? 'Submit' : er.pick(endLabels);
            document.body.dataset.endPlacement = ctx.finish ? 'none' : placement;
            const decoyBtn = (label, cls, collide) => {
              const b = E('button', cls, document.body, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
              return b;
            };
            Object.assign(_c, { cr, decoyBtn, endLabel, endLabels, er, labelOf, original, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, cr, ctx, decoyBtn, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, endLabel);
              _c.submit.dataset.placement = placement;
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const alternatives = endLabels.filter(
              (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
            );
            const collide = cr.bool(0.3) && alternatives.length ? cr.pick(alternatives) : null;
            if (placement !== 'composer' || ctx.finish)
              decoyBtn(collide || 'Save draft', 'chrome-slot-xtra', !!collide);
            else if (collide) decoyBtn(collide, 'chrome-pq', true);
            Object.assign(_c, { alternatives, collide });
          },
        'frame.21': (base, S) =>
          function (_c) {
            for (const n of document.querySelectorAll('.task-note')) {
              const inst = n.querySelector('.instruction');
              inst.style.whiteSpace = 'normal';
              inst.style.maxWidth = '100%';
              let f = parseFloat(getComputedStyle(n).fontSize);
              while ((inst.scrollWidth > inst.clientWidth + 1 || inst.scrollHeight > n.clientHeight - 4) && f > 10) {
                f -= 0.5;
                inst.style.fontSize = f + 'px';
              }
            }
          },
      },
    },
  });
})();
