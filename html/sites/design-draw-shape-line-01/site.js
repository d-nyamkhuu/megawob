// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-line-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'motif',
        'title': 'Line Task - /usr/local/bin/drawline',
        'menu': 'File    Edit    View    Tools',
        'foot':
          'Drawing Tools         Line         Eraser         Clear                       Line Settings     Color: Black     Width: 1',
        'accent': '#505b80',
        'bg': '#c6c5bb',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const m of ['File', 'Edit', 'View', 'Tools']) {
                const s = u.el('span', 'mi' + (m === 'Tools' ? ' on' : ''), nav);
                s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
              }
              const hp = u.el('span', 'mi help', nav);
              hp.innerHTML = '<u>H</u>elp';
              const dd = u.el('div', 'tearoff', head);
              u.el('div', 'tr-title', dd, 'Tools');
              for (const [a, b] of [
                ['Draw Line', 'Ctrl+L'],
                ['Erase', 'Ctrl+E'],
                ['Clear', 'Ctrl+K'],
              ]) {
                const r = u.el('div', 'tr-row', dd);
                u.el('span', '', r, a);
                u.el('span', '', r, b);
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            note.classList.add('motif-instr-' + ctx.display);
            u.el('div', 'note-label', note, ctx.display === 'panel' ? 'Task instructions' : '');
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            if (ctx.display === 'hidden') note.hidden = true;
            else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => {
                note.style.visibility = 'hidden';
                env.log('note-close');
              };
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const fc = u.el('div', 'footer-copy', footer);
            const g1 = u.el('div', 'grp g-tools', fc);
            u.el('span', 'glabel', g1, 'Drawing Tools');
            const tl = [
              ['Line', 'M2 33L35 4'],
              ['Eraser', 'M9 24L21 9Q24 6 27 9L32 14Q34 17 31 20L19 33Q17 35 14 33L9 30Z'],
              ['Clear', 'M10 7H27Q29 7 29 9V29H9V9Z'],
            ];
            for (const [n, p] of tl) {
              const w = u.el('div', 'tw', g1);
              const b = u.el('button', 'tbtn' + (n === 'Line' ? ' sel' : ''), w);
              b.type = 'button';
              const sv = u.svg(
                'svg',
                {
                  width: 38,
                  height: 38,
                  viewBox: '0 0 38 38',
                  fill: n === 'Eraser' ? '#82827c' : 'none',
                  stroke: '#111',
                  'stroke-width': n === 'Line' ? 2.7 : 1.5,
                },
                b,
              );
              if (n === 'Clear') sv.setAttribute('stroke-dasharray', '2 1.5');
              u.svg('path', { d: p }, sv);
              if (n === 'Eraser') {
                u.svg(
                  'path',
                  { d: 'M9 24L15 25L20 30L19 33M15 25L27 11M21 9L27 11L32 16', fill: 'none', 'stroke-width': 0.8 },
                  sv,
                );
              }
              if (n === 'Clear') {
                u.svg(
                  'rect',
                  {
                    x: 13,
                    y: 11,
                    width: 12,
                    height: 15,
                    rx: 3,
                    fill: '#cbd0d4',
                    stroke: '#eee',
                    'stroke-width': 2,
                    'stroke-dasharray': 'none',
                  },
                  sv,
                );
                u.svg('ellipse', { cx: 19, cy: 18, rx: 4, ry: 6, fill: '#d8dce0', stroke: 'none' }, sv);
              }
              u.el('span', '', w, n);
              if (n === 'Clear') b.onclick = () => env.widgetDef.clear?.();
            }
            const g2 = u.el('div', 'grp g-set', fc);
            u.el('span', 'glabel', g2, 'Line Settings');
            const cl = u.el('span', 'lbl', g2);
            cl.innerHTML = 'Col<u>o</u>r:';
            const sw = u.el('span', 'swatch', g2);
            u.el('span', 'swc', sw);
            u.el('span', 'swd', sw, '▼');
            u.el('span', 'lbl wl', g2, 'Width:');
            const wb = u.el('span', 'wbox', g2);
            u.el('span', 'wv', wb, '1');
            const spinner = u.el('span', 'wsp', wb);
            u.el('span', '', spinner, '▲');
            u.el('span', '', spinner, '▼');
            Object.assign(_c, { cl, fc, g1, g2, spinner, sw, tl, wb });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endPool = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
            ).map(labelText);
            const weightedEndPool = endPool.flatMap((x) => (x.trim().toLowerCase() === 'submit' ? [x, x, x, x] : [x]));
            const label = ctx.finish ? null : endR.pick(weightedEndPool);
            const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'menu', 'link', 'icon']);
            const endButton = (parent, cls, text) => {
              const b = u.el(cls === 'motif-end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            const decoyPool = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
            )
              .map(labelText)
              .filter((x) => !label || x.trim().toLowerCase() !== label.trim().toLowerCase());
            const collide =
              collideR.bool(0.3) && decoyPool.length
                ? { label: collideR.pick(decoyPool), where: collideR.pick(['menu', 'footer']) }
                : null;
            const decoyBtn = (parent, text) => {
              const b = u.el('button', 'motif-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            if (!ctx.finish) {
              const rs = u.el('button', 'reset', footer, 'Reset');
              rs.type = 'button';
              rs.onclick = () => env.widgetDef.clear?.();
              if (placement === 'footer') {
                _c.submit = endButton(footer, 'submit', label);
                footer.insertBefore(_c.submit, rs);
              } else if (placement === 'menu') {
                const tools = head.querySelector('.menu');
                _c.submit = endButton(tools, 'motif-end-menu', label);
              } else if (placement === 'link') {
                _c.submit = endButton(footer, 'motif-end-link', label + ' ›');
                footer.insertBefore(_c.submit, rs);
              } else {
                _c.submit = endButton(footer, 'submit motif-end-icon', '✓');
                _c.submit.title = label;
                footer.insertBefore(_c.submit, rs);
              }
            }
            if (collide) {
              if (collide.where === 'menu') {
                const tools = head.querySelector('.menu');
                decoyBtn(tools, collide.label);
              } else decoyBtn(footer, collide.label);
            }
            Object.assign(_c, {
              collide,
              collideR,
              decoyBtn,
              decoyPool,
              endButton,
              endPool,
              endR,
              label,
              labelText,
              placement,
              weightedEndPool,
            });
          },
      },
    },
  });
})();
