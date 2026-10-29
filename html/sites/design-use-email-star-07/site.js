// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-07',
    styles: ['site.css', 'paper.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'PaperMail',
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
        'site': 'design-use-email-star-07',
        'scenario': 'star',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
        'noteTitle': 'Your Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 61,
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
              const mode = ctx.display;
              const note = E('aside', 'task-note ' + (mode === 'toast' ? 'task-toast' : 'task-' + mode), document.body);
              note.dataset.display = mode;
              if (C.noteTitle) E('div', 'note-title', note, mode === 'toast' ? 'Task note' : C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
              if (mode !== 'toast') {
                const det = E('aside', 'note-details', document.body);
                E('b', '', det, 'Details:');
                E('span', '', det, ctx.instruction);
              }
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const content = ctx.content || {};
              const names =
                Array.isArray(content.END_LABELS) && content.END_LABELS.length
                  ? content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const er = ctx.rng.fork('chrome/end');
              const placement = er.pick(['original', 'original', 'toolbar', 'task-footer']);
              const label = labelOf(er.pick(names));
              _c.submit = E('button', 'end-control end-' + placement, document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
                const options = [...new Set(names.map(labelOf))].filter((x) => !same(x));
                if (options.length) {
                  const decoy = E('button', 'chrome-xtra', document.body, labelOf(cr.pick(options)));
                  decoy.type = 'button';
                  decoy.setAttribute('aria-label', decoy.textContent);
                  decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
