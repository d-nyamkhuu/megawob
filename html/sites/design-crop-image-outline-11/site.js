// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-11',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'kinetic',
        'title': 'CROP MATCH',
        'subtitle': 'ALIGN ANY IMAGE EXACTLY',
        'foot': '\u2212      100%      +                   Move       Resize',
        'accent': '#1257ff',
        'bg': '#f5f7fa',
        'surface': '#fff',
        'font': 'Nimbus Sans Narrow, Liberation Sans Narrow, Arial Narrow, sans-serif',
        'ob': 'survey',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              const tt = u.el('div', 'title', head);
              tt.setAttribute('aria-label', C.title);
              const logo = u.svg('svg', { viewBox: '0 0 408 90', role: 'img', 'aria-label': C.title }, tt);
              const c =
                'M36 34H23V18Q23 12 18 12Q13 12 13 18V72Q13 78 18 78Q23 78 23 72V57H36V72Q36 90 18 90Q0 90 0 72V18Q0 0 18 0Q36 0 36 18Z';
              for (const [x, d] of [
                [0, c],
                [
                  43,
                  'M0 90V0H19Q37 0 37 18V35Q37 48 27 51L40 90H26L14 53H13V90ZM13 12V41H19Q24 41 24 34V19Q24 12 19 12Z',
                ],
                [
                  87,
                  'M0 18Q0 0 18 0Q36 0 36 18V72Q36 90 18 90Q0 90 0 72ZM13 18V72Q13 78 18 78Q23 78 23 72V18Q23 12 18 12Q13 12 13 18Z',
                ],
                [130, 'M0 90V0H19Q37 0 37 18V35Q37 53 19 53H13V90ZM13 12V41H19Q24 41 24 34V19Q24 12 19 12Z'],
              ])
                u.svg(
                  'path',
                  { d, transform: 'translate(' + x + ' 0)', fill: '#fafbfd', 'fill-rule': 'evenodd' },
                  logo,
                );
              for (const [x, d] of [
                [190, 'M0 90V0H15L22 53L29 0H44V90H32V28L26 90H17L11 28V90Z'],
                [240, 'M0 90L14 0H31L45 90H31L28 69H15L12 90ZM17 56H26L21.5 20Z'],
                [283, 'M0 0H40V13H27V90H13V13H0Z'],
                [328, c],
                [371, 'M0 0H13V37H24V0H37V90H24V50H13V90H0Z'],
              ])
                u.svg(
                  'path',
                  { d, transform: 'translate(' + x + ' 0)', fill: '#1257ff', 'fill-rule': 'evenodd' },
                  logo,
                );
            }
            if (C.subtitle) u.el('div', 'subtitle', head, 'ALIGN\nANY IMAGE\nEXACTLY');
            {
              const meta = u.el('div', 'imgmeta', head);
              u.el('small', '', meta, 'IMAGE');
              const nv = u.el('div', '', meta);
              nv.appendChild(document.createTextNode('01 / '));
              u.el('span', 't2', nv, '01');
            }
          },
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' || C.theme === 'kinetic' ? 'TASK' : '');
          },
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
            const { content, ctx, u } = _c;
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
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const fc = u.el('div', 'footer-copy', footer);
            {
              const mk = (t, c) => {
                const b = u.el('span', 'fb ' + (c || ''), fc, t);
                return b;
              };
              mk('−', 'sq');
              mk('100%', 'zoom');
              mk('+', 'sq');
              u.el('span', 'vsep', fc);
              for (const [text, path] of [
                [
                  'Move',
                  'M12 29L4 20Q2 16 5 16L10 20V8Q10 4 13 7V17V4Q13 1 16 4V16V6Q16 3 19 6V17V9Q19 6 22 9V19V13Q25 10 26 14V25Q25 31 20 32H16Z',
                ],
                ['Resize', 'M8 2V24H30M2 8H24V30M8 8H24'],
              ]) {
                const b = mk('', text === 'Move' ? 'tool sel' : 'tool');
                const icon = u.svg(
                  'svg',
                  {
                    viewBox: '0 0 34 34',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2.3,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  b,
                );
                u.svg('path', { d: path }, icon);
                u.el('span', '', b, text);
              }
            }
            Object.assign(_c, { fc });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const parent =
                (C.layout === 'three' || C.layout === 'material-twin' || C.layout === 'margin') && _c.aside
                  ? _c.aside
                  : footer;
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const bank = Array.isArray(ctx.content && ctx.content.END_LABELS)
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const endLabels = bank.map(labelOf);
              let placement = 'footer',
                label = 'Submit';
              if (!er.bool(0.5)) {
                placement = er.pick(['link', 'icon']);
                label = er.pick(endLabels);
              }
              let collision = null;
              if (cr.bool(0.3)) {
                const choices = [...new Set(endLabels)].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (choices.length) collision = cr.pick(choices);
              }
              const action = u.el('div', 'kinetic-actions', parent);
              const decoyBtn = (text, collides) => {
                const b = u.el('button', 'kinetic-xtra', action, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
              };
              if (collision) decoyBtn(collision, true);
              if (placement === 'link') {
                _c.submit = u.el('a', 'submit kinetic-link', action, label + ' ›');
                _c.submit.href = '#';
                _c.submit.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
              } else {
                _c.submit = u.el(
                  'button',
                  'submit' + (placement === 'icon' ? ' kinetic-icon' : ''),
                  action,
                  placement === 'icon' ? '✓' : label,
                );
                _c.submit.type = 'button';
                _c.submit.onclick = () => ctx.submit();
              }
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
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
            if (C.theme === 'kinetic' && _c.submit) {
              const rs = u.el('button', 'kreset', footer, 'Reset');
              rs.type = 'button';
              rs.onclick = () => env.log('reset-control');
              footer.insertBefore(rs, _c.submit.parentNode);
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
              _c.title = 'Stay in the loop';
              _c.text = 'Get occasional tips, practice problems, and feature updates.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'survey') {
              _c.title = 'Quick survey';
              _c.text = 'This short survey is about your experience with this tool.';
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
        'overlay.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, o, u } = _c;
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
            } else {
              u.el('p', '', box, _c.text);
              if (o === 'survey') {
                const form = u.el('div', 'survey-form', box);
                {
                  const sec = u.el('fieldset', '', form);
                  u.el('legend', '', sec, 'How easy was this task so far?');
                  for (const value of ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult']) {
                    const label = u.el('label', 'survey-choice', sec);
                    const input = u.el('input', '', label);
                    input.type = 'radio';
                    input.name = 'survey-0';
                    input.value = value;
                    u.el('span', '', label, value);
                  }
                }
                u.el('div', 'survey-q2', form, 'What did you like most?');
                const sel = u.el('details', 'survey-select', form);
                const summary = u.el('summary', '', sel);
                u.el('span', '', summary, 'Select an option');
                const chevron = u.svg(
                  'svg',
                  {
                    viewBox: '0 0 18 16',
                    width: 18,
                    height: 16,
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2.2,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  summary,
                );
                u.svg('path', { d: 'M3 5L9 11L15 5' }, chevron);
                const extra = u.el('div', 'survey-extra', sel);
                for (const [i, q] of [
                  '2. Did you understand the instructions?',
                  '3. Would you use this training again?',
                ].entries()) {
                  const sec = u.el('fieldset', '', extra);
                  u.el('legend', '', sec, q);
                  for (const value of ['Yes', 'No', 'Not sure']) {
                    const label = u.el('label', 'survey-choice', sec);
                    const input = u.el('input', '', label);
                    input.type = 'radio';
                    input.name = 'survey-' + (i + 1);
                    input.value = value;
                    u.el('span', '', label, value);
                  }
                }
                u.el('p', '', extra, 'Comments (optional)');
                u.el('textarea', 'survey-comment', extra);
                const send = u.el('button', 'survey-send', extra, 'Submit feedback');
                send.type = 'button';
                send.onclick = () => ctx.dismiss('feedback');
                const xb = u.el('button', 'survey-x', box, '×');
                xb.type = 'button';
                xb.onclick = () => ctx.dismiss('close');
              }
            }
          },
      },
    },
  });
})();
