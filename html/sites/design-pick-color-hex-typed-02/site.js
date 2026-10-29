// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-typed-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'forum',
        'title': 'Color Picker',
        'subtitle': 'Color Tools  \u203a  Picker Challenge',
        'foot': '',
        'accent': '#2786d5',
        'bg': '#c9edff',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.classList.add('instruction-mode-' + ctx.display);
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.subtitle) {
              const sub = u.el('div', 'subtitle', head);
              const icon = u.svg('svg', { class: 'forum-message', viewBox: '0 0 40 40', width: 40, height: 40 }, sub);
              u.svg(
                'path',
                {
                  d: 'M5 4H34Q37 4 37 7V29Q37 32 34 32H15L7 38V32H5Q2 32 2 29V7Q2 4 5 4Z',
                  fill: '#7ca5cd',
                  stroke: '#46688e',
                  'stroke-width': 1.8,
                },
                icon,
              );
              u.svg('path', { d: 'M9 14H31M9 20H31', stroke: '#dceafa', 'stroke-width': 2 }, icon);
              u.el('strong', '', sub, 'Color Picker Challenge');
              u.el(
                'p',
                '',
                sub,
                'Adjust the color picker to match the target color. Use the controls below.',
              );
            }
            const dock = u.el('nav', 'forum-nav', head);
            for (const [name, path] of [
              ['Home', 'M3 14L16 3L29 14V28H19V19H13V28H3Z'],
              ['Colors', 'M16 3A13 13 0 1 0 16 29A13 13 0 1 0 16 3'],
              ['Images', 'M3 5H29V27H3ZM5 23L12 15L17 20L22 12L29 22'],
              ['Documents', 'M7 2H21L28 9V29H7ZM21 2V9H28M11 15H24M11 20H24M11 25H21'],
              [
                'Settings',
                'M16 3V7M16 25V29M3 16H7M25 16H29M7 7L10 10M22 22L25 25M25 7L22 10M10 22L7 25M16 9A7 7 0 1 0 16 23A7 7 0 1 0 16 9',
              ],
            ]) {
              const item = u.el('div', 'dock-item' + (name === 'Colors' ? ' active' : ''), dock);
              const svg = u.svg('svg', { viewBox: '0 0 32 32', 'aria-hidden': 'true' }, item);
              u.svg('path', { d: path }, svg);
              if (name === 'Home') {
                u.svg(
                  'rect',
                  {
                    x: 7,
                    y: 15,
                    width: 18,
                    height: 13,
                    rx: 1.5,
                    fill: '#f8fdff',
                    stroke: '#527da9',
                    'stroke-width': 1.2,
                  },
                  svg,
                );
                u.svg(
                  'path',
                  {
                    d: 'M3 14L16 3L29 14',
                    fill: 'none',
                    stroke: '#fff',
                    'stroke-width': 2.2,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  svg,
                );
                u.svg(
                  'rect',
                  { x: 14, y: 20, width: 5, height: 8, rx: 1, fill: '#9fc8e8', stroke: '#527da9', 'stroke-width': 0.8 },
                  svg,
                );
                u.svg(
                  'rect',
                  { x: 8.5, y: 17, width: 4, height: 4, fill: '#bcecff', stroke: '#6d93b9', 'stroke-width': 0.6 },
                  svg,
                );
              } else if (name === 'Colors') {
                u.svg('circle', { cx: 16, cy: 16, r: 5, fill: '#f4faff', stroke: '#547aa2', 'stroke-width': 0.8 }, svg);
                for (const [cx, cy, fill] of [
                  [16, 7, '#35c9e8'],
                  [24, 11, '#ffce32'],
                  [22, 21, '#f04d71'],
                  [12, 24, '#8a4be8'],
                  [7, 14, '#35b87b'],
                ])
                  u.svg('circle', { cx, cy, r: 4.3, fill, stroke: '#fff', 'stroke-width': 0.65 }, svg);
                u.svg(
                  'ellipse',
                  { cx: 13, cy: 10, rx: 8, ry: 2.2, transform: 'rotate(-35 13 10)', fill: '#ffffff88' },
                  svg,
                );
              } else if (name === 'Images') {
                u.svg(
                  'rect',
                  { x: 5, y: 7, width: 22, height: 17, rx: 1.7, fill: '#e8f8ff', stroke: '#fff', 'stroke-width': 1.5 },
                  svg,
                );
                u.svg('circle', { cx: 22, cy: 12, r: 2.4, fill: '#ffdc55', stroke: '#fff', 'stroke-width': 0.6 }, svg);
                u.svg(
                  'path',
                  { d: 'M6 22L13 14L18 19L21 16L27 23V24H6Z', fill: '#59b857', stroke: '#317e84', 'stroke-width': 0.8 },
                  svg,
                );
                u.svg('path', { d: 'M7 8H24', stroke: '#fff', 'stroke-width': 1.5, opacity: 0.8 }, svg);
              } else if (name === 'Documents') {
                u.svg(
                  'path',
                  {
                    d: 'M9 12H22M9 16H23M9 20H22M9 24H19',
                    stroke: '#7191b1',
                    'stroke-width': 1.15,
                    'stroke-linecap': 'round',
                  },
                  svg,
                );
                u.svg('path', { d: 'M21 3V9H27', fill: 'none', stroke: '#7191b1', 'stroke-width': 1.2 }, svg);
                u.svg('path', { d: 'M9 5H20L26 11V28H9Z', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, svg);
              } else {
                u.svg(
                  'circle',
                  { cx: 16, cy: 16, r: 6.5, fill: '#c8d9e8', stroke: '#526f91', 'stroke-width': 1.6 },
                  svg,
                );
                u.svg('circle', { cx: 16, cy: 16, r: 2.5, fill: '#eefaff', stroke: '#6683a1', 'stroke-width': 1 }, svg);
                u.svg(
                  'path',
                  {
                    d: 'M15 4H17L18 8L14 8ZM15 24H17L18 28L14 28ZM4 15V17L8 18V14ZM24 15V17L28 18V14Z',
                    fill: '#8ba8c1',
                    stroke: '#526f91',
                    'stroke-width': 0.7,
                  },
                  svg,
                );
              }
              u.el('span', '', item, name);
            }
            Object.assign(_c, { dock });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            if (C.theme === 'forum') {
              content.append(note);
              u.el('div', 'picker-title', content, 'Color Picker');
              u.el(
                'p',
                'picker-help',
                note,
                'Use the color area and hue slider to adjust the current color. The numbers update automatically.',
              );
            } else if (C.theme === 'organizer') {
              u.el('div', 'choose-title', stage, 'Choose a Color');
            }
            _c.aside = null;
            const colorList = u.el('aside', 'color-list', content);
            u.el('h2', '', colorList, 'Colors');
            const search = u.el('div', 'color-search', colorList, '⌕　Search colors...');
            const rows = [
              ['Ocean Blue', '#1E70FA'],
              ['Sky', '#87CEEB'],
              ['Leaf Green', '#32CD32'],
              ['Sunflower', '#FFD447'],
              ['Coral', '#FF7F50'],
              ['Slate', '#708090'],
              ['Plum', '#8A2BE2'],
              ['Turquoise', '#40E0D0'],
              ['Goldenrod', '#DAA520'],
              ['Tomato', '#FF6347'],
              ['Sea Green', '#2E8B57'],
              ['Steel Blue', '#4682B4'],
            ];
            for (const [name, hex] of rows) {
              const row = u.el('div', 'color-row', colorList);
              const sw = u.el('i', '', row);
              sw.style.background = hex;
              u.el('span', '', row, name);
              u.el('code', '', row, hex);
            }
            Object.assign(_c, { colorList, rows, search });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { ctx, head, instruction, note, shell, u } = _c;
            if (ctx.display === 'header') {
              const intro = head.querySelector('.subtitle p');
              intro.replaceWith(instruction);
              instruction.classList.add('thread-instruction');
              note.classList.add('picker-guide');
              u.el('h2', 'guide-title', note, 'Match the target color');
              note.prepend(note.lastChild);
            } else if (ctx.display === 'panel') {
              note.querySelector('.note-label').textContent = 'Your task';
            }
            const close = note.querySelector('.note-close');
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            const footer = u.el('footer', 'footer', shell);
            Object.assign(_c, { close, footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { content, ctx, footer, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = original ? 'Submit' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const bar = placement === 'toolbar' ? content.querySelector('.picker-title') : null;
              const toolbar = !!bar && bar.getClientRects().length > 0; // themes without a shown title bar: the footer
              const parent = toolbar ? bar : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (toolbar ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (collideR.bool(0.3)) {
              const labels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (labels.length) {
                const label = collideR.pick(labels),
                  decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideR, endLabel, endLabels, endR, labelOf, original, placement });
          },
        'frame.27': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            if (['aqua', 'collage', 'forum'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
            }
          },
      },
    },
  });
})();
