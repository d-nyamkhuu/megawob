// Restores this site's wider horizontal gap and independently spaced grid rows.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-04',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridGap: .021,
    gridHeight: .82,
    gridWidth: .81,
    parts: {
      gridFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapY = Math.round(ctx.size.height * .095);
        const maxH = Math.floor((room.availH - (rows - 1) * gapY) / rows);
        geo.h = Math.max(40, Math.floor(maxH * .82));
        geo.pitchY = geo.h + gapY;
        geo.font = Math.max(18, Math.min(42, Math.floor(geo.h * .35)));
      },
    },
  },
});
