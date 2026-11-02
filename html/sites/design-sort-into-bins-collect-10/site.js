// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'open',
        'theme': 'bauhaus',
        'title': 'Shape Sort',
        'menu': '',
        'foot': '',
        'accent': '#111111',
        'bg': '#faf7ed',
        'surface': '#faf7ed',
        'font': 'Arial, Helvetica, sans-serif',
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
        'frame.24': (base, S) =>
          function (_c) {
            const { ctx, head, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              endLabels = ctx.content.END_LABELS || [
                'Submit',
                'Done',
                'Finish',
                'Continue',
                'Save',
                'OK',
                'Confirm',
                'Apply',
                '✓',
              ];
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || 'Submit');
            const label = ctx.finish ? null : labelOf(endRng.pick(endLabels));
            const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const values = [...new Set(endLabels.map(labelOf))],
                choices = values.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (choices.length) _c.collision = collideRng.pick(choices);
            }
            const headerEnd = placement === 'header';
            _c.submit = null;
            if (headerEnd) {
              const action = u.el('div', 'header-actions', head);
              if (_c.collision) {
                const d = u.el('button', 'xtra', action, _c.collision);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: _c.collision, collide: true });
              }
              _c.submit = u.el('button', 'submit header-submit', action, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
            const footer = u.el('footer', 'footer', shell);
            Object.assign(_c, { collideRng, endLabels, endRng, footer, headerEnd, label, labelOf, placement });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, headerEnd, label, placement, u } = _c;
            if (!ctx.finish && !headerEnd) {
              if (placement === 'link') {
                _c.submit = u.el('a', 'submit end-link', footer, label + ' ›');
                _c.submit.href = '#';
                _c.submit.dataset.role = 'submit';
                _c.submit.setAttribute('aria-label', label);
                _c.submit.title = label;
                _c.submit.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
              } else {
                _c.submit = u.el('button', 'submit', footer, label);
                _c.submit.type = 'button';
                _c.submit.dataset.role = 'submit';
                _c.submit.onclick = () => ctx.submit();
              }
            }
            if (_c.collision && !headerEnd) {
              const d = u.el('button', 'xtra', footer, _c.collision);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.onclick = () => env.log('decoy', { label: _c.collision, collide: true });
            }
            if (C.theme === 'lisa' || C.theme === 'bauhaus') {
              const cl = u.el('button', 'clear', footer, 'Clear');
              cl.type = 'button';
              cl.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (_c.submit && _c.submit.parentElement === footer) footer.insertBefore(cl, _c.submit);
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
