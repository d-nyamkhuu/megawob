// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-08',
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
        'site': 'design-use-email-star-reply-08',
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
        'frame.4': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const tb = E('div', 'titlebar', bar);
            E('span', 'tb-icon', tb);
            E('span', 'brand', tb, 'Mail — Inbox');
            const gd = E('span', 'gadgets-box', tb);
            for (const g of ['_', '□', '×']) E('span', 'gadget', gd, g);
            const n = E('nav', 'nav', bar);
            for (const label of ['File', 'Edit', 'View', 'Message', 'Tools', 'Help']) {
              const a = E('button', 'chrome-nav', n);
              a.type = 'button';
              E('u', '', a, label[0]);
              a.append(label.slice(1));
              a.addEventListener('click', () => env.log('decoy', { label }));
            }
            Object.assign(_c, { gd, n, tb });
          },
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            E('span', 'foot-l', footer);
            E('span', 'foot-r', footer, 'No message selected');
            _c.display = ctx.display || 'header';
            if (
              (_c.display === 'panel' && innerWidth < 1180) ||
              (_c.display === 'toast' && (innerWidth < 1180 || innerHeight < 680))
            )
              _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, n } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                labels = (
                  (ctx.content && ctx.content.END_LABELS) || [
                    'Submit',
                    'Done',
                    'Finish',
                    'Continue',
                    'Save',
                    'OK',
                    'Confirm',
                    'Apply',
                    'Complete',
                    "I'm done",
                  ]
                ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
              const place = er.pick(['footer', 'footer-left', 'nav']);
              const label = er.bool(0.5) ? 'Submit' : er.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
              _c.submit = E('button', 'end-control end-' + place, document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const labels = (
                (ctx.content && ctx.content.END_LABELS) || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                  "I'm done",
                ]
              ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
              const own = _c.submit && _c.submit.textContent.trim().toLowerCase();
              const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== own);
              if (pool.length) {
                const d = E('button', 'chrome-pq', n, cr.pick(pool));
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
