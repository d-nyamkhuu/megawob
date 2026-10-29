// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'CityMail',
        'nav': 'A cleaner, stronger community',
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
        'site': 'design-use-email-reply-01',
        'scenario': 'reply',
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
        'rowHeight': 52,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': () => () => {},
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              _c.note = E('aside', 'task-note', document.body);
              _c.note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', _c.note, C.noteTitle);
              E('div', 'instruction', _c.note, ctx.instruction);
            }
            const endR = ctx.rng.fork('chrome/end');
            const positions = ['panel', 'panel', 'footer', 'header'];
            const position = ctx.finish ? null : endR.pick(positions);
            const labels = ctx.content && ctx.content.END_LABELS;
            const label = endR.bool(0.5)
              ? 'Submit'
              : labels && labels.length
                ? labels[endR.int(0, labels.length - 1)]
                : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'][endR.int(0, 6)];
            const collideR = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (collideR.bool(0.3)) {
              const bank =
                labels && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const options = bank
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length) _c.collide = options[collideR.int(0, options.length - 1)];
            }
            Object.assign(_c, { collideR, endR, label, labels, position, positions });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, label, position } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.position = position;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            if (_c.collide) {
              document.body.classList.add('has-pqd-xtra');
              const d = E('button', 'pqd-xtra', document.body, _c.collide);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.addEventListener('click', () => env.log('decoy', { label: _c.collide, collide: true }));
            }
          },
      },
    },
  });
})();
