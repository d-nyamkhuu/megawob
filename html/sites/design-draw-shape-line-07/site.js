// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-line-07',
    styles: ['site.css', 'beos.css'],
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
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util,
              body = document.body;
            body.className = 'beos';
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labels =
              ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const placement = ctx.finish ? null : er.pick(['side', 'side', 'side', 'header', 'taskbar']);
            const endLabel = placement === 'side' || ctx.finish ? 'Submit' : labelText(er.pick(labels));
            const collide = cr.bool(0.3)
              ? labelText(
                  cr.pick(labels.filter((x) => labelText(x).trim().toLowerCase() !== endLabel.trim().toLowerCase())),
                )
              : null;
            const win = u.el('div', 'bx-win', body);
            const tab = u.el('div', 'bx-tab', win);
            const ti = u.svg('svg', { class: 'bx-ticon', width: 18, height: 20, viewBox: '0 0 18 20' }, tab);
            u.svg('path', { d: 'M1 3H11L16 7V19H1Z', fill: '#aaa', stroke: '#111', 'stroke-width': 1 }, ti);
            u.svg('path', { d: 'M3 1H11L15 5V17H3Z', fill: '#fffef2', stroke: '#111', 'stroke-width': 1 }, ti);
            u.svg(
              'path',
              { d: 'M11 1V5H15M5 7V13M7 7V13M9 7V13M11 7V13', fill: 'none', stroke: '#555', 'stroke-width': 0.7 },
              ti,
            );
            u.el('span', 'bx-ttl', tab, 'Line Practice');
            u.el('span', 'bx-zoom', tab);
            const wc = u.el('div', 'bx-wc', win);
            for (const g of ['min', 'max', 'close']) {
              const b = u.el('button', 'bx-wcb', wc);
              b.type = 'button';
              b.dataset.g = g;
              b.onclick = () => env.log('window-control', { label: g });
            }
            const menu = u.el('nav', 'bx-menu', win);
            for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
            const main = u.el('div', 'bx-main', win);
            const tools = u.el('aside', 'bx-tools', main);
            u.el('div', 'bx-ph', tools, 'Tools');
            const tb = u.el('div', 'bx-tb', tools);
            const pen = u.el('button', 'bx-tool sel', tb);
            pen.type = 'button';
            const ps = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 44 44' }, pen);
            u.svg('path', { d: 'M5 39L9 27L32 3L38 3L41 6L41 11L17 34Z', fill: '#111' }, ps);
            u.svg('path', { d: 'M10 27L32 5L38 11L17 33Z', fill: '#ffcb23', stroke: '#704400', 'stroke-width': 1 }, ps);
            u.svg('path', { d: 'M11 27L33 5L35 7L13 29Z', fill: '#ffe882' }, ps);
            u.svg('path', { d: 'M15 31L37 9L38 11L17 33Z', fill: '#d68a00' }, ps);
            u.svg(
              'path',
              { d: 'M32 5L38 11L40 9L40 6L37 3L34 3Z', fill: '#f84243', stroke: '#111', 'stroke-width': 1 },
              ps,
            );
            u.svg('path', { d: 'M34 4L37 4L39 6', fill: 'none', stroke: '#ffaaa0', 'stroke-width': 1 }, ps);
            u.svg('path', { d: 'M7 36L10 27L17 33Z', fill: '#fff0be', stroke: '#333', 'stroke-width': 0.7 }, ps);
            u.svg('path', { d: 'M4 40L7 34L10 37Z', fill: '#111' }, ps);
            u.el('span', '', pen, 'Pencil');
            pen.onclick = () => env.log('tool', { tool: 'pencil' });
            const clr = u.el('button', 'bx-tool', tb);
            clr.type = 'button';
            const es = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 44 44' }, clr);
            u.svg('path', { d: 'M5 28L24 10L34 10L39 14V19L21 37H10L5 33Z', fill: '#111' }, es);
            u.svg(
              'path',
              { d: 'M7 28L25 12L34 12L37 15L19 32H10Z', fill: '#f4bac0', stroke: '#333', 'stroke-width': 1 },
              es,
            );
            u.svg('path', { d: 'M10 32H19V35H10L7 32V28Z', fill: '#d58d96', stroke: '#333', 'stroke-width': 1 }, es);
            u.svg('path', { d: 'M19 32L37 15V19L21 35H19Z', fill: '#b5747b', stroke: '#333', 'stroke-width': 1 }, es);
            u.svg('path', { d: 'M8 27L25 12H33', fill: 'none', stroke: '#fff0e9', 'stroke-width': 1 }, es);
            u.el('span', '', clr, 'Clear');
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            const center = u.el('section', 'bx-center', main);
            const note = u.el('div', 'bx-note', center);
            u.el('div', 'bx-instr', note, ctx.instruction);
            if (ctx.display === 'hidden') note.hidden = true;
            if (ctx.display === 'toast') {
              note.classList.add('bx-toast');
              const x = u.el('button', 'bx-note-close', note, '×');
              x.type = 'button';
              x.onclick = () => {
                note.style.visibility = 'hidden';
              };
            } else if (ctx.display === 'panel') {
              note.classList.add('bx-panel');
            }
            const stage = u.el('main', 'bx-stage', center);
            stage.dataset.role = 'stage';
            const side = u.el('aside', 'bx-side', main);
            u.el('div', 'bx-ph', side, 'Canvas');
            u.el('div', 'bx-size', side, 'Size: 640 × 360');
            if (ctx.display === 'panel') side.appendChild(note);
            let submit = null;
            const endBtn = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = () => ctx.submit();
              return b;
            };
            const decoyBtn = (parent, text) => {
              const b = u.el('button', 'bx-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: text, collide: true });
            };
            const menuTools = u.el('div', 'bx-menu-tools', menu);
            if (collide) decoyBtn(menuTools, collide);
            if (placement === 'header') submit = endBtn(menuTools, 'bx-submit bx-alt-submit', endLabel);
            if (!ctx.finish && placement === 'side') {
              const f = u.el('div', 'bx-sub', side);
              submit = endBtn(f, 'bx-submit', endLabel);
            }
            if (collide && placement !== 'header' && !menuTools.querySelector('.bx-xtra'))
              decoyBtn(menuTools, collide);
            const bar = u.el('footer', 'bx-bar', body);
            const lg = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26' }, bar);
            u.svg(
              'rect',
              { x: 1, y: 1, width: 24, height: 24, fill: '#070808', stroke: '#777', 'stroke-width': 1 },
              lg,
            );
            for (const [d, c] of [
              ['M4 13L9 4L12 5L10 15Z', '#167cdc'],
              ['M5 15L9 12L12 19L8 22Z', '#16a12b'],
              ['M11 4L17 3L22 10L19 22L15 21L16 11Z', '#df2425'],
              ['M10 11L14 6L15 13L18 17L14 23L10 18Z', '#fce632'],
              ['M15 7L18 10L17 17L14 13Z', '#fff4ac'],
            ])
              u.svg('path', { d, fill: c }, lg);
            u.el('span', 'bx-be', bar, 'BeOS');
            u.el('span', 'bx-sep', bar);
            u.el('span', 'bx-task', bar, 'Line Practice');
            u.el('span', 'bx-fill', bar);
            u.el('span', 'bx-sep', bar);
            const sv = u.svg('svg', { width: 22, height: 18, viewBox: '0 0 22 18' }, bar);
            u.svg('path', { d: 'M2 6H6L11 2V16L6 12H2Z', fill: '#111' }, sv);
            u.svg(
              'path',
              { d: 'M14 6Q17 9 14 12M16.5 4Q21 9 16.5 14', fill: 'none', stroke: '#111', 'stroke-width': 1.4 },
              sv,
            );
            u.el('span', 'bx-clock', bar, '10:24 AM');
            if (!ctx.finish && placement === 'taskbar') submit = endBtn(bar, 'bx-submit bx-taskbar-submit', endLabel);
            return { stage, submit };
          },
        'frameOld.8': (base, S) =>
          function (_c) {
            const { C } = S;
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
        'frameOld.11': (base, S) =>
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
        'frameOld.14': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            u.el('h2', 'ov-title', note, 'Task Overview');
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frameOld.18': (base, S) =>
          function (_c) {
            const { C } = S;
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
        'frameOld.21': (base, S) =>
          function (_c) {
            const { C } = S;
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
        'frameOld.25': (base, S) =>
          function (_c) {
            const { C } = S;
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
        'overlay.7': (base, S) =>
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
        'overlay.13': (base, S) =>
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
