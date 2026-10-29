// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-03',
    styles: ['site.css', 'newspaper.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'framed',
        'theme': 'chronicle',
        'title': 'The Daily Chronicle',
        'subtitle': 'TRUSTED NEWS FOR A BRIGHTER TOMORROW',
        'menu': 'Home       Nation       World       Business       Sports       Life       Opinion',
        'foot': '',
        'accent': '#b7191b',
        'bg': '#f6f3ec',
        'surface': '#fbf8f1',
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
              u.el('div', 'dateline', head, 'Tuesday, March 15, 2011');
              const nav = u.el('nav', 'menu', head);
              C.menu.split(/\s{2,}/).forEach((t, i) => {
                const b = u.el('button', 'mtab' + (i === 0 ? ' on' : ''), nav, t);
                b.type = 'button';
                b.onclick = () => {
                  nav.querySelectorAll('.mtab').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              const search = u.el('button', 'search', nav, '⌕  Search');
              search.type = 'button';
              search.onclick = () => env.log('nav', { label: 'Search' });
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
            content.dataset.display = ctx.display;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
            const instruction = u.el('div', 'instruction', note);
            const parts = ctx.instruction.split(/("[^"]+")/g);
            for (const part of parts) {
              if (/^"/.test(part)) {
                const word = u.el('span', 'color-word', instruction, part);
                word.dataset.color = part.slice(1, -1).toLowerCase();
              } else instruction.appendChild(document.createTextNode(part));
            }
            Object.assign(_c, { instruction, parts });
          },
        'frame.15': () => () => {},
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { ctx, footer, head, shell, u } = _c;
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
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endR.bool(0.5);
            const placement = referenceEnd ? 'form' : endR.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              shell.classList.add('end-' + placement);
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit end-control-' + placement,
                placement === 'header' ? head : footer,
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
            if (collideR.bool(0.3)) {
              const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideR.pick(options),
                  decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideR, endLabel, endLabels, endR, labelOf, placement, referenceEnd, tools });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
