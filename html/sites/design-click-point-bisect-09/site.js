// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-bisect-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'eink',
        'title': 'Angle Practice',
        'ribbon': true,
        'foot': 'Click a point in the workspace to place a marker.',
        'accent': '#111',
        'bg': '#eeede9',
        'surface': '#f2f1ed',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            {
              body.className = 'design g09' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
              const rs = document.documentElement.style;
              for (const [k, v] of Object.entries({
                bg: '#f4eee4',
                panel: '#faf7f1',
                fg: '#080808',
                muted: '#626770',
                line: '#d5cec3',
                accent: '#e8731c',
              }))
                rs.setProperty('--' + k, v);
              rs.setProperty('--font', "'DejaVu Sans','Segoe UI',sans-serif");
              const shell = u.el('div', 'shell', body),
                head = u.el('header', 'head', shell);
              const hi = u.svg(
                'svg',
                {
                  width: 28,
                  height: 28,
                  viewBox: '0 0 28 28',
                  fill: 'none',
                  stroke: '#332b22',
                  'stroke-width': 1.3,
                  class: 'home',
                },
                head,
              );
              u.svg('path', { d: 'M5 12V25H12V18H16V25H23V12L14 4Z', fill: '#fffdf6' }, hi);
              u.svg('path', { d: 'M2 12L12 2Q14 0 16 2L26 12L24 15L14 6L4 15Z', fill: '#e99135' }, hi);
              u.el('div', 'title', head, 'Geometry Practice');
              const wc = u.el('div', 'window-controls', head);
              for (const [l, p] of [
                ['min', 'M3 15H15'],
                ['max', 'M3 3H15V15H3ZM3 5H15'],
                ['close', 'M3 3L15 15M15 3L3 15'],
              ]) {
                const bt = u.el('button', l, wc);
                bt.type = 'button';
                const s = u.svg(
                  'svg',
                  {
                    width: 22,
                    height: 22,
                    viewBox: '0 0 18 18',
                    fill: 'none',
                    stroke: '#342b24',
                    'stroke-width': 4,
                    'stroke-linejoin': 'round',
                  },
                  bt,
                );
                u.svg('path', { d: p }, s);
                u.svg('path', { d: p, stroke: '#fff', 'stroke-width': 2 }, s);
                bt.onclick = () => env.log('window-control', { label: l });
              }
              const menu = u.el('nav', 'menu', head, '');
              menu.innerHTML = '<span>File</span><span>Edit</span><span>View</span><span>Tools</span><span>Help</span>';
              const mid = u.el('div', 'mid', shell),
                idx = u.el('aside', 'aside idx', mid);
              for (let i = 1; i <= 10; i++) u.el('div', 'index-number' + (i === 1 ? ' on' : ''), idx, String(i));
              const content = u.el('div', 'content', mid),
                note = u.el('section', 'task-note', content);
              u.el('div', 'instruction', note, ctx.instruction);
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') note.classList.add('instruction-toast');
              else if (ctx.display === 'panel') note.classList.add('instruction-panel');
              const stage = u.el('main', 'stage', content);
              stage.dataset.role = 'stage';
              const footer = u.el('footer', 'footer', shell),
                left = u.el('div', 'tools', footer);
              const mk = (cls, label, path) => {
                const b = u.el('button', 'tbtn ' + cls, left);
                b.type = 'button';
                const s = u.svg(
                  'svg',
                  { width: 30, height: 30, viewBox: '0 0 32 32', fill: '#fff', stroke: '#222', 'stroke-width': 1.6 },
                  b,
                );
                u.svg('path', { d: path }, s);
                u.el('span', '', b, label);
                return b;
              };
              mk('sel on', 'Select Point', 'M8 3V27L14 22L18 30L22 28L18 20H26Z');
              const clr = mk('clr', 'Clear', 'M3 21L18 5Q20 3 22 5L29 12Q31 14 29 16L15 30H11Z');
              const er = clr.querySelector('svg');
              er.firstChild.setAttribute('fill', '#929292');
              u.svg('path', { d: 'M3 21L11 13L22 24L15 30H11Z', fill: '#ddd9d4' }, er);
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              const rawLabels = (ctx.content && ctx.content.END_LABELS) || [
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
              ];
              const labels = rawLabels.map((x) =>
                typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
              );
              let placement = 'footer',
                label = 'Submit',
                submit = null;
              if (!ctx.finish) {
                const er = ctx.rng.fork('chrome/end');
                label = er.bool(0.7) ? 'Submit' : er.pick(labels);
                placement = er.pick([
                  'footer',
                  'footer',
                  'footer',
                  'footer',
                  'footer',
                  'footer',
                  'footer',
                  'menu',
                  'link',
                  'icon',
                ]);
                const addSubmit = (parent, cls, text) => {
                  const b = u.el('button', cls, parent, text);
                  b.type = 'button';
                  b.dataset.role = 'submit';
                  b.setAttribute('aria-label', label);
                  b.title = label;
                  b.onclick = () => ctx.submit();
                  return b;
                };
                if (placement === 'menu') submit = addSubmit(menu, 'menu-submit', label);
                else if (placement === 'link') {
                  submit = u.el('a', 'footer-endlink', footer, label + ' ›');
                  submit.href = '#';
                  submit.dataset.role = 'submit';
                  submit.setAttribute('aria-label', label);
                  submit.title = label;
                  submit.onclick = (e) => {
                    e.preventDefault();
                    ctx.submit();
                  };
                } else if (placement === 'icon') {
                  submit = addSubmit(footer, 'submit submit-icon', '✓');
                } else submit = addSubmit(footer, 'submit', label);
              }
              const collideRng = ctx.rng.fork('chrome/collide');
              if (!ctx.finish && collideRng.bool(0.3)) {
                const other = labels.filter((x) => x !== label);
                if (other.length) {
                  const text = collideRng.pick(other);
                  const decoy = u.el(
                    'button',
                    placement === 'menu' ? 'menu-xtra' : 'end-xtra',
                    placement === 'menu' ? menu : left,
                    text,
                  );
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: text, collide: true });
                }
              }
              return { stage, submit };
            }
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
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
                            : t === 'Example'
                              ? 'M6 2H20L27 9V30H6ZM20 2V10H27M10 15H23M10 20H23M10 25H21'
                              : t === 'Instructions' || t === 'Help'
                                ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                                : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
          },
        'frame.22': () => () => {},
      },
    },
  });
})();
