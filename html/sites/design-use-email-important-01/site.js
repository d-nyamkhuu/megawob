// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Inbox - Mozilla Thunderbird',
        'nav': 'File   Edit   View   Go   Message   Tools   Help',
        'bg': '#eeede7',
        'surface': '#eeece4',
        'fg': '#111',
        'line': '#aaa99e',
        'title': 'linear-gradient(#4f83b4,#32689e)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#f5f4ec,#dedcd0)',
        'accent': '#bacada',
        'accentfg': '#000',
        'sel': '#dce6ee',
        'bar': 35,
        'note': 'left:.5%;top:1%;width:20%;height:98%;font-weight:400',
        'end': 'left:2%;bottom:4%;width:17%',
        'geo': {
          'folders': 'left:21.3%;top:16%;width:14%;height:83%',
          'ledger': 'left:35.8%;top:16%;width:63.7%;height:40%',
          'document': 'left:35.8%;top:57%;width:63.7%;height:42%',
          'editor': 'left:64%;top:58%;width:35.5%;height:41%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-important-01',
        'scenario': 'important',
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
        'folderList': ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
        'rowHeight': 36,
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
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const placement = er.pick(['box', 'box', 'titlebar', 'link']);
              const labels = ctx.content && ctx.content.END_LABELS;
              const label = er.pick(
                labels && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
              );
              const makeEnd = (parent, cls, text) => {
                const b = E('button', 'end-control ' + cls, parent, text);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.addEventListener('click', () => ctx.submit());
                return b;
              };
              if (placement === 'box') _c.submit = makeEnd(document.body, 'end-box', label);
              else if (placement === 'titlebar') {
                bar.classList.add('has-titlebar-end');
                _c.submit = makeEnd(bar, 'end-titlebar', label);
              } else _c.submit = makeEnd(document.body, 'end-link', label);
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const pool =
                  labels && labels.length
                    ? labels
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
                const options = pool.filter(
                  (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
                );
                if (options.length) {
                  const text = cr.pick(options);
                  const d = E('button', 'chrome-pq', bar, text);
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
