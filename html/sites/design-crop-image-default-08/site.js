// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-08',
    styles: ['site.css', 'amiga.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'amiga',
        'title': 'Image Cropper',
        'ribbon': true,
        'menu': '',
        'aside': 'Crop',
        'foot': '',
        'accent': '#064bd0',
        'bg': '#85888d',
        'surface': '#c5c5c5',
        'font': 'monospace',
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
              fg: '#111',
              muted: '#333',
              line: '#555',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            const wb = u.el('div', 'workbench-bar', body);
            u.el('span', '', wb, 'Amiga Workbench');
            u.el('span', 'wb-date', wb, 'Mon Apr 28 1997  10:24');
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'amiga'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            Object.assign(_c, { head, shell, wb });
          },
        'frame.8': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
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
                } else {
                  for (const t of j === 1 ? ['Crop', 'Move'] : j === 2 ? ['Select', 'Reset'] : ['Help'])
                    tool(gr, t, 'M5 5H27V27H5ZM10 16L14 20L23 10');
                }
                u.el('small', '', gr, name);
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
            content.dataset.instruction = ctx.display;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
        'frame.22': () =>
          function (_c) {
            const { content, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('div', 'pane-band', _c.aside, 'Crop');
            for (const label of ['X:', 'Y:', 'Width:', 'Height:']) {
              const row = u.el('div', 'value-row', _c.aside);
              u.el('span', '', row, label);
              u.el('span', 'value-box', row, '—');
            }
            u.el('button', 'reset-crop', _c.aside, 'Reset');
            u.el('div', 'pane-band preview-band', _c.aside, 'Preview');
            const preview = u.el('canvas', 'preview-art', _c.aside);
            preview.width = 144;
            preview.height = 144;
            preview.setAttribute('aria-label', 'Current crop preview');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, footer, head, u } = _c;
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf),
              endRng = ctx.rng.fork('chrome/end');
            const classic = endRng.bool(0.5),
              placement = classic ? 'footer' : endRng.pick(['header', 'link']);
            const endLabel = classic ? 'Submit' : endRng.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el('button', 'submit end-' + placement, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (C.theme === 'amiga') {
              const rib = document.querySelector('.ribbon');
              if (rib) footer.insertBefore(rib, _c.submit?.parentNode === footer ? _c.submit : null);
              const palette = u.el('aside', 'floating-tools', body);
              u.el('div', 'floating-title', palette, 'Tools');
              for (const [glyph, label] of [
                ['↖', 'Select'],
                ['□', 'Crop'],
                ['✋', 'Move'],
                ['⌕', 'Zoom'],
              ]) {
                const b = u.el('button', 'float-tool', palette);
                u.el('b', '', b, glyph);
                u.el('span', '', b, label);
                b.type = 'button';
                b.onclick = () => env.log('decoy', { label });
              }
              const collideRng = ctx.rng.fork('chrome/collide');
              if (collideRng.bool(0.3)) {
                const other = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (other.length) {
                  const label = collideRng.pick(other),
                    decoy = u.el('button', 'end-xtra', palette, label);
                  palette.classList.add('has-xtra');
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label, collide: true });
                }
              }
            }
            Object.assign(_c, { classic, endLabel, endLabels, endRng, labelOf, placement });
          },
        'frame.27': () => () => {},
        'overlay.14': (base, S) =>
          function (_c) {
            const { ctx, dismiss, kind } = _c;
            dismiss.onclick = () => ctx.dismiss(kind === 'cookie' ? 'reject' : 'close');
          },
      },
    },
  });
})();
