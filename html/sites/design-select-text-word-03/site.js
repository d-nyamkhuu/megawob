// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-word-03',
    styles: ['site.css', 'win31.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'macmail',
        'title': 'Yahoo!',
        'subtitle': 'A Guide to   What’s New on the Web',
        'tabs': [
          'Project Update',
          'Launch Schedule',
          'Budget Review',
          'Site Design Details',
          'Re: Team Directory',
          'Meeting Notes',
          'Marketing Plans',
          'Re: Logo Ideas',
          'Test Results',
          'Project Kickoff',
        ],
        'aside': 'Related Messages',
        'menu': 'Search the Web                       Search          Help   |   My Yahoo!   |   Sign In',
        'foot': '',
        'accent': '#1239b4',
        'bg': '#d3d3d3',
        'surface': '#fff',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'win31'].includes(C.theme)) {
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
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell),
              directory = u.el('aside', 'directory', content);
            u.el('h3', '', directory, 'Directory');
            for (const [icon, label] of [
              ['globe', 'Arts & Humanities'],
              ['books', 'Business & Economy'],
              ['computer', 'Computers & Internet'],
              ['people', 'Education'],
              ['building', 'Government'],
              ['heart', 'Health'],
              ['news', 'News & Media'],
              ['tree', 'Recreation & Sports'],
              ['people', 'Reference'],
              ['globe', 'Regional'],
              ['flask', 'Science'],
              ['globe', 'Social Science'],
              ['briefcase', 'Society & Culture'],
            ]) {
              const row = u.el('div', 'directory-link', directory);
              const holder = u.el('span', 'dir-icon', row);
              holder.dataset.icon = icon;
              const svg = u.svg('svg', { width: 29, height: 29, viewBox: '0 0 32 32', 'aria-hidden': 'true' }, holder);
              const p = (d, fill = '#f4f4f4') =>
                u.svg(
                  'path',
                  { d, fill, stroke: '#111', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' },
                  svg,
                );
              if (icon === 'globe') {
                p('M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28', '#57b8df');
                p('M7 7l5 1 2 4-3 3 1 6-4 3-4-7 1-6zm13-3 5 3-2 4-4-1-2-3zm-1 14 5-2 4 4-4 7-5-2z', '#55aa54');
              } else if (icon === 'books') {
                p('M4 4h7v24H4z', '#e33a32');
                p('M13 3h7v25h-7z', '#ffd343');
                p('M22 5h6v23h-6z', '#318ad0');
                p('M6 8h3M15 8h3M24 9h2', 'none');
              } else if (icon === 'computer') {
                p('M4 4h24v17H4z', '#badcf0');
                p('M12 22h8v4h5v2H7v-2h5z', '#aaa');
              } else if (icon === 'people') {
                p('M5 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0M19 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0', '#ffcf42');
                p('M2 27v-5q0-6 7-6t7 6v5zm14 0v-5q0-6 7-6t7 6v5z', '#318ad0');
              } else if (icon === 'building') {
                p('M4 12h24M7 12v15m6-15v15m6-15v15m6-15v15M3 27h26M5 10l11-7 11 7z', '#d7d5c8');
                p('M14 7h4v3h-4z', '#db3830');
              } else if (icon === 'heart') {
                p('M16 28S2 19 3 10Q4 2 12 6l4 4 4-4q9-4 9 5 0 8-13 17', '#f33');
              } else if (icon === 'news') {
                p('M4 3h24v26H4z', '#fafafa');
                p('M8 7h16M8 11h16M8 16h7m-7 4h7m-7 4h7M19 15h5v9h-5z', 'none');
              } else if (icon === 'tree') {
                p('M16 3Q8 3 10 10 3 9 6 17q-4 7 8 7h4q12 0 8-8 3-8-5-7Q21 2 16 3', '#46b546');
                p('M14 23h4v6h-4z', '#8b542d');
              } else if (icon === 'flask') {
                p('M12 3h8m-6 0v9L7 26q-1 3 3 3h12q4 0 3-3L18 12V3z', '#46c9c0');
              } else {
                p('M5 10h22v18H5z', '#ac6451');
                p('M11 10V5h10v5m-8 5v4h6v-4', 'none');
              }
              u.el('a', '', row, label);
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, directory, note });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, stage, u } = _c;
            stage.classList.replace('stage', 'mail-stage');
            const sheet = u.el('section', 'mail-sheet', content);
            u.el('div', 'portal-mail-title', sheet, 'Yahoo! Mail');
            sheet.append(stage);
            _c.aside = null;
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
        'frame.22': () => () => {},
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
