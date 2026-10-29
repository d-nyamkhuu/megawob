// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'Riverton Public Library',
        'nav': 'CATALOG  RESEARCH  SERVICES  ABOUT',
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
        'site': 'design-use-email-reply-09',
        'scenario': 'reply',
        'platform': 'web',
        'account': 'A Quieter World\nThrough Greater Reading',
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
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (v) => (typeof v === 'string' ? v : v.label || v.text || v.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((v) => v !== 'Submit'));
            const placement = referenceEnd ? 'inspector' : endRng.pick(['header', 'form-footer']);
            Object.assign(_c, { endLabel, endLabels, endRng, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx, endLabel, endLabels, placement } = _c;
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
              const labels = endLabels.filter((v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (labels.length) {
                const label = collideRng.pick(labels);
                const decoy = E('button', 'chrome-xtra', bar, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
