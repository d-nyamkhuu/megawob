// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'Mail',
        'nav': '',
        'foot': true,
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
        'site': 'design-use-email-star-reply-05',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
        'noteTitle': 'Your task',
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
        'dock': ['When you’re done, click ', 'Submit.'],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            const endRng = ctx.rng.fork('chrome/end');
            const endLabels = ctx.content.END_LABELS;
            const endLabelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = endLabelOf(endRng.pick(endLabels));
            const placement = endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'link']);
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (collideRng.bool(0.3)) {
              const options = [...new Set(endLabels.map(endLabelOf))].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) _c.collide = collideRng.pick(options);
            }
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar, collideRng, endLabel, endLabelOf, endLabels, endRng, placement });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const fi = E('span', 'filter-ico', bar);
            fi.innerHTML =
              '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="8" cy="7" r="2" fill="#fff"/><circle cx="16" cy="12" r="2" fill="#fff"/><circle cx="10" cy="17" r="2" fill="#fff"/></svg>';
            Object.assign(_c, { fi });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, endLabel, footer } = _c;
            if (C.foot) for (const t of C.dock) E('span', '', footer, !ctx.finish ? t.replace('Submit', endLabel) : t);
            if (_c.collide) {
              const d = E('button', 'chrome-pq', footer, _c.collide);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.addEventListener('click', () => env.log('decoy', { label: _c.collide, collide: true }));
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, placement } = _c;
            if (!ctx.finish) {
              const isLink = placement === 'link';
              _c.submit = E(
                isLink ? 'a' : 'button',
                'end-control ' + (placement === 'toolbar' ? 'end-toolbar' : isLink ? 'end-link' : 'end-footer'),
                document.body,
                endLabel,
              );
              _c.submit.type = 'button';
              if (isLink) _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
          },
      },
    },
  });
})();
