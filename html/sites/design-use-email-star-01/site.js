// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'QuickMail',
        'nav': 'Fast Email for a Brighter Day',
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
        'site': 'design-use-email-star-01',
        'scenario': 'star',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
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
            const { E, ctx } = _c;
            ((_c.endPlacement = 'sidebar'), (_c.endLabel = 'Submit'), (_c.collide = null));
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              if (!er.bool(0.5)) {
                _c.endPlacement = er.pick(['header', 'corner']);
                const labels = ctx.content && ctx.content.END_LABELS;
                const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
                _c.endLabel =
                  labels && labels.length
                    ? labelOf(er.pick(labels))
                    : er.pick([
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
                      ]);
              }
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && cr.bool(0.3)) {
              const labels = ctx.content && ctx.content.END_LABELS;
              const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
              const pool = (
                labels && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
              )
                .map(labelOf)
                .filter((x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase());
              if (pool.length) _c.collide = cr.pick(pool);
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { cr });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, _c.endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = _c.endPlacement;
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            if (_c.collide) {
              const b = E('button', 'end-xtra', document.body, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.dataset.avoid = _c.endPlacement;
              b.addEventListener('click', () => env.log('decoy', { label: _c.collide, collide: true }));
            }
          },
      },
    },
  });
})();
