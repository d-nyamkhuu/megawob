// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function risc(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design risc';
    const bar = u.el('div', 'rk-menubar', body);
    const logo = u.svg('svg', { class: 'rk-logo', width: 26, height: 26, viewBox: '0 0 26 26' }, bar);
    logo.setAttribute('viewBox', '0 0 38 34');
    logo.setAttribute('width', '40');
    logo.setAttribute('height', '34');
    u.svg(
      'path',
      { d: 'M14 9Q3 7 6 2Q12 0 16 5Q20 0 27 2Q27 8 19 10', fill: '#3cab36', stroke: '#163919', 'stroke-width': 1.5 },
      logo,
    );
    for (const [x, y, r] of [
      [11, 11, 4],
      [19, 10, 4],
      [9, 17, 4],
      [16, 16, 4],
      [23, 16, 4],
      [11, 23, 4],
      [19, 23, 4],
      [16, 29, 3],
    ])
      u.svg('circle', { cx: x, cy: y, r, fill: '#cc163b', stroke: '#241c24', 'stroke-width': 1.1 }, logo);
    u.svg('path', { d: 'M31 13V23M27 18H36M28 14L35 22M28 22L35 14', stroke: '#385525', 'stroke-width': 1 }, logo);
    for (const t of ['RISC OS', 'File', 'Edit', 'View', 'Special', 'Help'])
      u.el('span', 'rk-mi' + (t === 'RISC OS' ? ' rk-first' : ''), bar, t);
    u.el('span', 'rk-clock', bar, 'Mon 16 Oct 1989   10:24');
    const ib = u.el('div', 'rk-iconbar', body);
    for (const n of ['Discs', 'Apps', 'Draw', 'Edit', 'Files', 'Prefs']) {
      const it = u.el('div', 'rk-icon', ib),
        s = u.svg(
          'svg',
          {
            width: 40,
            height: 40,
            viewBox: '0 0 40 40',
            stroke: '#303030',
            'stroke-width': 1.2,
            'stroke-linejoin': 'round',
          },
          it,
        );
      const add = (tag, a) => u.svg(tag, a, s);
      const defs = u.svg('defs', {}, s),
        gr = u.svg('linearGradient', { id: 'rk-metal-' + n, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      for (const [offset, color] of [
        ['0', '#f0f0eb'],
        ['.45', '#c7c7c3'],
        ['1', '#8b8d8d'],
      ])
        u.svg('stop', { offset, 'stop-color': color }, gr);
      const metal = 'url(#rk-metal-' + n + ')';
      if (n === 'Discs') {
        add('path', { d: 'M5 3H35V37H5Z', fill: metal });
        add('path', { d: 'M7 5H33V35H7Z', fill: 'none', stroke: '#eee' });
        for (const y of [7, 18, 28]) {
          add('rect', { x: 8, y, width: 24, height: 7, fill: metal });
          add('path', { d: `M17 ${y + 2}V${y + 4}H23V${y + 2}`, fill: 'none' });
        }
      } else if (n === 'Apps') {
        add('path', { d: 'M8 3H26L35 12V37H8Z', fill: '#ececea' });
        add('path', { d: 'M26 3V12H35', fill: '#b6b8bf' });
        for (let y = 8; y < 34; y += 3)
          add('path', { d: `M11 ${y}H${y < 14 ? 24 : 31}`, stroke: y < 14 ? '#888' : '#8583b8', 'stroke-width': 0.8 });
        add('path', { d: 'M10 35H32', stroke: '#b0b0bb' });
      } else if (n === 'Draw') {
        add('path', {
          d: 'M22 4C10 3 2 15 4 26C5 36 14 39 22 33C25 31 22 28 23 25C23 23 28 24 32 21C39 14 32 5 22 4Z',
          fill: '#e1cf83',
        });
        for (const [x, y, c] of [
          [12, 13, '#478ac7'],
          [20, 8, '#40a950'],
          [28, 11, '#e0b226'],
          [9, 22, '#ce4549'],
          [15, 29, '#835fa6'],
        ])
          add('ellipse', { cx: x, cy: y, rx: 2.4, ry: 3, fill: c, 'stroke-width': 0.7 });
        add('path', { d: 'M23 22L31 9L35 3Q37 1 38 4L33 12L26 24Z', fill: '#b73c30' });
        add('path', { d: 'M23 22L22 27L27 23', fill: '#4a392e' });
      } else if (n === 'Edit') {
        add('rect', { x: 6, y: 3, width: 29, height: 34, fill: '#eeeede' });
        add('path', { d: 'M8 5H32V35H8Z', fill: 'none', stroke: '#999' });
        for (let x = 9; x < 32; x += 5) add('rect', { x, y: 2, width: 2, height: 5, fill: '#777' });
        for (let y = 11; y < 33; y += 3)
          add('path', { d: `M10 ${y}H${y % 2 ? 30 : 27}`, stroke: '#575757', 'stroke-width': 0.8 });
      } else if (n === 'Files') {
        add('path', { d: 'M4 9V6H16L20 10H35V35H3V10Z', fill: '#dece84' });
        add('path', { d: 'M3 14L8 10H37L34 35H3Z', fill: '#e9d993' });
        add('path', { d: 'M5 15H34M5 16V33', stroke: '#ffffd2', fill: 'none' });
      } else {
        add('path', {
          d: 'M16 3H23L24 8L28 10L33 7L37 13L33 17V22L37 25L33 32L28 29L24 32L23 37H16L15 32L11 29L6 32L2 26L6 22V17L2 13L6 7L11 10L15 8Z',
          fill: '#7c85bc',
        });
        add('circle', { cx: 20, cy: 20, r: 8, fill: '#bbbfc5' });
        add('circle', { cx: 20, cy: 20, r: 5, fill: '#48538a' });
        add('path', { d: 'M17 4H22M5 13L8 9M32 29L35 25', stroke: '#d9ddfa', fill: 'none' });
      }
      u.el('span', '', it, n);
    }
    for (const [n, cls] of [
      ['HardDisc', 'rk-hd'],
      ['Waste', 'rk-waste'],
    ]) {
      const it = u.el('div', 'rk-desk ' + cls, body),
        s = u.svg(
          'svg',
          {
            width: 48,
            height: 46,
            viewBox: '0 0 48 46',
            stroke: '#303030',
            'stroke-width': 1.4,
            'stroke-linejoin': 'round',
          },
          it,
        ),
        add = (tag, a) => u.svg(tag, a, s);
      const defs = u.svg('defs', {}, s),
        gr = u.svg('linearGradient', { id: 'rk-desk-' + n, x2: 0, y2: 1 }, defs);
      for (const [offset, color] of [
        ['0', '#ecece8'],
        ['.4', '#c9cbc9'],
        ['1', '#838783'],
      ])
        u.svg('stop', { offset, 'stop-color': color }, gr);
      if (n === 'HardDisc') {
        add('path', { d: 'M3 26L7 5H40L45 26V40H3Z', fill: 'url(#rk-desk-HardDisc)' });
        add('path', { d: 'M5 24L9 8H38L42 24ZM5 28H42V37H5Z', fill: 'none', stroke: '#eee' });
        add('path', { d: 'M4 27H44M9 33H29', fill: 'none' });
        add('circle', { cx: 38, cy: 33, r: 2, fill: '#d9c998' });
      } else {
        add('path', { d: 'M8 11L13 41Q24 46 35 41L40 11', fill: 'url(#rk-desk-Waste)' });
        add('ellipse', { cx: 24, cy: 11, rx: 16, ry: 7, fill: '#bbbdb9' });
        add('ellipse', { cx: 24, cy: 11, rx: 12, ry: 4, fill: '#747771' });
        for (const x of [13, 18, 24, 30, 35])
          add('path', {
            d: `M${x} 19L${24 + (x - 24) * 0.65} 39`,
            fill: 'none',
            stroke: '#747873',
            'stroke-width': 0.8,
          });
        add('path', { d: 'M11 13L16 17M18 5L18 10M27 5L31 10M33 9L37 12', stroke: '#e5e5df', fill: 'none' });
      }
      u.el('span', '', it, n);
    }
    const dlg = u.el('div', 'rk-dialog', body),
      tb = u.el('div', 'rk-title', dlg);
    u.el('span', '', tb, 'Mouse Skills');
    const endRng = ctx.rng.fork('chrome/end'),
      defaultEnd = endRng.bool(0.5);
    const placement = defaultEnd ? 'footer' : endRng.pick(['title', 'menu']);
    const bank =
      ctx.content && Array.isArray(ctx.content.END_LABELS)
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
    const labelValue = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
    const endLabel = defaultEnd ? 'Submit' : labelValue(endRng.pick(bank));
    const collideRng = ctx.rng.fork('chrome/collide');
    let collide = null;
    if (!ctx.finish && collideRng.bool(0.3)) {
      const options = [...new Set(bank.map(labelValue))].filter(
        (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
      );
      if (options.length) collide = labelValue(collideRng.pick(options));
    }
    const menubarEnd = placement === 'menu' && !ctx.finish ? u.el('button', 'rk-menu-end', bar, endLabel) : null;
    if (menubarEnd) {
      bar.insertBefore(menubarEnd, bar.querySelector('.rk-clock'));
      menubarEnd.type = 'button';
      menubarEnd.onclick = () => ctx.submit();
      menubarEnd.dataset.role = 'submit';
    }
    const cl = u.el('button', 'rk-close', tb, '×');
    cl.type = 'button';
    cl.onclick = () => env.log('window-control', { label: 'close' });
    let titleEnd = null;
    if (placement === 'title' && !ctx.finish) {
      titleEnd = u.el('button', 'rk-title-end', tb, endLabel);
      titleEnd.type = 'button';
      titleEnd.dataset.role = 'submit';
      titleEnd.onclick = () => ctx.submit();
    }
    const note = u.el('section', 'rk-note task-note', dlg);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') {
      note.classList.add('instruction-panel');
      u.el('span', 'rk-panel-label', note, 'Instructions');
    }
    if (ctx.display !== 'hidden')
      instruction.style.transform = `scaleX(${Math.min(1, (note.clientWidth - 36) / instruction.scrollWidth)})`;
    const stage = u.el('main', 'stage rk-stage', dlg);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'rk-footer', dlg);
    const clr = u.el('button', 'rk-btn rk-clear', footer, 'Clear');
    clr.type = 'button';
    clr.onclick = () => {
      env.widgetDef.clear?.();
    };
    let submit = ctx.finish ? null : titleEnd || menubarEnd || null;
    if (!ctx.finish) {
      if (collide) {
        const d = u.el('button', 'rk-xtra', footer, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      if (placement === 'footer') {
        const w = u.el('span', 'rk-default', footer);
        submit = u.el('button', 'rk-btn submit', w, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
      }
    }
    env.timeText = document.createElement('span');
    return { stage, submit };
  }
  env.site({
    name: 'design-draw-shape-trace-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
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
        'frame.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            return risc(ctx);
            const u = ctx.util,
              body = document.body;
            Object.assign(_c, { body, u });
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
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
        'frame.15': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            u.el('h2', 'ov-title', note, 'Task Overview');
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frame.19': (base, S) =>
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
        'frame.22': (base, S) =>
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
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.27': (base, S) =>
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
