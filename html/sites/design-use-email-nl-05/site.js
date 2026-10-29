// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Start',
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
        'site': 'design-use-email-nl-05',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': '10:24 AM',
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
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, stage } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = stage.clientWidth <= 1280 ? 'header' : ctx.display;
              note.dataset.requestedDisplay = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = (
              ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map(labelOf);
            const classic = endRng.bool(0.5);
            const placement = classic ? 'form' : endRng.pick(['menu', 'taskbar']);
            const endLabel = classic ? 'Submit' : endRng.pick(endLabels);
            Object.assign(_c, { classic, endLabel, endLabels, endRng, labelOf, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'taskbar' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (_c.submit.tagName === 'BUTTON') _c.submit.type = 'button';
              else _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', (ev) => {
                ev.preventDefault();
                ctx.submit();
              });
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const labels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (labels.length) {
                const label = collideRng.pick(labels),
                  decoy = E('button', 'chrome-xtra', document.body, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
        'frame.21': (base, S) =>
          function (_c) {
            for (const n of document.querySelectorAll('.task-note')) {
              let f = parseFloat(getComputedStyle(n).fontSize);
              const text = n.querySelector('.instruction');
              if (text.getBoundingClientRect().height > f * 1.5) n.classList.add('note-wrapped');
              while (
                (n.scrollHeight > n.clientHeight + 1 || text.getBoundingClientRect().height > n.clientHeight - 8) &&
                f > 12
              ) {
                f -= 0.5;
                n.style.fontSize = f + 'px';
              }
            }
            for (const e of document.body.querySelectorAll('.task-note,.end-control,.chrome-xtra,.obstruction')) {
              const r = e.getBoundingClientRect();
              e.style.left = Math.round(r.left) + 'px';
              e.style.top = Math.round(r.top) + 'px';
              e.style.width = Math.round(r.width) + 'px';
              e.style.height = Math.round(r.height) + 'px';
              e.style.right = 'auto';
              e.style.bottom = 'auto';
            }
          },
        'frame.22': () => () => {},
      },
    },
  });
})();
