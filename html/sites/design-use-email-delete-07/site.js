// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Mail',
        'nav': 'File  Edit  View  Message  Window  Help',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#111',
        'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
        'control': '#fff',
        'accent': '#fff',
        'accentfg': '#000',
        'sel': '#050505',
        'selfg': '#fff',
        'font': '"DejaVu Sans Mono",monospace',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-delete-07',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon Apr 10   9:24 AM',
        'noteTitle': '',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E } = _c;
            document.body.dataset.instructionDisplay = 'header';
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const wt = E('div', 'win-title', document.body);
            for (const g of ['−', '−']) E('span', 'gad l', wt, g);
            E('span', 'stripes', wt);
            E('span', 'wt-text', wt, 'Mail');
            for (const g of ['−', '↔', '×']) E('span', 'gad r', wt, g);
            Object.assign(_c, { wt });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, stage } = _c;
            _c.display = ctx.display;
            const bounds = stage.getBoundingClientRect();
            if ((_c.display === 'panel' && bounds.width < 1180) || (_c.display === 'toast' && bounds.height < 610))
              _c.display = 'header';
            document.body.dataset.instructionDisplay = _c.display;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'note-title', note, 'Instructions');
              else if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const labels = ctx.content.END_LABELS.map(labelOf);
            const classic = endRng.bool(0.5),
              placement = classic ? 'footer' : endRng.pick(['header', 'link']),
              endLabel = classic ? 'Submit' : endRng.pick(labels);
            Object.assign(_c, { bounds, classic, endLabel, endRng, labelOf, labels, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, labels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control end-' + placement, document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const options = labels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideRng.pick(options),
                  decoy = E('button', 'chrome-xtra', document.body, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
