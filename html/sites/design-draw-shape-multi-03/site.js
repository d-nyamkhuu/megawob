// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-multi-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'community',
        'title': 'Maple Grove',
        'subtitle': 'COMMUNITY   HOMEPAGE',
        'aside': 'Drawing Tools',
        'foot': 'Click and drag to draw. Release to finish.',
        'accent': '#171d52',
        'bg': '#e7eaf6',
        'surface': '#fffdf7',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx } = _c;
            const u = ctx.util,
              body = document.body,
              display =
                (ctx.display === 'panel' || ctx.display === 'toast') &&
                (window.innerWidth < 1400 || window.innerHeight < 800)
                  ? 'header'
                  : ctx.display;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' instr-' +
              display +
              (display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { body, display, u });
          },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            const sprite = (x, y, w, h, cls = '') =>
              `<svg class="pixel-sprite ${cls}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><image href="sites/design-draw-shape-multi-03/assets/reference.webp" width="1672" height="941" preserveAspectRatio="none"/></svg>`;
            if (C.theme === 'community')
              shell.insertAdjacentHTML(
                'afterbegin',
                '<svg class="paper-texture" width="100%" height="100%" aria-hidden="true"><defs><pattern id="community-paper" width="128" height="128" patternUnits="userSpaceOnUse"><svg width="128" height="128" viewBox="260 0 128 128"><image href="sites/design-draw-shape-multi-03/assets/reference.webp" width="1672" height="941"/></svg></pattern></defs><rect width="100%" height="100%" fill="url(#community-paper)"/></svg>',
              );
            if (C.theme === 'community') {
              const t = head.querySelector('.title'),
                s = head.querySelector('.subtitle');
              const left = u.el('div', 'h-left', head),
                mid = u.el('div', 'h-mid', head),
                right = u.el('div', 'h-right', head);
              left.innerHTML =
                '<svg width="76" height="82" viewBox="0 0 38 41"><path d="M2 20L19 4L36 20Z" fill="#c9566b" stroke="#6a2c3c"/><rect x="6" y="20" width="26" height="17" fill="#f1e7b8" stroke="#6a5a3c"/><rect x="10" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="22" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="16" y="29" width="6" height="8" fill="#7a5a3c"/><path d="M2 38H36" stroke="#4a9a4a" stroke-width="3"/></svg>';
              left.innerHTML =
                '<svg class="pixel-sprite house" viewBox="0 0 500 140" preserveAspectRatio="none" aria-hidden="true"><rect width="500" height="140" fill="transparent"/><path d="M0 112Q55 91 105 112T210 110T330 108T500 116V140H0Z" fill="#63814a"/><g fill="#315d39" stroke="#263e30" stroke-width="2"><circle cx="64" cy="55" r="35"/><circle cx="103" cy="40" r="29"/><circle cx="374" cy="61" r="37"/><circle cx="427" cy="48" r="44"/><circle cx="467" cy="77" r="31"/></g><g fill="#547c48"><circle cx="48" cy="42" r="18"/><circle cx="87" cy="24" r="19"/><circle cx="350" cy="46" r="21"/><circle cx="411" cy="27" r="22"/></g><path d="M104 99V56L165 8L237 55V106Z" fill="#eee8d3" stroke="#5d4c42" stroke-width="4"/><path d="M92 57L164 1L246 53L234 61L164 18L106 66Z" fill="#a83234" stroke="#652b2c" stroke-width="4"/><path d="M178 23V4H197V38" fill="#813433" stroke="#582d2d" stroke-width="3"/><rect x="120" y="64" width="27" height="30" fill="#b9d2d7" stroke="#34445a" stroke-width="3"/><path d="M133 64V94M120 79H147" stroke="#f4f1df" stroke-width="3"/><rect x="190" y="65" width="30" height="41" fill="#f5e9b6" stroke="#51463c" stroke-width="3"/><rect x="156" y="64" width="23" height="20" fill="#c5dce0" stroke="#34445a" stroke-width="3"/><path d="M167 64V84M156 74H179" stroke="#f4f1df" stroke-width="2"/><path d="M4 112H493" stroke="#eee8d4" stroke-width="8"/><path d="M9 99V132M25 99V132M41 99V132M57 99V132M73 99V132M89 99V132M250 99V132M266 99V132M282 99V132M298 99V132M314 99V132M330 99V132M346 99V132M362 99V132M378 99V132M394 99V132M410 99V132M426 99V132M442 99V132M458 99V132M474 99V132" stroke="#eee8d4" stroke-width="6"/><g fill="#e7bf48"><circle cx="258" cy="105" r="5"/><circle cx="271" cy="99" r="4"/><circle cx="286" cy="106" r="5"/><circle cx="300" cy="99" r="4"/><circle cx="316" cy="105" r="5"/></g></svg>';
              u.el('nav', 'h-nav', left);
              const leaf =
                '<svg class="leaf" width="56" height="68" viewBox="0 0 28 34"><path d="M14 2L19 9L25 8L22 15L26 20L18 21L14 26L10 21L2 20L6 15L3 8L9 9Z" fill="#2f9a6a" stroke="#1a5a40"/><path d="M14 10V32" stroke="#1a5a40" stroke-width="2"/></svg>';
              const row = u.el('div', 'h-row', mid);
              const tw = u.el('div', 'h-tw', row);
              tw.append(t, s);
              right.innerHTML =
                '<svg width="76" height="84" viewBox="0 0 38 42"><path d="M6 40V18L9 6L14 14H24L29 6L32 18V40Z" fill="#8c93a6" stroke="#444a5c"/><circle cx="14" cy="22" r="1.6" fill="#222"/><circle cx="24" cy="22" r="1.6" fill="#222"/></svg><div class="h-wish">Good<br>People<br>Brighter<br>Days</div><svg width="34" height="44" viewBox="0 0 17 22"><circle cx="8.5" cy="7" r="5.5" fill="#d83a55" stroke="#7a1830"/><path d="M8.5 12V22" stroke="#2f7a3a" stroke-width="2"/></svg>';
            }
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
                const bt = u.el('button', 'tool', parent);
                bt.type = 'button';
                const icon = u.svg(
                  'svg',
                  {
                    width: 32,
                    height: 34,
                    viewBox: '0 0 32 32',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.8,
                  },
                  bt,
                );
                u.svg('path', { d: path }, icon);
                u.el('span', '', bt, name);
                bt.onclick = () => {
                  rib.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                  bt.classList.add('selected');
                };
                return bt;
              };
              const groups =
                C.theme === 'eink'
                  ? ['Tools', 'View', 'Style', 'Help']
                  : C.theme === 'office'
                    ? ['Navigate', 'Draw', 'Edit', 'Options']
                    : ['Navigation', 'Draw', 'Options', 'Support'];
              for (const [j, name] of groups.entries()) {
                const gr = u.el('div', 'tool-group', rib);
                if (j === 0) {
                  for (const t of [
                    'Select',
                    'Pan',
                    'Zoom In',
                    'Zoom Out',
                    C.theme === 'office' ? 'Fit to Window' : 'Reset View',
                  ]) {
                    const path =
                      t === 'Select'
                        ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                        : t === 'Pan'
                          ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z'
                          : t === 'Reset View'
                            ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                            : 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' +
                              (t === 'Zoom In' ? 'M14 8V20' : '');
                    tool(gr, t, path);
                  }
                } else if ((C.theme === 'eink' && j === 1) || (C.theme === 'vista' && j === 2)) {
                  for (const label of C.theme === 'eink'
                    ? ['Show Labels', 'Show Dotted Circle', 'Show Grid']
                    : ['Show Grid', 'Snap to Grid', 'Show Measurements']) {
                    const l = u.el('label', 'check-tool', gr);
                    const input = u.el('input', '', l);
                    input.type = 'checkbox';
                    input.checked =
                      label === 'Show Labels' ||
                      label === 'Show Dotted Circle' ||
                      (label === 'Show Grid' && C.theme === 'vista');
                    u.el('span', '', l, label);
                  }
                } else if (C.theme === 'eink' && j === 2) {
                  for (const [title, values] of [
                    ['Line Thickness', ['2', '1', '3']],
                    ['Dashed Style', ['Dotted', 'Dashed', 'Solid']],
                  ]) {
                    const l = u.el('label', 'style-tool', gr, title);
                    const select = u.el('select', '', l);
                    for (const v of values) u.el('option', '', select, v);
                  }
                } else {
                  let names =
                    C.theme === 'eink'
                      ? ['Instructions', 'Example']
                      : C.theme === 'office'
                        ? j === 1
                          ? ['Add Point', 'Add Circle', 'Add Line', 'Erase']
                          : j === 2
                            ? ['Undo', 'Redo']
                            : ['Settings']
                        : j === 1
                          ? ['Line', 'Circle', 'Rectangle', 'Point']
                          : ['Help', 'About'];
                  for (const t of names)
                    tool(
                      gr,
                      t,
                      t.includes('Circle')
                        ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16'
                        : t.includes('Line')
                          ? 'M3 29L29 3'
                          : t === 'Point'
                            ? 'M19 16A3 3 0 1 1 13 16A3 3 0 1 1 19 16'
                            : t === 'Instructions' || t === 'Help'
                              ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                              : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
            if (C.theme === 'community') {
              head.querySelector('.h-right').innerHTML =
                '<svg class="pixel-sprite lake" viewBox="0 0 532 140" preserveAspectRatio="none" aria-hidden="true"><rect width="532" height="140" fill="transparent"/><path d="M0 99L34 66L58 76L98 32L128 72L170 25L207 74L247 45L278 78L324 34L358 76L400 50L442 75L480 40L532 71V112H0Z" fill="#7293a0"/><path d="M0 101L49 78L74 91L116 55L143 89L183 44L219 87L257 66L287 91L333 53L370 89L413 68L448 90L489 58L532 82V119H0Z" fill="#385b4b"/><path d="M0 91Q70 82 134 94T273 93T409 92T532 90V140H0Z" fill="#82bad0"/><path d="M0 110Q80 103 165 112T331 108T532 109" fill="none" stroke="#d2e2d9" stroke-width="4"/><g fill="#173e35"><path d="M59 89L72 36L85 89ZM82 90L97 24L112 90ZM128 91L141 39L154 91ZM337 91L351 29L365 91ZM379 90L394 20L409 90ZM426 91L440 36L454 91ZM481 91L496 25L511 91Z"/></g><path d="M355 111V69L382 109Z" fill="#fff" stroke="#26344a" stroke-width="3"/><path d="M358 112H389L378 121H350Z" fill="#b82c32" stroke="#26344a" stroke-width="3"/><path d="M354 67V111" stroke="#26344a" stroke-width="3"/></svg>';
            }
            const content = u.el('div', 'content', shell);
            if (C.theme === 'community') {
              const bar = u.el('div', 'act-bar', content);
              bar.classList.add('diagram-index');
              u.el('b', 'index-title', bar, 'Diagrams');
              const table = u.el('div', 'index-table', bar);
              const headings = u.el('div', 'index-row index-heading', table);
              for (const value of ['#', '', 'Name', 'Updated', 'Size']) u.el('span', '', headings, value);
              const records = [
                ['1', 'Garden Plan', 'Apr 12, 1996', '4 KB'],
                ['2', 'Trail Map', 'Apr 14, 1996', '3 KB'],
                ['3', 'Playground', 'Apr 16, 1996', '5 KB'],
                ['4', 'Picnic Area', 'Apr 18, 1996', '4 KB'],
              ];
              records.forEach((record, i) => {
                const row = u.el('div', 'index-row' + (i === 0 ? ' current' : ''), table);
                u.el('span', 'row-num', row, record[0]);
                u.el('span', 'file-icon', row, '');
                u.el('span', 'row-name', row, record[1]);
                u.el('span', 'row-date', row, record[2]);
                u.el('span', 'row-size', row, record[3]);
              });
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note, sprite });
          },
        'frame.13': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, display, note, u } = _c;
            if (display === 'hidden') note.hidden = true;
            else if (display === 'toast') {
              note.hidden = true;
              const toast = u.el('div', 'community-toast', content.querySelector('.act-bar'));
              u.el('span', '', toast, ctx.instruction);
              const x = u.el('button', 'note-close', toast, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => toast.remove();
            } else if (display === 'panel') note.hidden = false;
            if (C.layout === 'split-level') {
              const text = u.el(
                'p',
                'overview-copy',
                note,
                C.theme === 'vista'
                  ? 'Click at the start dot, then drag along the curved path to the arrowhead. Keep your pointer on the line and complete it in one continuous stroke. Do not lift the mouse button until you reach the arrowhead.'
                  : 'Drag within the color area or the hue slider to find the closest match.',
              );
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, display, shell, sprite, u } = _c;
            if (
              [
                'three',
                'windows',
                'offset',
                'sheet',
                'notebook',
                'rail',
                'palette',
                'ledger',
                'material-twin',
                'margin',
                'crop-dock',
              ].includes(C.layout)
            ) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
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
                else if (C.theme === 'community') {
                  u.el('p', '', _c.aside, 'Freehand Drawing (Click and drag to draw.)');
                  u.el('h3', '', _c.aside, 'Tips');
                  const list = u.el('ul', '', _c.aside);
                  for (const t of [
                    'Click and drag to draw a single continuous circle.',
                    'Try to make a smooth circle.',
                    'Release to finish the circle.',
                    'The hollow dot must be on the circle’s edge.',
                  ])
                    u.el('li', '', list, t);
                  u.el('h3', '', _c.aside, 'Community Corner');
                  for (const t of [
                    'Welcome, Neighbor!',
                    'Sign My Guestbook',
                    'View Recent Updates',
                    'Our Little Town',
                    'Helpful Links',
                  ]) {
                    const a = u.el('a', 'community-link', _c.aside, t);
                    a.href = '#';
                    a.onclick = (ev) => ev.preventDefault();
                  }
                } else if (C.disabled) {
                  const tools = u.el('div', 'actual-tools', _c.aside);
                  for (const text of ['Add point', 'Remove point', 'Clear all']) {
                    const bt = u.el('button', '', tools, text);
                    bt.onclick = () => {
                      if (text !== 'Add point') env.widgetDef.clear?.();
                    };
                  }
                  u.el('h3', '', _c.aside, 'Quick action');
                  const shortcut = u.el('button', 'disabled-shortcut', _c.aside, 'Auto-find center (disabled)');
                  shortcut.disabled = true;
                  u.el('p', '', _c.aside, 'This shortcut is not available for this exercise.');
                  u.el('h3', '', _c.aside, 'Status');
                  u.el('p', '', _c.aside, 'No points placed yet.');
                } else if (C.collapsed) {
                  for (const t of [
                    'Show labels: A, B, V',
                    'Point style: ●',
                    'Line style: ━',
                    'Grid: Show grid',
                    'Snap to grid: Enabled',
                  ]) {
                    const l = u.el('label', 'preference', _c.aside, t);
                    const check = u.el('input', '', l);
                    check.type = 'checkbox';
                    check.checked = t.startsWith('Show labels');
                  }
                } else if (C.theme === 'crop-minimal')
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
            if (C.theme === 'community' && _c.aside) {
              if (display === 'panel') {
                _c.aside.classList.add('has-task-panel');
                _c.aside.querySelector('h3').textContent = 'Today’s Activity';
              }
              const icons = [
                '<svg width="38" height="38" viewBox="0 0 20 20"><path d="M3 17L4 13L14 3L17 6L7 16Z" fill="#f2b84a" stroke="#6a4a1c"/><path d="M3 17L4 13L7 16Z" fill="#e8b0a0" stroke="#6a4a1c"/></svg>',
                '<svg width="34" height="34" viewBox="0 0 18 18"><circle cx="9" cy="7" r="5" fill="#f7e060" stroke="#7a6a1c"/><rect x="7" y="12" width="4" height="4" fill="#888"/></svg>',
                '<svg width="42" height="34" viewBox="0 0 22 18"><circle cx="6" cy="6" r="3" fill="#e8a070" stroke="#444"/><circle cx="16" cy="6" r="3" fill="#e8a070" stroke="#444"/><circle cx="11" cy="8" r="3.2" fill="#f0b890" stroke="#444"/><path d="M1 17Q6 9 11 11Q16 9 21 17Z" fill="#5a78c8" stroke="#334"/></svg>',
              ];
              const badges = [sprite(1297, 149, 42, 42), sprite(1298, 332, 32, 37), sprite(1295, 584, 46, 35)];
              const tips = _c.aside.querySelectorAll('li');
              tips[0].innerHTML = 'Click and drag to draw <br class="reference-break">a single continuous circle.';
              tips[3].innerHTML = 'The hollow dot must be on <br class="reference-break">the circle’s edge.';
              _c.aside.querySelectorAll('h3').forEach((h, i) => {
                if (badges[i]) {
                  h.style.display = 'flex';
                  h.style.alignItems = 'center';
                  h.style.gap = '10px';
                  h.insertAdjacentHTML('afterbegin', badges[i]);
                }
              });
              const fp = _c.aside.querySelector('p');
              if (fp) {
                fp.innerHTML =
                  '<span class="cur"><svg width="34" height="50" viewBox="0 0 17 25"><path d="M2 2V20L7 15L11 23L14 22L10 14H17Z" fill="#fff" stroke="#111" stroke-width="1.5"/></svg></span><span>' +
                  (display === 'panel' ? ctx.instruction : 'Freehand Drawing<br>(Click and drag<br>to draw.)') +
                  '</span>';
              }
              _c.aside.insertAdjacentHTML(
                'beforeend',
                '<svg class="flwr" width="52" height="80" viewBox="0 0 26 40"><path d="M13 20V38" stroke="#2f7a3a" stroke-width="3"/><path d="M13 30Q4 28 3 22Q10 22 13 30Z" fill="#4aa860"/><circle cx="13" cy="11" r="9" fill="#e870b0" stroke="#7a2050"/><circle cx="13" cy="11" r="3.5" fill="#f5d040"/></svg>',
              );
            }
            if (C.theme === 'community' && _c.aside) {
              _c.aside.querySelector('.cur').innerHTML = sprite(1325, 226, 48, 65);
              _c.aside.querySelector('.flwr').outerHTML = sprite(1295, 821, 60, 86, 'flwr');
            }
            const footer = u.el('footer', 'footer', C.theme === 'community' ? content : shell);
            Object.assign(_c, { footer });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, footer, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                labels =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
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
                      ],
                labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              let placement = 'activity',
                label = 'Save';
              if (!er.bool(0.5)) {
                placement = er.pick(['footer', 'footer-link']);
                label = labelOf(er.pick(labels));
              }
              const makeEnd = (parent, tag, cls, text) => {
                const b = u.el(tag, cls, parent, text);
                if (tag === 'button') b.type = 'button';
                else b.href = '#';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const cr = ctx.rng.fork('chrome/collide');
              let collide = null;
              if (cr.bool(0.3)) {
                const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (pool.length) collide = cr.pick(pool);
              }
              if (placement === 'activity') {
                const bar = content.querySelector('.act-bar');
                _c.submit = makeEnd(bar, 'button', 'community-end activity-end', label);
              } else if (placement === 'footer-link') {
                _c.submit = makeEnd(footer, 'a', 'community-endlink', label + ' ›');
              } else _c.submit = makeEnd(footer, 'button', 'submit', label);
              if (collide) {
                const decoy = u.el('button', 'community-xtra', footer, collide);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
              }
              if (C.collapsed) {
                const show = u.el(
                  'button',
                  'show-controls',
                  placement === 'activity' ? content.querySelector('.act-bar') : footer,
                  'Show controls',
                );
                show.type = 'button';
                show.onclick = () => {
                  show.classList.add('revealed');
                  show.textContent = 'Task controls';
                  _c.submit.style.visibility = 'visible';
                };
                _c.submit.style.visibility = 'hidden';
              }
            }
          },
      },
    },
  });
})();
