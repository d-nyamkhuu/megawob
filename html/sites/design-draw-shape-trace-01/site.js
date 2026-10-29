// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'gtk',
        'title': 'Mouse Practice',
        'menu': 'File    Edit    View    Help',
        'tabs': ['Practice', 'Settings', 'Results', 'Help'],
        'foot': '',
        'accent': '#719ac3',
        'bg': '#d3cfc1',
        'surface': '#faf7eb',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls);
                bt.type = 'button';
                bt.setAttribute('aria-label', label === '−' ? 'Minimize' : label === '□' ? 'Maximize' : 'Close');
                const icon = u.svg('svg', { viewBox: '0 0 20 20', 'aria-hidden': 'true' }, bt);
                const d = label === '−' ? 'M4 14H16' : label === '□' ? 'M4 4H16V16H4Z' : 'M4 4L16 16M16 4L4 16';
                u.svg(
                  'path',
                  {
                    d,
                    fill: 'none',
                    stroke: '#365e82',
                    'stroke-width': 5,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  icon,
                );
                u.svg(
                  'path',
                  {
                    d,
                    fill: 'none',
                    stroke: '#f7f8fa',
                    'stroke-width': label === '□' ? 2 : 3,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  icon,
                );
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const menu = u.el('nav', 'menu', head);
              for (const label of C.menu.split(/\s{2,}/)) u.el('span', 'menu-label', menu, label);
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { shell, u } = _c;
            if (C.layout === 'notebook') {
              const binding = u.el('div', 'notebook-binding', shell);
              binding.setAttribute('aria-hidden', 'true');
              for (let i = 0; i < 19; i++) {
                const coil = u.svg('svg', { viewBox: '0 0 52 22', class: 'notebook-coil' }, binding),
                  defs = u.svg('defs', {}, coil);
                const metal = u.svg(
                  'linearGradient',
                  { id: 'coil-metal-' + i, x1: '0', y1: '0', x2: '0', y2: '1' },
                  defs,
                );
                for (const [offset, color] of [
                  ['0', '#62625a'],
                  ['.3', '#a2a59f'],
                  ['.47', '#e4e5df'],
                  ['.65', '#a8aaa3'],
                  ['1', '#62655b'],
                ])
                  u.svg('stop', { offset, 'stop-color': color }, metal);
                const hole = u.svg(
                  'linearGradient',
                  { id: 'coil-hole-' + i, x1: '0', y1: '0', x2: '1', y2: '1' },
                  defs,
                );
                u.svg('stop', { offset: '0', 'stop-color': '#9a9278' }, hole);
                u.svg('stop', { offset: '1', 'stop-color': '#423b28' }, hole);
                u.svg('rect', { x: 38, y: 3, width: 14, height: 16, rx: 3, fill: 'url(#coil-hole-' + i + ')' }, coil);
                u.svg('rect', { x: 40, y: 7, width: 8, height: 7, rx: 2, fill: '#3c392b' }, coil);
                const d =
                  i === 0 || i % 3 === 1 || i > 16
                    ? 'M44 10 C33 5 3 6 3 13 C3 17 10 18 19 18'
                    : 'M44 11 C36 7 23 7 16 10';
                u.svg(
                  'path',
                  { d, fill: 'none', stroke: '#626258', 'stroke-width': 7, 'stroke-linecap': 'round' },
                  coil,
                );
                u.svg(
                  'path',
                  {
                    d,
                    fill: 'none',
                    stroke: 'url(#coil-metal-' + i + ')',
                    'stroke-width': 4.5,
                    'stroke-linecap': 'round',
                  },
                  coil,
                );
              }
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            _c.display = ctx.display || 'header';
            if (_c.display === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 700)) _c.display = 'header';
            if (_c.display === 'toast' && window.innerHeight < 680) _c.display = 'header';
            if (_c.display === 'hidden') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (_c.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                labels = (ctx.content && ctx.content.END_LABELS) || [
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
                ];
              const placement = endRng.pick(['page', 'page', 'page', 'bottom-left', 'top-right', 'top-right']);
              const label = endRng.bool(0.5)
                ? 'Submit'
                : (function () {
                    const picked = endRng.pick(labels);
                    return typeof picked === 'string'
                      ? picked
                      : picked.label || picked.text || picked.name || String(picked);
                  })();
              footer.classList.add('end-' + placement);
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el('button', 'submit', parent, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = () => ctx.submit();
              const collideRng = ctx.rng.fork('chrome/collide');
              if (collideRng.bool(0.3)) {
                let pool = labels
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                  .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (pool.length) {
                  const decoy = u.el('button', 'end-xtra', footer, collideRng.pick(pool));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
                }
              }
            }
          },
      },
    },
  });
})();
