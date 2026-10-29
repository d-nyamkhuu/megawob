// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-content-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'os2-crop',
        'title': 'Image Studio',
        'menu': 'File     Edit     View     Image     Tools     Help',
        'tabs': ['Crop', 'Resize', 'Adjust', 'Effects', 'Print'],
        'aside': 'Cropping Help',
        'foot': '',
        'accent': '#00a6bd',
        'bg': '#c8c8c8',
        'surface': '#e4e4e4',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 1260) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'os2-crop'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            if (C.title) {
              const title = u.el('div', 'title', head);
              if (C.theme === 'os2-crop') {
                const app = u.svg(
                  'svg',
                  { class: 'app-mark', width: 34, height: 30, viewBox: '0 0 34 30', fill: 'none' },
                  title,
                );
                u.svg(
                  'rect',
                  { x: 1, y: 1, width: 32, height: 28, fill: '#ddd', stroke: '#111', 'stroke-width': 2 },
                  app,
                );
                u.svg(
                  'rect',
                  { x: 4, y: 4, width: 26, height: 21, fill: '#f8f8f8', stroke: '#333', 'stroke-width': 1 },
                  app,
                );
                u.svg(
                  'path',
                  { d: 'M5 23L12 14L17 19L22 11L29 23Z', fill: '#888', stroke: '#111', 'stroke-width': 1.2 },
                  app,
                );
                u.svg('circle', { cx: 23, cy: 9, r: 2.5, fill: '#fff', stroke: '#111', 'stroke-width': 1 }, app);
                u.el('span', 'title-text', title, C.title);
              } else title.textContent = C.title;
            }
          },
        'frame.9': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            const band = u.el('div', 'record-band', note),
              fileIcon = u.el('div', 'file-icon', band);
            if (C.theme === 'os2-crop') {
              const pic = u.svg('svg', { width: 76, height: 76, viewBox: '0 0 76 76', fill: 'none' }, fileIcon);
              u.svg(
                'rect',
                { x: 3, y: 3, width: 70, height: 70, fill: '#f4f4f4', stroke: '#111', 'stroke-width': 4 },
                pic,
              );
              u.svg(
                'rect',
                { x: 9, y: 9, width: 58, height: 58, fill: '#ddd', stroke: '#111', 'stroke-width': 2 },
                pic,
              );
              u.svg(
                'path',
                { d: 'M11 57L27 37L38 49L49 31L65 57Z', fill: '#888', stroke: '#111', 'stroke-width': 2 },
                pic,
              );
              u.svg('circle', { cx: 53, cy: 22, r: 6, fill: '#fff', stroke: '#111', 'stroke-width': 2 }, pic);
              u.svg('path', { d: 'M11 58H65', stroke: '#111', 'stroke-width': 2 }, pic);
            }
            const file = u.el('div', 'file-meta', band);
            u.el('div', '', file, 'Image:   signs.png');
            u.el('div', '', file, 'Dimensions:   640 × 480 pixels');
            u.el('div', '', file, 'Type:   PNG Image');
            u.el('div', '', file, 'Size:   182 KB');
            u.el('div', 'selection-meta', band, 'Selection:   208 × 208 pixels\nPosition:   48, 72');
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
            Object.assign(_c, { band, file, fileIcon });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { instruction, note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') {
              note.classList.add('no-header-instruction');
              instruction.hidden = true;
            } else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, instruction, u } = _c;
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
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
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
            if (C.theme === 'os2-crop' && _c.aside) {
              const help = u.el('div', 'help-content', _c.aside);
              u.el('h3', '', help, 'Cropping Help');
              const drawings = [
                (s) => {
                  u.svg(
                    'rect',
                    { x: 6, y: 7, width: 28, height: 27, fill: '#eee', stroke: '#111', 'stroke-width': 2 },
                    s,
                  );
                  for (const [x, y] of [
                    [6, 7],
                    [34, 7],
                    [6, 34],
                    [34, 34],
                  ])
                    u.svg(
                      'rect',
                      {
                        x: x - 2.5,
                        y: y - 2.5,
                        width: 5,
                        height: 5,
                        fill: '#fff',
                        stroke: '#111',
                        'stroke-width': 1.5,
                      },
                      s,
                    );
                  u.svg(
                    'path',
                    {
                      d: 'M10 10H30V30H10Z',
                      fill: 'none',
                      stroke: '#111',
                      'stroke-width': 1,
                      'stroke-dasharray': '2 2',
                    },
                    s,
                  );
                },
                (s) => {
                  u.svg(
                    'path',
                    {
                      d: 'M20 3V37M3 20H37M20 3L16 8M20 3L24 8M20 37L16 32M20 37L24 32M3 20L8 16M3 20L8 24M37 20L32 16M37 20L32 24',
                      stroke: '#111',
                      'stroke-width': 3,
                      fill: 'none',
                    },
                    s,
                  );
                },
                (s) => {
                  u.svg(
                    'rect',
                    { x: 9, y: 9, width: 22, height: 22, fill: '#fff', stroke: '#111', 'stroke-width': 3 },
                    s,
                  );
                  u.svg('path', { d: 'M12 12H28V28H12Z', fill: 'none', stroke: '#ddd', 'stroke-width': 1 }, s);
                },
                (s) => {
                  u.svg(
                    'rect',
                    { x: 4, y: 4, width: 32, height: 32, fill: '#fff', stroke: '#111', 'stroke-width': 2 },
                    s,
                  );
                  u.svg(
                    'rect',
                    { x: 8, y: 8, width: 24, height: 24, fill: '#ddd', stroke: '#111', 'stroke-width': 1 },
                    s,
                  );
                  u.svg(
                    'path',
                    { d: 'M9 28L16 19L21 24L26 17L31 28Z', fill: '#aaa', stroke: '#111', 'stroke-width': 1 },
                    s,
                  );
                  u.svg('circle', { cx: 26, cy: 13, r: 3, fill: '#fff', stroke: '#111', 'stroke-width': 1 }, s);
                },
              ];
              const texts = [
                'Drag the handles to resize the crop box. Drag inside the box to move it.',
                'Use the arrow keys to move the selection by small amounts.',
                'Hold Shift while dragging a corner handle to keep the same proportions.',
                'The area inside the box will be kept when you apply the crop.',
              ];
              for (let i = 0; i < drawings.length; i++) {
                const row = u.el('div', 'help-row', help);
                const icon = u.el('span', 'help-icon', row);
                const svg = u.svg(
                  'svg',
                  { width: 44, height: 44, viewBox: '0 0 40 40', fill: 'none', class: 'etched-icon' },
                  icon,
                );
                drawings[i](svg);
                u.el('p', '', row, texts[i]);
              }
            }
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              // Reuse the kit instruction element; never copy goal text into help.
              instruction.hidden = false;
              instruction.classList.add('completion-note', 'panel-instruction');
              const panel = _c.aside.querySelector('.help-content') || _c.aside;
              panel.insertBefore(instruction, panel.querySelector('.help-row'));
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'aside';
                _c.label = 'Submit';
              } else {
                _c.placement = endRng.pick(['footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                _c.label = endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'aside' && _c.aside) _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
