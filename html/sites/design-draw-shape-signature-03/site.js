// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-signature-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        layout: 'three',
        theme: 'classic',
        title: 'Acme Document Center',
        subtitle: '',
        menu: '    File     Edit     View     Document     Window     Help',
        tabs: ['Documents', 'Review', 'Sign', 'History'],
        accent: '#3478d4',
        bg: '#8ea5c8',
        surface: '#fff',
        font: 'Georgia, "Times New Roman", serif',
        aside: '',
        foot: '',
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
              'design ' + C.theme + ' layout-' + C.layout + (display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { body, display, u });
          },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head);
              const mark = u.svg(
                'svg',
                { class: 'apple-mark', width: 22, height: 24, viewBox: '0 0 22 24', 'aria-hidden': 'true' },
                menu,
              );
              u.svg(
                'path',
                {
                  d: 'M11.4 6.3C9.8 4.5 10.3 2.3 12.4 1.2c.3 2-0.4 3.8-1 5.1Zm-1.1 1.1c-1.8-1.2-4.9-.6-6 1.3-2.1 3.4.2 10.5 3.1 12.5 1.1.8 2.1.3 3.2-.1.8-.3 1.5-.3 2.3 0 1.3.5 2.3.9 3.4-.1 1.1-1 2-2.8 2.5-4.5-2.4-.9-3.1-4.1-.7-5.7-1.4-2.5-4.5-3.3-6.6-2-.5.3-.9.3-1.2.1Z',
                  fill: '#3974c2',
                  stroke: '#123f83',
                  'stroke-width': '.8',
                },
                mark,
              );
              u.svg(
                'path',
                {
                  d: 'M11.5 5.9c.1-2.1 1.2-3.6 3.3-4.1-.1 2-1.2 3.5-3.3 4.1Z',
                  fill: '#459844',
                  stroke: '#245e2e',
                  'stroke-width': '.6',
                },
                mark,
              );
              for (const label of ['File', 'Edit', 'View', 'Document', 'Window', 'Help'])
                u.el('span', 'menu-item', menu, label);
            }
            const sprite = (x, y, w, h, cls = '') =>
              `<svg class="pixel-sprite ${cls}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><image href="sites/design-draw-shape-signature-03/assets/reference.webp" width="1672" height="941"/></svg>`;
            if (C.theme === 'community')
              shell.insertAdjacentHTML(
                'afterbegin',
                '<svg class="paper-texture" width="100%" height="100%" aria-hidden="true"><defs><pattern id="community-paper" width="128" height="128" patternUnits="userSpaceOnUse"><svg width="128" height="128" viewBox="260 0 128 128"><image href="sites/design-draw-shape-signature-03/assets/reference.webp" width="1672" height="941"/></svg></pattern></defs><rect width="100%" height="100%" fill="url(#community-paper)"/></svg>',
              );
            if (C.theme === 'community') {
              const t = head.querySelector('.title'),
                s = head.querySelector('.subtitle');
              const left = u.el('div', 'h-left', head),
                mid = u.el('div', 'h-mid', head),
                right = u.el('div', 'h-right', head);
              left.innerHTML =
                '<svg width="76" height="82" viewBox="0 0 38 41"><path d="M2 20L19 4L36 20Z" fill="#c9566b" stroke="#6a2c3c"/><rect x="6" y="20" width="26" height="17" fill="#f1e7b8" stroke="#6a5a3c"/><rect x="10" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="22" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="16" y="29" width="6" height="8" fill="#7a5a3c"/><path d="M2 38H36" stroke="#4a9a4a" stroke-width="3"/></svg>';
              left.innerHTML = sprite(35, 27, 78, 83, 'house');
              const nav = u.el('nav', 'h-nav', left);
              for (const x of ['Home', 'My Page', 'Friends', 'Guestbook']) {
                const a = u.el('a', '', nav, x);
                a.href = '#';
                a.onclick = (e) => e.preventDefault();
              }
              const leaf =
                '<svg class="leaf" width="56" height="68" viewBox="0 0 28 34"><path d="M14 2L19 9L25 8L22 15L26 20L18 21L14 26L10 21L2 20L6 15L3 8L9 9Z" fill="#2f9a6a" stroke="#1a5a40"/><path d="M14 10V32" stroke="#1a5a40" stroke-width="2"/></svg>';
              const row = u.el('div', 'h-row', mid);
              row.innerHTML = sprite(506, 18, 58, 70, 'leaf');
              const tw = u.el('div', 'h-tw', row);
              row.insertAdjacentHTML('beforeend', sprite(1105, 18, 58, 70, 'leaf'));
              tw.append(t, s);
              right.innerHTML =
                '<svg width="76" height="84" viewBox="0 0 38 42"><path d="M6 40V18L9 6L14 14H24L29 6L32 18V40Z" fill="#8c93a6" stroke="#444a5c"/><circle cx="14" cy="22" r="1.6" fill="#222"/><circle cx="24" cy="22" r="1.6" fill="#222"/></svg><div class="h-wish">Good<br>People<br>Brighter<br>Days</div><svg width="34" height="44" viewBox="0 0 17 22"><circle cx="8.5" cy="7" r="5.5" fill="#d83a55" stroke="#7a1830"/><path d="M8.5 12V22" stroke="#2f7a3a" stroke-width="2"/></svg>';
            }
            Object.assign(_c, { sprite });
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, sprite, u } = _c;
            if (C.theme === 'community') {
              head.querySelector('.h-right').innerHTML =
                sprite(1324, 40, 75, 83, 'cat') +
                '<div class="h-wish">Good<br>People<br>Brighter<br>Days</div>' +
                sprite(1556, 64, 39, 49, 'rose');
            }
            const content = u.el('div', 'content', shell);
            if (C.theme === 'community') {
              const bar = u.el('div', 'act-bar', content);
              bar.insertAdjacentHTML('beforeend', sprite(29, 149, 35, 41, 'act-flower'));
              u.el('b', '', bar, "Today's Activity");
              u.el('span', 'act-date', bar, 'Tue, Apr 16, 1996');
            } else {
              const bar = u.el('div', 'act-bar', content);
              u.el('span', '', bar, 'Document 1 of 4');
              u.el('span', 'act-date', bar, 'Total: 4');
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
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
            } else if (display === 'panel') note.hidden = true;
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
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, display, shell, sprite, stage, u } = _c;
            const scroll = u.el('div', 'doc-scroll', stage);
            scroll.setAttribute('aria-hidden', 'true');
            u.el('span', 'scroll-arrow', scroll, '▲');
            u.el('span', 'scroll-thumb', scroll, '');
            u.el('span', 'scroll-arrow', scroll, '▼');
            u.el('span', 'scroll-arrow', scroll, '▼');
            _c.aside = null;
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
            Object.assign(_c, { footer, scroll });
          },
        'frame.22': () => () => {},
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
              let placement = 'footer',
                label = 'Submit';
              if (!er.bool(0.5)) {
                placement = er.pick(['activity', 'footer-link']);
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
