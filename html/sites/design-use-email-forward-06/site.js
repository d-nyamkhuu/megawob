// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'MAIL',
        'nav': '',
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
        'site': 'design-use-email-forward-06',
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
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (v) => (typeof v === 'string' ? v : v.label || v.text || v.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endR.bool(0.5),
              placement = referenceEnd ? 'header' : endR.pick(['footer', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
            _c.display = ctx.display;
            if (_c.display === 'panel' && innerWidth < 1260) _c.display = 'header';
            if (_c.display === 'toast' && innerHeight < 700) _c.display = 'header';
            document.body.dataset.note = _c.display;
            document.body.dataset.end = ctx.finish ? 'none' : placement;
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar, collideR, endLabel, endLabels, endR, labelOf, placement, referenceEnd });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'episode-note-title', note, 'Task');
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, collideR, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control end-' + placement, document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            if (collideR.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = collideR.pick(options),
                  b = E('button', 'chrome-xtra', bar, label);
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
