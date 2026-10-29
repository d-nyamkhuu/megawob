// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-forward-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'bauhaus',
        'brand': 'Work Mail',
        'nav': 'SIMPLE PEOPLE BRIGHTER WORK',
        'bg': '#f1ece4',
        'surface': '#f9f8f4',
        'fg': '#111',
        'line': '#d1cec8',
        'title': '#f6d9d4',
        'control': '#f8f6f2',
        'accent': '#d3091a',
        'sel': '#fbe4df',
        'bar': 0,
        'foot': 70,
        'note': 'left:14.5%;top:1%;width:73%;border:0;background:transparent;font-size:24px;padding:8px',
        'end': 'right:0;bottom:0;width:23%;height:90px',
        'geo': {
          'folders': 'left:0;top:1%;width:12%;height:98%',
          'ledger': 'left:12%;top:1%;width:22%;height:98%',
          'document': 'left:34%;top:1%;width:33%;height:98%',
          'editor': 'left:67%;top:1%;width:33%;height:98%',
          'contacts': 'left:34%;bottom:-80px;width:42%;height:70px;z-index:7',
        },
        'site': 'design-use-email-forward-03',
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
        'dock': ['Tracker', 'Mail'],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            if (C.foot) {
              const leaf =
                  '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="13" cy="14" rx="7" ry="5" transform="rotate(35 13 14)" fill="#008633" stroke="#071d32"/><ellipse cx="6" cy="6" rx="3" ry="6" transform="rotate(-36 6 6)" fill="#3b9bed" stroke="#071d32"/><path d="M3 3 21 21" stroke="#071d32"/></svg>',
                env2 =
                  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z M3 5l9 7 9-7" fill="#fff" stroke="#235"/></svg>';
              C.dock.forEach((t, i) => {
                const s = E('span', 'dock-item' + (i ? ' dock-on' : ''), footer);
                s.innerHTML = (i ? env2 : leaf) + '<b>' + t + '</b>';
              });
              const tray = E('span', 'dock-tray', footer);
              tray.innerHTML =
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z M16 8c2 2 2 6 0 8 M19 5c4 4 4 10 0 14" fill="none" stroke="#222"/></svg><b>4:55 PM</b>';
              const di = E('div', 'desk-icons', document.body);
              const ic = [
                [
                  'BeOS',
                  '<svg viewBox="0 0 48 48"><defs><linearGradient id="leaf"><stop stop-color="#36b951"/><stop offset="1" stop-color="#007330"/></linearGradient><linearGradient id="petal"><stop stop-color="#98d3ff"/><stop offset="1" stop-color="#075ec0"/></linearGradient></defs><ellipse cx="29" cy="28" rx="14" ry="11" transform="rotate(36 29 28)" fill="url(#leaf)" stroke="#001d32"/><ellipse cx="13" cy="13" rx="6" ry="14" transform="rotate(-38 13 13)" fill="url(#petal)" stroke="#001d32"/><path d="M7 6C18 20 29 31 46 40" stroke="#001d32" stroke-width="2" fill="none"/></svg>',
                ],
                [
                  'Home',
                  '<svg viewBox="0 0 48 48"><path d="m7 7 11-1 5 5 17-2 2 32-34 1z" fill="#ffe2a0" stroke="#272622"/><path d="M5 15h35l-3 25H10z" fill="#efb459" stroke="#272622"/><path d="m3 17 34 2 5 23-32-3z" fill="#ffe6ad" stroke="#272622"/><path d="m8 18 27 2" stroke="#fff4d8"/></svg>',
                ],
                [
                  'Trash',
                  '<svg viewBox="0 0 48 48"><defs><linearGradient id="can"><stop stop-color="#eee"/><stop offset=".35" stop-color="#9ca4a8"/><stop offset=".8" stop-color="#737b80"/><stop offset="1" stop-color="#d5d9d9"/></linearGradient></defs><path d="M10 11h28l-4 31q-10 6-20 0z" fill="url(#can)" stroke="#15212b" stroke-width="2"/><ellipse cx="24" cy="11" rx="15" ry="6" fill="#d5d9dc" stroke="#15212b" stroke-width="2"/><ellipse cx="24" cy="10" rx="10" ry="3" fill="#384148"/><path d="M21 6V3h7v3" stroke="#ddd" stroke-width="2"/></svg>',
                ],
              ];
              for (const [n, s] of ic) {
                const d = E('div', 'desk-icon', di);
                d.innerHTML = s + '<span>' + n + '</span>';
              }
            }
            _c.display = ctx.display || 'header';
            const vw = document.documentElement.clientWidth,
              vh = document.documentElement.clientHeight;
            if ((_c.display === 'panel' && vw < 1260) || (_c.display === 'toast' && vh < 700)) _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              note.classList.add('note-' + _c.display);
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { vh, vw });
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const standard = er.bool(0.5);
              const placement = standard ? 'footer' : er.pick(['shelf', 'footer-left']);
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
              const label = standard
                ? 'Submit'
                : labels.filter((x) => x.trim().toLowerCase() !== 'submit')[
                    er.int(0, Math.max(0, labels.filter((x) => x.trim().toLowerCase() !== 'submit').length - 1))
                  ] || 'Done';
              _c.submit = E('button', 'end-control end-' + placement, document.body, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.addEventListener('click', () => ctx.submit());
              if (cr.bool(0.3)) {
                const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
                if (pool.length) {
                  const text = pool[cr.int(0, pool.length - 1)],
                    decoy = E('button', 'end-xtra end-xtra-' + placement, document.body, text);
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
