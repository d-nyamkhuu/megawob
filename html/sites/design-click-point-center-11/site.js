// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function appEmblem(u, parent, titlebar) {
    const icon = u.svg(
      'svg',
      { class: titlebar ? 'title-emblem' : 'menu-emblem', viewBox: '0 0 32 32', 'aria-hidden': 'true' },
      parent,
    );
    const defs = u.svg('defs', {}, icon),
      id = titlebar ? 'title-glass' : 'menu-glass';
    const fill = u.svg('linearGradient', { id, x1: '0', y1: '0', x2: '.35', y2: '1' }, defs);
    for (const [offset, color] of titlebar
      ? [
          ['0', '#c9e5f3'],
          ['.35', '#6fafd1'],
          ['.6', '#3378a2'],
          ['1', '#8ec7e0'],
        ]
      : [
          ['0', '#e3f6ff'],
          ['.4', '#a5d7f7'],
          ['.55', '#6eb1e2'],
          ['1', '#cce8fb'],
        ])
      u.svg('stop', { offset, 'stop-color': color }, fill);
    u.svg(
      'rect',
      {
        x: 1.5,
        y: 1.5,
        width: 29,
        height: 29,
        rx: titlebar ? 9 : 14,
        fill: 'url(#' + id + ')',
        stroke: titlebar ? '#567d94' : '#8ab9dd',
        'stroke-width': 1.5,
      },
      icon,
    );
    if (titlebar) {
      u.svg(
        'path',
        { d: 'M5 12Q8 3 18 5Q26 6 28 13', fill: 'none', stroke: '#e9f8ff', 'stroke-width': 1.5, opacity: 0.8 },
        icon,
      );
      u.svg('path', { d: 'M15 10L21 15L17 22L11 18V13Z', fill: '#d9f0ff', stroke: '#4e8aae', 'stroke-width': 1 }, icon);
      u.svg('path', { d: 'M15 10L18 14L15 19L11 16V13Z', fill: '#fff' }, icon);
      u.svg('path', { d: 'M9 25Q17 29 24 23', fill: 'none', stroke: '#4d84a3', 'stroke-width': 2 }, icon);
    } else {
      u.svg(
        'path',
        {
          d: 'M10 8V21Q10 25 16 25H20M11 15H20Q23 15 23 18Q23 21 19 21H16M19 21L23 25L26 20',
          fill: 'none',
          stroke: '#5a9ad0',
          'stroke-width': 4,
          'stroke-linejoin': 'round',
        },
        icon,
      );
      u.svg(
        'path',
        {
          d: 'M10 7V20Q10 24 16 24H19M11 14H19Q22 14 22 17Q22 20 18 20H16M19 20L23 24L26 19',
          fill: 'none',
          stroke: '#f6fcff',
          'stroke-width': 2.4,
          'stroke-linejoin': 'round',
        },
        icon,
      );
    }
  }
  function glassIcon(u, icon, name) {
    icon.replaceChildren();
    icon.setAttribute('viewBox', '0 0 40 42');
    icon.setAttribute('stroke-width', '2');
    const id = 'vista-' + name.toLowerCase().replace(/\s/g, '-');
    const defs = u.svg('defs', {}, icon);
    const grad = u.svg('linearGradient', { id: id + '-silver', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    for (const [offset, color] of [
      ['0', '#fff'],
      ['.55', '#f9fafb'],
      ['1', '#c0c3c8'],
    ])
      u.svg('stop', { offset, 'stop-color': color }, grad);
    const blue = u.svg('linearGradient', { id: id + '-blue', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
    for (const [offset, color] of [
      ['0', '#9ecbfc'],
      ['.32', '#5b97e5'],
      ['.44', '#4580da'],
      ['.63', '#3973d6'],
      ['1', name === 'Help' ? '#3d6fd0' : '#285ac0'],
    ])
      u.svg('stop', { offset, 'stop-color': color }, blue);
    const path = (d, attrs = {}) => u.svg('path', { d, ...attrs }, icon);
    const silver = 'url(#' + id + '-silver)',
      blueFill = 'url(#' + id + '-blue)';
    if (name === 'Select')
      path('M10 3V33L17 25L23 38L29 35L23 23H33Z', { fill: silver, stroke: '#53564f', 'stroke-linejoin': 'round' });
    else if (name === 'Pan')
      path(
        'M13 38L4 23Q1 17 5 17Q7 17 12 23V8Q12 4 15 4Q18 4 18 8V19V5Q18 1 21 1Q24 1 24 5V19V7Q24 3 27 4Q30 4 30 8V21V14Q30 10 33 11Q36 11 36 15V27L30 39Z',
        { fill: silver, stroke: '#666a6e', 'stroke-linejoin': 'round' },
      );
    else if (name === 'Zoom In' || name === 'Zoom Out') {
      path('M25 27L36 38', { stroke: '#555b59', 'stroke-width': 7, 'stroke-linecap': 'round' });
      path('M25 26L36 37', { stroke: '#a3a9a5', 'stroke-width': 2, 'stroke-linecap': 'round' });
      u.svg('circle', { cx: 16, cy: 16, r: 13, fill: silver, stroke: '#596063', 'stroke-width': 2.5 }, icon);
      u.svg('circle', { cx: 16, cy: 16, r: 10, fill: '#f9fcff', stroke: '#cfdae3', 'stroke-width': 1 }, icon);
      path('M9 16H23' + (name === 'Zoom In' ? 'M16 9V23' : ''), { stroke: '#368bce', 'stroke-width': 3 });
    } else if (name === 'Reset View') {
      path('M12 10C22 3 35 12 35 22C35 32 23 39 14 33C10 31 8 27 8 23', {
        stroke: '#759bbb',
        'stroke-width': 5.5,
        'stroke-linecap': 'round',
      });
      path('M12 3L3 15L17 15Z', { fill: '#749abb', stroke: '#9bb8cf', 'stroke-width': 1, 'stroke-linejoin': 'round' });
      path('M18 7C28 6 35 14 35 22', { stroke: '#b6cfdf', 'stroke-width': 1.2 });
    } else if (name === 'Help' || name === 'About') {
      u.svg('circle', { cx: 20, cy: 21, r: 20, fill: blueFill, stroke: '#779cce', 'stroke-width': 1 }, icon);
      u.svg('ellipse', { cx: 16, cy: 8, rx: 5, ry: 2.5, fill: '#eef8ff', stroke: 'none', opacity: 0.75 }, icon);
      const t = u.svg(
        'text',
        {
          x: 20,
          y: 33,
          fill: '#fff',
          stroke: 'none',
          'text-anchor': 'middle',
          'font-family': name === 'About' ? 'Georgia, serif' : 'Tahoma, Arial, sans-serif',
          'font-size': 35,
          'font-weight': 'bold',
        },
        icon,
      );
      t.textContent = name === 'Help' ? '?' : 'i';
    } else if (name === 'Line') path('M3 38L37 4', { stroke: '#c5cbd5', 'stroke-width': 2.5 });
    else if (name === 'Circle') u.svg('circle', { cx: 20, cy: 21, r: 18, fill: 'none', stroke: '#9ea4b2' }, icon);
    else if (name === 'Rectangle') {
      icon.setAttribute('viewBox', '-2 0 44 42');
      u.svg('rect', { x: 0, y: 4, width: 40, height: 34, fill: 'none', stroke: '#9ea4b2' }, icon);
    } else if (name === 'Point')
      u.svg('circle', { cx: 20, cy: 21, r: 5, fill: '#9a9daf', stroke: '#8c8fa0', 'stroke-width': 1 }, icon);
  }
  env.site({
    name: 'design-click-point-center-11',
    styles: ['site.css', 'vista.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'vista',
        'title': 'Geometry Practice',
        'menu': 'Home      View      Tools      Help',
        'ribbon': true,
        'foot': 'Points: 0',
        'accent': '#266bae',
        'bg': '#d1e4f4',
        'surface': '#fff',
        'font': '"Segoe UI", Tahoma, Arial, sans-serif',
        'ob': 'privacy',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              const title = u.el('div', 'title', head);
              appEmblem(u, title, true);
              u.el('span', 'title-caption', title, C.title);
            }
            if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
            if (C.menu) {
              const menu = u.el('nav', 'menu', head);
              const orb = u.el('button', 'application-menu', menu, '');
              orb.type = 'button';
              orb.setAttribute('aria-label', 'Application menu');
              appEmblem(u, orb, false);
              orb.onclick = () => env.log('application-menu', {});
              for (const [i, label] of C.menu
                .trim()
                .split(/\s{2,}/)
                .entries()) {
                const tab = u.el('button', 'menu-tab' + (i === 0 ? ' active' : ''), menu, label);
                tab.type = 'button';
                tab.onclick = () => env.log('menu-tab', { label });
              }
            }
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
                path =
                  {
                    'Add Point': 'M4 2V28L12 20L18 30L23 27L17 18H29Z',
                    'Erase': 'M5 20L21 3L30 12L14 29H8ZM5 20L14 29M15 10L24 19',
                    'Undo': 'M13 5L3 14L13 22V16H21Q28 16 29 28Q32 9 21 9H13Z',
                    'Redo': 'M19 5L29 14L19 22V16H11Q4 16 3 28Q0 9 11 9H19Z',
                    'Settings':
                      'M13 2H19L20 7L24 9L29 7L32 13L28 17V21L31 25L27 30L22 28L18 30L17 34H11L10 29L6 27L2 29L-1 23L3 19V15L0 11L4 6L9 8L13 6ZM22 17A6 6 0 1 1 10 17A6 6 0 1 1 22 17',
                    'About': 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M16 13V24M16 7V9',
                    'Rectangle': 'M4 4H28V28H4Z',
                    'Fit to Window':
                      'M4 4H28V28H4ZM8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 13V8H13M19 8H24V13M8 19V24H13M19 24H24V19',
                  }[name] || path;
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
                if (C.theme === 'vista') glassIcon(u, icon, name);
                u.el(
                  'span',
                  'tool-label',
                  bt,
                  ['Zoom In', 'Zoom Out', 'Reset View'].includes(name) ? name.replace(' ', '\n') : name,
                );
                if (name === 'Select') bt.classList.add('selected');
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
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, head, note, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labels = ctx.content.END_LABELS;
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = labelOf(endRng.pick(labels));
            const placement = endRng.pick(['footer', 'footer', 'ribbon', 'link']);
            const actualPlacement = placement === 'ribbon' && window.innerWidth < 1200 ? 'footer' : placement;
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const alternatives = labels
                .map(labelOf)
                .filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (alternatives.length) _c.collide = collideRng.pick(alternatives);
            }
            const footer = u.el('footer', 'footer', shell);
            if (C.theme === 'vista') footer.prepend(note);
            u.el('div', 'footer-copy', footer, C.foot || '');
            _c.submit = null;
            const addEnd = (parent, where) => {
              const link = where === 'link',
                button = u.el(
                  link ? 'a' : 'button',
                  where === 'ribbon' ? 'submit ribbon-submit' : link ? 'submit end-link' : 'submit',
                  parent,
                  link ? endLabel + ' ›' : endLabel,
                );
              if (!link) button.type = 'button';
              else button.href = '#';
              button.dataset.role = 'submit';
              button.setAttribute('aria-label', endLabel);
              button.title = endLabel;
              button.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return button;
            };
            const decoy = (parent) => {
              if (!_c.collide) return;
              const inRibbon = parent.classList.contains('ribbon');
              const b = u.el('button', 'submit end-xtra' + (inRibbon ? ' ribbon-xtra' : ''), parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            };
            if (!ctx.finish) {
              if (actualPlacement === 'ribbon') {
                const target = head.querySelector('.ribbon');
                _c.submit = addEnd(target, 'ribbon');
              } else if (actualPlacement === 'link') _c.submit = addEnd(footer, 'link');
              else _c.submit = addEnd(footer, 'footer');
            }
            if (_c.collide) decoy(actualPlacement === 'ribbon' ? head.querySelector('.ribbon') : footer);
            Object.assign(_c, {
              actualPlacement,
              addEnd,
              collideRng,
              decoy,
              endLabel,
              endRng,
              footer,
              labelOf,
              labels,
              placement,
            });
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        overlay: (base, S) =>
          function (ctx) {
            const { C } = S;
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
              title = "We'd like your consent";
              text =
                'We use optional analytics to improve this application.\nThis may include information about how you use the tool,\nsuch as the features you click and general performance data.\n\nYou can change this setting at any time in the Options menu.';
              label = 'Reject optional';
            } else if (o === 'tips') {
              title = 'Tip of the day';
              text = 'The midpoint is the point that is the same distance from both marked points.';
              label = 'Close';
            } else if (o === 'newsletter') {
              title = 'Stay in the loop';
              text = 'Get occasional tips, practice problems, and feature updates.';
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
            if (C.theme === 'vista' && o === 'privacy') {
              const close = u.el('button', 'privacy-close', box, '×');
              close.type = 'button';
              close.setAttribute('aria-label', 'Close consent panel');
              close.onclick = () => ctx.dismiss('close');
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
            } else if (C.theme === 'vista' && o === 'privacy') {
              const copy = u.el('div', 'privacy-copy', box);
              const paragraphs = text.split('\n\n');
              u.el('p', '', copy, paragraphs[0]);
              u.el('p', 'privacy-setting', copy, paragraphs[1]);
            } else u.el('p', '', box, text);
            if (o === 'tips') {
              const label = u.el('label', 'tip-option', box);
              const input = u.el('input', '', label);
              input.type = 'checkbox';
              u.el('span', '', label, 'Do not show again');
            }
            const dismiss = u.el('button', 'dismiss', box, label);
            if (o === 'privacy') dismiss.classList.add('reject');
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
              if (C.theme === 'vista' && o === 'privacy') {
                icon.replaceChildren();
                const defs = u.svg('defs', {}, icon);
                const grad = u.svg('linearGradient', { id: 'shield-blue', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
                for (const [offset, color] of [
                  ['0', '#59a8ed'],
                  ['.5', '#2272c2'],
                  ['1', '#0750b5'],
                ])
                  u.svg('stop', { offset, 'stop-color': color }, grad);
                u.svg(
                  'path',
                  {
                    d: 'M32 1L59 10V28Q59 49 32 64Q5 49 5 28V10Z',
                    fill: 'url(#shield-blue)',
                    stroke: '#316fac',
                    'stroke-width': 1,
                  },
                  icon,
                );
                u.svg('path', { d: 'M32 2V63Q7 49 7 28V11Z', fill: '#83beeb', opacity: 0.28 }, icon);
                u.svg('path', { d: 'M32 12L49 18V30Q49 42 32 51Q15 42 15 30V18Z', fill: '#fff', stroke: 'none' }, icon);
                u.svg('path', { d: 'M32 12V31H15Q15 43 32 51V31H49V18Z', fill: '#74b3e4', stroke: 'none' }, icon);
              }
            }
            dismiss.type = 'button';
            dismiss.onclick = () => ctx.dismiss('close');
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss', box, 'Accept optional');
              accept.classList.add('accept');
              accept.type = 'button';
              accept.onclick = () => ctx.dismiss('accept');
            }
            return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
          },
      },
    },
  });
})();
