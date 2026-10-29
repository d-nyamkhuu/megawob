// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'Work Mail',
        'nav': 'SIMPLE PEOPLE BRIGHTER WORK',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 63,
        'foot': 90,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-01',
        'scenario': 'forward',
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
        'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 100,
        'stack': false,
        'dock': ['Available contacts', 'Select the correct recipient for this task.'],
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
            const endR = ctx.rng.fork('chrome/end'),
              endWords =
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
              wordOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const classic = ctx.finish || endR.bool(0.5),
              endPlacement = classic ? 'classic' : endR.pick(['header', 'link']),
              endLabel = classic ? 'Submit' : wordOf(endR.pick(endWords));
            document.body.classList.toggle('email-end-header', endPlacement === 'header');
            document.body.classList.toggle('email-end-link', endPlacement === 'link');
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { classic, endLabel, endPlacement, endR, endWords, wordOf });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endPlacement, endWords, footer, wordOf } = _c;
            if (!ctx.finish) {
              const cls =
                'end-control' +
                (endPlacement === 'header' ? ' end-header' : endPlacement === 'link' ? ' end-link' : '');
              _c.submit = E('button', cls, document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideR.bool(0.3)) {
              const same = (x) => wordOf(x).trim().toLowerCase() === endLabel.trim().toLowerCase(),
                choices = [...new Set(endWords.map(wordOf).filter((x) => !same(x)))];
              if (choices.length) {
                const d = E('button', 'pqd-xtra', footer, wordOf(collideR.pick(choices)));
                d.type = 'button';
                d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
              }
            }
            Object.assign(_c, { collideR });
          },
      },
    },
  });
})();
