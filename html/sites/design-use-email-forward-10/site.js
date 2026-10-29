// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'MailWorks',
        'nav': 'Mail  Contacts  Calendar  Tasks  Preferences',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 63,
        'foot': 0,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-10',
        'scenario': 'forward',
        'platform': 'web',
        'account': 'Jane Smith ▾',
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
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (v) => (typeof v === 'string' ? v : v.label || v.text || v.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const placement = endRng.bool(0.5) ? 'reference' : endRng.pick(['toolbar', 'link']);
            const endLabel = placement === 'reference' ? 'Submit' : endRng.pick(endWords);
            document.body.dataset.endPlacement = ctx.finish ? 'none' : placement;
            Object.assign(_c, { endLabel, endRng, endWords, labelOf, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx, endLabel, endWords, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                'button',
                'end-control end-' + placement,
                placement === 'reference' ? document.body : bar,
                endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const label = collideRng.pick(
                [...new Set(endWords)].filter((v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
              );
              const decoy = E('button', 'chrome-end-xtra', bar, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
