// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'Mail Utility',
        'nav': 'File  Edit  View  Message  Tools  Help',
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
        'site': 'design-use-email-reply-10',
        'scenario': 'reply',
        'platform': 'web',
        'account': 'Mon Apr 12 2004   10:24 AM',
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
        'rowHeight': 41,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const gadgets = E('div', 'window-controls', bar);
            for (const label of ['−', '□', '×']) {
              const b = E('button', 'window-control', gadgets, label);
              b.type = 'button';
              b.tabIndex = -1;
            }
            Object.assign(_c, { gadgets });
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
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            document.body.dataset.endPlacement = ctx.finish ? 'none' : placement;
            Object.assign(_c, { cr, endLabel, endLabels, er, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, cr, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            if (cr.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options),
                  b = E('button', 'chrome-end-xtra', bar, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
          },
      },
    },
  });
})();
