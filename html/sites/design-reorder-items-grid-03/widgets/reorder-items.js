// Design for the three-column grid: fixed tile sizing with separate horizontal and vertical gaps.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-03',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridCols: 3,
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }, longest) => {
        const { size, rng } = ctx;
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gapY = Math.max(gapDraw, Math.round(size.width * 0.028));
        const gapX = Math.round(size.width * 0.04);
        const maxH = Math.floor((availH - 18 - (rows - 1) * gapY) / rows);
        geo.h = Math.max(34, Math.min(Math.round(size.width * 0.135), maxH));
        geo.w = Math.min(Math.round(size.width * 0.171), Math.floor((availW - 2 * gapX) / 3));
        geo.pitchX = geo.w + gapX;
        geo.pitchY = geo.h + gapY;
        geo.font = S.spec.rule.kind === 'number'
          ? Math.round(geo.h * 0.35)
          : Math.max(13, Math.min(Math.round(geo.h * 0.35), Math.floor((geo.w - 16) / (longest * 0.58))));
      },
    },
  },
});
