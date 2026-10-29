// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'breeze',
        'title': 'Shape Sorter',
        'menu': '',
        'foot': '',
        'accent': '#2879d8',
        'bg': '#f3f6f9',
        'surface': '#f8fafc',
        'font': 'Arial, Segoe UI, sans-serif',
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
              fg: '#20344f',
              muted: '#73869e',
              line: '#d5e0ea',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'breeze'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            if (C.title) {
              const title = u.el('div', 'title', head);
              u.el('span', 'title-text', title, C.title);
            }
          },
        'frame.9': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head, C.menu);
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
            const { note, u } = _c;
            u.el('div', 'note-label', note, '');
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            if (ctx.display === 'hidden') note.hidden = true;
            else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => {
                note.style.visibility = 'hidden';
                env.log('note-close');
              };
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.17': () => () => {},
        'frame.18': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.layout === 'sheet') {
                for (const [icon, label] of [
                  ['⌂', 'Task'],
                  ['⚙', 'Settings'],
                  ['?', 'Help'],
                  ['i', 'About'],
                ]) {
                  const item = u.el('button', 'rail-item', _c.aside);
                  item.type = 'button';
                  u.el('span', 'rail-icon', item, icon);
                  u.el('span', 'rail-label', item, label);
                }
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
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endBank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
            const label = endR.bool(0.5) ? 'Submit' : labelText(endR.pick(endBank));
            const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
            const same = (x) => labelText(x).trim().toLowerCase() === label.trim().toLowerCase();
            const collidePool = [...new Set(endBank.map(labelText))].filter(
              (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
            );
            const collide =
              collidePool.length && collideR.bool(0.3)
                ? { label: collideR.pick(collidePool), where: collideR.pick(['header', 'footer']) }
                : null;
            const endButton = (parent, kind, text) => {
              const el = u.el(
                kind === 'link' ? 'a' : 'button',
                kind === 'link'
                  ? 'submit-link'
                  : 'submit ' + (kind === 'header' ? 'submit-header' : kind === 'icon' ? 'submit-icon' : ''),
                parent,
                text,
              );
              if (kind === 'link') {
                el.href = '#';
              } else el.type = 'button';
              el.dataset.role = 'submit';
              el.setAttribute('aria-label', label);
              el.title = label;
              el.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return el;
            };
            const decoyBtn = (parent, text) => {
              const b = u.el('button', 'episode-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: text, collide: true });
              return b;
            };
            _c.submit = null;
            if (placement === 'header' || (collide && collide.where === 'header')) {
              const controls = u.el('div', 'episode-header-controls', head);
              if (placement === 'header') _c.submit = endButton(controls, 'header', label);
              if (collide && collide.where === 'header') decoyBtn(controls, collide.label);
            }
            Object.assign(_c, {
              collide,
              collidePool,
              collideR,
              decoyBtn,
              endBank,
              endButton,
              endR,
              label,
              labelText,
              placement,
              same,
            });
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { collide, ctx, decoyBtn, endButton, footer, label, placement, u } = _c;
            const footerTools = u.el('div', 'episode-footer-controls', footer);
            if (!ctx.finish && placement !== 'header') {
              _c.submit = endButton(
                footerTools,
                placement === 'link' ? 'link' : placement === 'icon' ? 'icon' : 'footer',
                placement === 'icon' ? '✓' : label,
              );
            }
            if (collide && collide.where === 'footer') decoyBtn(footerTools, collide.label);
            if (['lisa', 'breeze'].includes(C.theme)) {
              const cl = u.el('button', 'clear', footer, 'Reset');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              footer.insertBefore(cl, footerTools);
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, footerTools);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            if (['aqua', 'collage'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              footer.insertBefore(reset, footerTools);
            }
            Object.assign(_c, { footerTools });
          },
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
      },
    },
  });
})();
