// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-circle-04',
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
            {
              const u = ctx.util,
                body = document.body;
              body.className = 'design sk';
              const rt = document.documentElement;
              for (const [k, v] of Object.entries({
                bg: '#1e1428',
                panel: '#21172d',
                fg: '#f4eefa',
                muted: '#a99bbd',
                line: '#3a2d4a',
                accent: '#ff6b6b',
                dot: '#ff6b6b',
                font: '"Segoe UI Variable","Segoe UI","DIN Alternate","Bahnschrift",system-ui,sans-serif',
              }))
                rt.style.setProperty('--' + k, v);
              const ic = (parent, d, w) => {
                const s = u.svg(
                  'svg',
                  {
                    width: w || 30,
                    height: w || 30,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.6,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  parent,
                );
                u.svg('path', { d }, s);
                return s;
              };
              const PEN = 'M3 21l2-6L17 3q1-1 2 0l2 2q1 1 0 2L9 19zM5 15l4 4M15 5l4 4M3 21l6-2';
              const BIN = 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6';
              const shell = u.el('div', 'sk-shell', body);
              const tb = u.el('header', 'sk-title', shell);
              const ai = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22' }, tb);
              u.svg('rect', { x: 1, y: 1, width: 20, height: 20, rx: 4, fill: '#efbbb7' }, ai);
              u.svg(
                'path',
                {
                  d: 'M6 16l3-5 2 2 5-7M9 11l2-5M10 14l5-2M13 8l3 2',
                  fill: 'none',
                  stroke: '#3a1830',
                  'stroke-width': 1.2,
                  'stroke-linecap': 'round',
                },
                ai,
              );
              u.el('span', 'sk-app', tb, 'Sketch Task');
              const wc = u.el('div', 'sk-wc', tb);
              for (const [t, d] of [
                ['min', 'M2 8h12'],
                ['max', 'M3 3h10v10H3z'],
                ['close', 'M3 3l10 10M13 3L3 13'],
              ]) {
                const b = u.el('button', '', wc);
                b.type = 'button';
                const s = u.svg(
                  'svg',
                  {
                    width: 16,
                    height: 16,
                    viewBox: '0 0 16 16',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.3,
                  },
                  b,
                );
                u.svg('path', { d }, s);
                b.onclick = () => env.log('window-control', { label: t });
              }
              const rail = u.el('nav', 'sk-rail', shell);
              const ri = (cls, d, label) => {
                const b = u.el('button', 'sk-ri ' + cls, rail);
                b.type = 'button';
                ic(b, d, 34);
                u.el('span', '', b, label);
                return b;
              };
              const dr = ri('on', PEN, 'Draw');
              const cl = ri('', BIN, 'Clear');
              cl.onclick = () => env.widgetDef.clear?.();
              const st = ri(
                'sk-set',
                'M12 9a3 3 0 100 6 3 3 0 000-6zM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2L9 3 6 4l.5 2L5 7.5 3 7l-1 3 2 1v2l-2 1 1 3 2-.5L6.5 18l-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z',
                'Settings',
              );
              const main = u.el('section', 'sk-main', shell);
              const note = u.el('div', 'task-note sk-note', main);
              u.el('div', 'instruction', note, ctx.instruction);
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') {
                note.classList.add('instruction-toast');
                const x = u.el('button', 'note-close', note, '×');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
              const stage = u.el('main', 'stage', main);
              stage.dataset.role = 'stage';
              const side = u.el('aside', 'sk-side', shell);
              const p1 = u.el('div', 'sk-panel', side);
              u.el('h3', '', p1, 'Tool');
              const tbtn = u.el('div', 'sk-tool', p1);
              const pencil = ic(tbtn, PEN, 32);
              u.svg('path', { d: 'M7 14l8-8 4 4-8 8z', fill: '#ff8582', stroke: 'none' }, pencil);
              u.el('div', 'sk-tname', p1, 'Freehand Pencil');
              u.el('p', '', p1, 'Press and hold to draw a continuous stroke.');
              const p2 = u.el('div', 'sk-panel', side);
              u.el('h3', '', p2, 'Controls');
              const cb = u.el('button', 'sk-clear', p2);
              cb.type = 'button';
              ic(cb, BIN, 30);
              u.el('span', '', cb, 'Clear');
              cb.onclick = () => env.widgetDef.clear?.();
              u.el('p', '', p2, 'Clears your drawing so you can try again.');
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const endRng = ctx.rng.fork('chrome/end');
              let placement = 'dock',
                endLabel = 'Submit';
              if (!ctx.finish && !endRng.bool(0.5)) {
                placement = endRng.pick(['title', 'controls', 'controls']);
                const choices = labels.map(labelOf).filter((x) => x.toLowerCase() !== 'submit');
                if (choices.length) endLabel = endRng.pick(choices);
              }
              const makeSubmit = (parent, cls) => {
                const b = u.el('button', 'submit sk-submit ' + cls, parent, endLabel);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', endLabel);
                b.title = endLabel;
                b.onclick = () => ctx.submit();
                return b;
              };
              let submit = null;
              if (!ctx.finish && placement === 'title') {
                submit = makeSubmit(tb, 'sk-submit-title');
                tb.insertBefore(submit, wc);
              }
              if (!ctx.finish && placement === 'controls') submit = makeSubmit(p2, 'sk-submit-controls');
              if (!ctx.finish && placement === 'dock') submit = makeSubmit(side, 'sk-submit-dock');
              const collideRng = ctx.rng.fork('chrome/collide');
              if (!ctx.finish && collideRng.bool(0.3)) {
                const pool = labels
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (pool.length) {
                  const text = collideRng.pick(pool),
                    b = u.el('button', 'sk-xtra', tb, text);
                  b.type = 'button';
                  b.dataset.role = 'xtra';
                  b.onclick = () => env.log('decoy', { label: text, collide: true });
                  tb.insertBefore(b, wc);
                }
              }
              env.timeText = u.el('span', 'sk-time', tb, '');
              return { stage, submit };
            }
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
