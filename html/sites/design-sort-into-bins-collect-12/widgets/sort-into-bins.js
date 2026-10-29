// This design fills the stage and shifts the board below the instruction card; items keep their sampled height.
(function () {
  'use strict';
  let inset = 0;
  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-collect-12',
    name: 'design',
    split: 'train',
    scenarios: ['collect'],
    traits: { itemsAt: 'left', containers: [{ x: .64, y: .145, w: .328, h: .695 }] },
    template: 'sort-into-bins/boxes',
    design: {
      parts: {
        fit: () => (ctx) => {
          const { size } = ctx;
          const note = document.querySelector('.task-note');
          const stageRect = ctx.stage.getBoundingClientRect();
          inset = 0;
          if (note && !note.hidden && !note.classList.contains('instruction-toast')) {
            const nr = note.getBoundingClientRect();
            for (const it of ctx.spec.items) {
              const p = ctx.model.pos[it.id];
              const left = stageRect.left + (p[0] - ctx.spec.item.w / 2) * size.width;
              const right = left + ctx.spec.item.w * size.width;
              if (right <= nr.left || left >= nr.right) continue;
              const y = p[1] - ctx.spec.item.h / 2;
              inset = Math.max(inset, (nr.bottom - stageRect.top + 12 - y * size.height) / (1 - y));
            }
          }
          inset = Math.ceil(Math.max(0, inset));
          return { H: Math.floor(size.height - inset - 2), W: Math.floor(size.width - 2) };
        },
        board: (base) => (ctx) => {
          const el = base(ctx);
          el.style.top = inset + 'px';
          return el;
        },
        item: (base, S) => (ctx, el) => {
          base(ctx, el);
          el.style.height = S.spec.item.h * S.geo.H + 'px';
        },
      },
    },
  });
})();
