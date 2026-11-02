// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-position-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'gem',
        'title': 'Image Editor',
        'menu': 'File　 Edit　 View　 Image　 Options　 Help',
        'ribbon': true,
        'aside': 'Preview',
        'foot': '',
        'accent': '#111',
        'bg': '#c5c5c5',
        'surface': '#f7f7f7',
        'font': "'Courier New', monospace",
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
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'gem'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.12': (base, S) =>
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
              if (C.theme === 'gem') {
                rib.classList.add('gem-ribbon');
                const gemIcon = (group, label, draw) => {
                  const bt = u.el('button', 'tool gem-action', group);
                  bt.type = 'button';
                  bt.title = label;
                  bt.setAttribute('aria-label', label);
                  const svg = u.svg(
                    'svg',
                    {
                      width: 36,
                      height: 36,
                      viewBox: '0 0 36 36',
                      fill: 'none',
                      stroke: 'currentColor',
                      'stroke-width': 2,
                      'stroke-linecap': 'square',
                      'stroke-linejoin': 'miter',
                    },
                    bt,
                  );
                  draw(svg);
                  bt.onclick = () => {
                    rib.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                    bt.classList.add('selected');
                  };
                  return bt;
                };
                const rect = (s, x, y, w, h) => u.svg('rect', { x, y, width: w, height: h }, s),
                  path = (s, d) => u.svg('path', { d }, s),
                  line = (s, x1, y1, x2, y2) => u.svg('path', { d: `M${x1} ${y1}L${x2} ${y2}` }, s);
                let gr = u.el('div', 'tool-group gem-group', rib);
                gemIcon(gr, 'New image', (s) => {
                  rect(s, 8, 4, 20, 28);
                  line(s, 13, 11, 23, 11);
                  line(s, 13, 17, 23, 17);
                  line(s, 13, 23, 20, 23);
                });
                gemIcon(gr, 'Open image', (s) => {
                  path(s, 'M4 11H14L18 15H32V29H4Z');
                  path(s, 'M3 11L6 6H16L20 10');
                });
                gemIcon(gr, 'Print', (s) => {
                  rect(s, 10, 4, 16, 9);
                  rect(s, 7, 14, 22, 12);
                  rect(s, 10, 22, 16, 10);
                  line(s, 12, 8, 24, 8);
                  line(s, 12, 26, 24, 26);
                });
                gr = u.el('div', 'tool-group gem-group', rib);
                gemIcon(gr, 'Select area', (s) => {
                  path(s, 'M7 12V6H13 M23 6H29V12 M29 24V30H23 M13 30H7V24');
                });
                gemIcon(gr, 'Crop', (s) => {
                  path(s, 'M11 4V25H32 M4 11H25V32');
                });
                gemIcon(gr, 'Zoom in', (s) => {
                  u.svg('circle', { cx: 15, cy: 15, r: 10 }, s);
                  line(s, 22, 22, 31, 31);
                  line(s, 15, 10, 15, 20);
                  line(s, 10, 15, 20, 15);
                });
                gemIcon(gr, 'Zoom out', (s) => {
                  u.svg('circle', { cx: 15, cy: 15, r: 10 }, s);
                  line(s, 22, 22, 31, 31);
                  line(s, 10, 15, 20, 15);
                });
                gr = u.el('div', 'tool-group gem-group', rib);
                gemIcon(gr, 'Undo', (s) => {
                  path(s, 'M14 9L6 16L14 23');
                  path(s, 'M7 16H19Q28 16 28 25');
                });
                gemIcon(gr, 'Redo', (s) => {
                  path(s, 'M22 9L30 16L22 23');
                  path(s, 'M29 16H17Q8 16 8 25');
                });
              } else {
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
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, instruction, u } = _c;
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
                } else if (C.layout === 'windows')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
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
            if (_c.aside && C.theme === 'gem') {
              const preview = u.el('div', 'gem-preview', _c.aside);
              u.el('div', 'gem-preview-image', preview);
              u.el('h3', 'gem-tools-title', _c.aside, 'Crop Tools');
              for (const [icon, label] of [
                ['▧', 'New Selection'],
                ['✥', 'Move Selection'],
                ['□', 'Resize Handles'],
              ]) {
                const row = u.el('div', 'gem-tool-row', _c.aside);
                u.el('span', 'gem-tool-icon', row, icon);
                u.el('span', '', row, label);
              }
              u.el('div', 'gem-tips-title', _c.aside, 'Tips');
              u.el(
                'p',
                'gem-tips',
                _c.aside,
                'Drag the handles to resize the crop box.\nDrag inside the box to move it.\nYou can also create a new selection by dragging on the image.',
              );
            }
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              // Reuse the frame's sole instruction element; never copy goal text.
              instruction.classList.add('completion-note', 'panel-instruction');
              _c.aside.append(instruction);
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
