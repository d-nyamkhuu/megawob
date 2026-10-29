(function () {
  'use strict';
  const C = {
    'layout': 'split-level',
    'theme': 'vista',
    'title': 'Path Tracer',
    'menu': 'File    Edit    View    Tools    Help',
    'foot': '',
    'accent': '#2685dd',
    'bg': '#d8e8f6',
    'surface': '#fff',
    'font': 'Arial, sans-serif',
    'ob': 'tips',
  };
  function macFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'mac';
    for (const [k, v] of Object.entries({
      bg: '#f0f0f0',
      panel: '#ffffff',
      fg: '#000000',
      muted: '#666666',
      line: '#d0d0d0',
      accent: '#2f7bf2',
    }))
      document.documentElement.style.setProperty('--' + k, v);
    const pos = (el, l, t, w, h) => {
      el.style.left = l + '%';
      el.style.top = t + '%';
      if (w != null) el.style.width = w + '%';
      if (h != null) el.style.height = h + '%';
      return el;
    };
    const bg = u.el('div', 'mac-desk', body);
    for (const area of [
      'left',
      'top',
      'right-top',
      'right-bottom',
      'edge',
      'bottom',
      'foot-left',
      'foot-right',
      'under-dock',
    ])
      u.el('div', 'wall-' + area, bg);
    const mb = u.el('div', 'mac-menubar', body);
    const ap = u.svg('svg', { class: 'mac-apple', width: 16, height: 18, viewBox: '0 0 16 18' }, mb);
    u.svg(
      'path',
      {
        d: 'M8 5C6 3.5 2 4.5 2 9C2 13 5 17 7 16.5C7.8 16.2 8.2 16.2 9 16.5C11 17 14 13 14 10C12 9.500 11.500 6 13.500 5C11.500 3.500 9.500 4 8 5ZM8.500 4C8.500 2 9.500 1 11 0.500C11 2 10 3.500 8.500 4Z',
        fill: '#222',
      },
      ap,
    );
    u.el('b', '', mb, 'Finder');
    for (const t of ['File', 'Edit', 'View', 'Go', 'Window', 'Help']) u.el('span', '', mb, t);
    const tr = u.el('div', 'mac-status', mb);
    {
      const ic = (w, kids) => {
        const s = u.svg('svg', { width: w, height: 14, viewBox: '0 0 ' + w + ' 14' }, tr);
        for (const [t, a] of kids) u.svg(t, a, s);
      };
      ic(18, [
        ['path', { d: 'M1 3Q9 -3 17 3M3 6Q9 1 15 6M5 9Q9 5 13 9', fill: 'none', stroke: '#222', 'stroke-width': 1.4 }],
        ['circle', { cx: 9, cy: 12, r: 1.3, fill: '#222' }],
      ]);
      ic(18, [
        ['path', { d: 'M1 5H4L9 1V13L4 9H1Z', fill: '#222' }],
        ['path', { d: 'M11 4Q14 7 11 10M13 2Q18 7 13 12', fill: 'none', stroke: '#222', 'stroke-width': 1.3 }],
      ]);
      ic(28, [
        ['rect', { x: 1, y: 3, width: 22, height: 9, rx: 2, fill: 'none', stroke: '#222', 'stroke-width': 1.2 }],
        ['rect', { x: 3, y: 5, width: 18, height: 5, fill: '#222' }],
        ['rect', { x: 24, y: 6, width: 2, height: 3, fill: '#222' }],
      ]);
    }
    u.el('span', '', tr, 'Mon 10:24 AM');
    {
      const s = u.svg('svg', { width: 16, height: 14, viewBox: '0 0 16 14' }, tr);
      u.svg('circle', { cx: 6, cy: 6, r: 4.5, fill: 'none', stroke: '#222', 'stroke-width': 1.6 }, s);
      u.svg('path', { d: 'M9.500 9.500L14 13', stroke: '#222', 'stroke-width': 1.8 }, s);
      const l = u.svg('svg', { width: 18, height: 14, viewBox: '0 0 18 14' }, tr);
      u.svg('path', { d: 'M1 2H3M5 2H17M1 7H3M5 7H17M1 12H3M5 12H17', stroke: '#222', 'stroke-width': 2 }, l);
    }
    const win = pos(u.el('div', 'mac-win', body), 3.23, 7.76, 68.8, 77.6);
    const tb = u.el('div', 'mac-title', win);
    const lights = u.el('div', 'mac-lights', tb);
    for (const c of ['#fc5f57', '#fdbc2e', '#28c840']) u.el('i', '', lights).style.background = c;
    u.el('span', '', tb, 'Drawing Task');
    const note = u.el('section', 'task-note mac-note', win);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') {
      note.classList.add('instruction-panel');
      const title = u.el('div', 'mac-instruction-title', note, 'Task');
      note.insertBefore(title, instruction);
    }
    const stage = u.el('main', 'mac-stage', win);
    stage.dataset.role = 'stage';
    const side = u.el('aside', 'mac-side', win);
    u.el('div', 'mac-lab', side, 'Tool');
    const pb = u.el('button', 'mac-pencil', side);
    pb.type = 'button';
    const pi = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 34 34' }, pb);
    u.svg('path', { d: 'M3 32L6 22L24 4L30 10L12 28Z', fill: '#594438' }, pi);
    u.svg('path', { d: 'M6 22L9 25L27 7L24 4Z', fill: '#947362' }, pi);
    u.svg('path', { d: 'M3 32L6 22L12 28Z', fill: '#dcb195' }, pi);
    u.svg('path', { d: 'M3 32L4.5 27L8 30Z', fill: '#1c1c1c' }, pi);
    u.svg('path', { d: 'M24 4L27 1L33 7L30 10Z', fill: '#25282b' }, pi);
    u.svg('path', { d: 'M24 4L30 10', stroke: '#c4c4c4', 'stroke-width': 1 }, pi);
    u.el('span', '', pb, 'Freehand Pencil');
    u.el('div', 'mac-lab mac-lab2', side, 'Line Color');
    u.el('div', 'mac-swatch', side);
    const clr = u.el('button', 'mac-clear', side, 'Clear');
    clr.type = 'button';
    clr.onclick = () => {
      env.widgetDef.clear?.();
    };
    const endR = ctx.rng.fork('chrome/end'),
      collideR = ctx.rng.fork('chrome/collide');
    const endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
    const referenceEnd = endR.bool(0.5),
      placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
    const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
    let submit = null;
    if (!ctx.finish) {
      submit = u.el(
        'button',
        'submit mac-submit' + (placement === 'footer' ? '' : ' mac-submit-' + placement),
        placement === 'header' ? tb : win,
        endLabel,
      );
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.onclick = () => ctx.submit();
    }
    let decoy = null;
    if (collideR.bool(0.3)) {
      const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      if (options.length) {
        const label = collideR.pick(options);
        decoy = u.el(
          'button',
          'mac-clear mac-end-xtra' + (!ctx.finish && placement === 'link' ? ' mac-end-xtra-right' : ''),
          win,
          label,
        );
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
    }
    if (!ctx.finish || decoy) u.el('div', 'mac-sep', win);
    const tips = pos(u.el('div', 'mac-win mac-tips', body), 72.6, 38.8, 24.7, 28.9);
    const tt = u.el('div', 'mac-title', tips);
    const l2 = u.el('div', 'mac-lights', tt);
    for (const c of ['#fc5f57', '#fdbc2e', '#28c840']) u.el('i', '', l2).style.background = c;
    u.el('span', '', tt, 'Tips');
    const tc = u.el('div', 'mac-tipbody', tips);
    u.el('h4', '', tc, 'How to draw');
    const ol = u.el('ol', '', tc);
    for (const t of [
      'Press and hold the mouse button.',
      'Draw a single straight line from one dot to the other.',
      'Release the mouse button when finished.',
    ])
      u.el('li', '', ol, t);
    const dock = u.el('div', 'mac-dock', body),
      iconBoxes = [
        [279, 862, 61, 66],
        [351, 858, 69, 70],
        [430, 858, 66, 70],
        [507, 858, 60, 71],
        [583, 857, 66, 72],
        [660, 857, 61, 72],
        [735, 857, 61, 72],
        [810, 858, 68, 71],
        [885, 858, 69, 71],
        [962, 858, 66, 71],
        [1040, 858, 70, 71],
        [1117, 858, 69, 71],
        [1192, 858, 71, 71],
        [1328, 857, 62, 72],
      ];
    for (let i = 0; i < 14; i++) {
      if (i === 13) u.el('em', '', dock);
      const icon = u.el('img', 'mac-dock-icon mac-icon-' + i, dock);
      icon.src = 'sites/design-draw-shape-line-09/assets/dock-' + i + '.webp';
      icon.alt = '';
      const [x, y, w, h] = iconBoxes[i];
      icon.style.cssText = `left:${((x - 266) / 1140) * 100}%;top:${((y - 848) / 93) * 100}%;width:${(w / 1140) * 100}%;height:${(h / 93) * 100}%;`;
    }
    u.el('span', 'mac-dock-active', dock);
    return { stage, submit };
  }
  env.site({
    name: 'design-draw-shape-line-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      return macFrame(ctx);
    },
    oldFrame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: C.theme === 'developer' ? '#eff4ff' : '#111820',
        muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
        line: C.theme === 'developer' ? '#283544' : '#c9cfd5',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['−', '□', '×']) {
          const bt = u.el('button', '', controls, label);
          bt.type = 'button';
          bt.onclick = () => env.log('window-control', { label });
        }
      }
      if (C.title) {
        const ic = u.svg('svg', { class: 'app-icon', width: 24, height: 24, viewBox: '0 0 24 24' }, head);
        u.svg(
          'rect',
          { x: 1, y: 1, width: 22, height: 22, rx: 5, fill: '#3d8fe6', stroke: '#e8f3ff', 'stroke-width': 1.5 },
          ic,
        );
        u.svg(
          'path',
          { d: 'M7 17Q9 7 15 9L17 6', fill: 'none', stroke: '#fff', 'stroke-width': 2.2, 'stroke-linecap': 'round' },
          ic,
        );
      }
      if (C.title) u.el('div', 'title', head, C.title);
      if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
      if (C.menu) u.el('nav', 'menu', head, C.menu);
      if (C.ribbon) {
        const rib = u.el('div', 'ribbon', head);
        const tool = (parent, name, path) => {
          const bt = u.el('button', 'tool', parent);
          bt.type = 'button';
          const icon = u.svg(
            'svg',
            { width: 32, height: 34, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 },
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
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
      u.el('h2', 'ov-title', note, 'Task Overview');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
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
      if (C.theme === 'minimal') {
        const steps = u.el('ol', 'steps', note);
        for (const text of [
          'Drag the shape from its current position.',
          'Drop it inside the rectangular box.',
          'The shape must fit fully inside the box.',
        ])
          u.el('li', '', steps, text);
        u.el('h3', '', note, 'Notes');
        u.el(
          'p',
          'brief-copy',
          note,
          'Use your mouse or trackpad (pointer) to move the shape. Do not resize the shape.',
        );
      }
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
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
      stage.dataset.role = 'stage';
      let aside = null;
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
        aside = u.el('aside', 'aside', content);
        if (C.tabs) {
          aside.classList.add('tabs');
          for (const text of C.tabs) {
            const bt = u.el('button', 'tab', aside, text);
            bt.type = 'button';
            bt.onclick = () => {
              aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
              bt.classList.add('active');
            };
          }
        } else if (C.layout === 'sheet') {
          for (let i = 1; i <= 20; i++) u.el('div', 'index-number', aside, String(i));
        } else if (C.layout === 'offset') {
          for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', aside, text);
        } else {
          u.el('h3', '', aside, C.aside || 'Instructions');
          if (C.aside === 'Your Answer') {
            u.el('p', '', aside, 'No point selected yet.');
            u.el('hr', '', aside);
            u.el('p', '', aside, 'X:    —');
            u.el('p', '', aside, 'Y:    —');
          } else if (C.aside === 'Progress') {
            u.el('p', '', aside, 'Problem 1 of 5');
            u.el('progress', '', aside).value = 0.2;
            u.el('h3', '', aside, 'Tips');
            u.el('p', '', aside, 'Click outside the dotted circle.');
          } else if (C.layout === 'windows') u.el('p', '', aside, ctx.instruction);
          else if (C.theme === 'community') {
            u.el('p', '', aside, 'Freehand Drawing (Click and drag to draw.)');
            u.el('h3', '', aside, 'Tips');
            const list = u.el('ul', '', aside);
            for (const t of [
              'Click and drag to draw a single continuous circle.',
              'Try to make a smooth circle.',
              'Release to finish the circle.',
              'The hollow dot must be on the circle’s edge.',
            ])
              u.el('li', '', list, t);
            u.el('h3', '', aside, 'Community Corner');
            for (const t of [
              'Welcome, Neighbor!',
              'Sign My Guestbook',
              'View Recent Updates',
              'Our Little Town',
              'Helpful Links',
            ]) {
              const a = u.el('a', 'community-link', aside, t);
              a.href = '#';
              a.onclick = (ev) => ev.preventDefault();
            }
          } else if (C.disabled) {
            const tools = u.el('div', 'actual-tools', aside);
            for (const text of ['Add point', 'Remove point', 'Clear all']) {
              const bt = u.el('button', '', tools, text);
              bt.onclick = () => {
                if (text !== 'Add point') env.widgetDef.clear?.();
              };
            }
            u.el('h3', '', aside, 'Quick action');
            const shortcut = u.el('button', 'disabled-shortcut', aside, 'Auto-find center (disabled)');
            shortcut.disabled = true;
            u.el('p', '', aside, 'This shortcut is not available for this exercise.');
            u.el('h3', '', aside, 'Status');
            u.el('p', '', aside, 'No points placed yet.');
          } else if (C.collapsed) {
            for (const t of [
              'Show labels: A, B, V',
              'Point style: ●',
              'Line style: ━',
              'Grid: Show grid',
              'Snap to grid: Enabled',
            ]) {
              const l = u.el('label', 'preference', aside, t);
              const check = u.el('input', '', l);
              check.type = 'checkbox';
              check.checked = t.startsWith('Show labels');
            }
          } else if (C.theme === 'crop-minimal') u.el('p', '', aside, 'Drag the handles to resize the crop box.');
          else if (C.layout === 'palette') {
            const ol = u.el('ol', 'guide', aside);
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
      u.el('div', 'footer-copy', footer, C.foot || '');
      let submit = null;
      if (!ctx.finish) {
        const parent =
          (C.layout === 'three' || C.layout === 'material-twin' || C.layout === 'margin') && aside ? aside : footer;
        submit = u.el('button', 'submit', parent, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
        if (C.collapsed) {
          const show = u.el('button', 'show-controls', parent, 'Show controls');
          show.type = 'button';
          show.onclick = () => {
            show.classList.add('revealed');
            show.textContent = 'Task controls';
            submit.style.visibility = 'visible';
          };
          submit.style.visibility = 'hidden';
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
      if (C.theme === 'eink') {
        const points = u.el('span', 'points', footer, 'Points: 0/1');
        footer.insertBefore(points, submit);
        const clear = u.el('button', 'clear', footer, 'Clear');
        clear.onclick = () => {
          env.widgetDef.clear?.();
        };
      }
      if (['aqua', 'collage'].includes(C.theme)) {
        const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
        reset.onclick = () => env.widgetDef.clear?.();
        if (submit) footer.insertBefore(reset, submit);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      let title, text, label;
      const o = C.ob;
      if (o === 'update') {
        title = 'A new version is available';
        text = 'Get the latest features and security fixes.';
        label = 'Remind me later';
      } else if (o === 'privacy') {
        title = 'We’d like your consent';
        text =
          'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
        label = 'Reject optional';
      } else if (o === 'tips') {
        title = 'How to draw';
        text = 'Press and hold the mouse button. Draw one continuous stroke, then release when finished.';
        label = 'Close';
      } else if (o === 'newsletter') {
        title = 'Product Updates Newsletter';
        text = 'Get occasional updates about new features and tips.';
        label = 'Close';
      } else if (o === 'notifications') {
        title = 'Notifications (5)';
        text = 'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
        label = 'Dismiss all';
      } else if (o === 'survey') {
        title = 'Quick Survey';
        text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
        label = 'Close survey';
      } else {
        title = {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind];
        text = {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind];
        label = kind === 'cookie' ? 'Reject optional' : 'Close';
      }
      u.el('h3', '', box, title);
      if (o === 'notifications') {
        const notifications = u.el('div', 'notifications', box);
        for (const [name, body] of C.theme === 'bitmap'
          ? [
              ['Software Update Available', 'A new version is ready.'],
              ['Disk Almost Full', 'You have 12 MB remaining.'],
              ['Tip of the Day', 'Organize your files faster.'],
              ['Welcome to Shape Sorter', 'Learn how to play.'],
              ['Reminder', 'Back up your disk.'],
            ]
          : [
              ['New message', 'You have a new message from Alex.'],
              ['Weekly digest', 'Your summary is ready to view.'],
              ['Product update', 'Check out what’s new this week.'],
              ['Event reminder', 'Design sync starts in 1 hour.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          u.el('p', '', card, body);
          const x = u.el('button', 'notification-x', card, '×');
          x.onclick = () => card.remove();
        }
      } else u.el('p', '', box, text);
      if (o === 'tips') {
        const label = u.el('label', 'tip-option', box);
        const input = u.el('input', '', label);
        input.type = 'checkbox';
        u.el('span', '', label, 'Do not show again');
      }
      const dismiss = u.el('button', 'dismiss', box, label);
      if (o === 'privacy' || o === 'newsletter') {
        const icon = u.svg(
          'svg',
          {
            class: 'ob-icon',
            width: 64,
            height: 64,
            viewBox: '0 0 64 64',
            fill: 'none',
            stroke: C.accent,
            'stroke-width': 3,
          },
          box,
        );
        u.svg(
          'path',
          {
            d:
              o === 'newsletter'
                ? 'M8 14H56V50H8ZM8 14L32 34L56 14'
                : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
          },
          icon,
        );
      }
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
      if (o === 'privacy' || (kind === 'cookie' && !o)) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
