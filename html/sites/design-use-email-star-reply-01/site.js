// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'WebMail',
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
        'site': 'design-use-email-star-reply-01',
        'scenario': 'star-reply',
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
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            const endR = ctx.rng.fork('chrome/end');
            const endBank = ctx.content && ctx.content.END_LABELS;
            const endLabels =
              Array.isArray(endBank) && endBank.length
                ? endBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = labelOf(endR.pick(endLabels));
            const placement = endR.pick(['footer', 'footer', 'form', 'ribbon']);
            _c.collideLabel = null;
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar, endBank, endLabel, endLabels, endR, labelOf, placement });
          },
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar, ctx, endLabel, endLabels, labelOf } = _c;
            if (C.nav) {
              const n = E('nav', 'nav', bar);
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav', n, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
              const collideR = ctx.rng.fork('chrome/collide');
              if (collideR.bool(0.3)) {
                const pool = endLabels
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (pool.length) _c.collideLabel = collideR.pick(pool);
              }
            }
          },
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
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'ribbon' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (placement === 'ribbon') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            if (_c.collideLabel) {
              const d = E('button', 'endword-xtra', document.body, _c.collideLabel);
              d.type = 'button';
              d.addEventListener('click', () => env.log('decoy', { label: _c.collideLabel, collide: true }));
            }
          },
      },
    },
  });
})();
