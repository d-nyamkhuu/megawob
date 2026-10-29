// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'fluent',
        'title': 'Image Cropper',
        'tabs': null,
        'aside': '',
        'foot': '↶　Undo　　 ↷　Redo',
        'accent': '#1673df',
        'bg': '#f7f4f0',
        'surface': '#ffffff',
        'font': "'Segoe UI', Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: '#182536',
              muted: '#495565',
              line: '#d7d9dd',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'fluent'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, shell, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  u.el('span', 'tab-label', bt, text);
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
            const footer = u.el('footer', 'footer', shell),
              history = u.el('div', 'footer-copy', footer);
            for (const [label, path] of [
              ['Undo', 'M26 9C10 1 2 15 10 25C15 31 27 29 29 21C32 12 23 6 10 9M10 9L16 2M10 9L18 13'],
              ['Redo', 'M6 9C22 1 30 15 22 25C17 31 5 29 3 21C0 12 9 6 22 9M22 9L16 2M22 9L14 13'],
            ]) {
              const bt = u.el('button', 'history-button', history);
              bt.type = 'button';
              const icon = u.svg(
                'svg',
                {
                  width: 32,
                  height: 32,
                  viewBox: '0 0 32 32',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.7,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                },
                bt,
              );
              u.svg('path', { d: path }, icon);
              u.el('span', '', bt, label);
              bt.onclick = () => env.log('decoy', { label });
            }
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
            const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endWords.filter((x) => x !== 'Submit'));
            const tools = u.el('div', 'header-tools', head);
            Object.assign(_c, { collideRng, endLabel, endRng, endWords, footer, history, labelOf, placement, tools });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { collideRng, ctx, endLabel, endWords, footer, placement, shell, tools, u } = _c;
            shell.classList.toggle('finish-mode', ctx.finish);
            shell.dataset.endPlacement = ctx.finish ? 'none' : placement;
            if (!ctx.finish) {
              _c.submit = u.el('button', 'submit end-' + placement, placement === 'header' ? tools : footer, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (collideRng.bool(0.3)) {
              const label = collideRng.pick(endWords.filter((x) => x.toLowerCase() !== endLabel.toLowerCase()));
              const bt = u.el('button', 'chrome-xtra', tools, label);
              bt.type = 'button';
              bt.dataset.role = 'xtra';
              bt.onclick = () => env.log('decoy', { label, collide: true });
            }
          },
      },
    },
  });
})();
