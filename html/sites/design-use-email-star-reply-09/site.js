// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'Mail',
        'nav': 'Inbox   Compose   Folders   Address Book   Options   Help',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#000',
        'line': '#444',
        'title': '#fff',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#ddd',
        'font': '"Times New Roman",serif',
        'bar': 60,
        'note': 'left:2%;top:9%;width:96%;padding:8px 0;border:0;border-block:1px solid #111;font-size:20px',
        'end': 'right:2%;bottom:1.5%;padding:7px 32px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:2%;top:11%;width:25%;height:34%',
          'document': 'left:2%;top:11%;width:96%;height:45%;border:0;border-bottom:1px solid #111',
          'editor': 'left:2%;top:57%;width:96%;height:36%;border:0;border-bottom:1px solid #111',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-09',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
        'noteTitle': 'YOUR TASK',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.5': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const sb = E('div', 'searchbox', bar);
            sb.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
            E('span', '', sb, 'Search mail');
            const acc = E('span', 'account', bar);
            acc.innerHTML =
              '<svg class="grid9" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor" stroke="none"><circle cx="5" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/><circle cx="5" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/></g></svg>';
            E('span', 'me', acc, 'JD');
            Object.assign(_c, { acc, sb });
          },
        'frame.6': () => () => {},
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
            const steps = E('aside', 'steps-box', document.body);
            E('div', 'steps-h', steps, 'MAIL TIPS');
            const ol = E('ol', '', steps);
            for (const t of [
              'Select a message to read it.',
              'Use the toolbar to manage your mail.',
              'Review your draft before sending.',
            ])
              E('li', '', ol, t);
            const endRng = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const placement = referenceEnd ? 'briefing' : endRng.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
            Object.assign(_c, { endLabel, endLabels, endRng, labelOf, ol, placement, referenceEnd, steps });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, acc, bar, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control end-' + placement,
                placement === 'header' ? bar : document.body,
                endLabel,
              );
              if (placement === 'header') bar.insertBefore(_c.submit, acc);
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.dataset.role = 'submit';
              _c.submit.addEventListener('click', (ev) => {
                ev.preventDefault();
                ctx.submit();
              });
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = collideRng.pick(options);
                const decoy = E('button', 'chrome-xtra', document.body, label);
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
