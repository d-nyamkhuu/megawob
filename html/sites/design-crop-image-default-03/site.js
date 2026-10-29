// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'riscos',
        'theme': 'riscos',
        'title': 'PictureCrop',
        'aside': 'Crop Image',
        'foot': 'Image: shapes.png　　 Size: 640 x 480　　 Zoom: 100%',
        'accent': '#111',
        'bg': '#c6c6c6',
        'surface': '#f7f7f7',
        'font': 'Courier New, monospace',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'riscos'].includes(C.theme)) {
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
            if (C.theme === 'riscos') {
              const bar = u.el('nav', 'riscos-iconbar', shell);
              for (const [label, glyph] of [
                ['File', '▤'],
                ['Edit', '✎'],
                ['View', '▣'],
                ['Image', '▧'],
                ['Tools', '⚒'],
                ['Help', '?'],
              ]) {
                const item = u.el('button', 'riscos-icon', bar);
                item.type = 'button';
                u.el('span', 'riscos-glyph', item, glyph);
                u.el('span', '', item, label);
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
        // Keep tool chrome independent of the instruction and sampled target.
        'frame.22': () =>
          function (_c) {
            const { content, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, 'Crop Image');
            for (const [label, glyph] of [
              ['Pointer', '↖'],
              ['Crop tool', '□'],
              ['Zoom in', '⊕'],
              ['Zoom out', '⊖'],
            ]) {
              const tool = u.el('button', 'riscos-tool', _c.aside);
              tool.type = 'button';
              u.el('span', 'riscos-tool-glyph', tool, glyph);
              tool.setAttribute('aria-label', label);
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const placement = referenceEnd ? 'footer' : endRng.pick(['title', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endWords.filter((x) => x !== 'Submit'));
            _c.titleActions = null;
            const actions = () => _c.titleActions || (_c.titleActions = u.el('div', 'riscos-title-actions', head));
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'title' ? actions() : C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'title' ? ' end-title' : placement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (collideRng.bool(0.3)) {
              const pool = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (pool.length) {
                const label = collideRng.pick(pool),
                  decoy = u.el('button', 'riscos-xtra', actions(), label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { actions, collideRng, endLabel, endRng, endWords, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
