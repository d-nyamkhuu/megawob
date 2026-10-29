// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'Amiga Workbench',
        'nav': '',
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
        'site': 'design-use-email-star-reply-06',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Mon 27 May 1991  10:24',
        'noteTitle': 'Task:',
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
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { E } = _c;
            const icons = [
              [
                'Ram Disk',
                '<svg viewBox="0 0 48 48"><path d="M5 4h34l5 5v35H5z" fill="#1d4fc4" stroke="#000" stroke-width="2"/><rect x="12" y="4" width="22" height="14" fill="#fff" stroke="#000" stroke-width="2"/><rect x="11" y="26" width="26" height="18" fill="#e8e8e8" stroke="#000" stroke-width="2"/><path d="M16 32h16M16 37h16" stroke="#1d4fc4" stroke-width="2"/></svg>',
              ],
              [
                'Work',
                '<svg viewBox="0 0 48 48"><path d="M4 22l6-10h28l6 10v16H4z" fill="#d8d8d8" stroke="#000" stroke-width="2"/><rect x="4" y="22" width="40" height="16" fill="#bbb" stroke="#000" stroke-width="2"/><path d="M14 30h20" stroke="#000" stroke-width="3"/></svg>',
              ],
              [
                'Mail',
                '<svg viewBox="0 0 48 48"><rect x="3" y="8" width="42" height="32" fill="#f2f2f2" stroke="#000" stroke-width="2"/><path d="M3 8l21 18L45 8M3 40l16-16M45 40L29 24" fill="none" stroke="#1d4fc4" stroke-width="2"/></svg>',
              ],
              [
                'Trash',
                '<svg viewBox="0 0 48 48"><rect x="8" y="4" width="32" height="6" rx="2" fill="#aaa" stroke="#000" stroke-width="2"/><path d="M10 12h28l-3 32H13z" fill="#bbb" stroke="#000" stroke-width="2"/><path d="M19 16v24M24 16v24M29 16v24" stroke="#555" stroke-width="2"/></svg>',
              ],
            ];
            icons[1][1] =
              '<svg viewBox="0 0 64 42"><path d="M3 17 10 3h44l7 14v21H3z" fill="#aaa" stroke="#000" stroke-width="2"/><path d="M6 17 12 5h40l6 12z" fill="#ddd" stroke="#fff"/><path d="M5 20h54v15H5z" fill="#bbb" stroke="#000"/><path d="M8 22h47M8 22v10M10 37h48" stroke="#eee"/><path d="M23 27h19l-3 4H24z" fill="#36618c" stroke="#111"/></svg>';
            icons[2][1] =
              '<svg viewBox="0 0 64 44"><rect x="2" y="2" width="60" height="40" fill="#eee" stroke="#000" stroke-width="2"/><path d="M4 4h56v36H4z" fill="none" stroke="#2f6da3"/><path d="M3 3 32 28 61 3M3 41 25 21M61 41 39 21" fill="none" stroke="#153451" stroke-width="2"/><path d="M5 5 32 26 58 5" fill="none" stroke="#6f9bcc"/></svg>';
            icons[3][1] =
              '<svg viewBox="0 0 54 68"><path d="M8 12 10 59Q27 68 43 59l3-47" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M13 15v43M20 17v45M28 17v46M36 16v45M41 15v42" stroke="#eee" stroke-width="2"/><path d="M16 17v43M24 18v45M32 18v44M39 16v44" stroke="#444"/><ellipse cx="27" cy="12" rx="24" ry="8" fill="#c4c4c4" stroke="#111" stroke-width="2"/><ellipse cx="27" cy="11" rx="20" ry="5" fill="#777" stroke="#eee"/><path d="M18 11V5q9-7 18 0v6h-5V6H23v5z" fill="#ccc" stroke="#111"/></svg>';
            icons.forEach(([t, svg], i) => {
              const d = E('div', 'wb-icon wb-icon' + i, document.body);
              d.innerHTML = svg;
              E('span', '', d, t);
            });
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { footer, icons });
          },
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
            const er = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'desktop' : er.pick(['toolbar', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            Object.assign(_c, { endLabel, endLabels, er, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endLabels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', (ev) => {
                ev.preventDefault();
                ctx.submit();
              });
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const labels = [...new Set(endLabels)].filter(
                (v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (labels.length) {
                const label = cr.pick(labels);
                const decoy = E('button', 'chrome-xtra', document.body, label);
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
