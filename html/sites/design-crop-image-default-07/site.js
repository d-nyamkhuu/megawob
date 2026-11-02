// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'document',
        'theme': 'pastel-native',
        'title': 'Image Cropper',
        'aside': 'Crop Image',
        'foot': '',
        'accent': '#5758e8',
        'bg': '#f4f5ff',
        'surface': '#ffffff',
        'font': "'Segoe UI', Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (
              ['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'pastel-native'].includes(C.theme)
            ) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.theme === 'pastel-native') {
              const bar = u.el('nav', 'native-toolbar', shell);
              const zoom = u.el('div', 'zoom-tools', bar);
              for (const [glyph, label] of [
                ['⌕', 'Zoom out'],
                ['100%', 'Zoom level'],
                ['⊕', 'Zoom in'],
              ]) {
                const b = u.el('button', 'zoom-button', zoom, glyph);
                b.type = 'button';
                b.setAttribute('aria-label', label);
              }
              u.el('span', 'toolbar-divider', bar);
              for (const [glyph, label] of [
                ['↶', 'Undo'],
                ['↷', 'Redo'],
              ]) {
                const b = u.el('button', 'history-button', bar);
                b.type = 'button';
                u.el('span', 'history-icon', b, glyph);
                u.el('span', '', b, label);
              }
            }
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
        'frame.22': () =>
          function (_c) {
            const { content, u } = _c;
            // Keep help independent of the goal; the frame's instruction element owns it.
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, 'Actions');
            u.el(
              'p',
              '',
              _c.aside,
              'Drag any of the eight handles (corners or side midpoints) to resize the crop box.',
            );
            u.el('h3', 'inspector-heading', _c.aside, 'Crop box size');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = (
              ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map(labelOf);
            const placement = er.pick(['inspector', 'inspector', 'toolbar', 'title']);
            const endLabel = placement === 'inspector' ? 'Submit' : er.pick(endWords);
            const toolbar = shell.querySelector('.native-toolbar');
            if (C.theme === 'pastel-native' && _c.aside) {
              const reset = u.el('button', 'reset-button', _c.aside, 'Reset');
              reset.type = 'button';
              reset.onclick = () => env.widgetDef.clear?.();
            }
            _c.submit = null;
            if (!ctx.finish) {
              const parent =
                placement === 'toolbar'
                  ? toolbar
                  : placement === 'title'
                    ? head
                    : (C.layout === 'three' || C.layout === 'document') && _c.aside
                      ? _c.aside
                      : footer;
              _c.submit = u.el('button', 'submit end-' + placement, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const choices = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (choices.length) {
                const label = cr.pick(choices),
                  decoy = u.el('button', 'end-xtra', toolbar || head, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                if (_c.submit && placement === 'toolbar') toolbar.insertBefore(decoy, _c.submit);
              }
            }
            for (const b of shell.querySelectorAll('.zoom-button,.history-button'))
              b.onclick = () => env.log('decoy', { label: b.getAttribute('aria-label') || b.textContent.trim() });
            Object.assign(_c, { cr, endLabel, endWords, er, labelOf, placement, toolbar });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
