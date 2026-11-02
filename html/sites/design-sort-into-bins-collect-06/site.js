// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'plain',
        'title': '',
        'menu': '',
        'foot': '',
        'accent': '#111',
        'bg': '#fff',
        'surface': '#fff',
        'font': "'Times New Roman', Times, serif",
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
            if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
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
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, instruction, note, u } = _c;
            if (C.theme === 'lisa')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 90 / ctx.instruction.length));
            if (C.theme === 'plain')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 86 / ctx.instruction.length));
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
            const { content, ctx, head, shell, u } = _c;
            const footer = u.el('footer', 'footer', shell),
              actions = u.el('div', 'dock-actions', footer);
            u.el('strong', 'dock-heading', actions, 'Actions');
            u.el('div', 'dock-help', actions, 'Use your pointer to drag shapes.');
            const reset = u.el('button', 'clear dock-reset', actions, 'Reset');
            reset.type = 'button';
            reset.onclick = () => env.widgetDef.clear?.();
            const clearBox = u.el('button', 'clear dock-clear', actions, 'Clear Box');
            clearBox.type = 'button';
            clearBox.onclick = () => env.widgetDef.clear?.();
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endR = ctx.rng.fork('chrome/end'),
              endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              endLabel = original ? 'Submit' : endR.pick(endLabels);
            const placement = original ? 'footer' : endR.pick(['header', 'link']);
            const endTools = u.el('div', 'dock-end-tools', footer);
            _c.submit = null;
            footer.classList.toggle('finish-mode', ctx.finish);
            if (!ctx.finish) {
              if (placement === 'header') head.classList.add('end-toolbar');
              const parent = placement === 'header' ? head : endTools;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideR.pick(options),
                  decoy = u.el('button', 'dock-xtra', endTools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                if (_c.submit?.parentNode === endTools) endTools.insertBefore(decoy, _c.submit);
              }
            }
            content.classList.add('display-' + ctx.display);
            Object.assign(_c, {
              actions,
              clearBox,
              collideR,
              endLabel,
              endLabels,
              endR,
              endTools,
              footer,
              labelOf,
              original,
              placement,
              reset,
            });
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
