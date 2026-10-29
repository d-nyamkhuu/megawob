// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'document',
        'theme': 'openlook',
        'title': 'Shape Task',
        'subtitle': '',
        'menu': '📌 File     📌 Edit     📌 View     📌 Tools     📌 Help',
        'foot': '',
        'accent': '#80a9d0',
        'bg': '#c8c8c8',
        'surface': '#d4d5d6',
        'font': "'Lucida Sans', 'Segoe UI', Arial, sans-serif",
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
              ' instruction-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'openlook'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '−', '□']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            if (C.theme === 'openlook') {
              const mark = u.svg(
                'svg',
                {
                  class: 'window-mark',
                  width: 40,
                  height: 40,
                  viewBox: '0 0 40 40',
                  fill: 'none',
                  stroke: '#122331',
                  'stroke-width': 1.7,
                  'stroke-linecap': 'square',
                  'aria-hidden': 'true',
                },
                head,
              );
              u.svg(
                'path',
                {
                  d: 'M20 10L30 20L20 30L10 20ZM20 14L26 20L20 26L14 20ZM20 18L22 20L20 22L18 20ZM20 2V7M20 33V38M2 20H7M33 20H38M7 7L11 11M29 29L33 33M7 33L11 29M29 11L33 7M12 3L14 8M26 32L28 37M3 12L8 14M32 26L37 28M3 28L8 26M32 14L37 12M12 37L14 32M26 8L28 3',
                },
                mark,
              );
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head);
              if (C.theme === 'openlook') {
                for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
                  const group = u.el('span', 'menu-item', menu);
                  const pin = u.svg('svg', { width: 24, height: 30, viewBox: '0 0 24 30', fill: '#101820' }, group);
                  u.svg('path', { d: 'M8 1H18V3L16 5V12L19 14V17H14L12 28L10 17H5V14L8 12V5L6 3V1Z' }, pin);
                  u.el('span', '', group, label);
                }
              } else menu.textContent = C.menu;
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el('div', 'note-label', note, C.layout === 'left' || C.theme === 'openlook' ? 'Task' : '');
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'minimal' || C.theme === 'openlook') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'shape';
              const color = (ctx.plainInstruction || ctx.instruction)
                .match(/\b(blue|red|green|yellow|orange|purple|pink|cyan|teal|brown|gray)\b/i)?.[0]
                .toLowerCase();
              const target = color ? color + ' ' + shape : shape;
              const steps = u.el('ol', 'steps', note);
              if (C.theme === 'openlook') u.el('h3', '', note, 'Actions');
              for (const text of C.theme === 'openlook'
                ? ['Point to the ' + shape + '.', 'Drag it into the box.', 'Release to place it.']
                : [
                    'Drag the ' + target + ' from its current position.',
                    'Drop it inside the rectangular box.',
                    'The ' + shape + ' must fit fully inside the box.',
                  ])
                u.el('li', '', steps, text);
              if (C.theme === 'minimal') {
                u.el('h3', '', note, 'Notes');
                const nl = u.el('ul', 'notes-list', note);
                for (const text of [
                  'Use your mouse or trackpad (pointer) to move the ' + shape + '.',
                  'Do not resize the shape.',
                  'The ' + shape + ' must be completely inside the box, not touching or outside the borders.',
                ])
                  u.el('li', '', nl, text);
              }
            }
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (C.theme === 'openlook' && ctx.display === 'header') {
              const lead = u.el('div', 'document-instruction', content, ctx.instruction);
              lead.setAttribute('aria-hidden', 'true');
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            if (['aqua', 'collage', 'openlook'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit) footer.insertBefore(reset, _c.submit);
            }
            if (C.theme === 'openlook' && _c.submit) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const place = er.pick(['footer', 'footer', 'toolbar', 'link']);
              const opts = ctx.content && ctx.content.END_LABELS;
              const label = opts && opts.length ? opts[er.int(0, opts.length - 1)] : 'Submit';
              _c.submit.textContent = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              if (place === 'toolbar') {
                _c.submit.classList.add('toolbar-end');
                (head.querySelector('.menu') || head).appendChild(_c.submit);
              } else if (place === 'link') {
                _c.submit.classList.add('end-link');
                _c.submit.textContent = label + ' ›';
              }
              if (cr.bool(0.3)) {
                const labels =
                  opts && opts.length
                    ? opts
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
                const pool = labels
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (pool.length) {
                  const text = pool[cr.int(0, pool.length - 1)],
                    parent = cr.bool(0.5) ? footer : head.querySelector('.menu') || head,
                    d = u.el('button', 'xtra-end', parent, text);
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: text, collide: true });
                }
              }
            }
          },
      },
    },
  });
})();
