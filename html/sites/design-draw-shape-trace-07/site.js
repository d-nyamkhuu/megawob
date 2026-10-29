// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-07',
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
              body.className = 'design vista kb' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
              const root = document.documentElement;
              for (const [k, v] of Object.entries({
                bg: '#fcfcfd',
                panel: '#fcfcfd',
                fg: '#232629',
                muted: '#5c6670',
                line: '#d5d9de',
                accent: '#1d7fe8',
              }))
                root.style.setProperty('--' + k, v);
              root.style.setProperty('--font', '"Noto Sans","Open Sans","Segoe UI",Arial,sans-serif');
              const win = u.el('div', 'kb-win', body);
              const tb = u.el('div', 'kb-title', win);
              const ic = u.svg('svg', { class: 'kb-icon', width: 20, height: 20, viewBox: '0 0 20 20' }, tb);
              u.svg('rect', { x: 1, y: 1, width: 18, height: 18, rx: 3, fill: '#3d9be9', stroke: '#80b9df' }, ic);
              u.svg('rect', { x: 4, y: 4, width: 12, height: 12, rx: 1, fill: '#e8f3ff' }, ic);
              u.svg(
                'path',
                { d: 'M6 5V15M8 5L10 15M12 5V15M14 5V15', fill: 'none', stroke: '#89bde1', 'stroke-width': 0.7 },
                ic,
              );
              u.el('div', 'kb-title-text', tb, 'Mouse Path Challenge');
              const wc = u.el('div', 'kb-wc', tb);
              const mk = (d) => {
                const b = u.el('span', 'kb-wb', wc);
                const s = u.svg('svg', { width: 14, height: 14, viewBox: '0 0 14 14' }, b);
                u.svg('path', { d, fill: 'none', stroke: '#2a2e32', 'stroke-width': 1.5 }, s);
              };
              mk('M2 7H12');
              mk('M2.5 2.5H11.5V11.5H2.5Z');
              mk('M2 2L12 12M12 2L2 12');
              const mn = u.el('nav', 'kb-menu', win);
              for (const t of ['File', 'Edit', 'Help']) u.el('span', '', mn, t);
              let submit = null;
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const er = ctx.rng.fork('chrome/end'),
                placeR = ctx.rng.fork('chrome/placement');
              const placement = ctx.finish ? null : placeR.pick(['side', 'side', 'menu', 'status']);
              const label = er.int(0, 1) ? 'Submit' : labelOf(er.pick(labels));
              const cr = ctx.rng.fork('chrome/collide');
              let collide = null;
              if (!ctx.finish && cr.bool(0.3)) {
                const options = [...new Set(labels.map(labelOf))].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (options.length) collide = cr.pick(options);
              }
              const dr = ctx.rng.fork('chrome/decoy');
              const fillers =
                ctx.content && Array.isArray(ctx.content.DECOY_LABELS)
                  ? ctx.content.DECOY_LABELS
                  : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view', 'Share', 'Export', 'History'];
              const filler = dr.bool(0.22) ? labelOf(dr.pick(fillers)) : null;
              const decoy = (parent, text, isCollide) => {
                const b = u.el('button', 'kb-episode-xtra', parent, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', isCollide ? { label: text, collide: true } : { label: text });
              };
              const end = (parent, cls, text) => {
                const b = u.el('button', cls, parent, text);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => ctx.submit();
                return b;
              };
              const menuTools = u.el('div', 'kb-episode-tools', mn);
              if (filler && placement !== 'menu') decoy(menuTools, filler, false);
              if (collide && placement === 'menu') decoy(menuTools, collide, true);
              if (placement === 'menu') submit = end(menuTools, 'kb-episode-end', label);
              const main = u.el('div', 'kb-main', win);
              const left = u.el('div', 'kb-left', main);
              const head = u.el('h1', 'kb-head', left, ctx.instruction);
              if (ctx.display === 'hidden' || ctx.display === 'panel') head.hidden = true;
              if (ctx.display === 'toast') {
                head.classList.add('kb-head-toast');
                const x = u.el('button', 'note-close', head, '×');
                x.type = 'button';
                x.setAttribute('aria-label', 'Close task note');
                x.onclick = () => (head.style.visibility = 'hidden');
              }
              const stage = u.el('main', 'stage kb-stage', left);
              stage.dataset.role = 'stage';
              const side = u.el('aside', 'kb-side', main);
              const note = u.el('section', 'task-note kb-note', side);
              u.el('h3', '', note, 'Task');
              u.el('p', '', note, ctx.instruction);
              if (ctx.display === 'hidden' || ctx.display === 'header' || ctx.display === 'toast') note.hidden = true;
              u.el('hr', '', side);
              u.el('h3', '', side, 'Progress');
              const pr = u.el('div', 'kb-prog', side);
              u.el('div', 'kb-bar', pr);
              u.el('span', '', pr, '0%');
              u.el('hr', '', side);
              u.el('h3', '', side, 'Controls');
              const clr = u.el('button', 'kb-clear', side);
              clr.type = 'button';
              const cs = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26' }, clr);
              u.svg(
                'path',
                {
                  d: 'M4 8A11 11 0 1 1 2.5 13M4 3V8H9',
                  fill: 'none',
                  stroke: '#202d3b',
                  'stroke-width': 2,
                  'stroke-linejoin': 'round',
                },
                cs,
              );
              u.el('span', '', clr, 'Clear Path');
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              u.el('div', 'kb-grow', side);
              if (placement === 'side') submit = end(side, 'submit kb-submit', label);
              if (filler && placement === 'side') decoy(side, filler, false);
              if (collide && placement === 'side') decoy(side, collide, true);
              const st = u.el('div', 'kb-status', win);
              u.el('span', '', st, 'Ready');
              const statusRight = u.el('div', 'kb-status-right', st);
              u.el('span', '', statusRight, 'Pointer:  (not tracing)');
              if (placement === 'status') submit = end(statusRight, 'kb-status-end', label);
              if (filler && placement === 'status') decoy(statusRight, filler, false);
              if (collide && placement === 'status') decoy(statusRight, collide, true);
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
