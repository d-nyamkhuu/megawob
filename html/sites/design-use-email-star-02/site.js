// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: 'design-use-email-star-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'human',
        'brand': 'Applications   Places   System',
        'nav': '',
        'bg': 'linear-gradient(130deg,#6e391b,#a15b2a 45%,#5a311e)',
        'surface': '#efebe5',
        'fg': '#1c242b',
        'line': '#a09a8f',
        'title': 'linear-gradient(#70573e,#4f3c2b)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#f7f4ee,#d6d1c8)',
        'accent': '#e98224',
        'accentfg': '#111',
        'sel': '#e98022',
        'selfg': '#fff',
        'bar': 25,
        'foot': 33,
        'note': 'right:2%;top:18%;width:32%;background:#efebe5;box-shadow:0 5px 18px #0007',
        'end': 'right:4%;top:39%;width:10%',
        'geo': {
          'folders': 'left:1.4%;top:17%;width:16%;height:81%',
          'ledger': 'left:17.6%;top:17%;width:47.5%;height:44%',
          'document': 'left:17.6%;top:62%;width:52%;height:36%',
          'editor': 'left:34%;top:63%;width:35.6%;height:35%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-02',
        'scenario': 'star',
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
        'folderList': ['inbox', 'drafts', 'sent', 'junk', 'trash', 'archive'],
        'rowHeight': 35,
        'stack': false,
        'dock': ['Mail - Inbox - Evolution', 'Task'],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const trash = E('div', 'desktop-trash', document.body);
            trash.innerHTML = '<svg viewBox="0 0 50 50"><path d="M11 10h28l-3 35H14Z M7 10h36 M18 5h14"/></svg>Trash';
            Object.assign(_c, { trash });
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
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, footer } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              let label = 'Submit',
                placement = 'original';
              if (!er.bool(0.5)) {
                const labels = (
                  ctx.content.END_LABELS || [
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
                  ]
                )
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== 'submit');
                if (labels.length) label = er.pick(labels);
                placement = er.pick(['upper', 'lower']);
              }
              _c.submit = E('button', 'end-control', document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              if (placement === 'upper') {
                _c.submit.style.top = '8%';
                _c.submit.style.right = '4%';
                _c.submit.style.width = 'auto';
              } else if (placement === 'lower') {
                _c.submit.style.top = 'auto';
                _c.submit.style.bottom = 'calc(var(--footh,46px) + 12px)';
                _c.submit.style.right = '4%';
                _c.submit.style.width = 'auto';
              }
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const labels = (
                ctx.content.END_LABELS || [
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
                ]
              ).map(labelOf);
              const same = (x) => x.trim().toLowerCase() === _c.submit?.textContent.trim().toLowerCase();
              const options = [...new Set(labels)].filter((x) => !same(x));
              if (options.length) {
                const b = E('button', 'chrome-pq', footer, cr.pick(options));
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.style.cssText = 'margin-left:auto;padding:5px 12px;font-size:12px;position:relative;z-index:9';
                b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
