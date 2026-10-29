// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'MailDesk',
        'nav': 'File  Edit  Message  View  Options  Help',
        'foot': true,
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
        'site': 'design-use-email-star-05',
        'scenario': 'star',
        'platform': 'web',
        'account': '',
        'noteTitle': '',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 44,
        'stack': false,
        'dock': ['▣  A:\\>', '16:28'],
      },
      parts: {
        'frame.3': (_base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            _c.display = ctx.display;
            if (innerWidth < 1260 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
            document.body.dataset.instructionDisplay = _c.display;
            document.body.style.removeProperty('--note-extra');
            document.body.style.removeProperty('--toast-space');
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (_c.display === 'panel') E('div', 'episode-note-title', note, 'Task');
              else if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
              if (_c.display === 'header') {
                const base = note.getBoundingClientRect().height,
                  needed = note.querySelector('.instruction').scrollHeight + 8;
                if (needed > base) {
                  note.style.height = needed + 'px';
                  document.body.style.setProperty('--note-extra', needed - base + 'px');
                }
              }
              if (_c.display === 'toast')
                document.body.style.setProperty('--toast-space', note.getBoundingClientRect().height + 12 + 'px');
            }
            const endR = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
              endWords = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['header', 'link']),
              endLabel = original ? 'Submit' : endR.pick(endWords);
            Object.assign(_c, { endLabel, endR, endWords, labelOf, original, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (_base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endWords, original, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              if (!original) _c.submit.classList.add('end-alternate');
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = collideR.pick(options),
                  decoy = E('button', 'end-xtra', document.body, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.dataset.placement = placement === 'link' ? 'right' : 'middle';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideR });
          },
      },
    },
  });
})();
