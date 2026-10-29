// Adds the site's reference preview below the shared shape board.
(function () {
  'use strict';
  env.widget({
    task: 'read-figure',
    site: 'design-read-figure-shape-12',
    name: 'design',
    split: 'train',
    scenarios: ['shape'],
    template: 'read-figure/scene',
    design: {
      parts: {
        shape: (base, S) => (ctx) => {
          base(ctx);
          const s = S.spec,
            u = ctx.util,
            f = env.taskDef,
            preview = document.querySelector('.pvbox');
          if (!preview) return;
          preview.replaceChildren();
          const W = 260,
            H = 218,
            cols = Math.ceil(s.items.length / 2),
            rows = Math.ceil(s.items.length / cols),
            svg = u.svg('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, preview);
          s.items.forEach((it, i) => {
            const cell = Math.min(W / cols, H / rows),
              size = it.size === 'tiny' ? 14 : cell * (it.size === 'small' ? 0.4 : 0.85);
            S.P.figure(
              u,
              svg,
              it,
              ((i % cols + 0.5) * W) / cols,
              ((Math.floor(i / cols) + 0.5) * H) / rows,
              size,
              f.helpers.ITEM_COLORS[it.color],
            );
          });
        },
      },
    },
  });
})();
