// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bottom',
        'theme': 'openlook',
        'title': 'Shape Sorter',
        'menu': 'File       Edit       View       Help',
        'foot': 'Ready.',
        'accent': '#3479c7',
        'bg': '#aeb8c1',
        'surface': '#d4d9dc',
        'font': 'Arial, Helvetica, sans-serif',
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
              ' note-mode-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
            const er = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
              endWords = ctx.content.END_LABELS.map(labelOf);
            const customary = er.bool(0.5),
              placement = customary ? 'actions' : er.pick(['toolbar', 'status']);
            const endText = customary ? 'Submit' : er.pick(endWords);
            Object.assign(_c, { customary, endText, endWords, er, labelOf, placement });
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'openlook'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            for (const corner of ['tl', 'tr', 'bl', 'br']) {
              const ornament = u.el('div', 'corner corner-' + corner, shell);
              ornament.innerHTML =
                '<svg viewBox="0 0 30 30"><path d="M2 2H26L20 8L23 17L15 14L8 25L7 13L2 14Z" fill="#bd8d3d" stroke="#453016" stroke-width="2"/><path d="M4 4L18 5L11 9L9 18L8 8Z" fill="#ffe3a0"/><path d="M13 12L20 9L18 15L24 19L15 17L10 24Z" fill="#e0b25c" stroke="#674019"/></svg>';
            }
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              C.menu.split(/\s{2,}/).forEach((t, i) => {
                const b = u.el('button', 'mtab' + (i === 0 ? ' on' : ''), nav, t);
                b.type = 'button';
                b.onclick = () => {
                  nav.querySelectorAll('.mtab').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              u.el('div', 'tagline', head, 'Learn ✦ Explore ✦ Grow');
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { note, u } = _c;
            u.el(
              'div',
              'note-label',
              note,
              C.theme === 'openlook' ? 'Shapes to Sort' : C.layout === 'left' ? 'Task' : '',
            );
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const actions = u.el('div', 'action-row', shell),
              footer = u.el('footer', 'footer', shell);
            const tools = u.el('div', 'tools', actions);
            u.el('span', 'tools-label', footer, 'Ready.');
            for (const [nm, path] of [
              ['Select', 'M6 3V27L12 21L17 31L21 29L16 19H25Z'],
              ['Clear', 'M3 20L19 3L27 10L29 16L14 31L3 24Z'],
              ['Reset', 'M10 9A10 10 0 1 1 6 20'],
            ]) {
              const w = u.el('button', 'tool2' + (nm === 'Select' ? ' sel' : ''), tools);
              w.type = 'button';
              const s = u.svg(
                'svg',
                {
                  width: 34,
                  height: 34,
                  viewBox: '0 0 32 32',
                  fill: nm === 'Clear' ? '#9290b9' : nm === 'Select' ? '#fff' : 'none',
                  stroke: nm === 'Clear' ? '#30254c' : nm === 'Select' ? '#000' : '#a8a4c5',
                  'stroke-width': nm === 'Clear' ? 1 : nm === 'Select' ? 1.6 : 3.6,
                  'stroke-linejoin': 'round',
                },
                w,
              );
              u.svg('path', { d: path }, s);
              if (nm === 'Clear') {
                u.svg(
                  'path',
                  { d: 'M3 20L14 27L29 12L27 10L12 24Z', fill: '#b0afd0', stroke: '#50456d', 'stroke-width': 0.8 },
                  s,
                );
                u.svg(
                  'path',
                  { d: 'M14 27V31M3 20L14 27M12 24L27 10', fill: 'none', stroke: '#42375f', 'stroke-width': 1 },
                  s,
                );
              }
              if (nm === 'Reset')
                u.svg('path', { d: 'M11 2L3 9L12 16Z', fill: '#a8a4c5', stroke: '#a8a4c5', 'stroke-width': 0.5 }, s);
              u.el('small', '', w, nm);
              if (nm === 'Select')
                w.onclick = () => {
                  tools.querySelectorAll('.tool2').forEach((x) => x.classList.remove('sel'));
                  w.classList.add('sel');
                };
              else w.onclick = () => env.log('tool', { label: nm });
            }
            u.el('div', 'tool-sep', footer);
            Object.assign(_c, { actions, footer, tools });
          },
        'frame.25': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { actions, ctx, endText, endWords, footer, head, placement, u } = _c;
            if (!ctx.finish) {
              const parent =
                placement === 'toolbar' ? head.querySelector('.menu') : placement === 'status' ? footer : actions;
              _c.submit = u.el('button', 'submit end-' + placement, parent, endText);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.onclick = () => ctx.submit();
            }
            const menu = head.querySelector('.menu'),
              cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const options = endWords.filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
              if (options.length) {
                const label = cr.pick(options),
                  decoy = u.el('button', 'chrome-xtra', menu, label);
                decoy.type = 'button';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            const brand = u.el('div', 'sun-brand', menu);
            brand.innerHTML =
              '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="translate(20 20) rotate(45)" fill="none" stroke="currentColor" stroke-width="2"><path d="M-12-12H-2V-2H-12ZM2-12H12V-2H2ZM-12 2H-2V12H-12ZM2 2H12V12H2Z"/><path d="M-8-10V-6H-4M4-10V-6H8M-8 4V8H-4M4 4V8H8"/></g></svg><span>Sun</span>';
            u.el('span', 'system-version', footer, 'SunOS 4.1.3');
            u.el('span', 'system-time', footer, '9:24 AM');
            Object.assign(_c, { brand, cr, menu });
          },
      },
    },
  });
})();
