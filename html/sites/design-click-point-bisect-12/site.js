// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-bisect-12',
    styles: ['site.css', 'gem.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'margin',
        'theme': 'gem',
        'title': 'Angle Explorer',
        'menu': 'GeoTool    File    Edit    View    Options    Help',
        'aside': 'Preferences',
        'foot': 'Click in the drawing area.',
        'accent': '#111',
        'bg': '#fff',
        'surface': '#fff',
        'font': 'monospace',
        'collapsed': true,
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labels = (
              (ctx.content && ctx.content.END_LABELS) || [
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
              ]
            ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
            const endLabel = labels.length ? endR.pick(labels) : 'Submit';
            const placement = ctx.finish ? 'none' : endR.pick(['controls', 'controls', 'controls', 'footer', 'menu']);
            const collide = collideR.bool(0.3)
              ? labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()).length
                ? collideR.pick(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
                : null
              : null;
            Object.assign(_c, { collide, collideR, endLabel, endR, labels, placement });
          },
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: C.theme === 'developer' ? '#eff4ff' : '#000',
              muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
              line: C.theme === 'developer' ? '#283544' : '#c9cfd5',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            u.el('div', 'gem-frame', shell);
            u.el('div', 'gem-titlebar', shell);
            u.el('div', 'gem-box l', shell);
            u.el('div', 'gem-box r', shell, '↑');
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              const lg = u.svg(
                'svg',
                { class: 'mlogo', viewBox: '0 0 20 20', fill: 'none', stroke: '#000', 'stroke-width': 1.6 },
                nav,
              );
              u.svg(
                'path',
                {
                  d: 'M6 1H12L15 4V8L17 10V13H15V16L12 18H5L2 15V6L6 1ZM6 5H10L12 7V11L10 13H7V10H5V7L6 5M12 5H14M13 9H15M7 13V16H11L12 14M3 14H5M4 18H14',
                },
                lg,
              );
              for (const w of C.menu.split(/\s{2,}/)) u.el('span', 'mi', nav, w);
              u.el('span', 'clock', nav, 'Mon Apr 27 1987    10:24 AM').style.whiteSpace = 'pre';
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
        'frame.19': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, u } = _c;
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
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { stage });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
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
                  const notes = u.el('section', 'gem-notes', note);
                  u.el('p', '', notes, 'Notes:');
                  for (const text of [
                    '• Click once to place a point.',
                    '• The point must be outside the dotted circle.',
                  ])
                    u.el('div', '', notes, text);
                  for (const [name, choices] of [
                    ['Show labels:', ['A, B, V']],
                    ['Point style:', ['●', '○']],
                    ['Line style:', ['━━━━', '┄┄┄']],
                    ['Grid:', ['Show grid']],
                    ['Snap to grid:', ['Enabled']],
                  ]) {
                    const l = u.el('label', 'preference', _c.aside);
                    u.el('span', '', l, name);
                    if (name === 'Point style:' || name === 'Line style:') {
                      const select = u.el(
                        'button',
                        'pref-select' + (name === 'Line style:' ? ' line-style' : ''),
                        l,
                        name === 'Point style:' ? choices[0] : '',
                      );
                      select.type = 'button';
                      select.setAttribute('aria-label', name);
                      let choice = 0;
                      select.onclick = () => {
                        choice = (choice + 1) % choices.length;
                        if (name === 'Point style:') {
                          select.textContent = choices[choice];
                          select.classList.toggle('hollow', choice === 1);
                        } else select.classList.toggle('dashed', choice === 1);
                      };
                    } else {
                      const control = u.el('span', 'pref-control', l);
                      const check = u.el('input', '', control);
                      check.type = 'checkbox';
                      check.checked = name === 'Show labels:';
                      u.el('span', '', control, choices[0]);
                    }
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
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { collide, ctx, endLabel, footer, head, placement, stage, u } = _c;
            {
              const co = u.el('div', 'coords', footer, 'x: 418  y: 276');
              stage.addEventListener('mousemove', (ev) => {
                const r = stage.getBoundingClientRect();
                co.textContent = 'x: ' + Math.round(ev.clientX - r.left) + '  y: ' + Math.round(ev.clientY - r.top);
              });
            }
            _c.submit = null;
            if (!ctx.finish) {
              const parent =
                (C.layout === 'three' || C.layout === 'material-twin' || C.layout === 'margin') && _c.aside
                  ? _c.aside
                  : footer;
              let tb = null,
                show = null;
              if (C.collapsed) {
                show = u.el('button', 'show-controls', parent, 'Show controls');
                show.type = 'button';
                tb = u.el('div', 'task-box', parent);
                u.el('span', 'tb-icon', tb, '▶');
                u.el('span', 'tb-label', tb, 'Task controls');
                tb.appendChild(show);
                show.onclick = () => {
                  show.classList.toggle('revealed');
                  show.textContent = show.classList.contains('revealed') ? 'Hide controls' : 'Show controls';
                };
              }
              const endParent = placement === 'controls' ? tb || parent : placement === 'footer' ? footer : head;
              const endCls =
                placement === 'menu'
                  ? 'gem-end gem-end-menu'
                  : placement === 'footer'
                    ? 'gem-end gem-end-footer'
                    : 'gem-end gem-end-controls';
              _c.submit = u.el('button', endCls, endParent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.onclick = () => ctx.submit();
              if (collide) {
                const decoy = u.el('button', 'gem-xtra', placement === 'menu' ? head : footer, collide);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
              }
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
