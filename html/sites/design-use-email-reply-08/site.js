// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-reply-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'MailTool',
        'nav': 'File  Edit  View  Mesage  Options',
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
        'site': 'design-use-email-reply-08',
        'scenario': 'reply',
        'platform': 'web',
        'account': 'Help',
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
        'frame.3': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              endWords = (ctx.content && ctx.content.END_LABELS) || [
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
              ],
              wordOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const placement = endRng.pick(['bottom', 'bottom', 'center', 'menu']);
            const standard = endWords.find((x) => wordOf(x).trim().toLowerCase() === 'submit');
            const label = endRng.bool(0.5)
              ? wordOf(standard || 'Submit')
              : wordOf(endRng.pick(endWords.filter((x) => wordOf(x).trim().toLowerCase() !== 'submit')) || 'Done');
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (collideRng.bool(0.3)) {
              const candidates = [...new Set(endWords.map(wordOf))].filter(
                (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
              );
              if (candidates.length) _c.collide = collideRng.pick(candidates);
            }
            const bar = E('header', 'desktop-bar', document.body);
            const brand = E('span', 'brand', bar, C.brand);
            E('span', 'wm-spacer', brand);
            E('span', 'wm-btn wm-min', brand);
            E('span', 'wm-btn wm-close', brand, '✕');
            const side = E('nav', 'side-index', document.body);
            E('span', 'side-logo', side, '✕');
            for (let n = 1; n <= 15; n++) E('span', 'side-cell' + (n === 9 ? ' on' : ''), side, String(n));
            if (C.nav) {
              const n = E('nav', 'nav', bar);
              for (const label of C.nav.split(/\s{2,}/)) {
                const a = E('button', 'chrome-nav', n, label);
                a.type = 'button';
                a.addEventListener('click', () => env.log('decoy', { label }));
              }
              if (_c.collide) {
                const d = E('button', 'chrome-nav chrome-pq', n, _c.collide);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.addEventListener('click', () => env.log('decoy', { label: _c.collide, collide: true }));
              }
            }
            Object.assign(_c, { bar, brand, collideRng, endRng, endWords, label, placement, side, standard, wordOf });
          },
        'frame.4': () => () => {},
        'frame.5': () => () => {},
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
            const { E, ctx, label, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'menu' ? 'a' : 'button',
                'end-control' + (placement === 'menu' ? ' end-link' : ''),
                document.body,
                label,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              if (placement === 'menu') {
                _c.submit.href = '#';
                Object.assign(_c.submit.style, {
                  left: '76%',
                  top: '5.05%',
                  width: '10%',
                  height: '3.2vh',
                  padding: '0',
                  background: 'transparent',
                  color: '#111',
                  fontSize: 'clamp(12px,1.2vw,20px)',
                  fontWeight: 'normal',
                  textDecoration: 'underline',
                  border: '0',
                  boxShadow: 'none',
                  textAlign: 'center',
                });
                _c.submit.addEventListener('click', (e) => {
                  e.preventDefault();
                  ctx.submit();
                });
              } else {
                if (placement === 'center')
                  Object.assign(_c.submit.style, {
                    left: '58%',
                    top: '88.4%',
                    right: 'auto',
                    width: '12%',
                    height: '5.95vh',
                  });
                _c.submit.addEventListener('click', () => ctx.submit());
              }
            }
          },
      },
    },
  });
})();
