// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-paragraph-08',
    styles: ['site.css', 'aero.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'open',
        'theme': 'frut',
        'title': 'Read & Learn',
        'foot': '',
        'accent': '#1c7a1c',
        'bg': '#7cc4f5',
        'surface': '#fff',
        'font': "'Trebuchet MS', 'Segoe UI', Arial, sans-serif",
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
            if (C.theme === 'frut') {
              const g = u.svg('svg', { class: 'globe', width: 62, height: 62, viewBox: '0 0 62 62' }, head);
              g.innerHTML =
                '<defs><radialGradient id="gl" cx=".32" cy=".25" r=".78"><stop offset="0" stop-color="#bcf5ff"/><stop offset=".38" stop-color="#47c6f8"/><stop offset=".72" stop-color="#168bdb"/><stop offset="1" stop-color="#0054a4"/></radialGradient><radialGradient id="land" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#e6fa8d"/><stop offset=".45" stop-color="#afe64b"/><stop offset="1" stop-color="#60b831"/></radialGradient><clipPath id="world-clip"><circle cx="31" cy="31" r="29"/></clipPath><radialGradient id="world-shade" cx=".34" cy=".24" r=".75"><stop offset=".55" stop-color="#005cac" stop-opacity="0"/><stop offset="1" stop-color="#004180" stop-opacity=".48"/></radialGradient></defs><circle cx="31" cy="31" r="29" fill="url(#gl)" stroke="#2187bb"/><g clip-path="url(#world-clip)" fill="url(#land)" stroke="#71b631" stroke-width=".25"><path d="M9 12Q12 8 17 7L22 5 26 7 28 5 31 8 28 11 27 15 24 17 22 15 19 17 18 22 15 24 14 29 11 28 9 25 7 24 6 20 3 18 6 14z"/><path d="M24 31Q26 28 30 30L32 33Q35 33 35 36L32 39 31 45 27 50 27 54 23 50 23 45 21 41 19 37 21 34z"/><path d="M35 7L39 5 42 6 42 8 39 10 37 14 35 12 32 13 32 10zM43 10L46 9 48 12 52 14 54 19 53 22 50 19 48 21 45 18 44 15 40 15 40 12z"/><path d="M34 20L38 18 42 20 44 24 40 26 41 30 38 35 36 37 33 33 33 29 30 25 31 22zM47 29L49 30 50 35 48 35zM48 41Q52 38 56 41L55 45 52 48 47 47 45 44z"/></g><circle cx="31" cy="31" r="29" fill="url(#world-shade)"/><ellipse cx="20" cy="15" rx="9" ry="14" transform="rotate(35 20 15)" fill="#fff" opacity=".28"/><path d="M10 12Q17 3 29 4" fill="none" stroke="#e2fdff" stroke-opacity=".65" stroke-width="1.2"/>';
            }
            if (C.theme === 'frut') {
              const waves = u.svg(
                'svg',
                { class: 'header-waves', viewBox: '0 0 1672 77', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
                head,
              );
              waves.innerHTML =
                '<path d="M450 0H1190Q1057 72 815 77Q670 61 450 0Z" fill="#dcf7ff" opacity=".11"/><path d="M515 0H1110Q997 72 807 77Q687 59 515 0Z" fill="#e4f9ff" opacity=".09"/>';
            }
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.theme === 'frut') {
              const nv = u.el('nav', 'fnav', head);
              const ic = {
                Home: '<path d="M1 11.4L10.6 1.9q1.4-1.3 2.8 0l3 2.7V2.3h3v5l3.6 3.5-2 2-1.7-1.7v10.4H14v-7h-4v7H4.7V11.1L3 13z" fill="#fff" stroke="#168fed" stroke-width=".8" stroke-linejoin="round"/><path d="M5.8 10.8L12 4.6l6.2 6.2" fill="none" stroke="#d4edff"/>',
                Activities:
                  '<rect x="2.3" y="1" width="19.4" height="22" rx="1.8" fill="#fff" stroke="#168fed" stroke-width=".8"/><path d="M5.5 5.2h13M5.5 9.1h13M5.5 13h13M5.5 17h13" stroke="#168fed" stroke-width="1.6"/>',
                Settings:
                  '<path d="M9.5 1h5l.7 3.5 2 .9 3-1.8 2.5 4.3-2.7 2.3v3.6l2.7 2.3-2.5 4.3-3-1.8-2 .9-.7 3.5h-5l-.7-3.5-2-.9-3 1.8L.8 16.1l2.7-2.3v-3.6L.8 7.9l2.5-4.3 3 1.8 2-.9z" fill="#fff" stroke="#168fed" stroke-width=".8" stroke-linejoin="round"/><circle cx="12" cy="12" r="4.7" fill="#48aaf6" stroke="#168fed" stroke-width="1"/>',
              };
              for (const n of ['Home', 'Activities', 'Settings']) {
                const a = u.el('button', 'fnav-i', nv);
                a.type = 'button';
                const s = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 24 24' }, a);
                s.innerHTML = ic[n];
                u.el('span', '', a, n);
                a.onclick = () => env.log('nav', { n });
              }
            }
            if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'frut') {
              const bi = u.svg('svg', { class: 'note-ic', width: 88, height: 88, viewBox: '0 0 88 88' }, note);
              bi.innerHTML =
                '<defs><linearGradient id="ng" x2="0" y2="1"><stop offset="0" stop-color="#85d5ff"/><stop offset=".42" stop-color="#078bed"/><stop offset=".57" stop-color="#208de9"/><stop offset="1" stop-color="#4bb3ee"/></linearGradient><linearGradient id="ng-rim" x2="0" y2="1"><stop offset="0" stop-color="#d3f5ff"/><stop offset="1" stop-color="#61b5e5"/></linearGradient><radialGradient id="ng-shine" cx=".3" cy=".13" r=".65"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle cx="44" cy="44" r="42" fill="url(#ng)" stroke="#0396ed" stroke-width="2"/><circle cx="44" cy="44" r="39" fill="none" stroke="url(#ng-rim)" stroke-width="1.5"/><circle cx="44" cy="44" r="39" fill="url(#ng-shine)"/><path d="M29 23h20l12 12v27q0 2-2 2H29q-2 0-2-2V25q0-2 2-2z" fill="#fff" stroke="#0b7fd8" stroke-width="1.5"/><path d="M49 24v12h11M33 35h8M33 42h21M33 48h21M33 54h21" fill="none" stroke="#1689ea" stroke-width="2" stroke-linejoin="round"/>';
            }
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
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
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
            Object.assign(_c, { cr, endLabel, endWords, er, labelOf, placement, referenceEnd });
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, content, cr, ctx, endLabel, endWords, footer, head, placement, shell, u } = _c;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'header' ? ' end-header' : placement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (placement === 'link') {
                _c.submit.href = '#';
                footer.classList.add('end-at-left');
              } else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (cr.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options),
                  tools = u.el(
                    'div',
                    'chrome-xtras' + (!ctx.finish && placement === 'link' ? ' xtras-at-right' : ''),
                    shell,
                  );
                const decoy = u.el('button', 'end-xtra', tools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            if (ctx.display === 'panel') content.classList.add('with-instruction-panel');
            if (ctx.display === 'toast') content.classList.add('with-instruction-toast');
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
