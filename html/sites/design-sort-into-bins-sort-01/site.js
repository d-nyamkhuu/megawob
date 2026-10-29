// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bottom',
        'theme': 'cdrom',
        'title': 'Discovery Workshop',
        'menu': 'Activities       Games       Creativity       Reference       Help',
        'foot': 'Tools        Select        Clear        Reset',
        'accent': '#137d45',
        'bg': '#352178',
        'surface': '#efe1bc',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.3': () => () => {},
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
            const { ctx, note, u } = _c;
            u.el(
              'div',
              'note-label',
              note,
              C.layout === 'left' ? 'Task' : ctx.display === 'panel' ? 'Activity instructions' : '',
            );
          },
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { body, ctx, footer, u } = _c;
            if (ctx.finish) body.classList.add('finish-mode');
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
            const divider = u.el('div', 'tool-sep', footer);
            _c.submit = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                defaultEnd = er.bool(0.5),
                label = defaultEnd
                  ? 'Submit'
                  : (Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                      ? ctx.content.END_LABELS
                      : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])[
                      er.int(
                        0,
                        (ctx.content.END_LABELS && ctx.content.END_LABELS.length
                          ? ctx.content.END_LABELS
                          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
                        ).length - 1,
                      )
                    ];
              const where = defaultEnd ? 'right' : er.pick(['center', 'left']);
              _c.submit = u.el('button', 'submit end-' + where, footer, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = () => ctx.submit();
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const bank =
                  Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
                const choices = bank.filter(
                  (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
                );
                if (choices.length) {
                  const text = choices[cr.int(0, choices.length - 1)];
                  const decoy = u.el('button', 'end-xtra', footer, String(text));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: String(text), collide: true });
                }
              }
            } else divider.hidden = true;
            Object.assign(_c, { divider, tools });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
