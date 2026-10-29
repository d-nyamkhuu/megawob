// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-word-04',
    styles: ['site.css', 'win31.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'gtkclear',
        'title': 'Documents',
        'tabs': ['All Documents', 'Recent', 'Starred', 'Trash', 'Personal', 'Work', 'Projects', 'Travel'],
        'aside': 'Library',
        'menu': 'File     Edit     View     Go     Bookmarks     Help',
        'ribbon': true,
        'foot': '',
        'accent': '#5c8fca',
        'bg': '#e9e7e1',
        'surface': '#fff',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (
              ['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'gtkclear', 'win31'].includes(
                C.theme,
              )
            ) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.theme === 'gtkclear') {
              const gtkRibbon = head.querySelector('.ribbon');
              const items = [
                ['New', 'M7 2h12l6 6v22H7z M19 2v7h6', 'M10 14h12M10 18h12M10 22h9'],
                ['Open', 'M3 9h11l3 3h12v16H3z M3 9V5h10l3 4', ''],
                ['Print', 'M8 3h16v9H8z M5 13h22v12H5z M9 19h14v10H9z', 'M10 6h12M10 22h12'],
                ['Cut', 'M8 8a3 3 0 1 0 0 .1M24 24a3 3 0 1 0 0 .1M10 10l12 12M22 10L10 22', ''],
                ['Copy', 'M10 8h17v21H10z M5 23H3V3h17v3', 'M14 13h9M14 17h9M14 21h9'],
                ['Paste', 'M10 5h12v4H10z M7 7H4v24h20v-4 M7 10h15v21H7z', 'M10 16h9M10 21h9M10 26h7'],
                ['Paste', 'M10 5h12v4H10z M7 7H4v24h20v-4 M7 10h15v21H7z', 'M10 16h9M10 21h9M10 26h7'],
              ];
              for (const [label, path, lines] of items) {
                const item = u.el('div', 'gtk-toolbar-item', gtkRibbon);
                const icon = u.svg(
                  'svg',
                  {
                    width: 32,
                    height: 34,
                    viewBox: '0 0 32 34',
                    fill: 'none',
                    stroke: '#686963',
                    'stroke-width': 1.4,
                    'stroke-linejoin': 'round',
                    'stroke-linecap': 'round',
                  },
                  item,
                );
                u.svg('path', { d: path, fill: label === 'Open' ? '#d3b372' : '#fdfdfb' }, icon);
                if (lines) u.svg('path', { d: lines, fill: 'none' }, icon);
                u.el('span', '', item, label);
              }
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  bt.type = 'button';
                  {
                    const P = {
                      Open: '<path d="M8 3h12l6 6v20H8z" fill="#fff" stroke="#000080" stroke-width="2"/><path d="M12 14h10M12 18h10M12 22h10" stroke="#000080" stroke-width="2"/>',
                      Save: '<path d="M4 4h24v24H4z" fill="#000080"/><path d="M9 4h14v9H9z" fill="#fff"/><path d="M10 19h12v9H10z" fill="#808080"/>',
                      Print:
                        '<path d="M9 4h14v9H9z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M3 13h26v12H3z" fill="#c0c0c0" stroke="#000" stroke-width="2"/><path d="M8 21h16v8H8z" fill="#fff" stroke="#000" stroke-width="2"/>',
                      Find: '<circle cx="13" cy="13" r="8" fill="#bfe8ff" stroke="#000080" stroke-width="3"/><path d="M19 19l9 9" stroke="#000080" stroke-width="5"/>',
                      Notes: '<path d="M3 8h10l3 3h13v16H3z" fill="#ffff55" stroke="#808000" stroke-width="2"/>',
                      Settings:
                        '<circle cx="16" cy="16" r="10" fill="#808080" stroke="#404040" stroke-width="4" stroke-dasharray="4 3"/><circle cx="16" cy="16" r="6" fill="#c0c0c0" stroke="#404040" stroke-width="2"/>',
                      Help: '<text x="16" y="27" font-size="30" font-weight="bold" text-anchor="middle" fill="#000080" font-family="Arial">?</text>',
                    };
                    const ic = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32' }, bt);
                    ic.innerHTML =
                      {
                        'Open':
                          '<path d="M5 2h18l5 5v24H5z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M23 2v6h5M8 6h12M8 11h16M8 14h16M8 17h16M8 20h16M8 23h16M8 26h16" fill="none" stroke="#5555ed" stroke-width="1.3"/>',
                        'Save':
                          '<path d="M3 2h24l3 3v25H3z" fill="#000080" stroke="#111" stroke-width="1.5"/><path d="M5 3h3v24H5z" fill="#7777ff"/><path d="M10 3h14v11H10z" fill="#ddd" stroke="#111"/><path d="M12 4h10v8H12z" fill="#fff"/><path d="M9 19h15v11H9z" fill="#aaa" stroke="#111"/><path d="M14 22h4v7h-4z" fill="#000080"/><path d="M27 7v20" stroke="#6666ff" stroke-width="2"/>',
                        'Print':
                          '<path d="M5 16h24v12l-4 3H2V21z" fill="#999" stroke="#111" stroke-width="1.5"/><path d="M2 21h23l4-5M25 21v10" fill="none" stroke="#111"/><path d="M10 2h17l-5 16H6z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M13 5h10M12 8h10M11 11h10M10 14h10" stroke="#000080" stroke-width="1.3"/><path d="M6 20h15l-2 7H4z" fill="#ddd" stroke="#111"/><path d="M8 21h9" stroke="#fff"/><path d="M23 24h3" stroke="#000"/>',
                        'Find':
                          '<path d="M20 19l10 10-3 3-10-10z" fill="#777" stroke="#111" stroke-width="1.3"/><circle cx="13" cy="13" r="11" fill="#000080" stroke="#111"/><circle cx="13" cy="13" r="9" fill="#5ce6ff"/><path d="M6 13a7 7 0 0 1 12-6v7H6z" fill="#e0ffff"/><path d="M6 7l3-2M5 11v4" stroke="white" stroke-width="2"/>',
                        'Notes':
                          '<path d="M2 4h11l4 5h13v23H2z" fill="#ffff91" stroke="#111" stroke-width="1.6"/><path d="M4 7h8l3 4h12v18H4z" fill="#ffff99"/><path d="M3 29h26V10" fill="none" stroke="#aaa954" stroke-width="2"/>',
                        'Settings':
                          '<path d="M12 2h7l1 5 4 1 4-2 4 6-4 3v4l4 3-4 6-4-2-4 1-1 5h-7l-1-5-4-1-4 2-4-6 4-3v-4l-4-3 4-6 4 2 4-1z" fill="#999" stroke="#111" stroke-width="1.5"/><path d="M13 4h4M24 11l3 3M6 12l-2 3M23 26l-3 1" stroke="#eee" stroke-width="1.5"/><circle cx="15.5" cy="17" r="7" fill="#ddd" stroke="#111" stroke-width="1.4"/><circle cx="15.5" cy="17" r="4" fill="#aaa"/>',
                        'Help':
                          '<text x="16" y="29" font-size="34" font-weight="bold" text-anchor="middle" fill="#0808b3" stroke="#111" stroke-width=".7" font-family="Arial">?</text>',
                      }[text] ||
                      P[text] ||
                      '';
                  }
                  u.el('span', '', bt, text);
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, footer, head, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide'),
                labels = ctx.content.END_LABELS || [
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
                labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              let label = 'Submit',
                place = 'footer';
              if (er.bool(0.5)) {
                label = labelOf(er.pick(labels));
                place = er.pick(['header', 'footer', 'link']);
              }
              const b = u.el(
                place === 'link' ? 'a' : 'button',
                place === 'link'
                  ? 'submit chrome-end-link'
                  : 'submit ' + (place === 'header' ? 'chrome-end-header' : ''),
                place === 'header' ? head : footer,
                label,
              );
              if (place === 'link') b.href = '#';
              else b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              _c.submit = b;
              if (cr.bool(0.3)) {
                const pool = [
                  ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
                ];
                if (pool.length) {
                  const d = u.el('button', 'clear chrome-pq', footer, cr.pick(pool));
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
                }
              }
            }
            if (C.theme === 'win31') {
              const clr = u.el('button', 'clear', footer, 'Clear');
              clr.type = 'button';
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              const tb = u.el('div', 'taskbar', body);
              const st = u.el('div', 'tb-start', tb);
              const fl = u.el('span', 'tb-flag', st);
              u.el('b', '', st, 'Start');
              u.el('div', 'tb-task', tb, C.title);
              const tr = u.el('div', 'tb-tray', tb);
              {
                const sp = u.svg(
                  'svg',
                  { width: 20, height: 18, viewBox: '0 0 20 18', fill: 'none', stroke: '#000', 'stroke-width': 1.6 },
                  tr,
                );
                u.svg('path', { d: 'M2 6h3l4-4v14l-4-4H2zM12 6q2 3 0 6M15 4q4 5 0 10' }, sp);
              }
              u.el('span', '', tr, '10:24 AM');
            }
          },
      },
    },
  });
})();
