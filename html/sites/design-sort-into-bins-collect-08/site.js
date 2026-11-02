// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'pixelcraft',
        'title': 'Shape Sorter',
        'menu': 'Task    Settings    Help',
        'foot': '',
        'accent': '#05a7b5',
        'bg': '#d2deed',
        'surface': '#fffceb',
        'font': 'monospace',
      },
      parts: {
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
              const menu = u.el('nav', 'menu', head, C.theme === 'pixelcraft' ? '' : C.menu);
              if (C.theme === 'pixelcraft') {
                for (const [i, label] of ['Task', 'Settings', 'Help'].entries()) {
                  const tab = u.el('button', 'top-tab', menu, label);
                  tab.type = 'button';
                  if (i === 0) tab.classList.add('active');
                }
              }
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
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
            content.dataset.display = ctx.display;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
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
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.theme === 'pixelcraft') {
                const bar = u.el('div', 'preview-title', _c.aside, 'Preview');
                for (const glyph of ['−', '□', '×']) u.el('span', 'preview-control', bar, glyph);
                u.el('div', 'preview-frame', _c.aside);
              } else if (C.tabs) {
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
            const endR = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endR.bool(0.5);
            const endPlacement = referenceEnd ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
            Object.assign(_c, { endLabel, endLabels, endPlacement, endR, labelOf, referenceEnd });
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, endLabel, endPlacement, footer, u } = _c;
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el(
                endPlacement === 'link' ? 'a' : 'button',
                'submit' + (endPlacement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (endPlacement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (C.theme === 'lisa' || C.theme === 'pixelcraft') {
              const cl = u.el('button', 'clear', footer, C.theme === 'pixelcraft' ? 'Clear All' : 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit) footer.insertBefore(cl, _c.submit);
              if (C.theme === 'pixelcraft') {
                const undo = u.el('button', 'undo', footer, 'Undo');
                undo.type = 'button';
                undo.disabled = true;
                if (_c.submit) footer.insertBefore(undo, _c.submit);
              }
            }
          },
        'frame.30': (base, S) =>
          function (_c) {
            const { ctx, endLabel, endLabels, endPlacement, footer, head, shell, stage, u } = _c;
            if (_c.submit && endPlacement === 'toolbar') {
              const tools = u.el('div', 'end-tools', shell);
              tools.setAttribute('aria-label', 'Task tools');
              tools.append(_c.submit);
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideR.pick(options);
                const decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(decoy, _c.submit);
              }
            }
            for (const tab of head.querySelectorAll('.top-tab'))
              tab.onclick = () => env.log('decoy', { label: tab.textContent });
            return { stage, submit: _c.submit };
            Object.assign(_c, { collideR });
          },
      },
    },
  });
})();
