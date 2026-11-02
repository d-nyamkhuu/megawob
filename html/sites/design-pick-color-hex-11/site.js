// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-11',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'split-level',
        'theme': 'organizer',
        'title': 'Color Match Task',
        'subtitle': 'Match the target color shown using the picker below.',
        'foot': 'Adjust the picker until the color matches the target above.',
        'accent': '#4b9136',
        'bg': '#553b2b',
        'surface': '#f5ecda',
        'font': 'Georgia, serif',
        'ob': 'update',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.subtitle)
              u.el(
                'div',
                'subtitle',
                head,
                'Match the target color shown on the right using the picker below. Drag within the color area or the hue slider to find the closest match.',
              );
            u.el(
              'p',
              'overview-italic',
              head,
              'Aim for a visually matching result. The numeric values are provided for reference.',
            );
            const binding = u.el('div', 'binding', head);
            for (let i = 0; i < 7; i++) u.el('i', 'binding-ring', binding);
            const leaf = u.svg('svg', { class: 'organizer-leaf', viewBox: '0 0 100 180' }, head);
            u.svg('path', { d: 'M91 179Q70 114 55 18', fill: 'none', stroke: '#626542', 'stroke-width': 3 }, leaf);
            for (const d of [
              'M60 95Q18 60 55 0Q88 39 60 95',
              'M75 129Q24 149 14 179Q18 115 75 129',
              'M71 111Q104 54 98 37Q121 99 71 111',
            ])
              u.svg('path', { d, fill: '#4c6036', stroke: '#697449', 'stroke-width': 1 }, leaf);
            u.svg(
              'path',
              { d: 'M56 12L60 95M27 163L75 129M97 54L71 111', stroke: '#a4a777', 'stroke-width': 1, fill: 'none' },
              leaf,
            );
            Object.assign(_c, { binding, leaf });
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'organizer') u.el('div', 'guide-copy', note, C.foot);
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, head, instruction, note, u } = _c;
            if (ctx.display === 'hidden') instruction.hidden = true;
            else if (ctx.display === 'header') {
              instruction.classList.add('header-instruction');
              head.appendChild(instruction);
            } else if (ctx.display === 'toast') {
              instruction.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', instruction, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => (instruction.style.visibility = 'hidden');
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
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
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, stage, u } = _c;
            if (C.theme === 'forum') {
              stage.append(note);
              u.el('div', 'picker-title', stage, 'Color Picker');
              u.el(
                'p',
                'picker-help',
                note,
                'Use the color area and hue slider to adjust the current color. The numbers update automatically.',
              );
            } else if (C.theme === 'organizer') {
              u.el('div', 'choose-title', stage, 'Choose a Color');
            }
            _c.aside = null;
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
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { content, ctx, footer, u } = _c;
            _c.endPlacement = null;
            _c.endText = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const common = er.bool(0.5);
              _c.endPlacement = common ? 'footer' : er.pick(['toolbar', 'link']);
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              _c.endText = common ? 'Submit' : textOf(er.pick(labels));
            }
            const makeEnd = (parent, cls, asLink = false) => {
              const b = u.el(asLink ? 'a' : 'button', cls, parent, _c.endText);
              if (asLink) {
                b.href = '#';
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
              } else {
                b.type = 'button';
                b.onclick = () => ctx.submit();
              }
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.endText);
              b.title = _c.endText;
              return b;
            };
            if (_c.endPlacement === 'footer') _c.submit = makeEnd(footer, 'submit');
            else if (_c.endPlacement === 'toolbar') _c.submit = makeEnd(content, 'submit toolbar-submit');
            else if (_c.endPlacement === 'link') _c.submit = makeEnd(footer, 'end-link', true);
            const cr = ctx.rng.fork('chrome/collide');
            if (!ctx.finish && cr.bool(0.3)) {
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS)
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const options = [...new Set(labels.map(textOf))].filter(
                (x) => x.trim().toLowerCase() !== _c.endText.trim().toLowerCase(),
              );
              if (options.length) {
                const d = u.el('button', 'end-xtra', footer, cr.pick(options));
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
              }
            }
            Object.assign(_c, { cr, makeEnd });
          },
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Version 2.4.0 includes stability improvements and bug fixes. Would you like to update now?';
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
        'overlay.11': (base, S) =>
          function (_c) {
            const { box, ctx, o, u } = _c;
            if (o === 'update') {
              const close = u.el('button', 'overlay-close', box, '×');
              close.type = 'button';
              close.onclick = () => ctx.dismiss('close');
              const gear = u.svg('svg', { class: 'update-gear', viewBox: '0 0 64 64', 'aria-hidden': 'true' }, box);
              const defs = u.svg('defs', {}, gear),
                shade = u.svg('linearGradient', { id: 'gear-shade', x2: 1, y2: 1 }, defs);
              u.svg('stop', { offset: 0, 'stop-color': '#53677f' }, shade);
              u.svg('stop', { offset: 1, 'stop-color': '#35465b' }, shade);
              for (let i = 0; i < 8; i++)
                u.svg(
                  'rect',
                  {
                    x: 26,
                    y: 2,
                    width: 12,
                    height: 14,
                    rx: 1.3,
                    transform: 'rotate(' + i * 45 + ' 32 32)',
                    fill: 'url(#gear-shade)',
                  },
                  gear,
                );
              u.svg(
                'path',
                {
                  d: 'M32 8a24 24 0 1 0 0 48a24 24 0 1 0 0-48M32 20a12 12 0 1 0 0 24a12 12 0 1 0 0-24',
                  'fill-rule': 'evenodd',
                  fill: 'url(#gear-shade)',
                },
                gear,
              );
              const update = u.el('button', 'update-now', box, 'Update now');
              update.onclick = () => ctx.dismiss('update');
            }
            const dismiss = u.el('button', 'dismiss', box, _c.label);
            Object.assign(_c, { dismiss });
          },
      },
    },
  });
})();
