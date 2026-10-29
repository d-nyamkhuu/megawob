// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      C: {
        'layout': 'split-level',
        'theme': 'vista',
        'title': 'Path Tracer',
        'menu': 'File    Edit    View    Tools    Help',
        'foot': '',
        'accent': '#2685dd',
        'bg': '#d8e8f6',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
        'ob': 'newsletter',
      },
      parts: {
        frame: (base, St) =>
          function (ctx) {
            const u = ctx.util,
              body = document.body;
            let display = ctx.display || 'header';
            if (display === 'panel' && (window.innerWidth < 1366 || window.innerHeight < 850)) display = 'header';
            if (display === 'toast' && (window.innerWidth < 1024 || window.innerHeight < 640)) display = 'header';
            body.className = 'design qt' + (display === 'toast' ? ' has-instruction-toast' : '');
            const endR = ctx.rng.fork('chrome/end'),
              endPool = (ctx.content && ctx.content.END_LABELS) || [
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
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const isDefault = endR.bool(0.5),
              placement = isDefault ? 'footer' : endR.pick(['footer', 'menu', 'menu', 'status', 'status', 'link']);
            const label = isDefault ? 'Submit' : endText(endR.pick(endPool));
            const collideR = ctx.rng.fork('chrome/collide');
            let collide = null;
            if (collideR.bool(0.3)) {
              const choices = [
                ...new Set(endPool.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
              ];
              if (choices.length)
                collide = { label: endText(collideR.pick(choices)), where: collideR.pick(['menu', 'menu', 'footer']) };
            }
            const noop = (ev) => ev.preventDefault();
            const win = u.el('div', 'qt-win', body);
            const tb = u.el('div', 'qt-title', win);
            u.el('span', 'qt-star', tb, '★');
            const ic = u.svg('svg', { class: 'qt-icon', width: 24, height: 24, viewBox: '0 0 24 24' }, tb);
            u.svg('rect', { x: 1, y: 1, width: 22, height: 22, rx: 1, fill: '#125abb', stroke: '#9ab9e5' }, ic);
            u.svg(
              'path',
              {
                d: 'M7 17Q8 8 15 9M12 6L15 3L18 6M15 3V13M4 12L7 9L10 12',
                fill: 'none',
                stroke: '#fff',
                'stroke-width': 1.8,
              },
              ic,
            );
            u.el('span', 'qt-name', tb, 'Path Trainer');
            const wc = u.el('div', 'qt-wc', tb);
            for (const [t, c] of [
              ['_', 'min'],
              ['□', 'max'],
              ['×', 'close'],
            ]) {
              const b = u.el('button', c, wc, t);
              b.type = 'button';
              b.onclick = () => env.log('window-control', { label: t });
            }
            const mb = u.el('nav', 'qt-menu', win);
            for (const t of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', mb, t);
            const menuTools = u.el('div', 'qt-menu-tools', mb);
            let submit = null;
            const decoyBtn = (parent, text, collides) => {
              const b = u.el('button', 'qt-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
              return b;
            };
            const endBtn = (parent, cls, text) => {
              const b = u.el(cls === 'qt-endlink' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (ev) => {
                ev.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (collide && collide.where === 'menu') decoyBtn(menuTools, collide.label, true);
            if (!ctx.finish && placement === 'menu') submit = endBtn(menuTools, 'qt-end', label);
            const mid = u.el('div', 'qt-mid', win);
            const side = u.el('aside', 'qt-side', mid);
            const g1 = u.el('div', 'qt-group', side);
            u.el('div', 'qt-gh', g1, 'Exercises');
            ['1. Curved Path', '2. S Curve', '3. Loop', '4. Corner Turn', '5. Spiral', '6. Freehand'].forEach(
              (t, i) => {
                const r = u.el('div', 'qt-item' + (i === 0 ? ' sel' : ''), g1, t);
              },
            );
            const g2 = u.el('div', 'qt-group qt-opts', side);
            u.el('div', 'qt-gh', g2, 'Options');
            u.el('div', 'qt-lbl', g2, 'Guide style:');
            const dd = u.el('div', 'qt-combo', g2);
            u.el('span', '', dd, 'Dashed line');
            u.el('i', '', dd, '▾');
            for (const [t, c] of [
              ['Show start and end', true],
              ['Snap to path', false],
              ['Show grid', false],
            ]) {
              const l = u.el('label', 'qt-chk', g2);
              const b = u.el('span', 'qt-box' + (c ? ' on' : ''), l, c ? '✔' : '');
              u.el('span', '', l, t);
              l.onclick = () => {
                b.classList.toggle('on');
                b.textContent = b.classList.contains('on') ? '✔' : '';
              };
            }
            const pw = u.el('div', 'qt-row', g2);
            u.el('span', '', pw, 'Pen width:');
            const sp = u.el('div', 'qt-spin', pw);
            u.el('span', '', sp, '3');
            u.el('i', '', sp, '▴▾');
            const pc = u.el('div', 'qt-row', g2);
            u.el('span', '', pc, 'Pen color:');
            const cb = u.el('div', 'qt-color', pc);
            u.el('b', '', cb);
            u.el('i', '', cb, '▾');
            const rs = u.el('button', 'qt-btn qt-reset', g2, 'Reset');
            rs.type = 'button';
            rs.onclick = () => env.widgetDef.clear?.();
            const main = u.el('div', 'qt-main', mid);
            const note = u.el('section', 'task-note qt-note', main);
            u.el('div', 'instruction', note, ctx.instruction);
            if (display === 'hidden' || display === 'panel') note.hidden = true;
            else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.onclick = () => (note.style.visibility = 'hidden');
            }
            if (display === 'panel') {
              note.hidden = false;
              note.classList.add('instruction-panel');
              side.insertBefore(note, g2);
            }
            const stage = u.el('main', 'stage', main);
            stage.dataset.role = 'stage';
            const foot = u.el('div', 'qt-foot', main);
            if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'submit qt-btn qt-submit', label);
            if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'qt-endlink', label + ' ›');
            if (collide && collide.where === 'footer') decoyBtn(foot, collide.label, true);
            const clr = u.el('button', 'clear qt-btn', foot, 'Clear');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            const sb = u.el('div', 'qt-status', win);
            u.el('span', '', sb, 'Exercise 1 of 6');
            const statusTools = u.el('span', 'qt-status-tools', sb);
            if (!ctx.finish && placement === 'status') submit = endBtn(statusTools, 'qt-end', label);
            u.el('span', 'qt-ready', statusTools, 'Ready');
            const pal = u.el('div', 'qt-pal', body);
            const ph = u.el('div', 'qt-pal-h', pal);
            u.el('span', '', ph, 'Tools');
            u.el('b', '', ph, '×');
            const tools = u.el('div', 'qt-tools', pal);
            [
              ['Pen', 'M4 20L5 15L16 4Q17 3 18 4L20 6Q21 7 20 8L9 19ZM14 6L18 10M5 15L9 19'],
              ['Eraser', 'M3 15L12 5Q13 4 14 5L19 10Q20 11 19 12L12 20H7L3 17ZM8 10L15 16M4 17L8 19L12 20'],
              ['Select', 'M4 4H20V20H4Z'],
            ].forEach(([n, d], i) => {
              const r = u.el('div', 'qt-tool', tools);
              const bx = u.el('span', 'qt-tbox' + (i === 0 ? ' sel' : ''), r);
              const s = u.svg(
                'svg',
                {
                  width: 26,
                  height: 26,
                  viewBox: '0 0 24 24',
                  fill: i === 2 ? 'none' : '#f4f6f9',
                  stroke: '#17212b',
                  'stroke-width': 1.5,
                  'stroke-dasharray': i === 2 ? '2 1' : '0',
                },
                bx,
              );
              u.svg('path', { d }, s);
              u.el('span', '', r, n);
            });
            const p1 = u.el('div', 'qt-row qt-prow', pal);
            u.el('span', '', p1, 'Pen size:');
            const s2 = u.el('div', 'qt-spin', p1);
            u.el('span', '', s2, '3');
            u.el('i', '', s2, '▴▾');
            const p2 = u.el('div', 'qt-row qt-prow', pal);
            u.el('span', '', p2, 'Color:');
            const c2 = u.el('div', 'qt-color', p2);
            u.el('b', '', c2);
            u.el('i', '', c2, '▾');
            return { stage, submit };
          },
        'frameOld.8': (base, St) =>
          function (_c) {
            const { C } = St;
            const { head, u } = _c;
            if (C.title) {
              const ic = u.svg('svg', { class: 'app-icon', width: 24, height: 24, viewBox: '0 0 24 24' }, head);
              u.svg(
                'rect',
                { x: 1, y: 1, width: 22, height: 22, rx: 5, fill: '#3d8fe6', stroke: '#e8f3ff', 'stroke-width': 1.5 },
                ic,
              );
              u.svg(
                'path',
                {
                  d: 'M7 17Q9 7 15 9L17 6',
                  fill: 'none',
                  stroke: '#fff',
                  'stroke-width': 2.2,
                  'stroke-linecap': 'round',
                },
                ic,
              );
            }
            if (C.title) u.el('div', 'title', head, C.title);
          },
        'frameOld.11': (base, St) =>
          function (_c) {
            const { C } = St;
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
        'frameOld.14': (base, St) =>
          function (_c) {
            const { ctx, note, u } = _c;
            u.el('h2', 'ov-title', note, 'Task Overview');
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frameOld.18': (base, St) =>
          function (_c) {
            const { C } = St;
            const { content, note, u } = _c;
            if (C.layout === 'split-level') {
              const ul = u.el('ul', 'overview-copy', note);
              for (const t of [
                'Click at the green start dot, then drag along the curved path to the arrowhead.',
                'Keep your pointer on the line and complete it in one continuous stroke.',
                'Do not lift the mouse button until you reach the arrowhead.',
              ])
                u.el('li', '', ul, t);
              const ex = u.el('div', 'example', note);
              u.el('div', 'ex-head', ex, 'Example (not interactive)');
              const sv = u.svg('svg', { viewBox: '0 0 240 110', preserveAspectRatio: 'xMidYMid meet' }, ex);
              u.svg(
                'path',
                {
                  d: 'M32 38C70 30 85 8 115 12C150 16 160 62 195 62C215 62 225 52 232 44',
                  fill: 'none',
                  stroke: '#a9b4c6',
                  'stroke-width': 3.5,
                  'stroke-linecap': 'round',
                },
                sv,
              );
              u.svg('circle', { cx: 30, cy: 38, r: 6, fill: '#3dbb4a' }, sv);
              u.svg('path', { d: 'M228 36L212 52L234 58Z', fill: '#3b8ee8' }, sv);
              for (const [x, y, t] of [
                [30, 64, 'Start'],
                [210, 26, 'Arrowhead'],
              ]) {
                const tx = u.svg(
                  'text',
                  { x, y, 'text-anchor': 'middle', 'font-size': 10, fill: t === 'Start' ? '#222' : '#2a62a8' },
                  sv,
                );
                tx.textContent = t;
              }
            }
            const turn = u.el('section', 'turn', content);
            const th = u.el('div', 'turn-head', turn);
            u.el('h2', 'ov-title', th, 'Your Turn');
            const tm = u.el('div', 'turn-time', th);
            const pi = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, tm);
            u.svg('circle', { cx: 10, cy: 10, r: 8.5, fill: 'none', stroke: '#444', 'stroke-width': 1.6 }, pi);
            u.svg('path', { d: 'M7.5 6V14M12.5 6V14', stroke: '#444', 'stroke-width': 1.8 }, pi);
            env.timeText = u.el('span', '', tm, 'Time: Ready');
            const stage = u.el('main', 'stage', turn);
            Object.assign(_c, { pi, stage, th, tm, turn });
          },
        'frameOld.21': (base, St) =>
          function (_c) {
            const { C } = St;
            const { content, ctx, turn, u } = _c;
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
            const footer = u.el('footer', 'footer', turn);
            Object.assign(_c, { footer });
          },
        'frameOld.22': () => () => {},
        'frameOld.25': (base, St) =>
          function (_c) {
            const { C } = St;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const parent =
                (C.layout === 'three' || C.layout === 'material-twin' || C.layout === 'margin') && _c.aside
                  ? _c.aside
                  : footer;
              _c.submit = u.el('button', 'submit', parent, 'Submit');
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
              if (C.collapsed) {
                const show = u.el('button', 'show-controls', parent, 'Show controls');
                show.type = 'button';
                show.onclick = () => {
                  show.classList.add('revealed');
                  show.textContent = 'Task controls';
                  _c.submit.style.visibility = 'visible';
                };
                _c.submit.style.visibility = 'hidden';
              }
            }
            {
              const clr = u.el('button', 'clear', footer, 'Clear');
              clr.type = 'button';
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              footer.insertBefore(clr, footer.firstChild);
            }
          },
        'overlay.7': (base, St) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = 'We’d like your consent';
              _c.text =
                'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'The midpoint is the point that is the same distance from both marked points.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Product Updates Newsletter';
              _c.text = 'Get occasional updates about new features and tips.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'survey') {
              _c.title = 'Quick Survey';
              _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
              _c.label = 'Close survey';
            } else {
              _c.title = {
                cookie: 'Your privacy',
                toast: 'Changes saved',
                chat: 'Support',
                promo: 'Workspace update',
                banner: 'Service notice',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner: 'You are viewing a shared workspace.',
              }[kind];
              _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
            }
          },
        'overlay.13': (base, St) =>
          function (_c) {
            const { box, ctx, dismiss, o, u } = _c;
            if (o === 'newsletter') {
              u.el('div', 'nl-input', box, 'Your email address (optional)');
              const cb = u.el('div', 'nl-check', box);
              u.el('span', 'nl-box', cb);
              u.el('span', '', cb, 'Send me product updates');
              const x = u.el('button', 'nl-x', box, '✕');
              x.type = 'button';
              x.onclick = () => dismiss.click();
              if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
            }
            dismiss.type = 'button';
            dismiss.onclick = () => {
              if (env.timeText) env.timeText.textContent = 'Time: Ready';
              ctx.dismiss('close');
            };
          },
        'overlay.14': () => () => {},
      },
    },
  });
})();
