// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bottom',
        'theme': 'cdrom',
        'title': 'Shape Sorter',
        'menu': 'Options       Help',
        'foot': '',
        'accent': '#286c46',
        'bg': '#24170f',
        'surface': '#f4ecd8',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'cdrom'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            if (C.title) {
              const badge = u.el('div', 'title', head);
              u.el('span', 'title-text', badge, C.title);
            }
          },
        'frame.9': () => () => {},
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
            if (ctx.display === 'header') note.classList.add('instruction-header');
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const tools = u.el('div', 'tools', footer);
            u.el('span', 'tools-label', tools, 'Tools');
            for (const [nm, path] of [
              ['Select', 'M6 3V27L12 21L17 31L21 29L16 19H25Z'],
              ['Clear', 'M3 20L19 3L27 10L29 16L14 31L3 24Z'],
              ['Reset', 'M7 16A9 9 0 1 1 9 23M7 16V8M7 16H15'],
            ]) {
              const w = u.el('button', 'tool2' + (nm === 'Select' ? ' sel' : ''), tools);
              w.type = 'button';
              const s = u.svg(
                'svg',
                {
                  width: 34,
                  height: 34,
                  viewBox: '0 0 32 32',
                  fill: nm === 'Clear' ? 'none' : nm === 'Select' ? '#fff' : 'none',
                  stroke: nm === 'Clear' ? '#21170c' : nm === 'Select' ? '#000' : '#21170c',
                  'stroke-width': nm === 'Clear' ? 2.6 : nm === 'Select' ? 1.6 : 3.2,
                  'stroke-linejoin': 'round',
                  'stroke-linecap': 'round',
                },
                w,
              );
              if (nm === 'Clear') {
                u.svg('path', { d: 'M16 3C9 3 5 8 5 14c0 5 3 7 5 9h12c2-2 5-4 5-9 0-6-4-11-11-11Z' }, s);
                u.svg('path', { d: 'M11 26h10M12 29h8M12 18c0-3-3-4-3-7m11 7c0-3 3-4 3-7M16 7v8m-3-3 3 3 3-3' }, s);
              }
              if (nm === 'Reset') {
                u.svg('path', { d: 'M7 16A9 9 0 1 1 9 23M7 16V8M7 16H15' }, s);
              }
              u.el('small', '', w, nm);
              if (nm === 'Select')
                w.onclick = () => {
                  tools.querySelectorAll('.tool2').forEach((x) => x.classList.remove('sel'));
                  w.classList.add('sel');
                };
              else w.onclick = () => env.log('tool', { label: nm });
            }
            u.el('div', 'tool-sep', footer);
            ((_c.submit = null), (_c.collide = null));
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide'),
                ends = (ctx.content && ctx.content.END_LABELS) || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                  "I'm done",
                ],
                toLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = er.bool(0.5) ? 'Submit' : toLabel(er.pick(ends));
              const place = er.pick(['footer', 'footer', 'footer', 'header', 'link']);
              if (cr.bool(0.3)) {
                const candidates = [
                  ...new Set(ends.map(toLabel).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
                ];
                if (candidates.length) _c.collide = { text: cr.pick(candidates), where: cr.pick(['header', 'footer']) };
              }
              if (place === 'header') {
                _c.submit = u.el('button', 'submit header-submit', head, label);
                _c.submit.style.position = 'absolute';
                _c.submit.style.left = '56%';
                _c.submit.style.top = '47%';
              } else if (place === 'link') {
                _c.submit = u.el('a', 'submit-link', footer, label);
                _c.submit.href = '#';
              } else {
                const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
                _c.submit = u.el('button', 'submit', parent, label);
              }
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (_c.collide) {
              const parent = _c.collide.where === 'footer' ? footer : head,
                b = u.el(
                  'button',
                  'end-xtra' + (_c.collide.where === 'footer' ? ' end-xtra-footer' : ''),
                  parent,
                  _c.collide.text,
                );
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide.text, collide: true });
            }
            Object.assign(_c, { tools });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
