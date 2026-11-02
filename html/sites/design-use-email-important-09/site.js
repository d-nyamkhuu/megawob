// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Amiga Workbench',
        'nav': '',
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
        'site': 'design-use-email-important-09',
        'scenario': 'important',
        'platform': 'desktop',
        'account': 'Mon  Apr 22 1991  14:37',
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
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              else if (ctx.display === 'panel') E('div', 'note-title', note, 'Task');
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const placement = er.pick(['corner', 'corner', 'mailbar', 'menubar']);
              const labels = ctx.content && ctx.content.END_LABELS;
              const label = (
                Array.isArray(labels) && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
              ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
              const endLabel = er.pick(label);
              _c.submit = E('button', 'end-control end-' + placement, document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
              if (cr.bool(0.3)) {
                const options = [...new Set(label)].filter(
                  (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
                );
                if (options.length) {
                  const decoy = E(
                    'button',
                    'end-xtra end-xtra-' +
                      cr.pick(
                        placement === 'mailbar'
                          ? ['menubar']
                          : placement === 'menubar'
                            ? ['mailbar']
                            : ['mailbar', 'menubar'],
                      ),
                    document.body,
                    cr.pick(options),
                  );
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
                }
              }
            }
          },
        'frame.21': (base, S) =>
          function (_c) {
            for (const n of document.querySelectorAll('.task-note')) {
              let f = parseFloat(getComputedStyle(n).fontSize);
              while ((n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1) && f > 12) {
                f -= 0.5;
                n.style.fontSize = f + 'px';
              }
            }
          },
      },
    },
  });
})();
