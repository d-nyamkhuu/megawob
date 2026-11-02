// Design on templates/reorder-items/base.js: keep card and drop-slot sizes in
// the widget so the planner and the visible list use the same geometry.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-move-03',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'reorder-items/base',
  design: {
    parts: {
      // Keep the template's draws, handles and sortable. Size both its visible
      // cards and its slot geometry together, before anchors are captured.
      renderOrdered: (base, S) => function (ctx, wrap) {
        base(ctx, wrap);
        const n = ctx.spec.items.length;
        const g = S.geo;
        const legend = ctx.spec.legend ? 190 : 0;
        const style = getComputedStyle(ctx.stage);
        const width = Math.max(220, ctx.size.width * 0.91 - legend);
        const height = Math.max(26 * n, ctx.size.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 24);
        const gap = Math.min(12, ctx.size.height * 0.014);
        g.w = Math.floor(width);
        g.h = Math.max(26, Math.floor(Math.min(ctx.size.width * 0.087, (height - (n - 1) * gap) / n)));
        g.pitchY = g.h + gap;
        g.boardW = g.w;
        g.boardH = (n - 1) * g.pitchY + g.h;
        wrap.style.margin = '0';
        Object.assign(S.board.style, { width: g.boardW + 'px', height: g.boardH + 'px' });
        for (const card of S.board.querySelectorAll('.ro-card, .ro-slot')) {
          Object.assign(card.style, { width: g.w + 'px', height: g.h + 'px' });
        }
        S.sortable.set(ctx.model.order);
      },
      'ensureStyle@0': (base) => function (id, css) {
        base(id, css + `
          .ro-wrap { gap: 22px; }
          .ro-card { gap: 14px; padding: 0 18px 0 20px; }
          .ro-card .ro-grip { order: 0; width: 14px; height: 22px; font-size: 0;
            background: radial-gradient(circle,#9198a8 1.6px,transparent 2px) 0 0/7px 7px; }
          .ro-card .ro-t { order: 2; text-align: left; font-weight: 500; font-size: clamp(15px,1.25vw,22px); }
          .ro-card .ro-t::before { content: ''; display: inline-block; width: 22px; height: 22px;
            border: 2px solid #a0a6b3; border-radius: 8px; vertical-align: -5px; margin-right: 15px; background: #fff; }
          .ro-card .ro-tag { order: 3; padding: 7px 13px; border: 0; font-size: clamp(12px,.95vw,16px); }
          .ro-card:has(.ro-v) .ro-t { transform: translateY(-7px); }
          .ro-card .ro-v { position: absolute; left: 7vw; top: 73%; transform: translateY(-50%);
            font-size: clamp(11px,.9vw,15px); font-weight: 400; color: #7b8498; white-space: nowrap; }
        `);
      },
    },
  },
});
