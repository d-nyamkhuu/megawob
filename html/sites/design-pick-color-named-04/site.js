// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-named-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'forum',
        'title': 'Color Picker',
        'subtitle': 'Color Tools  \u203a  Picker Challenge',
        'foot': 'Actions',
        'menu': 'File     Edit     View     Tools     Help',
        'ribbon': true,
        'accent': '#3584e4',
        'bg': '#f1f2f4',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (_base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.classList.add('instruction-mode-' + ctx.display);
          },
        'frame.10': (_base, S) =>
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
            u.el('nav', 'forum-nav', head, 'Home　|　Forums　|　Tools　|　Help');
          },
        'frame.12': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
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
                C.theme === 'forum'
                  ? ['Picker']
                  : C.theme === 'eink'
                    ? ['Tools', 'View', 'Style', 'Help']
                    : C.theme === 'office'
                      ? ['Navigate', 'Draw', 'Edit', 'Options']
                      : ['Navigation', 'Draw', 'Options', 'Support'];
              for (const [j, name] of groups.entries()) {
                const gr = u.el('div', 'tool-group', rib);
                if (j === 0) {
                  const names =
                    C.theme === 'forum'
                      ? ['Pick Color', 'Show Values', 'Zoom In', 'Zoom Out', 'Reset']
                      : ['Select', 'Pan', 'Zoom In', 'Zoom Out', C.theme === 'office' ? 'Fit to Window' : 'Reset View'];
                  for (const t of names) {
                    const path =
                      t === 'Select'
                        ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                        : t === 'Pan'
                          ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z'
                          : t === 'Reset View' || t === 'Reset'
                            ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                            : t === 'Show Values'
                              ? 'M16 3C9 3 4 8 4 16s5 13 12 13 12-5 12-13S23 3 16 3ZM9 12h2m10 0h2M12 22h8'
                              : t === 'Pick Color'
                                ? 'M7 24L23 8M5 27l5-1 2-2-4-4-2 2zM21 6l5-4 4 4-4 5z'
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
          },
        'frame.15': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'forum') {
              const nav = u.el('nav', 'picker-rail-nav', note);
              nav.setAttribute('aria-label', 'Color Picker sections');
              const entries = [
                [
                  'Color Picker',
                  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6M6 17a3 3 0 1 1 5-2 5 5 0 0 0-1 4 8 8 0 0 1-4-2M15 19a3 3 0 1 1 1-5 5 5 0 0 0 3-2 8 8 0 0 1-4 7',
                ],
                [
                  'Color Information',
                  'M12 2 14 4 17 4 18 7 21 9 20 12 21 15 18 17 17 20 14 20 12 22 10 20 7 20 6 17 3 15 4 12 3 9 6 7 7 4 10 4ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
                ],
                ['Tips & Help', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18v.1'],
              ];
              entries.forEach(([label, path], i) => {
                const row = u.el('div', 'picker-rail-item' + (i === 0 ? ' active' : ''), nav);
                const icon = u.svg(
                  'svg',
                  {
                    viewBox: '0 0 24 24',
                    width: 24,
                    height: 24,
                    fill: i === 2 ? 'none' : 'currentColor',
                    stroke: 'currentColor',
                    'stroke-width': i === 2 ? 2 : 0,
                  },
                  row,
                );
                u.svg('path', { d: path }, icon);
                u.el('span', '', row, label);
              });
              const target = u.el('section', 'picker-rail-target', note);
              u.el('h3', '', target, 'Target Color');
              u.el('div', 'picker-target-slot', target);
              const tips = u.el('section', 'picker-rail-tips', note);
              const th = u.el('h3', '', tips);
              const bulb = u.svg(
                'svg',
                {
                  viewBox: '0 0 24 24',
                  width: 24,
                  height: 24,
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.8,
                },
                th,
              );
              u.svg(
                'path',
                { d: 'M9 18h6m-5 3h4m-2-21a7 7 0 0 0-4 13c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 0 0-4-13Z' },
                bulb,
              );
              u.el('span', '', th, 'Tips');
              for (const txt of [
                'Drag in the color square to choose saturation and brightness.',
                'Use the hue strip to change the base color.',
                'The selected color is shown below with its hex code.',
                'Try to match the target color as closely as possible.',
              ])
                u.el('p', 'picker-tip', tips, txt);
            }
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frame.21': (_base, S) =>
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
          },
        'frame.22': () => () => {},
        'frame.24': (_base, S) =>
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
        'frame.26': (_base, S) =>
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
        'frame.29': (_base, S) =>
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
