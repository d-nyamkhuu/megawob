// Design on templates/reorder-items/cards.js; preserves this site's compact, text-fit grid geometry.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-12',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { rng, size } = ctx;
        const rows = Math.ceil(S.spec.items.length / S.geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.max(gapDraw, Math.round(size.width * .0175));
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (S.geo.cols - 1) * gap) / S.geo.cols);
        S.geo.h = Math.max(40, Math.min(maxH, Math.round(size.width * .077)));
        S.geo.w = Math.min(maxW, Math.round(size.width * .12));
        S.geo.pitchX = S.geo.w + Math.max(gap, Math.round(size.width * .024));
        S.geo.pitchY = S.geo.h + gap;
        const longest = Math.max(...S.spec.items.map((id) =>
          (S.spec.labels[id].value || S.spec.labels[id].title).length));
        S.geo.font = Math.max(11, Math.min(48, Math.floor(S.geo.h * .43),
          Math.floor((S.geo.w - 34) / (longest * .62))));
      },
    },
  },
});
