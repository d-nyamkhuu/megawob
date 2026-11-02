// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function gemFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    let display = ctx.display || 'header';
    const frameSize = ctx.size || {},
      viewportWidth = frameSize.width || frameSize.w || document.documentElement.clientWidth;
    if (viewportWidth < 1200 && (display === 'panel' || display === 'toast')) display = 'header';
    body.className = 'design atari-gem gem-instr-' + display + (ctx.finish ? ' gem-finish' : '');
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#278836',
      panel: '#c4c4c4',
      fg: '#000',
      muted: '#111',
      line: '#000',
      accent: '#000',
      font: "'Courier New',monospace",
    }))
      root.style.setProperty('--' + k, v);
    const shell = u.el('div', 'shell', body),
      menu = u.el('nav', 'head gem-menu', shell);
    for (const label of ['Desk', 'File', 'Edit', 'Image', 'View', 'Options']) {
      const b = u.el('button', 'gem-menu-item', menu, label);
      b.type = 'button';
      b.onclick = () => env.log('menu', { label });
    }
    const desktopTools = u.el('div', 'gem-desktop-tools', menu);
    const icon = (parent, path, viewBox = '0 0 32 32') => {
      const s = u.svg(
        'svg',
        {
          viewBox,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'square',
          'stroke-linejoin': 'miter',
          'aria-hidden': 'true',
        },
        parent,
      );
      u.svg('path', { d: path }, s);
      return s;
    };
    icon(desktopTools, 'M5 2H25L29 6V30H3V2H5ZM8 2V13H23V2M8 19H24V30H8ZM18 4V10H21V4');
    icon(desktopTools, 'M6 7H26M10 7V3H22V7M8 9L10 30H23L25 9M13 12V25M18 12V25M22 12V25');
    const app = u.el('div', 'content gem-window', shell),
      titlebar = u.el('header', 'gem-titlebar', app);
    const gadget = u.el('button', 'gem-window-menu', titlebar);
    gadget.type = 'button';
    gadget.title = 'Window menu';
    icon(gadget, 'M3 3H29V29H3ZM7 8H24M7 15H15M20 15H25M7 23H25');
    gadget.onclick = () => env.log('window-control', { label: 'Window menu' });
    const title = u.el('div', 'gem-title', titlebar, 'Image Cropper - SHAPES.PI1');
    const stripes = u.el('div', 'gem-title-stripes', titlebar);
    const titleActions = u.el('div', 'gem-window-actions', titlebar);
    for (const [label, path] of [
      ['Minimize', 'M7 23H25'],
      ['Maximize', 'M7 6H25V25H7ZM10 9H22V22H10Z'],
      ['Close', 'M7 6L25 25M25 6L7 25'],
    ]) {
      const b = u.el('button', 'gem-gadget', titleActions);
      b.type = 'button';
      b.title = label;
      icon(b, path);
      b.onclick = () => env.log('window-control', { label });
    }
    let note = null;
    if (display === 'header') {
      titlebar.classList.add('with-note');
      stripes.hidden = true;
      note = u.el('section', 'task-note gem-header-note', titlebar);
      u.el('span', 'gem-note-separator', note, '— ');
      u.el('div', 'instruction', note, ctx.instruction);
      titlebar.insertBefore(note, titleActions);
    }
    const workspace = u.el('div', 'gem-workspace', app),
      stage = u.el('main', 'stage', workspace);
    stage.dataset.role = 'stage';
    const rail = u.el('aside', 'gem-tool-rail', workspace);
    const paths = [
      ['Select', 'M5 5H27V27H5Z'],
      ['Pan', 'M10 28L4 18Q2 13 6 14L11 19V7Q13 3 15 7V16V4Q18 1 19 5V16V7Q22 4 23 8V18V11Q27 8 28 12V23L23 30H14Z'],
      ['Zoom', 'M23 13A10 10 0 1 1 3 13A10 10 0 1 1 23 13M21 21L30 30'],
      ['Pattern', 'M5 5H27V27H5ZM9 9H10M15 9H16M21 9H22M12 14H13M19 14H20M9 19H10M15 19H16M21 19H22M12 24H13M19 24H20'],
      ['Ellipse', 'M27 16A11 11 0 1 1 5 16A11 11 0 1 1 27 16'],
      ['Line', 'M4 28L28 4'],
    ];
    for (let group = 0; group < 2; group++) {
      const gr = u.el('div', 'gem-tool-group', rail);
      for (const [label, path] of paths.slice(group * 3, group * 3 + 3)) {
        const b = u.el(
          'button',
          'gem-tool' + (label === 'Pan' ? ' selected' : '') + (label === 'Select' ? ' gem-marquee-tool' : ''),
          gr,
        );
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        icon(b, path);
        b.onclick = () => {
          rail.querySelectorAll('.gem-tool').forEach((x) => x.classList.remove('selected'));
          b.classList.add('selected');
          env.log('tool', { label });
        };
      }
      if (group === 1) {
        const b = u.el('button', 'gem-tool gem-text-tool', gr, 'T');
        b.type = 'button';
        b.title = 'Text';
        b.onclick = () => env.log('tool', { label: 'Text' });
      }
    }
    if (display === 'panel' || display === 'toast') {
      note = u.el('section', 'task-note gem-' + display + '-note', workspace);
      u.el('div', 'gem-note-heading', note, display === 'panel' ? 'Task' : 'Information');
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'toast') {
        u.el('span', 'gem-info-icon', note, 'i');
        const close = u.el('button', 'gem-note-close', note, '×');
        close.type = 'button';
        close.title = 'Dismiss information';
        close.onclick = () => {
          note.style.visibility = 'hidden';
        };
      }
    }
    const footer = u.el('footer', 'footer gem-status', app),
      status = u.el('div', 'footer-copy gem-view-status', footer, 'View: —');
    const footerActions = u.el('div', 'gem-footer-actions', footer),
      objects = u.el('div', 'gem-object-status', footer, 'Objects: —');
    const endRng = ctx.rng.fork('chrome/end'),
      rawLabels = ctx.content && ctx.content.END_LABELS;
    const labels = (
      Array.isArray(rawLabels) && rawLabels.length
        ? rawLabels
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
    ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
    let submit = null,
      label = null,
      placement = null;
    if (!ctx.finish) {
      const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
      if (common) {
        placement = 'footer';
        label = 'Save';
      } else {
        placement = endRng.pick(['header', 'icon', 'link']);
        const alternatives = labels.filter((x) => x.toLowerCase() !== 'save');
        label = endRng.pick(alternatives.length ? alternatives : labels);
      }
      const parent = placement === 'header' ? titleActions : footerActions;
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        'gem-end gem-end-' + placement,
        parent,
        placement === 'icon' ? '✓' : label,
      );
      if (submit.tagName === 'BUTTON') submit.type = 'button';
      else submit.href = '#';
      submit.dataset.role = 'submit';
      submit.title = placement === 'icon' ? 'All set' : label;
      submit.setAttribute('aria-label', label);
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    const collideRng = ctx.rng.fork('chrome/collide');
    if (!ctx.finish && collideRng.bool(0.3)) {
      const options = [...new Set(labels.filter((x) => x.toLowerCase() !== label.toLowerCase()))];
      if (options.length) {
        const decoyLabel = collideRng.pick(options),
          decoy = u.el('button', 'gem-end gem-end-xtra', footerActions, decoyLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
      }
    }
    if (display === 'panel' && note) {
      const noteHeight = note.getBoundingClientRect().height;
      const sidebarSpace = viewportWidth > 1400 ? 500 : 430;
      if (noteHeight + sidebarSpace > workspace.getBoundingClientRect().height) {
        display = 'header';
        body.classList.replace('gem-instr-panel', 'gem-instr-header');
        note.className = 'task-note gem-header-note';
        note.querySelector('.gem-note-heading').remove();
        const separator = u.el('span', 'gem-note-separator', null, '— ');
        note.prepend(separator);
        titlebar.classList.add('with-note');
        stripes.hidden = true;
        titlebar.insertBefore(note, titleActions);
      } else workspace.style.setProperty('--gem-panel-height', noteHeight + 'px');
    }
    return { stage, submit };
  }
  function gemOverlay(ctx) {
    const u = ctx.util,
      kind = ctx.kind,
      stage = document.querySelector('.gem-workspace'),
      pane = document.querySelector('.gem-scene-window');
    const bounds = (pane || stage).getBoundingClientRect(),
      workspace = stage.getBoundingClientRect(),
      small = bounds.width < 750;
    const el = u.el('section', 'obstruction gem-obstruction gem-ob-' + kind, document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    const symbol = (name) => {
      const svg = u.svg('svg', { viewBox: '0 0 64 64', class: 'gem-overlay-icon', 'aria-hidden': 'true' }, box);
      if (name === 'cookie') {
        u.svg(
          'path',
          {
            d: 'M57 31L54 44L43 56L28 59L14 53L6 41L5 27L12 14L25 7L38 6L44 18L55 22Z',
            fill: '#c39552',
            stroke: '#000',
            'stroke-width': 3,
          },
          svg,
        );
        for (const [x, y] of [
          [19, 20],
          [33, 15],
          [44, 31],
          [23, 36],
          [15, 42],
          [35, 48],
          [31, 27],
        ])
          u.svg('rect', { x, y, width: 5, height: 5, fill: '#111' }, svg);
      } else if (name === 'chat') {
        u.svg(
          'path',
          { d: 'M13 6H50L59 15V43L50 51H27L13 61V51H6V15Z', fill: '#0050e1', stroke: '#000', 'stroke-width': 3 },
          svg,
        );
        for (const x of [18, 31, 44]) u.svg('rect', { x, y: 27, width: 5, height: 5, fill: '#000' }, svg);
      } else if (name === 'mail') {
        u.svg('path', { d: 'M3 12H61V54H3Z', fill: '#a6d9ef', stroke: '#000', 'stroke-width': 3 }, svg);
        u.svg(
          'path',
          { d: 'M3 12L32 38L61 12M3 54L25 32M61 54L39 32', fill: 'none', stroke: '#000', 'stroke-width': 3 },
          svg,
        );
      } else {
        u.svg(
          'path',
          { d: 'M9 25H23L47 11V53L23 39H9ZM18 39L23 55H32L28 42', fill: '#e7c741', stroke: '#000', 'stroke-width': 3 },
          svg,
        );
        u.svg('path', { d: 'M47 11V53L55 47V18Z', fill: '#d81118', stroke: '#000', 'stroke-width': 3 }, svg);
      }
    };
    let dismiss;
    const close = (title) => {
      const b = u.el('button', 'gem-overlay-close', box, '×');
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.onclick = () => ctx.dismiss('close');
      return b;
    };
    if (kind === 'cookie') {
      Object.assign(el.style, {
        left: bounds.left + 'px',
        top: bounds.bottom - (small ? 130 : 150) + 'px',
        width: bounds.width + 'px',
      });
      symbol('cookie');
      u.el(
        'p',
        'gem-overlay-copy',
        box,
        'We use cookies to improve your experience.\nBy continuing, you agree to our use of cookies.',
      );
      dismiss = close('Dismiss cookies');
    } else if (kind === 'banner') {
      const titlebar = document.querySelector('.gem-titlebar').getBoundingClientRect();
      Object.assign(el.style, {
        left: workspace.left + 'px',
        top: titlebar.bottom + 'px',
        width: workspace.width + 'px',
      });
      symbol('announcement');
      const text = u.el('p', 'gem-overlay-copy', box);
      u.el('strong', '', text, 'New update available! ');
      u.el('span', '', text, 'Get the latest version for improved performance.');
      dismiss = close('Dismiss announcement');
    } else if (kind === 'chat') {
      Object.assign(el.style, {
        left: Math.max(bounds.left, bounds.right - (small ? 340 : 500)) + 'px',
        top: bounds.bottom - (small ? 240 : 330) + 'px',
        width: (small ? 340 : 500) + 'px',
      });
      symbol('chat');
      const copy = u.el('div', 'gem-chat-copy', box);
      u.el('h3', '', copy, 'Need help?');
      u.el('p', '', copy, 'Our team is here\nto assist you.');
      const composer = u.el('div', 'gem-chat-composer', box),
        input = u.el('input', '', composer);
      input.type = 'text';
      input.placeholder = 'Type a message..';
      input.setAttribute('aria-label', 'Chat message');
      const send = u.el('button', '', composer, '➤');
      send.type = 'button';
      send.title = 'Send message';
      send.onclick = () => env.log('decoy', { label: 'Send message' });
      dismiss = close('Close chat');
    } else if (kind === 'promo') {
      Object.assign(el.style, {
        left: workspace.left + 'px',
        top: workspace.top + 'px',
        width: workspace.width + 'px',
        height: workspace.height + 'px',
      });
      symbol('mail');
      const copy = u.el('div', 'gem-promo-copy', box);
      u.el('h3', '', copy, 'Get product updates');
      u.el('p', '', copy, 'Subscribe to our newsletter\nfor tips, new features, and more.');
      const input = u.el('input', 'gem-promo-input', box);
      input.type = 'text';
      input.placeholder = 'Your email address...';
      input.setAttribute('aria-label', 'Email address');
      const actions = u.el('div', 'gem-promo-actions', box);
      for (const label of ['Subscribe', 'Maybe later']) {
        const b = u.el('button', 'dismiss', actions, label);
        b.type = 'button';
        b.onclick = () => ctx.dismiss(label === 'Subscribe' ? 'subscribe' : 'close');
      }
      dismiss = close('Close product updates');
    } else {
      Object.assign(el.style, { right: '5%', top: workspace.top + 18 + 'px', left: 'auto', width: '360px' });
      u.el('h3', '', box, 'Information');
      u.el('p', '', box, 'Your changes have been saved.');
      dismiss = close('Dismiss notification');
    }
    return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-crop-image-pan-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'rail',
        'theme': 'atari-gem',
        'title': 'Image Cropper - SHAPES.PI1',
        'menu': 'Desk     File     Edit     Image     View     Options',
        'aside': 'Navigator',
        'foot': 'View: 153 × 116  (of 640 × 480)',
        'accent': '#1c1c1c',
        'bg': '#238d3b',
        'surface': '#d6d6d6',
        'font': "'Courier New', monospace",
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx } = _c;
            if (C.theme === 'atari-gem') return gemFrame(ctx);
            const u = ctx.util,
              body = document.body;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 1260) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { body, size, u, width });
          },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
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
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Use the tools to edit the image.');
                else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
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
            if (_c.aside && C.theme === 'neo-crop') {
              const files = [
                ['shapes.jpg', '4000 × 3000', '2.1 MB'],
                ['mountain.jpg', '4000 × 2667', '3.4 MB'],
                ['dog.jpg', '3000 × 2000', '1.8 MB'],
                ['beach.jpg', '3840 × 2560', '2.9 MB'],
                ['city.jpg', '4096 × 2731', '3.6 MB'],
              ];
              for (let i = 0; i < files.length; i++) {
                const row = u.el('div', 'media-item' + (i === 0 ? ' selected' : ''), _c.aside);
                u.el('div', 'media-thumb thumb-' + i, row);
                const detail = u.el('div', 'media-detail', row);
                u.el('strong', '', detail, files[i][0]);
                u.el('span', '', detail, files[i][1]);
                u.el('span', '', detail, files[i][2]);
              }
            }
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              u.el('p', 'completion-note panel-instruction', _c.aside, 'Use the tools to edit the image.');
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'aside';
                _c.label = 'Submit';
              } else {
                _c.placement = endRng.pick(['footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                _c.label = endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'aside' && _c.aside) _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
        'overlay.1': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx } = _c;
            if (C.theme === 'atari-gem') return gemOverlay(ctx);
            const u = ctx.util,
              kind = ctx.kind;
            Object.assign(_c, { kind, u });
          },
      },
    },
  });
})();
