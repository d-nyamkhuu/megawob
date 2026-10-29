// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Desk   File   Edit   Message   Options',
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
        'site': 'design-use-email-nl-10',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': 'Mon Mar 10 1986   10:24 AM',
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
            const logo = E('span', 'atari-logo', bar);
            logo.innerHTML = '<svg viewBox="0 0 32 28"><path d="M16 3 8 25M16 3l8 22M4 25h8M20 25h8"/></svg>';
            E('span', 'brand', bar, C.brand);
            Object.assign(_c, { logo });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E, stage } = _c;
            const deco = E('div', 'deco', document.body);
            document.body.insertBefore(deco, stage);
            const gw = E('div', 'gem-window', deco);
            const gt = E('div', 'gem-title', gw, 'Mail');
            const gx = E('span', 'gem-close', gt);
            gx.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M21 3 3 21"/></svg>';
            for (const k of ['top', 'bottom']) E('span', 'gem-ring ' + k, deco);
            const fl = E('div', 'desk-floppy', deco);
            fl.innerHTML =
              '<svg viewBox="0 0 24 24"><path d="M3 3h15l3 3v15H3zM7 3v6h9V3M6 21v-8h12v8M8 16h8M8 18h8"/></svg><span>A:</span>';
            const tr = E('div', 'desk-trash', deco);
            tr.innerHTML =
              '<svg viewBox="0 0 24 24"><path d="M5 6h14M9 6V3h6v3M6 6l1 15h10l1-15M10 9v9M14 9v9"/></svg><span>Trash</span>';
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { deco, fl, footer, gt, gw, gx, tr });
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, stage } = _c;
            _c.display = ctx.display;
            if (
              (_c.display === 'panel' || _c.display === 'toast') &&
              (stage.clientWidth < 1260 || stage.clientHeight < 660)
            )
              _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'note-title', note, 'Memo');
              else if (_c.display === 'toast') E('div', 'note-title', note, 'Mail notice');
              else if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const er = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const original = er.bool(0.5);
            const placement = original ? 'footer' : er.pick(['header', 'link']);
            const endLabel = original ? 'Submit' : er.pick(endWords);
            Object.assign(_c, { endLabel, endWords, er, labelOf, original, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endWords, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (_c.submit.tagName === 'BUTTON') _c.submit.type = 'button';
              else _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options);
                const b = E('button', 'chrome-xtra', document.body, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
        'frame.21': (base, S) =>
          function (_c) {
            for (const n of document.querySelectorAll('.task-note')) {
              let f = parseFloat(getComputedStyle(n).fontSize);
              while (
                (n.scrollHeight > n.clientHeight + 1 ||
                  n.querySelector('.instruction').scrollWidth > n.querySelector('.instruction').clientWidth + 1) &&
                f > 10
              ) {
                f -= 0.5;
                n.style.fontSize = f + 'px';
              }
            }
          },
      },
    },
  });
})();
