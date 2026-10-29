// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'fullbleed',
        'theme': 'memphis',
        'title': '',
        'menu': '',
        'foot': '',
        'accent': '#147ff0',
        'bg': '#fff9e9',
        'surface': '#fff9e9',
        'font': 'Arial, sans-serif',
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
            if (C.theme === 'memphis') {
              const source = String(ctx.instruction),
                match = /\b(blue|red|yellow|green|purple|orange|pink|brown)\b/i.exec(source);
              if (match) {
                const before = source.slice(0, match.index),
                  word = match[0],
                  after = source.slice(match.index + word.length);
                instruction.textContent = '';
                instruction.append(document.createTextNode(before));
                u.el('span', 'instruction-color color-' + word.toLowerCase(), instruction, word);
                instruction.append(document.createTextNode(after));
              }
            }
            if (C.theme === 'lisa')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 90 / ctx.instruction.length));
            if (C.theme === 'memphis' && C.layout === 'brief') {
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
            const { ctx, footer, shell, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                bank = Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish'],
                labels = bank.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
                baseline = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0],
                common = er.bool(0.5),
                label = common
                  ? baseline
                  : er.pick(
                      labels.filter((x) => x.trim().toLowerCase() !== baseline.trim().toLowerCase()).length
                        ? labels.filter((x) => x.trim().toLowerCase() !== baseline.trim().toLowerCase())
                        : labels,
                    ),
                placement = common ? 'footer' : er.pick(['header', 'link']);
              const createEnd = (parent, cls, text) => {
                const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
                if (b.tagName === 'BUTTON') b.type = 'button';
                else b.href = '#';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              if (placement === 'header') {
                _c.submit = createEnd(shell, 'header-end', label);
              } else if (placement === 'link') {
                _c.submit = createEnd(footer, 'end-link', label + ' ›');
              } else {
                _c.submit = createEnd(footer, 'submit', label);
              }
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (pool.length) {
                  const d = u.el('button', 'pqd-xtra', footer, cr.pick(pool));
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
                }
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
          },
      },
    },
  });
})();
