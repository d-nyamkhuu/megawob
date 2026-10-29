// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'Toolchest   Desktop   Windows   Applications   Help',
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
        'site': 'design-use-email-nl-01',
        'scenario': 'nl',
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
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle || ctx.display === 'panel') E('div', 'note-title', note, C.noteTitle || 'Task');
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const endPlacement = endRng.bool(0.5) ? 'legacy' : endRng.pick(['topbar', 'shelf']);
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const labels = (ctx.content && ctx.content.END_LABELS) || [
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
            const submitLabel = labels.map(labelOf).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
            const label = endPlacement === 'legacy' ? submitLabel : labelOf(endRng.pick(labels));
            Object.assign(_c, { endPlacement, endRng, label, labelOf, labels, submitLabel });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endPlacement, label, labelOf, labels } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = endPlacement;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (collideRng.bool(0.3)) {
              const options = [...new Set(labels.map(labelOf))].filter(
                (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
              );
              if (options.length) _c.collision = labelOf(collideRng.pick(options));
            }
            if (_c.collision) {
              const b = E('button', 'end-pq', document.body, _c.collision);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.dataset.placement = endPlacement === 'topbar' ? 'shelf' : 'topbar';
              b.addEventListener('click', () => env.log('decoy', { label: _c.collision, collide: true }));
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
