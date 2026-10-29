// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Mail',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#111',
        'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
        'control': '#fff',
        'accent': '#fff',
        'accentfg': '#000',
        'sel': '#050505',
        'selfg': '#fff',
        'font': '"DejaVu Sans Mono",monospace',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-delete-09',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
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
            const W = innerWidth,
              H = innerHeight;
            _c.display = ctx.display;
            if ((_c.display === 'panel' && W < 1200) || (_c.display === 'toast' && H < 680)) _c.display = 'header';
            document.body.dataset.instr = _c.display;
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            Object.assign(_c, { H, W, labelOf });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, labelOf } = _c;
            _c.placement = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              _c.placement = er.pick(['bottom', 'bottom', 'bottom', 'bottom', 'titlebar', 'left-link']);
              const labels = (
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
              ).map(labelOf);
              const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
              const label = er.bool(0.75) || !alternatives.length ? 'Submit' : er.pick(alternatives);
              _c.submit = E(
                'button',
                'end-control ' + (_c.placement === 'bottom' ? '' : 'end-' + _c.placement),
                document.body,
                label,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.place = _c.placement;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { E, bar, ctx, labelOf } = _c;
            const controls = E('div', 'window-controls', bar);
            for (const path of ['M3 12h18', 'M4 4h16v16H4z', 'M4 4l16 16M20 4L4 20']) {
              const item = E('span', 'window-control', controls);
              item.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"/></svg>';
            }
            if (!ctx.finish) {
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const labels = (
                  ctx.content && Array.isArray(ctx.content.END_LABELS)
                    ? ctx.content.END_LABELS
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
                ).map(labelOf);
                const own = _c.submit.textContent.trim().toLowerCase();
                const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== own);
                if (pool.length) {
                  const b = E('button', 'chrome-pq', bar, cr.pick(pool));
                  b.type = 'button';
                  b.dataset.role = 'xtra';
                  b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
                }
              }
            }
            for (const n of document.querySelectorAll('.task-note')) {
              let f = parseFloat(getComputedStyle(n).fontSize);
              while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
                f -= 0.5;
                n.style.fontSize = f + 'px';
              }
            }
            Object.assign(_c, { controls });
          },
      },
    },
  });
})();
