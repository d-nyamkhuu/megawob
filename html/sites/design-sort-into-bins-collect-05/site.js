// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'framed',
        'theme': 'fluent',
        'title': 'Shape Sorter',
        'menu': '',
        'foot': '',
        'accent': '#1877e9',
        'bg': '#f4f4f4',
        'surface': '#fffefd',
        'font': "'Segoe UI', Arial, sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'fluent'].includes(C.theme)) {
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
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const endWords = (
              ctx.content.END_LABELS || [
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
              ]
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            const label = er.bool(0.5)
              ? 'Submit'
              : er.pick(endWords.filter((x) => x.trim().toLowerCase() !== 'submit'));
            const placement = ctx.finish
              ? null
              : er.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon']);
            const submitBtn = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (!ctx.finish) {
              if (placement === 'footer') _c.submit = submitBtn(footer, 'submit', label);
              else if (placement === 'link') _c.submit = submitBtn(footer, 'end-link', label + ' ›');
              else if (placement === 'icon') _c.submit = submitBtn(head, 'submit end-icon', '✓');
              else _c.submit = submitBtn(head, 'submit end-header', label);
            }
            _c.collide = null;
            if (!ctx.finish && cr.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
              );
              if (options.length) _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
            }
            const decoy = (parent, item) => {
              const b = u.el('button', 'xtra-end', parent, item.label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: item.label, collide: true });
            };
            if (_c.collide) decoy(_c.collide.where === 'header' ? head : footer, _c.collide);
            if (C.theme === 'lisa' || C.theme === 'fluent') {
              const cl = u.el('button', 'clear', footer, C.theme === 'fluent' ? 'Reset' : 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(cl, _c.submit);
            }
            Object.assign(_c, { cr, decoy, endWords, er, label, placement, submitBtn });
          },
      },
    },
  });
})();
