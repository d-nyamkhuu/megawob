// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        layout: 'three',
        theme: 'soft',
        title: '',
        menu: '',
        accent: '#277cf2',
        bg: '#edf2f8',
        surface: '#f5f8fc',
        font: 'Arial, sans-serif',
        aside: 'Task Details',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
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
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell),
              workbench = u.el('section', 'workbench', content),
              note = u.el('section', 'task-note', workbench);
            u.el('div', 'note-label', note, '');
            Object.assign(_c, { content, note, workbench });
          },
        'frame.14': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { u, workbench } = _c;
            const stage = u.el('main', 'stage', workbench);
            Object.assign(_c, { stage });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, content, ctx, note, shell, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside);
            const info = u.el('div', 'inspector-stats', _c.aside);
            // Workspace facts only; never repeat the goal or required placements.
            for (const [label, value] of [
              ['Total shapes', '—'],
              ['Boxes', '—'],
              ['Input', 'Pointer'],
            ]) {
              const row = u.el('div', 'inspector-row', info);
              u.el('span', '', row, label);
              u.el('span', '', row, value);
            }
            u.el('div', 'inspector-rule', _c.aside);
            u.el('h3', 'inspector-subhead', _c.aside, 'Pointer controls');
            const legend = u.el('div', 'inspector-legend', _c.aside);
            for (const [label, color] of [['Drag', '#ff8610'], ['Release', '#2db44a']]) {
              const row = u.el('div', 'legend-row', legend);
              u.el('i', 'legend-dot', row).style.background = color;
              u.el('span', '', row, label);
            }
            const hint = u.el('div', 'inspector-hint', _c.aside);
            hint.innerHTML = '<b>i</b><span>Drag shapes to move them around the workspace.</span>';
            const clear = u.el('button', 'clear-all', _c.aside, 'Clear All');
            clear.type = 'button';
            clear.onclick = () => env.widgetDef.clear?.();
            if (ctx.display === 'panel' && _c.aside && shell.clientWidth > 1100 && shell.clientHeight > 700)
              _c.aside.insertBefore(note, _c.aside.children[1] || null);
            body.classList.add('instruction-mode-' + ctx.display);
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
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
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              const endR = ctx.rng.fork('chrome/end');
              const keep = endR.bool(0.5);
              const placement = keep ? 'bottom' : endR.pick(['top', 'link']);
              const bank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const label = keep ? 'Submit' : String(endR.pick(bank));
              _c.aside.classList.add('end-' + placement);
              _c.submit = u.el('button', 'submit' + (placement === 'link' ? ' end-link' : ''), parent, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.onclick = () => ctx.submit();
              const collideR = ctx.rng.fork('chrome/collide');
              if (collideR.bool(0.3)) {
                const words = bank.map((x) => String(typeof x === 'string' ? x : x.label || x.text || x.name || x));
                const options = [...new Set(words)].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (options.length) {
                  const text = collideR.pick(options);
                  const d = u.el('button', 'xtra-pq', _c.aside, text);
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: text, collide: true });
                }
              }
            }
          },
      },
    },
  });
})();
