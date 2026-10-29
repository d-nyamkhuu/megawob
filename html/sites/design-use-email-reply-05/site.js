// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'CityMail',
        'nav': 'Mail  Contacts  Calendar  Tasks  Options',
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
        'site': 'design-use-email-reply-05',
        'scenario': 'reply',
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
        'rowHeight': 52,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar);
            brand.innerHTML =
              '<svg viewBox="0 0 60 46" aria-hidden="true"><path d="M4 12 54 5l2 32-50 8z" fill="#fff" stroke="#80b1da" stroke-width="2" stroke-linejoin="round"/><path d="m6 42 16-20m14-2 19 16" fill="none" stroke="#9dc3e4" stroke-width="2"/><path d="m5 13 25 17L53 6" fill="none" stroke="#80b1da" stroke-width="2" stroke-linejoin="round"/></svg><b>Mail</b><i>Plus</i>';
            E('span', 'tagline', bar, 'Simple Email for What Matters');
            const ms = E('input', 'mp-search', bar);
            ms.type = 'text';
            ms.placeholder = 'Search mail...';
            ms.setAttribute('aria-label', 'Search mail');
            if (C.nav) {
              const n = E('nav', 'nav', bar);
              let first = true;
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav' + (first ? ' active' : ''), n, label);
                first = false;
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
            }
            Object.assign(_c, { brand, ms });
          },
        'frame.5': () => () => {},
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
            const endRng = ctx.rng.fork('chrome/end');
            const endWords = ctx.content.END_LABELS.map((x) =>
              typeof x === 'string' ? x : x.label || x.text || x.name,
            );
            ((_c.endLabel = 'Submit'), (_c.endPlacement = 'reference'));
            if (!endRng.bool(0.5)) {
              _c.endPlacement = endRng.pick(['toolbar', 'link']);
              _c.endLabel = endRng.pick(endWords.filter((x) => x.trim().toLowerCase() !== 'submit'));
            }
            document.body.dataset.endPlacement = ctx.finish ? 'finish' : _c.endPlacement;
            document.body.classList.toggle('mail-finish', !!ctx.finish);
            Object.assign(_c, { endRng, endWords });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx, endWords } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                _c.endPlacement === 'link' ? 'a' : 'button',
                'end-control end-' + _c.endPlacement,
                document.body,
                _c.endLabel,
              );
              if (_c.endPlacement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = _c.endLabel;
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const choices = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase(),
              );
              if (choices.length) {
                const label = collideRng.pick(choices);
                const b = E('button', 'chrome-xtra', bar, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
