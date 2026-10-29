// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bottom',
        'theme': 'gnome',
        'title': 'Shape Sorter',
        'menu': 'File       Edit       View       Help',
        'accent': '#e87927',
        'bg': '#ddd0bc',
        'surface': '#f1e8d7',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.classList.add('display-' + ctx.display);
            const endRng = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
              endLabels = ctx.content.END_LABELS.map(labelOf);
            const usualEnd = endRng.bool(0.5),
              endPlacement = usualEnd ? 'footer' : endRng.pick(['link', 'toolbar']),
              endText = usualEnd ? 'Submit' : endRng.pick(endLabels);
            const collideRng = ctx.rng.fork('chrome/collide');
            Object.assign(_c, { collideRng, endLabels, endPlacement, endRng, endText, labelOf, usualEnd });
          },
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'gnome'].includes(C.theme)) {
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
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { ctx, endPlacement, footer, u } = _c;
            footer.classList.toggle('without-end', ctx.finish || endPlacement === 'toolbar');
            const tools = u.el('div', 'tools', footer);
            u.el('span', 'tools-label', tools, 'Tools');
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
            Object.assign(_c, { tools });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { collideRng, ctx, endLabels, endPlacement, endText, footer, head, u } = _c;
            if (!ctx.finish) {
              const parent =
                endPlacement === 'toolbar'
                  ? head.querySelector('.menu')
                  : C.layout === 'three' && _c.aside
                    ? _c.aside
                    : footer;
              _c.submit = u.el('button', 'submit end-' + endPlacement, parent, endText);
              _c.submit.type = 'button';
              _c.submit.title = endText;
              _c.submit.setAttribute('aria-label', endText);
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
            if (collideRng.bool(0.3)) {
              const pool = endLabels.filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
              if (pool.length) {
                const label = collideRng.pick(pool),
                  decoy = u.el('button', 'end-xtra', head.querySelector('.menu'), label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
          },
      },
    },
  });
})();
