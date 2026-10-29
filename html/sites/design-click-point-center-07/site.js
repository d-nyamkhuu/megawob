// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-center-07',
    styles: ['site.css', 'mint.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'mint',
        'title': '',
        'foot': '',
        'accent': '#5fc89b',
        'bg': '#ffffff',
        'surface': '#ffffff',
        'font': "'Helvetica Neue', Helvetica, Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
                path =
                  {
                    'Add Point': 'M4 2V28L12 20L18 30L23 27L17 18H29Z',
                    'Erase': 'M5 20L21 3L30 12L14 29H8ZM5 20L14 29M15 10L24 19',
                    'Undo': 'M13 5L3 14L13 22V16H21Q28 16 29 28Q32 9 21 9H13Z',
                    'Redo': 'M19 5L29 14L19 22V16H11Q4 16 3 28Q0 9 11 9H19Z',
                    'Settings':
                      'M13 2H19L20 7L24 9L29 7L32 13L28 17V21L31 25L27 30L22 28L18 30L17 34H11L10 29L6 27L2 29L-1 23L3 19V15L0 11L4 6L9 8L13 6ZM22 17A6 6 0 1 1 10 17A6 6 0 1 1 22 17',
                    'About': 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M16 13V24M16 7V9',
                    'Rectangle': 'M4 4H28V28H4Z',
                    'Fit to Window':
                      'M4 4H28V28H4ZM8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 13V8H13M19 8H24V13M8 19V24H13M19 24H24V19',
                  }[name] || path;
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
                            : t === 'Example'
                              ? 'M6 2H20L27 9V30H6ZM20 2V10H27M10 15H23M10 20H23M10 25H21'
                              : t === 'Instructions' || t === 'Help'
                                ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                                : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Geometry Task' : '');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            if (C.theme === 'mint')
              u.el(
                'p',
                'brief-copy',
                note,
                'Click anywhere on the circle area to place a marker. Your goal is to click the exact center of the circle.',
              );
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, instruction, note, u } = _c;
            if (ctx.display === 'hidden') {
              (C.theme === 'mint' ? instruction : note).hidden = true;
              if (C.theme === 'mint') note.classList.add('instruction-hidden');
            } else if (ctx.display === 'toast') {
              const toast = C.theme === 'mint' ? u.el('section', 'task-note', content) : note;
              toast.classList.add('instruction-toast');
              if (toast !== note) toast.appendChild(instruction);
              const x = u.el('button', 'note-close', toast, '×');
              x.onclick = () => (toast.style.visibility = 'hidden');
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, note, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            ((_c.placement = 'footer'), (_c.endLabel = 'Submit'), (_c.collision = null));
            if (!ctx.finish) {
              const labels = (ctx.content && ctx.content.END_LABELS) || [
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
              ];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              if (endR.bool(0.5)) {
                _c.placement = 'footer';
                _c.endLabel = 'Submit';
              } else {
                _c.placement = endR.pick(['note', 'link']);
                _c.endLabel = labelOf(endR.pick(labels));
              }
              if (collideR.bool(0.3)) {
                const options = [...new Set(labels.map(labelOf))].filter(
                  (x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase(),
                );
                if (options.length) _c.collision = labelOf(collideR.pick(options));
              }
            }
            const endButton = (parent, cls, label) => {
              const b = u.el('button', cls, parent, label);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.onclick = () => ctx.submit();
              return b;
            };
            const decoyButton = (parent, label) => {
              const b = u.el('button', 'end-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
              return b;
            };
            if (_c.placement === 'note') {
              const tools = u.el('div', 'note-tools', note);
              _c.submit = endButton(tools, 'submit', _c.endLabel);
              if (_c.collision) decoyButton(tools, _c.collision);
            } else {
              if (_c.placement === 'footer') _c.submit = endButton(footer, 'submit', _c.endLabel);
              else {
                const link = u.el('a', 'end-link', footer, _c.endLabel + ' ›');
                link.href = '#';
                link.dataset.role = 'submit';
                link.setAttribute('aria-label', _c.endLabel);
                link.title = _c.endLabel;
                link.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                _c.submit = link;
              }
              if (_c.collision) decoyButton(footer, _c.collision);
            }
            if (C.theme === 'mint') {
              const clear = u.el('button', 'clear', footer);
              const ic = u.svg(
                'svg',
                {
                  width: 28,
                  height: 28,
                  viewBox: '0 0 32 32',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 2.4,
                },
                clear,
              );
              u.svg('path', { d: 'M7 8A12 12 0 1 1 4 17M6 2V9H13' }, ic);
              clear.appendChild(document.createTextNode('Clear'));
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, { collideR, decoyButton, endButton, endR });
          },
      },
    },
  });
})();
