// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'Mail',
        'nav': '',
        'bg': '#9fcbef',
        'surface': '#eff6fc',
        'fg': '#062354',
        'line': '#8daed0',
        'title': '#3164a2',
        'titlefg': '#fff',
        'control': '#d3e4f4',
        'accent': '#f6d956',
        'accentfg': '#082356',
        'sel': '#c3ddf3',
        'bar': 75,
        'note': 'left:1%;top:13%;width:19%;background:#ffe896;clip-path:polygon(0 0,100% 0,100% 86%,90% 100%,0 100%)',
        'end': 'left:2%;bottom:5%;width:17%;clip-path:polygon(9% 0,94% 0,100% 50%,90% 100%,0 100%,0 60%)',
        'geo': {
          'folders': 'left:.5%;top:24%;width:20%;height:74%;background:#80b6e8;border:0',
          'ledger': 'left:21.2%;top:1%;width:78%;height:44%',
          'document': 'left:21.2%;top:47%;width:78%;height:51%',
          'editor': 'left:52%;top:48%;width:47%;height:50%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-04',
        'scenario': 'star',
        'platform': 'web',
        'account': '',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 44,
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
            const display =
              (ctx.display === 'panel' || ctx.display === 'toast') && stage.clientWidth < 1180 ? 'header' : ctx.display;
            document.body.dataset.instructionMode = display;
            if (display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
              if (display === 'toast') stage.style.top = Math.ceil(note.getBoundingClientRect().bottom + 12) + 'px';
            }
            if (!ctx.finish) {
              const skip = E('button', 'skip-btn', document.body, 'Skip');
              skip.type = 'button';
              skip.addEventListener('click', () => env.log('decoy', { label: 'Skip' }));
            }
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
            document.body.dataset.endPlacement = ctx.finish ? 'none' : placement;
            Object.assign(_c, { display, endLabel, endLabels, endRng, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const choices = [...new Set(endLabels)].filter(
                (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (choices.length) {
                const label = collideRng.pick(choices);
                const decoy = E('button', 'chrome-xtra', document.body, label);
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
              if (n.dataset.display === 'header') {
                let f = parseFloat(getComputedStyle(n).fontSize);
                while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
                  f -= 0.5;
                  n.style.fontSize = f + 'px';
                }
                if (n.scrollHeight > n.clientHeight + 1)
                  document.body.style.setProperty('--barh', Math.ceil(n.scrollHeight + 8) + 'px');
              }
            }
          },
      },
    },
  });
})();
