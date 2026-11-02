// Design on templates/reorder-items/cards.js.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-01',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    kanbanWidth: .205,
    kanbanHead: [34, .086],
    roundBoard: true,
    roundPane: true,
    parts: {
      trayFit: () => () => {},
      tray: (base, S) => (ctx, wrap, L) => {
        ctx.util.el('div', 'tray-label', S.board, 'Cards (drag to a column):');
        S.P.trayPositions(ctx, L);
        return {};
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { size } = L, { spec, geo } = S;
        S.trayPositions = {};
        spec.items.filter((id) => S.staged.has(id)).forEach((id, i) => {
          S.trayPositions[id] = { x: size.width * .012 + (i % 4) * size.width * .227,
            y: size.height * .07 + Math.floor(i / 4) * geo.pitchY, w: geo.w, h: geo.h };
        });
      },
    },
  },
});
