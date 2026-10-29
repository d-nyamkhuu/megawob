// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-image-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'forum',
        'title': 'Color Studio',
        'subtitle': '',
        'foot': '',
        'accent': '#6750A4',
        'bg': '#E9EDF3',
        'surface': '#FFFFFF',
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
              u.el('strong', '', sub, 'Color Studio');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, instruction, note, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
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
              } else if (C.layout === 'three') {
                u.el('h2', 'aside-title', _c.aside, 'Color reference');
                u.el('h3', '', _c.aside, 'Tips');
                const tips = [
                  ['Drag inside the square to adjust saturation and brightness.', '1'],
                  ['Use the hue strip to choose a different color family.', '2'],
                  ['You can also click the eyedropper and pick a color from the image.', '3'],
                ];
                for (const [txt, n] of tips) {
                  const row = u.el('div', 'tip-row', _c.aside);
                  u.el('span', 'tip-number', row, n);
                  u.el('p', '', row, txt);
                }
                u.el('hr', '', _c.aside);
                u.el('h3', '', _c.aside, 'Color values');
                u.el('div', 'aside-values', _c.aside, 'Hex　　 —\nRGB　　 —\nHSL　　 —');
                u.el('hr', '', _c.aside);
                u.el('h3', '', _c.aside, 'Presets');
                const dots = u.el('div', 'aside-dots', _c.aside);
                for (const color of [
                  '#F44336',
                  '#FB8C00',
                  '#FDD835',
                  '#66BB6A',
                  '#26C6DA',
                  '#448AFF',
                  '#AB47BC',
                  '#5E35B1',
                  '#D7CCC8',
                  '#9E9EAA',
                  '#202124',
                ]) {
                  const dot = u.el('i', '', dots);
                  dot.style.background = color;
                }
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
            if (ctx.display === 'header') {
              head.classList.add('has-task');
              instruction.classList.add('thread-instruction');
              head.append(instruction);
              note.hidden = true;
            } else if (ctx.display === 'panel') {
              note.querySelector('.note-label').textContent = 'Your task';
              if (_c.aside) _c.aside.prepend(note);
            }
            const close = note.querySelector('.note-close');
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            Object.assign(_c, { close });
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const dock = u.el('nav', 'dock', footer);
            for (const [i, x] of [
              ['⌂', 'Home'],
              ['☷', 'Palette'],
              ['⚒', 'Tools'],
              ['◉', 'Explore'],
            ].entries()) {
              const b = u.el('button', 'dock-item' + (!i ? ' active' : ''), dock);
              b.type = 'button';
              u.el('span', 'dock-icon', b, x[0]);
              u.el('span', '', b, x[1]);
            }
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = original ? 'OK' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'toolbar' ? head : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
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
            Object.assign(_c, { collideR, dock, endLabel, endLabels, endR, labelOf, original, placement });
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
