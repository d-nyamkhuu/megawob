// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'Mail - OS/2',
        'nav': 'File  Edit  View  Message  Compose  Options  Help',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 63,
        'foot': 90,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-07',
        'scenario': 'forward',
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
        'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 100,
        'stack': false,
        'dock': ['OS/2', 'Mail - OS/2'],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar, C.brand);
            const appIcon =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h18v20H3z M6 6h12v13H6z M9 3v9h6V3 M9 16h6 M1 7h2"/></svg>';
            const bi = E('span', 'app-icon', brand);
            bi.innerHTML = appIcon;
            const gadgets = E('span', 'window-controls', brand);
            for (const [label, cls] of [
              ['', 'minimize'],
              ['', 'maximize'],
              ['', 'close-window'],
            ]) {
              const g = E('button', cls, gadgets, label);
              g.type = 'button';
              g.setAttribute('aria-label', cls);
              g.addEventListener('click', () => env.log('decoy', { label: cls }));
            }
            Object.assign(_c, { appIcon, bi, brand, gadgets });
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
              if (ctx.display === 'panel') {
                E('div', 'episode-note-title', note, 'Task');
                if (document.body.clientWidth < 1200) note.dataset.display = 'header';
              }
              if (ctx.display === 'toast') note.setAttribute('role', 'status');
              if (note.dataset.display === 'panel' && note.scrollHeight > note.clientHeight + 1)
                note.dataset.display = 'header';
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, 'Submit');
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              let placement = 'inspector',
                label = 'Submit';
              if (er.bool(0.5)) {
                placement = er.pick(['menu', 'toolbar']);
                const pool = ctx.content && ctx.content.END_LABELS;
                const labels =
                  Array.isArray(pool) && pool.length
                    ? pool
                    : [
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
                      ];
                const picked = er.pick(labels);
                label =
                  typeof picked === 'string'
                    ? picked
                    : (picked && (picked.label || picked.text || picked.name)) || String(picked);
              }
              _c.submit.textContent = label;
              _c.submit.dataset.placement = placement;
              const panelNote = document.querySelector('.task-note[data-display=panel]');
              if (panelNote && placement === 'toolbar') panelNote.dataset.display = 'header';
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const pool = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(pool) && pool.length
                  ? pool
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const own = _c.submit && _c.submit.textContent.trim().toLowerCase();
              const options = [
                ...new Set(
                  labels
                    .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)).trim())
                    .filter((x) => x && x.toLowerCase() !== own),
                ),
              ];
              if (options.length) {
                const label = cr.pick(options);
                const decoy = E('button', 'chrome-pq', document.body, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { cr });
          },
      },
    },
  });
})();
