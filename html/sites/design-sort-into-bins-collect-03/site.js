// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'office-ribbon',
        'theme': 'office',
        'title': 'Shape Sorter - Activity 1',
        'menu': 'Home       View       Tools       Help',
        'ribbon': true,
        'foot': 'Drag the orange shapes into the box.',
        'accent': '#1768bd',
        'bg': '#e7f0fa',
        'surface': '#fbfcfd',
        'font': 'Segoe UI, Tahoma, Arial, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' instruction-mode-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              const title = u.el('div', 'title', head);
              u.el('span', 'title-text', title, C.title);
              if (C.theme === 'lisa') {
                const zoom = u.svg(
                  'svg',
                  { class: 'zoom-icon', viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 2 },
                  title,
                );
                u.svg('path', { d: 'M3 3H21V21H3ZM8 8H17V14H12V18H8Z' }, zoom);
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head);
              if (C.theme === 'office') {
                for (const [i, label] of C.menu.split(/\s{2,}/).entries()) {
                  const tab = u.el('button', 'menu-tab', menu, label);
                  tab.type = 'button';
                  if (i === 0) tab.classList.add('active');
                  tab.onclick = () => {
                    menu.querySelectorAll('.menu-tab').forEach((x) => x.classList.remove('active'));
                    tab.classList.add('active');
                  };
                }
              } else menu.textContent = C.menu;
              if (C.theme === 'lisa') {
                const apple = u.svg('svg', { class: 'apple-icon', viewBox: '0 0 30 36', fill: '#080808' }, menu);
                u.svg(
                  'path',
                  {
                    d: 'M18 8C18 4 21 1 25 1C25 5 22 8 18 8ZM15 11C10 7 4 10 3 16C1 23 5 32 10 34C12 35 14 32 17 33C21 36 23 33 26 28C20 25 20 18 27 15C24 9 20 8 15 11Z',
                  },
                  apple,
                );
                const doc = u.svg(
                  'svg',
                  { class: 'document-icon', viewBox: '0 0 28 34', fill: 'none', stroke: '#111', 'stroke-width': 1.8 },
                  menu,
                );
                u.svg(
                  'path',
                  { d: 'M3 2H20L25 7V31H3ZM20 2V8H25M7 7H15V11H7ZM7 15H21V27H7ZM10 18H18M10 21H20M10 24H17' },
                  doc,
                );
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
                    ? ['Clipboard', 'Edit', 'View', 'Activity']
                    : ['Navigation', 'Draw', 'Options', 'Support'];
              for (const [j, name] of groups.entries()) {
                const gr = u.el('div', 'tool-group', rib);
                if (j === 0) {
                  for (const t of C.theme === 'office'
                    ? ['Paste', 'Cut', 'Copy']
                    : ['Select', 'Pan', 'Zoom In', 'Zoom Out', C.theme === 'office' ? 'Fit to Window' : 'Reset View']) {
                    const path =
                      t === 'Select'
                        ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                        : t === 'Pan'
                          ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z'
                          : t === 'Paste'
                            ? 'M8 4H20L25 9V29H8ZM20 4V10H25M12 15H21M12 19H21M12 23H19'
                            : t === 'Cut'
                              ? 'M6 8A3 3 0 1 1 12 8A3 3 0 1 1 6 8M20 24A3 3 0 1 1 26 24A3 3 0 1 1 20 24M10 10L24 22M24 10L10 22'
                              : t === 'Copy'
                                ? 'M11 11H26V29H11ZM6 6H21V9M6 6V24H9'
                                : t === 'Move'
                                  ? 'M16 2V30M2 16H30M16 2L11 8M16 2L21 8M16 30L11 24M16 30L21 24M2 16L8 11M2 16L8 21M30 16L24 11M30 16L24 21'
                                  : t === 'Delete'
                                    ? 'M6 6L26 26M26 6L6 26'
                                    : t === 'Zoom In' || t === 'Zoom Out'
                                      ? 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' +
                                        (t === 'Zoom In' ? 'M14 8V20' : '')
                                      : t === 'Fit'
                                        ? 'M2 10H30M2 10L8 5M2 10L8 15M30 10L24 5M30 10L24 15M2 22H30M2 22L8 17M2 22L8 27M30 22L24 17M30 22L24 27'
                                        : t === 'Reset' || t === 'Reset View'
                                          ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                                          : t === 'Submit'
                                            ? 'M4 17L12 25L28 7'
                                            : 'M5 5H27V27H5Z';
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
                          ? ['Select', 'Move', 'Delete']
                          : j === 2
                            ? ['Zoom In', 'Zoom Out', 'Fit']
                            : ['Reset', 'Submit']
                        : j === 1
                          ? ['Line', 'Circle', 'Rectangle', 'Point']
                          : ['Help', 'About'];
                  for (const t of names)
                    tool(
                      gr,
                      t,
                      C.theme === 'office'
                        ? t === 'Select'
                          ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                          : t === 'Move'
                            ? 'M16 2V30M2 16H30M16 2L11 8M16 2L21 8M16 30L11 24M16 30L21 24M2 16L8 11M2 16L8 21M30 16L24 11M30 16L24 21'
                            : t === 'Delete'
                              ? 'M6 6L26 26M26 6L6 26'
                              : t === 'Zoom In' || t === 'Zoom Out'
                                ? 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' +
                                  (t === 'Zoom In' ? 'M14 8V20' : '')
                                : t === 'Fit'
                                  ? 'M2 10H30M2 10L8 5M2 10L8 15M30 10L24 5M30 10L24 15M2 22H30M2 22L8 17M2 22L8 27M30 22L24 17M30 22L24 27'
                                  : t === 'Reset'
                                    ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                                    : 'M4 17L12 25L28 7'
                        : t.includes('Circle')
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
        'frame.12': () => () => {},
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, instruction, note, u } = _c;
            if (C.theme === 'lisa')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 90 / ctx.instruction.length));
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
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
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
                'office-ribbon',
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
              } else if (C.layout === 'offset' || C.layout === 'office-ribbon') {
                for (const text of ['Select', 'Pan', 'Eraser']) u.el('button', 'map-tool', _c.aside, text);
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
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, shell, u } = _c;
            u.el('div', 'footer-copy', footer, ctx.display === 'hidden' ? 'Ready' : C.foot || '');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const endRng = ctx.rng.fork('chrome/end');
            const placement = endRng.pick(['footer', 'footer', 'ribbon', 'link']);
            const endText = placement === 'footer' ? 'Submit' : endRng.pick(endWords);
            shell.dataset.endPlacement = ctx.finish ? 'none' : placement;
            const ribbonCheck = [...shell.querySelectorAll('.tool')].find((bt) => bt.textContent === 'Submit');
            if (ribbonCheck) {
              ribbonCheck.querySelector('span').textContent = 'Check';
              ribbonCheck.addEventListener('click', () => {
                if (ribbonCheck.dataset.role !== 'submit') env.log('decoy', { label: 'Check' });
              });
            }
            Object.assign(_c, { endRng, endText, endWords, labelOf, placement, ribbonCheck });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, endText, endWords, footer, placement, ribbonCheck, u } = _c;
            if (!ctx.finish) {
              if (placement === 'ribbon') {
                _c.submit = ribbonCheck;
                _c.submit.querySelector('span').textContent = endText;
                _c.submit.classList.add('ribbon-end');
              } else {
                _c.submit = u.el(
                  placement === 'link' ? 'a' : 'button',
                  'submit' + (placement === 'link' ? ' end-link' : ''),
                  footer,
                  endText,
                );
                if (placement === 'link') {
                  _c.submit.href = '#';
                } else _c.submit.type = 'button';
              }
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const options = endWords.filter((label) => label.trim().toLowerCase() !== endText.trim().toLowerCase());
              if (options.length) {
                const label = collideRng.pick(options),
                  decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(decoy, _c.submit);
              }
            }
            if (C.theme === 'lisa') {
              const cl = u.el('button', 'clear', footer, 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit) footer.insertBefore(cl, _c.submit);
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
