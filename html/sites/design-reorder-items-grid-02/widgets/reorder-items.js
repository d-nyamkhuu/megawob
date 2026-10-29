// Preserve this design's sampled grid spacing and card sizing on the shared cards template.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-02',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }, longest) => {
        const { rng, size } = ctx;
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.max(gapDraw, Math.round(size.width * 0.041));
        const gapY = Math.max(gapDraw, Math.round(size.height * 0.057));
        const maxH = Math.floor((availH - (rows - 1) * gapY) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
        geo.h = Math.max(40, Math.min(Math.floor(maxH * 0.82), Math.round(size.height * 0.225)));
        geo.w = Math.min(maxW, Math.round(size.width * 0.166));
        geo.pitchX = geo.w + gap;
        geo.pitchY = geo.h + gapY;
        geo.font = Math.max(16, Math.min(geo.h * 0.58, geo.w / Math.max(1, longest) * 1.65));
      },
    },
  },
});
