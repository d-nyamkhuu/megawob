// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-bisect-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'gnome',
        'title': 'Angle Practice',
        'subtitle': 'Geometric reasoning, one click at a time',
        'aside': 'Progress',
        'foot': "Click a single point. Make sure it's on the angle bisector and outside the dotted circle.",
        'accent': '#2879ed',
        'bg': '#eceef3',
        'surface': '#fff',
        'font': 'Carlito, Calibri, Cantarell, Segoe UI, Arial, sans-serif',
        'ob': 'newsletter',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            const display =
              ctx.display === 'panel' &&
              (document.documentElement.clientWidth < 1280 || document.documentElement.clientHeight <= 800)
                ? 'header'
                : ctx.display;
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { display });
          },
        'frame.3': () => () => {},
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: C.theme === 'developer' ? '#eff4ff' : '#0e1421',
              muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
              line: C.theme === 'developer' ? '#283544' : '#c9cfd5',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.theme === 'gnome') {
              const bar = u.el('div', 'desktop-bar', head);
              u.el('span', 'activities', bar, 'Activities');
              u.el('span', 'desktop-app', bar, 'Angle Practice');
              u.el('span', 'desktop-clock', bar, 'Oct 26  10:14');
              const status = u.svg(
                'svg',
                {
                  class: 'desktop-status',
                  width: 132,
                  height: 24,
                  viewBox: '0 0 132 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.8,
                },
                bar,
              );
              u.svg(
                'path',
                {
                  d: 'M2 8Q12 0 22 8M5 11Q12 5 19 11M8 14Q12 10 16 14M11 17H13M44 9H48L53 5V19L48 15H44ZM57 8Q63 12 57 16M61 5Q69 12 61 19M89 5H109V19H89ZM111 9H114V15H111M93 8H104V16H93M126 11L129 14L132 11',
                },
                status,
              );
              const ai = u.el('div', 'app-icon', head);
              const icon = u.svg(
                'svg',
                { width: 30, height: 30, viewBox: '0 0 32 32', fill: 'none', stroke: 'white', 'stroke-width': 0.8 },
                ai,
              );
              u.svg(
                'path',
                { d: 'M5 27L12 10Q15 1 20 9L26 25L19 22L11 24ZM12 10L18 13L20 9M11 24L17 16L19 22M17 16L18 13' },
                icon,
              );
              const mini = icon.cloneNode(true);
              mini.setAttribute('stroke', '#2876ec');
              bar.querySelector('.desktop-app').prepend(mini);
              const wc = u.el('div', 'gwin', head);
              for (const g of ['−', '□', '×']) u.el('span', '', wc, g);
            }
            if (C.title) u.el('div', 'title', head, C.title);
          },
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
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
              brief = C.theme === 'gnome' ? u.el('section', 'brief-card', content) : content;
            if (C.theme === 'gnome') u.el('div', 'note-title', brief, 'Find the angle bisector');
            const note = u.el('section', 'task-note', brief);
            Object.assign(_c, { brief, content, note });
          },
        'frame.13': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { display, note, u } = _c;
            if (display === 'hidden') note.hidden = true;
            else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
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
                  u.el('progress', '', _c.aside).value = 0.235;
                  u.el('hr', '', _c.aside);
                  u.el('h3', '', _c.aside, 'Time');
                  const paused = u.el('p', 'paused', _c.aside);
                  u.el('span', 'pause-icon', paused, 'Ⅱ');
                  u.el('span', '', paused, 'Paused');
                  const ti = u.el('p', 'time-info', _c.aside);
                  u.el('span', 'info-i', ti, 'i');
                  u.el('span', '', ti, 'The timer will start after you close the newsletter.');
                  const tips = u.el('section', 'gnome-tips', _c.aside);
                  u.el('h3', '', tips, 'Tips');
                  const list = u.el('ul', '', tips);
                  for (const text of [
                    'The bisector splits the angle into two equal halves.',
                    'Click outside the dotted circle.',
                    'You only need to click once.',
                  ])
                    u.el('li', '', list, text);
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
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
            if (C.theme === 'gnome' && _c.aside) {
              const card = u.el('section', 'progress-card', _c.aside);
              for (const child of Array.from(_c.aside.children))
                if (child !== card && !child.classList.contains('gnome-tips')) card.append(child);
              _c.aside.prepend(card);
            }
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'aside' : er.pick(['header', 'footer']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            const actions = u.el('div', 'header-actions', head);
            Object.assign(_c, { actions, cr, endLabel, endLabels, er, labelOf, placement, referenceEnd });
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            const footerCopy = u.el('div', 'footer-copy', footer, C.foot || '');
            if (C.theme === 'gnome') {
              const info = u.el('span', 'info-i', footer, 'i');
              footer.prepend(info);
            }
            Object.assign(_c, { footerCopy });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const {
              actions,
              brief,
              content,
              cr,
              ctx,
              display,
              endLabel,
              endLabels,
              footer,
              footerCopy,
              note,
              placement,
              shell,
              u,
            } = _c;
            if (!ctx.finish) {
              const parent = placement === 'header' ? actions : placement === 'footer' ? footer : _c.aside || footer;
              _c.submit = u.el('button', 'submit end-' + placement, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
            }
            if (cr.bool(0.3)) {
              const label = cr.pick(endLabels.filter((x) => x !== endLabel));
              const decoy = u.el('button', 'chrome-xtra', actions, label);
              decoy.type = 'button';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            if (C.theme === 'gnome') {
              if (display === 'hidden') {
                brief.hidden = true;
                content.classList.add('brief-absent');
                footerCopy.textContent = 'Click the drawing to place a point. Clicking again moves it.';
                _c.aside.querySelector('.gnome-tips').hidden = true;
                _c.aside.classList.add('without-tips');
              } else if (display === 'panel') {
                brief.hidden = true;
                content.classList.add('brief-absent');
                note.classList.add('gnome-instruction-card');
                _c.aside.prepend(note);
                const heading = u.el('h3', '', note, 'Find the angle bisector');
                note.prepend(heading);
                _c.aside.classList.add('with-instruction-panel');
              } else if (display === 'toast') {
                brief.hidden = true;
                content.classList.add('brief-absent');
                const tray = u.el('div', 'instruction-tray', shell);
                tray.append(note);
                shell.insertBefore(tray, content);
              }
              if (ctx.finish) _c.aside.classList.add('finish-mode');
            }
          },
        'overlay.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, o, u } = _c;
            if (o === 'newsletter') {
              const sub = u.el('button', 'subscribe', box, 'Subscribe to newsletter');
              sub.onclick = () => ctx.dismiss('subscribe');
            }
            const dismiss = u.el('button', 'dismiss', box, _c.label);
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
                      ? 'M14 14H50Q56 14 56 20V44Q56 50 50 50H14Q8 50 8 44V20Q8 14 14 14ZM9 17L32 34L55 17'
                      : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
                },
                icon,
              );
            }
            Object.assign(_c, { dismiss });
          },
        'overlay.12': () => () => {},
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (o === 'newsletter') {
              const x = u.el('button', 'newsletter-x', box, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close newsletter');
              x.onclick = () => ctx.dismiss('close');
            }
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss', box, 'Accept optional');
              accept.onclick = () => ctx.dismiss('accept');
            }
          },
      },
    },
  });
})();
