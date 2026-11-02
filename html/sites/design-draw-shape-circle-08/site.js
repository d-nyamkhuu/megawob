// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  const nbFrame = (ctx) => {
    const u = ctx.util,
      body = document.body;
    body.className = 'design nb' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#faf8f5',
      panel: '#faf8f5',
      fg: '#000',
      muted: '#8a8a8a',
      line: '#b9b9b9',
      accent: '#ee6c35',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', '"DejaVu Sans Mono",Consolas,monospace');
    const shell = u.el('div', 'nb-shell', body),
      head = u.el('header', 'nb-head', shell);
    const ic = u.svg('svg', { class: 'nb-icon', width: 20, height: 20, viewBox: '0 0 20 20' }, head);
    u.svg(
      'rect',
      { x: 2, y: 1.5, width: 15, height: 17, rx: 2, fill: '#b97d57', stroke: '#f3975a', 'stroke-width': 1.8 },
      ic,
    );
    u.svg('path', { d: 'M5 4H14V16H5ZM7 4V16', fill: 'none', stroke: '#e5b997', 'stroke-width': 0.8 }, ic);
    u.el('div', 'nb-title', head, 'SketchPad Notebook');
    const wc = u.el('div', 'nb-wc', head);
    const w1 = u.svg(
      'svg',
      { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: '#e6e6e6', 'stroke-width': 1.3 },
      wc,
    );
    u.svg('path', { d: 'M1 8H13' }, w1);
    const w2 = u.svg(
      'svg',
      { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: '#e6e6e6', 'stroke-width': 1.3 },
      wc,
    );
    u.svg('rect', { x: 1.5, y: 1.5, width: 11, height: 11 }, w2);
    const w3 = u.svg(
      'svg',
      { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: '#e6e6e6', 'stroke-width': 1.3 },
      wc,
    );
    u.svg('path', { d: 'M1 1L13 13M13 1L1 13' }, w3);
    const tabs = u.el('nav', 'nb-tabs', shell);
    for (const [i, t] of ['Home', 'View', 'Help'].entries()) {
      const b = u.el('button', 'nb-tab' + (i === 0 ? ' active' : ''), tabs, t);
      b.type = 'button';
      b.onclick = () => {
        tabs.querySelectorAll('.nb-tab').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
      };
    }
    const rib = u.el('div', 'nb-ribbon', shell);
    const g1 = u.el('div', 'nb-group', rib);
    const pen = u.el('button', 'nb-tool selected', g1);
    pen.type = 'button';
    const pi = u.svg(
      'svg',
      {
        width: 40,
        height: 40,
        viewBox: '0 0 40 40',
        fill: 'none',
        stroke: '#353b44',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
      },
      pen,
    );
    u.svg(
      'path',
      { d: 'M5 35L9 24L29 4Q31 2 33 4L36 7Q38 9 36 11L16 31ZM9 24L16 31M26 7L33 14M5 35L11 33', fill: '#f5c49e' },
      pi,
    );
    u.el('span', '', pen, 'Freehand Pencil');
    const clr1 = u.el('button', 'nb-tool', g1);
    clr1.type = 'button';
    const ei = u.svg(
      'svg',
      {
        width: 40,
        height: 40,
        viewBox: '0 0 40 40',
        fill: 'none',
        stroke: '#353b44',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
      },
      clr1,
    );
    u.svg('path', { d: 'M6 23L23 5Q25 3 27 5L36 14Q38 16 36 18L20 35H11Q6 35 6 30ZM11 18L25 31' }, ei);
    u.el('span', '', clr1, 'Clear');
    clr1.onclick = () => env.widgetDef.clear?.();
    const g2 = u.el('div', 'nb-group', rib);
    u.el('div', 'nb-glabel', g2, 'Stroke Size');
    const r2 = u.el('div', 'nb-dots', g2);
    for (const [i, s] of [8, 26, 26].entries()) {
      const d = u.el('span', 'nb-dot sz' + i + (i === 1 ? ' on' : ''), r2);
      d.style.setProperty('--s', s + 'px');
    }
    const g3 = u.el('div', 'nb-group', rib);
    u.el('div', 'nb-glabel', g3, 'Color');
    const r3 = u.el('div', 'nb-dots', g3);
    for (const [i, c] of ['#000', '#777', '#c4c4c4'].entries()) {
      const d = u.el('span', 'nb-dot col' + (i === 0 ? ' on' : ''), r3);
      d.style.setProperty('--c', c);
    }
    const fill = u.el('div', 'nb-group nb-fill', rib);
    let display = ctx.display || 'header';
    const roomy = window.innerWidth >= 1260 && window.innerHeight >= 700;
    if ((display === 'panel' && !roomy) || (display === 'toast' && window.innerHeight < 700)) display = 'header';
    const content = u.el('div', 'nb-content', shell),
      note = u.el('section', 'task-note nb-note', content);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (display === 'hidden') note.hidden = true;
    else if (display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (display === 'panel') {
      note.classList.add('instruction-panel');
      content.classList.add('nb-panel');
      u.el('div', 'nb-panel-label', note, 'Task instructions');
    }
    const stage = u.el('main', 'stage', content);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'nb-foot', shell);
    u.el('div', 'nb-status', footer, 'Tool: Freehand Pencil  |  Stroke: Medium  |  Color: Black');
    const clr = u.el('button', 'clear', footer, 'Clear');
    clr.type = 'button';
    clr.onclick = () => {
      env.widgetDef.clear?.();
    };
    const endRng = ctx.rng.fork('chrome/end'),
      contentLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
      labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
    let placement = 'footer',
      label = 'Submit';
    if (!ctx.finish && endRng.bool(0.5)) {
      placement = endRng.pick(['ribbon', 'ribbon', 'link', 'footer']);
      label = labelOf(endRng.pick(contentLabels));
    }
    const collideRng = ctx.rng.fork('chrome/collide'),
      same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase(),
      collidePool = [...new Set(contentLabels.map(labelOf))].filter((x) => !same(x));
    let collide = null;
    if (!ctx.finish && collidePool.length && collideRng.bool(0.3))
      collide = { label: collideRng.pick(collidePool), where: collideRng.pick(['ribbon', 'footer']) };
    const decoyBtn = (parent, text) => {
      const b = u.el('button', 'nb-xtra', parent, text);
      b.type = 'button';
      b.dataset.role = 'xtra';
      b.onclick = () => env.log('decoy', { label: text, collide: true });
    };
    if (collide && collide.where === 'ribbon') decoyBtn(fill, collide.label);
    let submit = null;
    if (!ctx.finish) {
      if (placement === 'ribbon') submit = u.el('button', 'nb-ribbon-submit', fill, label);
      else if (placement === 'link') {
        submit = u.el('a', 'nb-endlink', footer, label);
        submit.href = '#';
      } else submit = u.el('button', 'submit', footer, label);
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.setAttribute('aria-label', label);
      submit.title = label;
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    if (collide && collide.where === 'footer') decoyBtn(footer, collide.label);
    return { stage, submit };
  };
  env.site({
    name: 'design-draw-shape-circle-08',
    styles: ['site.css', 'nb.css'],
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
            return nbFrame(ctx);
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
