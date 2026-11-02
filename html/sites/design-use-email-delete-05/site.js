// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-delete-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Activities',
        'nav': 'Mail',
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
        'site': 'design-use-email-delete-05',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Apr 28  10:24 AM',
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
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const ic = (d) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
            const tray = E('span', 'sys-tray', bar);
            tray.innerHTML =
              ic('M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0') +
              ic('M3 9v6h4l5 4V5L7 9zM16 9a4 4 0 0 1 0 6') +
              ic('M8 4h8v17H8zM10 2h4');
            E('div', 'win-bg', document.body);
            E('span', 'win-title', document.body, 'Mail');
            const cb = E('span', 'win-compose', document.body);
            cb.innerHTML = ic('M4 6h8M4 6v14h14v-8M20 3l-9 9-1 3 3-1 9-9z');
            for (const [k, d] of [
              ['min', 'M6 12h12'],
              ['max', 'M7 7h10v10H7z'],
              ['close', 'M6 6l12 12M18 6 6 18'],
            ]) {
              const w = E('span', 'win-btn ' + k, document.body);
              w.innerHTML = ic(d);
            }
            Object.assign(_c, { cb, ic, tray });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              E('span', 'note-icon', note, 'i');
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            const submit = _c.submit;
            if (submit && !submit.classList.contains('end-home')) {
              const alternate = _c.ctx.rng.fork('chrome/site/alternate').bool(0.5);
              submit.classList.toggle('end-center', alternate);
              submit.classList.toggle('end-menubar', !alternate);
            }
            const placement = !submit ? 'none' : submit.classList.contains('end-home') ? 'note' :
              submit.classList.contains('end-center') ? 'footer' : 'header';
            document.body.dataset.endPlacement = placement;
            if (submit) submit.dataset.placement = placement;
            const extra = _c.bar.querySelector('.pq-xtra');
            if (extra) {
              extra.className = 'end-xtra';
              extra.dataset.placement = placement === 'header' ? 'note' : 'header';
              document.body.appendChild(extra);
            }
          },
      },
    },
  });
})();
