// Design on templates/reorder-items/cards.js; keeps the five-column bottom tray and empty-column hints.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-07',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    kanbanWidth: .188,
    columnGap: .013,
    kanbanHead: [34, .086],
    parts: {
      trayFit: (base, S) => (ctx, size) => {
        const { geo, staged } = S;
        const rows = Math.max(2, Math.ceil(staged.size / 5));
        geo.trayTop = size.height * .633;
        geo.h = Math.min(size.height * .112,
          (size.height - geo.trayTop - size.height * .09 - rows * size.height * .027) / rows);
        geo.pitchY = geo.h + size.height * .027;
        geo.binY = 0;
        geo.colH = geo.trayTop - size.height * .04;
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { size, boardW } = L;
        const { util } = ctx;
        const box = util.el('div', 'tray-box', S.board);
        Object.assign(box.style, {
          top: S.geo.trayTop + 'px',
          height: (size.height - S.geo.trayTop - 2) + 'px',
        });
        const label = util.el('div', 'tray-label', S.board);
        label.style.top = (S.geo.trayTop + size.height * .023) + 'px';
        label.innerHTML = '<b>Cards</b> <span>(drag to a column)</span>';
        S.P.trayPositions(ctx, L);
        return {};
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { size } = L;
        S.trayPositions = {};
        S.spec.items.filter((id) => S.staged.has(id)).forEach((id, i) => {
          S.trayPositions[id] = {
            x: size.width * .006 + (i % 5) * size.width * .2,
            y: S.geo.trayTop + size.height * .09 + Math.floor(i / 5) * S.geo.pitchY,
            w: S.geo.w,
            h: S.geo.h,
          };
        });
      },
      columnReady: (base, S) => (ctx, col, h, c) => {
        S.extra.emptyNotes ||= {};
        S.extra.emptyNotes[c] = ctx.util.el('div', 'empty-column', col, 'Drag cards here');
      },
      counts: (base, S) => (ctx, cols, counts, L) => {
        const update = base(ctx, cols, counts, L);
        return () => {
          update();
          for (const c of S.spec.columns) {
            S.extra.emptyNotes[c].hidden = (ctx.model.columns[c] || []).some((id) => !S.staged.has(id));
          }
        };
      },
    },
  },
});
