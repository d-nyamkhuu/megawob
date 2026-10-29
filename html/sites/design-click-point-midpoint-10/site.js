// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-midpoint-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'carbon',
        'theme': 'carbon',
        'title': 'Point Task',
        'menu': ['File', 'Edit', 'View', 'Tools', 'Help'],
        'foot': 'Click on the canvas to place your point.',
        'accent': '#1f5fd0',
        'bg': '#262a32',
        'surface': '#000',
        'font': "'Segoe UI', Tahoma, Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            body.classList.toggle('instruction-hidden', ctx.display === 'hidden');
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            if (['carbon', 'eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            Object.assign(_c, { head, shell });
          },
        'frame.8': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const m of C.menu) {
                const mb = u.el('span', 'menu-item', nav, m);
              }
            }
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
        'frame.12': () => () => {},
        'frame.21': (base, S) =>
          function (_c) {
            const { ctx, note, stage } = _c;
            if (ctx.display === 'hidden') {
              note.remove();
              stage.style.gridRow = '1 / -1';
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              endBank = (ctx.content && ctx.content.END_LABELS) || [
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
            const primary = endR.bool(0.5),
              placement = primary ? 'footer' : endR.pick(['header', 'link']),
              label = primary ? 'Submit' : labelOf(endR.pick(endBank));
            const endButton = (parent, cls, text, aria) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', aria || label);
              b.title = aria || label;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (!ctx.finish) {
              if (placement === 'footer')
                _c.submit = endButton(C.layout === 'three' && _c.aside ? _c.aside : footer, 'submit', label);
              else if (placement === 'link') {
                _c.submit = endButton(footer, 'carbon-endlink', label + ' ›');
              } else {
                const nav = head.querySelector('.menu');
                _c.submit = endButton(nav, 'carbon-toolbar-end', label);
              }
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const pool = endBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (pool.length) {
                const decoyLabel = collideR.pick(pool),
                  d = u.el('button', 'carbon-xtra', footer, decoyLabel);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
              }
            }
            if (C.theme === 'carbon') {
              const ic = u.svg(
                'svg',
                {
                  width: 34,
                  height: 34,
                  viewBox: '0 0 34 34',
                  fill: 'none',
                  stroke: '#c8ccd2',
                  'stroke-width': 1.6,
                  class: 'info-icon',
                },
                footer,
              );
              u.svg('circle', { cx: 17, cy: 17, r: 14.5 }, ic);
              const info = u.svg(
                'text',
                {
                  x: 17,
                  y: 25,
                  'text-anchor': 'middle',
                  fill: '#eef0f3',
                  stroke: 'none',
                  style: 'font:italic bold 27px Georgia,serif',
                },
                ic,
              );
              info.textContent = 'i';
              footer.insertBefore(ic, footer.firstChild);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.type = 'button';
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
              const undo = u.el('button', 'clear', footer, 'Undo');
              undo.type = 'button';
              undo.onclick = () => {
                env.widgetDef.clear?.();
              };
              const before = _c.submit && _c.submit.parentNode === footer ? _c.submit : null;
              footer.insertBefore(clear, before);
              footer.insertBefore(undo, before);
            }
            Object.assign(_c, { collideR, endBank, endButton, endR, label, labelOf, placement, primary });
          },
      },
    },
  });
})();
