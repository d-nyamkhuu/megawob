// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-palette-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'ribbon8',
        'title': 'Paint Studio',
        'subtitle': 'Palette navigation',
        'foot': 'Actions',
        'accent': '#1677f8',
        'bg': '#f5f6f8',
        'surface': '#fff',
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
            const sub = u.el('div', 'subtitle', head);
            u.el('p', '', sub, '');
            const wc = u.el('div', 'win-ctl', head);
            ['_', '□', '✕'].forEach((t, i) => u.el('span', i === 2 ? 'wc-close' : '', wc, t));
            const menu = u.el('nav', 'rb-menu', head);
            ['File', 'Edit', 'View', 'Image', 'Colors', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
            const tb = u.el('div', 'rb-toolbar', head);
            const I = {
              New: ['M8 3H20L25 8V29H8Z', '#fff', '#7a8798'],
              Open: ['M3 9H13L15 12H28V27H3Z', '#f4b942', '#b9831c'],
              Undo: ['M6 14H20Q27 14 27 21Q27 27 20 27H12M6 14L12 8M6 14L12 20', 'none', '#2f7bd6'],
              Redo: ['M27 14H13Q6 14 6 21Q6 27 13 27H21M27 14L21 8M27 14L21 20', 'none', '#a7b2c2'],
              Brush: ['M26 4L12 20L10 25L15 22L28 7Z', '#d98a4e', '#8a4e22'],
              Fill: ['M16 4L28 16L17 28L5 16Z', '#8cc3f0', '#3b78b0'],
              Text: ['M5 27L16 5L27 27M9 20H23', 'none', '#2f6fd0'],
              Shapes: ['M3 5H17V17H3ZM18 14A7 7 0 1 0 18.1 14Z', '#5aa2ea', '#2a68ac'],
              'Zoom In': ['M13 5A8 8 0 1 0 13.1 5ZM19 19L28 28M9 13H17M13 9V17', 'none', '#2f7bd6'],
              'Zoom Out': ['M13 5A8 8 0 1 0 13.1 5ZM19 19L28 28M9 13H17', 'none', '#2f7bd6'],
              '100%': ['M5 5H27V27H5Z', '#e8f3ff', '#2f7bd6'],
            };
            const groups = [['New', 'Open'], ['Undo', 'Redo'], ['Brush', 'Fill'], ['Text', 'Shapes'], ['Zoom In', 'Zoom Out', '100%']];
            groups.forEach((g, gi) => {
              if (gi) u.el('span', 'rb-sep', tb);
              g.forEach((name) => {
                const b = u.el('span', 'rb-tool' + (name === 'Redo' ? ' dim' : ''), tb);
                const svg = u.svg('svg', { viewBox: '0 0 32 32', width: 32, height: 32 }, b);
                const d = I[name];
                u.svg('path', { d: d[0], fill: d[1], stroke: d[2], 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
                u.el('em', '', b, name);
              });
            });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            if (C.theme === 'ribbon8') {
              content.append(note);
            } else if (C.theme === 'organizer') {
              u.el('div', 'choose-title', stage, 'Choose a Color');
            }
            _c.aside = null;
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
              u.el('h2', 'guide-title', note, 'Website Redesign');
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
              const bar = placement === 'toolbar' ? _c.head.querySelector('.rb-toolbar') : null;
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
            if (['aqua', 'collage', 'forum', 'ribbon8'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
            }
          },
      },
    },
  });
})();
