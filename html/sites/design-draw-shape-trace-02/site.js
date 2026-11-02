// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'tracer02',
        'theme': 'tracer02',
        'title': '',
        'menu': '',
        'foot': '',
        'accent': '#1b6bd8',
        'bg': '#eef2f7',
        'surface': '#fff',
        'font': "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        'ob': 'newsletter',
      },
      parts: {
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
            if (C.layout === 'tracer02') {
              u.el('hr', 'rule', note);
              const ol = u.el('ol', 't2-steps', note);
              for (const t of ['Click and hold on the start dot.', 'Follow the grey path.', 'Lift at the arrowhead.'])
                u.el('li', '', ol, t);
              note.prepend(u.el('h1', 't2-title', note, 'Draw the Path'));
            }
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
            const { ctx, footer, u } = _c;
            _c.endAction = null;
            _c.endMode = 'button';
            _c.endText = 'Submit';
            _c.collide = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                bank =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : [
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
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const keep = er.bool(0.5),
                submitLabel = bank.find((x) => labelOf(x).trim().toLowerCase() === 'submit');
              _c.endText = keep && submitLabel ? labelOf(submitLabel) : labelOf(er.pick(bank));
              _c.endMode = keep ? 'button' : er.pick(['button', 'link', 'icon']);
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && cr.bool(0.3)) {
              const bank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const own = _c.endText.trim().toLowerCase(),
                pool = [
                  ...new Set(
                    bank.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
                  ),
                ].filter((x) => x.trim().toLowerCase() !== own);
              if (pool.length) _c.collide = cr.pick(pool);
            }
            {
              const ns = 'http://www.w3.org/2000/svg';
              const ico = (parent, d) => {
                const s = document.createElementNS(ns, 'svg');
                s.setAttribute('viewBox', '0 0 32 32');
                s.setAttribute('width', '34');
                s.setAttribute('height', '34');
                s.setAttribute('fill', 'none');
                s.setAttribute('stroke', 'currentColor');
                s.setAttribute('stroke-width', '2.4');
                s.setAttribute('stroke-linejoin', 'round');
                s.setAttribute('stroke-linecap', 'round');
                const p = document.createElementNS(ns, 'path');
                p.setAttribute('d', d);
                s.appendChild(p);
                parent.appendChild(s);
              };
              const grp = (label) => {
                const g = u.el('div', 't2-group', footer);
                u.el('div', 't2-label', g, label);
                const row = u.el('div', 't2-row', g);
                return row;
              };
              const pick = (row, bt) => {
                row.querySelectorAll('.t2-btn').forEach((x) => x.classList.remove('on'));
                bt.classList.add('on');
              };
              const mk = (row, text, path, on) => {
                const bt = u.el('button', 't2-btn' + (on ? ' on' : ''), row);
                bt.type = 'button';
                if (path === 'thin' || path === 'medium' || path === 'thick') u.el('i', 'bar ' + path, bt);
                else ico(bt, path);
                u.el('span', '', bt, text);
                bt.onclick = () => pick(row, bt);
                return bt;
              };
              const tr = grp('Tool');
              mk(
                tr,
                'Draw',
                'M5 27L7 19L23 3Q25 1 27 3L29 5Q31 7 29 9L13 25ZM7 19L13 25M21 5L27 11M18 8L24 14M5 27L10 26',
                true,
              );
              mk(
                tr,
                'Eraser',
                'M5 17L18 4Q19 3 21 5L27 11Q28 12 27 14L14 27Q13 28 11 26L5 20Q4 19 5 17ZM14 8L23 17',
                false,
              );
              const cl = u.el('button', 't2-btn', tr);
              cl.type = 'button';
              ico(cl, 'M6 9H26M12 9V5H20V9M9 9L10 28H22L23 9M14 14V23M18 14V23');
              u.el('span', '', cl, 'Clear');
              cl.classList.add('clear');
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              u.el('div', 't2-sep', footer);
              const ls = grp('Line style');
              const dd = u.el('div', 't2-select', ls);
              u.el('i', 'line', dd);
              const ch = u.svg(
                'svg',
                {
                  width: 18,
                  height: 18,
                  viewBox: '0 0 18 18',
                  fill: 'none',
                  stroke: '#16325c',
                  'stroke-width': 2.4,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                },
                dd,
              );
              u.svg('path', { d: 'M4 7L9 12L14 7' }, ch);
              u.el('div', 't2-sep', footer);
              const th = grp('Line thickness');
              mk(th, 'Thin', 'thin', false);
              mk(th, 'Medium', 'medium', true);
              mk(th, 'Thick', 'thick', false);
              if (!ctx.finish) u.el('div', 't2-sep', footer);
            }
            if (!ctx.finish) {
              _c.endAction = u.el('div', 't2-end-actions', footer);
              if (_c.endMode === 'link') {
                _c.submit = u.el('a', 'submit t2-end-link', _c.endAction, _c.endText + ' ›');
                _c.submit.href = '#';
              } else if (_c.endMode === 'icon') {
                _c.submit = u.el('button', 'submit t2-end-icon', _c.endAction, '✓');
                _c.submit.type = 'button';
                _c.submit.setAttribute('aria-label', _c.endText);
                _c.submit.title = _c.endText;
              } else {
                _c.submit = u.el('button', 'submit', _c.endAction, _c.endText);
                _c.submit.type = 'button';
              }
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = (ev) => {
                ev.preventDefault();
                ctx.submit();
              };
              if (_c.collide) {
                const dec = u.el('button', 't2-xtra', _c.endAction, _c.collide);
                dec.type = 'button';
                dec.dataset.role = 'xtra';
                dec.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
              }
            }
            Object.assign(_c, { cr });
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
