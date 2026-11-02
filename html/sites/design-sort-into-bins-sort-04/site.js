// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-04',
    styles: ['site.css', 'notebook.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'notebook',
        'title': 'SHAPE SORT',
        'menu': '',
        'tabs': ['PLAY', 'NOTES', 'IDEAS', 'TOOLS', 'SETTINGS'],
        'accent': '#1850d8',
        'bg': '#174bd5',
        'surface': '#f8f7f2',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.dataset.instruction = ctx.display;
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            if (C.theme === 'notebook') {
              const binding = u.el('div', 'notebook-binding', shell);
              binding.setAttribute('aria-hidden', 'true');
              for (let i = 0; i < 11; i++) u.el('i', 'binding-ring', binding);
            }
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
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              endWords = (ctx.content.END_LABELS || []).map((x) =>
                typeof x === 'string' ? x : x.label || x.text || x.name,
              );
            const endLabel = endRng.pick(
              endWords.length
                ? endWords
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'],
            );
            const endPlacement = endRng.pick(['footer', 'footer', 'footer', 'center', 'link', 'link']);
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, endLabel, endPlacement, endRng, endWords, note });
          },
        'frame.22': () => () => {},
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
            const { ctx, endLabel, endPlacement, endWords, footer, u } = _c;
            if (!ctx.finish) {
              const cls =
                endPlacement === 'center'
                  ? 'submit notebook-submit-center'
                  : endPlacement === 'link'
                    ? 'notebook-submit-link'
                    : 'submit';
              _c.submit = u.el(
                endPlacement === 'link' ? 'a' : 'button',
                cls,
                footer,
                endLabel + (endPlacement === 'link' ? ' ›' : ''),
              );
              if (_c.submit.tagName === 'BUTTON') _c.submit.type = 'button';
              else _c.submit.href = '#';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              const collideRng = ctx.rng.fork('chrome/collide');
              if (collideRng.bool(0.3)) {
                const pool = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (pool.length) {
                  const decoy = u.el('button', 'notebook-end-xtra', footer, collideRng.pick(pool));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
                }
              }
            }
          },
        'frame.30': (base, S) =>
          function (_c) {
            const { ctx, instruction, note, stage } = _c;
            if (ctx.display === 'header' || ctx.display === 'panel') {
              const ns = getComputedStyle(note);
              const available = note.clientHeight - parseFloat(ns.paddingTop) - parseFloat(ns.paddingBottom);
              let fs = parseFloat(getComputedStyle(instruction).fontSize);
              for (let i = 0; i < 6 && instruction.scrollHeight > available && available > 0; i++) {
                fs = Math.max(24, fs * Math.min(0.94, available / instruction.scrollHeight));
                instruction.style.fontSize = fs + 'px';
              }
            }
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
