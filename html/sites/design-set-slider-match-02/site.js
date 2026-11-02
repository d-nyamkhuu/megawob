// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-match-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util;
            const endRng = ctx.rng.fork('chrome/end');
            const placement = endRng.pick(['header', 'header', 'footer', 'link', 'icon']);
            const endLabels = ctx.content && ctx.content.END_LABELS;
            const endLabel = endRng.pick(
              Array.isArray(endLabels) && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
            );
            const label =
              typeof endLabel === 'string'
                ? endLabel
                : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
            const collideRng = ctx.rng.fork('chrome/collide');
            const collisionPool = (
              Array.isArray(endLabels) && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
            )
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
            const collision = collideRng.bool(0.3) && collisionPool.length ? collideRng.pick(collisionPool) : null;
            document.body.className = `sound-studio instruction-${ctx.display}`;
            const head = u.el('header', 'window-title', document.body);
            u.el('span', 'studio-mark', head, '♫');
            u.el('h1', '', head, 'Sound Studio');
            const win = u.el('div', 'window-controls', head);
            for (const glyph of ['—', '□', '×']) u.el('span', 'window-control', win, glyph);
            const menu = u.el('nav', 'menu-bar', document.body);
            for (const item of ['File', 'Edit', 'View', 'Tracks', 'Effects', 'Help'])
              u.el('span', 'menu-item', menu, item);
            const toolbar = u.el('div', 'toolbar', document.body);
            const icon = (name, shape) => {
              const b = u.el('button', 'tool-icon ' + name, toolbar);
              b.type = 'button';
              b.setAttribute('aria-label', name);
              b.innerHTML = shape;
            };
            icon('new', '<svg viewBox="0 0 28 32"><path d="M5 2h12l7 7v21H5zM17 2v8h7"/></svg>');
            icon('open', '<svg viewBox="0 0 32 28"><path d="M2 6h11l3 4h14v16H2z"/></svg>');
            u.el('i', 'tool-divider', toolbar);
            icon('play', '<svg viewBox="0 0 24 28"><path d="M4 2v24l18-12z"/></svg>');
            icon('stop', '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/></svg>');
            u.el('i', 'tool-divider', toolbar);
            icon(
              'mixer',
              '<svg viewBox="0 0 32 28"><path d="M3 6h26M3 14h26M3 22h26"/><circle cx="11" cy="6" r="2.5"/><circle cx="22" cy="14" r="2.5"/><circle cx="14" cy="22" r="2.5"/></svg>',
            );
            let submit = null;
            const endParent = placement === 'footer' ? toolbar : head;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (!ctx.finish && placement === 'header') submit = makeSubmit(toolbar, 'end-control', label);
            if (!ctx.finish && placement === 'footer')
              submit = makeSubmit(document.body, 'end-control footer-control', label);
            if (!ctx.finish && placement === 'link') {
              submit = u.el('a', 'end-link', toolbar, label);
              submit.href = '#';
              submit.dataset.role = 'submit';
              submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (!ctx.finish && placement === 'icon') {
              submit = makeSubmit(toolbar, 'end-icon', '✓');
              submit.title = label;
              submit.setAttribute('aria-label', label);
            }
            if (collision) {
              const decoy = u.el('button', 'end-xtra', endParent, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            const main = u.el('div', 'studio-main', document.body);
            const sidebar = u.el('aside', 'track-library', main);
            const libHead = u.el('div', 'library-heading', sidebar);
            u.el('h2', '', libHead, 'Track Library');
            u.el('span', 'search-icon', libHead, '⌕');
            const list = u.el('div', 'track-list', sidebar);
            const tracks = [
              ['Morning Light', '2:48', '#ffd66f', '#f176a1'],
              ['City Streets', '3:17', '#4544a6', '#8775e8'],
              ['Coffee Shop', '2:03', '#ffd66f', '#ff7294'],
              ['Forest Ambience', '4:21', '#72d3ae', '#137e68'],
              ['Warm Room', '3:05', '#ff7667', '#ff9b8e'],
              ['Night Drive', '3:52', '#292b7e', '#9384e8'],
              ['Ocean Waves', '5:14', '#67b8ff', '#3491e8'],
              ['Backyard Birds', '2:37', '#70d8af', '#22846a'],
              ['Rainy Window', '3:29', '#8db8c6', '#6c92a3'],
              ['Fireplace', '4:08', '#ff9b42', '#ed612b'],
              ['Distant Thunder', '3:11', '#9372dc', '#5336a7'],
              ['Soft Piano', '2:56', '#e9b7d4', '#a3588d'],
            ];
            tracks.forEach(([name, duration, a, b], i) => {
              const row = u.el('div', 'track-item' + (i === 0 ? ' selected' : ''), list);
              const art = u.el('span', 'track-art', row);
              art.style.setProperty('--art-a', a);
              art.style.setProperty('--art-b', b);
              u.el('span', 'track-name', row, name);
              u.el('span', 'track-duration', row, duration);
            });
            const stage = u.el('main', 'studio-stage', main);
            stage.dataset.role = 'stage';
            if (ctx.display === 'header') {
              const note = u.el('div', 'task-note header-note', head, ctx.instruction);
            }
            if (ctx.display === 'panel') {
              const note = u.el('div', 'task-note panel-note', sidebar, ctx.instruction);
            }
            if (ctx.display === 'toast') {
              const note = u.el('div', 'task-note toast-note', document.body, ctx.instruction);
            }
            return { stage, submit };
          },
      },
    },
  });
})();
