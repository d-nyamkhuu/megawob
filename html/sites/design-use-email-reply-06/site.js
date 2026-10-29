// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'Mail',
        'nav': 'File  Edit  View  Mailbox  Message  Format  Window  Help',
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
        'site': 'design-use-email-reply-06',
        'scenario': 'reply',
        'platform': 'web',
        'account': 'Mon Nov 9   10:24 AM',
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
        'rowHeight': 52,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const statusLeft = E('span', 'system-status status-left', bar);
            statusLeft.innerHTML =
              '<svg viewBox="0 0 24 24"><path d="M2 8Q12 0 22 8 M5 12Q12 6 19 12 M8 16Q12 12 16 16"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg><svg viewBox="0 0 32 20"><rect x="2" y="3" width="25" height="14" rx="3"/><path d="M29 7v6"/><rect x="5" y="6" width="19" height="8" fill="currentColor" stroke="none"/></svg>';
            bar.insertBefore(statusLeft, bar.querySelector('.account'));
            const statusRight = E('span', 'system-status status-right', bar);
            statusRight.innerHTML =
              '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg><svg viewBox="0 0 24 24"><path d="M7 5h16 M7 12h16 M7 19h16 M1 5h2 M1 12h2 M1 19h2"/></svg>';
            Object.assign(_c, { statusLeft, statusRight });
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
              E(
                'p',
                'task-help',
                note,
                'Browse messages in the list. Use the toolbar to manage your mail and the editor to write messages.',
              );
            }
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const placement = referenceEnd ? 'reference' : endRng.pick(['toolbar', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endWords.filter((s) => s !== 'Submit'));
            Object.assign(_c, { endLabel, endRng, endWords, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endWords, placement } = _c;
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
              const label = collideRng.pick(
                endWords.filter((s) => s.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
              );
              const decoy = E('button', 'chrome-xtra', document.body, label);
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
