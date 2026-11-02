// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-midpoint-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'offset',
        'theme': 'civic',
        'title': 'Map',
        'subtitle': 'Community Facilities Plan',
        'foot': 'Click on the map to place a point. You can zoom or pan if needed.',
        'accent': '#0765cf',
        'bg': '#fff',
        'surface': '#f1f5f8',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.12': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, head, shell, u } = _c;
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
              note = u.el('section', 'task-note' + (ctx.instruction.length > 75 ? ' long-instruction' : ''), content);
            Object.assign(_c, { content, note });
          },
        'frame.13': () => () => {},
        'frame.15': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            u.el('div', 'civic-label', note, 'YOUR TASK');
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            u.el(
              'p',
              'civic-explanation',
              note,
              'A and B are shown on the right. Click the point that is exactly in the middle of the straight line between them.',
            );
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
            Object.assign(_c, { instruction });
          },
        'frame.16': () => () => {},
        'frame.22': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, shell, u } = _c;
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
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) {
                  const bt = u.el('button', 'map-tool', _c.aside);
                  const ic = u.el('span', 'map-icon', bt);
                  const P = {
                    'Select': 'M6 3V26L12 20L16 29L20 27L16 19H24Z',
                    'Pan':
                      'M16 2L21 8H18V14H24V11L30 16L24 21V18H18V24H21L16 30L11 24H14V18H8V21L2 16L8 11V14H14V8H11Z',
                    'Zoom In': 'M13 4A9 9 0 1 1 13 22A9 9 0 1 1 13 4M20 21L29 30',
                    'Zoom Out': 'M13 4A9 9 0 1 1 13 22A9 9 0 1 1 13 4M20 21L29 30M8 13H18',
                  }[text];
                  const sv = u.svg(
                    'svg',
                    {
                      width: 34,
                      height: 34,
                      viewBox: '0 0 32 32',
                      fill: text === 'Select' || text === 'Pan' ? '#0c2c52' : 'none',
                      stroke: '#0c2c52',
                      'stroke-width': 2.4,
                      'stroke-linejoin': 'round',
                    },
                    ic,
                  );
                  u.svg('path', { d: P }, sv);
                  if (text === 'Select') bt.classList.add('on');
                  u.el('span', '', bt, text);
                }
                const scale = u.el('div', 'map-scale', shell);
                for (const [i, t] of ['0', '50', '100', '150', '200 m'].entries()) {
                  const s = u.el('span', '', scale, t);
                  s.style.left = i * 25 + '%';
                }
                const north = u.el('div', 'map-north', shell, '▲\nN');
                const org = u.el('div', 'head-org', head);
                u.el('div', '', org, 'Riverton City Council');
                u.el('div', '', org, 'Public Works Department');
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
          },
        'frame.23': () => () => {},
        'frame.27': (_base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                base = er.bool(0.5),
                placement = base ? 'footer' : er.pick(['head', 'rail', 'link']),
                labels = (ctx.content && ctx.content.END_LABELS) || [
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
                ],
                raw = er.pick(labels),
                label = base
                  ? 'Submit'
                  : String(typeof raw === 'string' ? raw : (raw && (raw.label || raw.text || raw.name)) || raw);
              let parent = footer,
                cls = 'submit';
              if (placement === 'head') {
                parent = head;
                cls = 'submit civic-head-submit';
              } else if (placement === 'rail') {
                parent = _c.aside || footer;
                cls = 'submit civic-rail-submit';
              } else if (placement === 'link') cls = 'civic-submit-link';
              _c.submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, label);
              _c.submit.type = 'button';
              if (placement === 'link') _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const other = labels
                  .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
                  .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
                if (other.length) {
                  const word = other[cr.int(0, other.length - 1)],
                    where = cr.pick(['head', 'rail', 'footer']),
                    target = where === 'head' ? head : where === 'rail' ? _c.aside || footer : footer,
                    decoy = u.el(
                      'button',
                      where === 'rail' ? 'civic-end-xtra civic-rail-xtra' : 'civic-end-xtra',
                      target,
                      String(word),
                    );
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: String(word), collide: true });
                }
              }
            }
          },
      },
    },
  });
})();
