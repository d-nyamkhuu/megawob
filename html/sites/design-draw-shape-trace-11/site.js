// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-11',
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
        'font': "'Segoe UI', Tahoma, Arial, sans-serif",
        'ob': 'newsletter',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              const ic = u.svg('svg', { class: 'app-icon', width: 26, height: 26, viewBox: '0 0 26 26' }, head);
              const defs = u.svg('defs', {}, ic),
                gl = u.svg(
                  'linearGradient',
                  { id: 'path-tracer-icon-glass', x1: '0', y1: '0', x2: '0', y2: '1' },
                  defs,
                );
              u.svg('stop', { offset: '0', 'stop-color': '#c1eeff' }, gl);
              u.svg('stop', { offset: '.45', 'stop-color': '#73bce8' }, gl);
              u.svg('stop', { offset: '1', 'stop-color': '#0b7bbe' }, gl);
              u.svg(
                'rect',
                {
                  x: 1,
                  y: 1,
                  width: 24,
                  height: 24,
                  rx: 5,
                  fill: 'url(#path-tracer-icon-glass)',
                  stroke: '#d7efff',
                  'stroke-width': 1,
                },
                ic,
              );
              u.svg(
                'path',
                {
                  d: 'M11 20L10 15L7 12Q6 10 8 10L11 12L9 7Q9 5 11 6L13 11L13 8Q14 7 15 9L16 12L17 10Q19 10 19 12L18 17L16 21Z',
                  fill: '#eefbff',
                  stroke: '#c4e9fa',
                  'stroke-width': 0.7,
                },
                ic,
              );
              u.svg(
                'path',
                {
                  d: 'M7 5L5 7M18 5L20 7M5 16L7 18',
                  stroke: '#fff',
                  'stroke-width': 1.3,
                  'stroke-linecap': 'round',
                  opacity: 0.8,
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
              const sv = u.svg('svg', { viewBox: '0 0 570 154', preserveAspectRatio: 'xMidYMid meet' }, ex);
              u.svg(
                'path',
                {
                  d: 'M74 60C142 35 181 9 234 42C288 70 304 160 433 85',
                  fill: 'none',
                  stroke: '#a5b1c3',
                  'stroke-width': 5,
                  'stroke-linecap': 'round',
                },
                sv,
              );
              u.svg('circle', { cx: 74, cy: 60, r: 11, fill: '#33bc49' }, sv);
              u.svg('path', { d: 'M416 77L450 77L432 105Z', fill: '#7eb4ed', 'stroke-linejoin': 'round' }, sv);
              for (const [x, y, t] of [
                [74, 91, 'Start'],
                [480, 69, 'Arrowhead'],
              ]) {
                const tx = u.svg(
                  'text',
                  { x, y, 'text-anchor': 'middle', 'font-size': 17, fill: t === 'Start' ? '#142036' : '#235996' },
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
            const { ctx, footer, th, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              endBank = ctx.content && ctx.content.END_LABELS;
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const endLabels =
              Array.isArray(endBank) && endBank.length
                ? endBank.map(labelOf)
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const endLabel = endR.bool(0.5) ? 'Submit' : endR.pick(endLabels);
            const endPlacement = endR.pick(['footer', 'footer', 'head', 'link']);
            if (!ctx.finish) {
              const parent = endPlacement === 'head' ? th : footer;
              const tag = endPlacement === 'link' ? 'a' : 'button';
              _c.submit = u.el(tag, endPlacement === 'link' ? 'submit-link submit' : 'submit', parent, endLabel);
              if (tag === 'button') _c.submit.type = 'button';
              else _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && collideR.bool(0.3)) {
              const pool = [
                ...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
              ];
              if (pool.length) {
                const decoy = u.el('button', 'end-xtra', footer, collideR.pick(pool));
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
            Object.assign(_c, { collideR, endBank, endLabel, endLabels, endPlacement, endR, labelOf });
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
            if (o === 'newsletter') {
              const icon = box.querySelector('.ob-icon');
              icon.replaceChildren();
              icon.setAttribute('viewBox', '0 0 76 56');
              const defs = u.svg('defs', {}, icon),
                gradient = u.svg(
                  'linearGradient',
                  { id: 'newsletter-envelope-glass', x1: '0', y1: '0', x2: '0', y2: '1' },
                  defs,
                );
              u.svg('stop', { offset: '0%', 'stop-color': '#ffffff' }, gradient);
              u.svg('stop', { offset: '100%', 'stop-color': '#c3d2e5' }, gradient);
              u.svg(
                'rect',
                {
                  x: 2,
                  y: 2,
                  width: 72,
                  height: 51,
                  rx: 3,
                  fill: 'url(#newsletter-envelope-glass)',
                  stroke: '#97a7bf',
                  'stroke-width': 2,
                },
                icon,
              );
              u.svg('path', { d: 'M3 52L28 27M73 52L48 27', stroke: '#acbcd0', 'stroke-width': 1.5 }, icon);
              u.svg(
                'path',
                { d: 'M3 4L34 30Q37 33 40 30L73 4', stroke: '#2389df', 'stroke-width': 4, 'stroke-linejoin': 'round' },
                icon,
              );
              u.svg('path', { d: 'M4 3L34 28Q37 31 40 28L72 3', stroke: '#a4d5ff', 'stroke-width': 1.8 }, icon);
              const x = box.querySelector('.nl-x');
              x.textContent = '';
              x.setAttribute('aria-label', 'Close newsletter');
              const xs = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, x);
              u.svg(
                'path',
                {
                  d: 'M4 4L16 16M16 4L4 16',
                  fill: 'none',
                  stroke: '#48627d',
                  'stroke-width': 2.7,
                  'stroke-linecap': 'round',
                },
                xs,
              );
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
