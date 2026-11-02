// Keep the campaign's wide rows inside the template's stage and seeded margins.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-move-02',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'reorder-items/base',
  design: {
    parts: {
      renderOrdered: (base, S) => function (ctx, wrap) {
        base(ctx, wrap);
        const width = Math.max(220, ctx.size.width - 60 - (ctx.spec.legend ? 190 : 0));
        S.geo.w = width;
        S.geo.boardW = width;
        S.board.style.width = width + 'px';
        S.slotEl.style.width = width + 'px';
        const count = ctx.spec.items.length;
        const availableHeight = ctx.size.height - 36;
        const compact = S.geo.boardH > availableHeight;
        if (compact) {
          const gap = Math.min(S.geo.pitchY - S.geo.h,
            Math.max(2, Math.floor((availableHeight - count * S.geo.h) / Math.max(1, count - 1))));
          S.geo.h = Math.min(S.geo.h, Math.floor((availableHeight - (count - 1) * gap) / count));
          S.geo.pitchY = S.geo.h + gap;
          S.geo.boardH = (count - 1) * S.geo.pitchY + S.geo.h;
          S.board.style.height = S.geo.boardH + 'px';
          S.slotEl.style.height = S.geo.h + 'px';
        }
        for (const card of S.board.children) {
          if (card.dataset.role === 'card') {
            card.style.width = width + 'px';
            if (compact) card.style.height = S.geo.h + 'px';
          }
        }
        if (compact) S.sortable.set(ctx.model.order);
      },
    },
  },
});
