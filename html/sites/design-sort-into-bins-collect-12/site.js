// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-collect-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'flash',
        'theme': 'flash',
        'title': 'Shape Sorter',
        'subtitle': 'Sort the shapes into the correct place.',
        'menu': '',
        'foot': 'Need help? Click the  ?  icon.',
        'accent': '#1766bd',
        'bg': '#fff8d8',
        'surface': '#fff8d8',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.theme === 'flash') {
              const logo = u.svg('svg', { class: 'shape-logo', viewBox: '0 0 108 68', 'aria-hidden': 'true' }, head);
              u.svg('path', { d: 'M52 19L91 17L102 40L71 50Z', fill: '#0755a9' }, logo);
              u.svg(
                'path',
                { d: 'M85 41L103 37L107 58L88 60Z', fill: '#1698ef', stroke: '#07366d', 'stroke-width': 1.6 },
                logo,
              );
              u.svg('circle', { cx: 23, cy: 25, r: 13, fill: '#16a858', stroke: '#072c32', 'stroke-width': 1.7 }, logo);
              u.svg('path', { d: 'M47 10L76 60H19Z', fill: '#ffb518', stroke: '#0a1c29', 'stroke-width': 1.8 }, logo);
              u.svg(
                'path',
                { d: 'M44 28H61C76 28 78 54 62 55H44Z', fill: '#0da77d', stroke: '#092327', 'stroke-width': 1.8 },
                logo,
              );
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
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, note, shell, u } = _c;
            const foot = u.el('div', 'footer-copy', footer, 'Need help? Click the');
            const help = u.el('span', 'help-dot', foot, '?');
            u.el('span', '', foot, ' icon.');
            if (ctx.display === 'toast') {
              footer.insertBefore(note, foot);
              foot.hidden = true;
            }
            const endRng = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const placement = endRng.bool(0.5) ? 'footer' : endRng.pick(['header', 'link']);
            const endLabel =
              placement === 'footer'
                ? endLabels.find((label) => label === 'Submit') || endLabels[0]
                : endRng.pick(endLabels);
            shell.dataset.end = ctx.finish ? 'finish' : placement;
            const footerTools = u.el('div', 'chrome-tools', footer);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : footerTools;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'link' ? ' end-link' : placement === 'header' ? ' end-header' : ''),
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
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideRng.pick(options),
                  decoy = u.el('button', 'chrome-xtra', footerTools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                if (_c.submit && _c.submit.parentNode === footerTools) footerTools.insertBefore(decoy, _c.submit);
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
            Object.assign(_c, { collideRng, endLabel, endLabels, endRng, foot, footerTools, help, labelOf, placement });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'overlay.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, el, u } = _c;
            if (ctx.initial) {
              el.classList.add('layout-recovery');
              u.el('div', 'warning-mark', box, '!');
              const bar = u.el('div', 'recovery-title', box);
              u.el('span', 'recovery-caution', bar, '⚠');
              u.el('span', 'recovery-title-text', bar, 'Layout Problem');
              const close = u.el('button', 'recovery-x', bar, '×');
              close.type = 'button';
              close.onclick = () => ctx.dismiss('close');
              u.el('strong', 'recovery-heading', box, 'Layout could not be restored.');
              u.el(
                'p',
                'recovery-copy',
                box,
                'Your previous layout could not be loaded correctly.\nSome controls may be out of place.\n\nClick “Use default layout” to restore the workspace\nand continue this task. Your task data will be kept.',
              );
              const actions = u.el('div', 'recovery-actions', box);
              const restore = u.el('button', 'recovery-restore', actions, 'Use default layout');
              restore.type = 'button';
              restore.onclick = () => ctx.dismiss('close');
              const keep = u.el('button', 'recovery-keep', actions, 'Keep current layout');
              keep.type = 'button';
              keep.onclick = () => ctx.dismiss('close');
              return { el, dismiss: restore };
            }
            const o = C.ob;
            Object.assign(_c, { o });
          },
      },
    },
  });
})();
