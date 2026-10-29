// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'library',
        'title': 'Riverton Public Library',
        'subtitle': 'Catalog   ·   Knowledge   ·   Community',
        'menu': 'Search     |     Browse     |     My Account     |     Help',
        'foot': '',
        'accent': '#762d38',
        'bg': '#f8f5eb',
        'surface': '#fffdf6',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              if (C.theme === 'library') {
                const mark = u.svg(
                  'svg',
                  {
                    class: 'library-mark',
                    viewBox: '0 0 104 76',
                    fill: 'none',
                    stroke: '#762d38',
                    'stroke-width': 1.4,
                  },
                  head,
                );
                u.svg(
                  'path',
                  {
                    d: 'M4 23Q14 19 23 23V67Q14 63 4 67ZM23 23Q31 19 39 23V67Q31 63 23 67ZM42 12Q52 8 62 12V65Q52 61 42 65ZM62 12Q71 9 80 12V65Q71 62 62 65ZM83 25Q91 22 99 26L96 68Q89 64 81 68Z',
                  },
                  mark,
                );
                u.svg(
                  'path',
                  {
                    d: 'M7 28Q14 25 20 28M7 32Q14 29 20 32M7 61Q14 58 20 61M26 27Q31 25 36 27M26 32Q31 30 36 32M45 18Q52 15 59 18M45 22Q52 19 59 22M45 58Q52 55 59 58M65 18Q71 16 77 18M65 22Q71 20 77 22M85 31L96 29M84 62L95 60M11 25V64M30 25V64M49 14V62M70 14V62M88 28L85 64M4 68Q14 64 23 68Q31 64 40 68Q51 63 62 68Q72 64 81 69Q91 64 99 69',
                  },
                  mark,
                );
                const spine = u.svg('path', { d: 'M13 24V64M31 23V64M52 13V61M71 13V61M89 27L86 63' }, mark);
                spine.setAttribute('stroke', '#f8f5eb');
                spine.setAttribute('stroke-width', '1.3');
              }
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
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            _c.placement = 'footer';
            _c.label = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                labels = ctx.content.END_LABELS || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                ];
              _c.label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
              _c.placement = er.pick(['footer', 'footer', 'footer', 'header', 'link']);
              const parent = _c.placement === 'header' ? head : footer;
              if (_c.placement === 'link') {
                _c.submit = u.el('a', 'submit library-endlink', parent, _c.label);
                _c.submit.href = '#';
              } else _c.submit = u.el('button', 'submit', parent, _c.label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.label);
              _c.submit.title = _c.label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const pool = (ctx.content.END_LABELS || labels)
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => x.trim().toLowerCase() !== _c.label.trim().toLowerCase());
                if (pool.length) {
                  const text = cr.pick(pool),
                    decoy = u.el('button', 'library-xtra', parent, text);
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: text, collide: true });
                }
              }
            }
            if (C.theme === 'lisa' || C.theme === 'library') {
              const cl = u.el('button', 'clear', footer, 'Clear All');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit && _c.submit.parentElement === footer) footer.insertBefore(cl, _c.submit);
            }
          },
      },
    },
  });
})();
