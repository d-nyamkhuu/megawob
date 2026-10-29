// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'forum',
        'brand': 'MailZone',
        'nav': 'Mail   Address Book   Preferences   Help',
        'bg': '#eef5fa',
        'surface': '#edf5fa',
        'fg': '#0a1119',
        'line': '#93afcd',
        'title': '#9fbbd4',
        'control': '#d7e4ef',
        'accent': '#c6dbee',
        'accentfg': '#000',
        'sel': '#d3e4f2',
        'font': 'Verdana,Arial,sans-serif',
        'bar': 36,
        'note': 'right:1%;top:10%;width:25%;background:#fff8d9;font-size:17px;padding:13px',
        'end': 'right:10.5%;bottom:3%;font-size:15px;padding:8px 20px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:.5%;top:1%;width:72%;height:98%',
          'document': 'left:.5%;top:1%;width:72%;height:98%',
          'editor': 'right:.5%;top:1%;width:26%;height:98%;padding-top:160px',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-nl-02',
        'scenario': 'nl',
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
        'rowHeight': 34,
        'stack': true,
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
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            _c.endPlacement = null;
            _c.endLabel = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
              if (er.bool(0.5)) {
                _c.endPlacement = 'bottom';
                _c.endLabel = labelOf(labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit');
              } else {
                _c.endPlacement = er.pick(['header', 'link']);
                _c.endLabel = labelOf(er.pick(labels));
              }
              const tag = _c.endPlacement === 'link' ? 'a' : 'button';
              _c.submit = E(tag, 'end-control end-' + _c.endPlacement, document.body, _c.endLabel);
              _c.submit.type = 'button';
              if (tag === 'A') _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            if (!ctx.finish) {
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const labels =
                  ctx.content && Array.isArray(ctx.content.END_LABELS)
                    ? ctx.content.END_LABELS
                    : [
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
                const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
                const own = _c.endLabel.trim().toLowerCase();
                const options = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== own);
                if (options.length) {
                  const d = E(
                    'button',
                    'pqd-xtra xtra-' + _c.endPlacement,
                    document.body,
                    labelOf(cr.pick(options)),
                  );
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
