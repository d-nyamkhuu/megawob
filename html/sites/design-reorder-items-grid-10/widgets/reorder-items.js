// Design on templates/reorder-items/cards.js; uses this site's compact, proportionally spaced grid tiles.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-10',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { size, rng } = ctx;
        const rows = Math.ceil(S.spec.items.length / S.geo.cols);
        rng.int(8, 16); // Preserve the original draw; the sampled value does not set this design's gap.
        const gap = Math.max(8, Math.round(size.width * 0.0095));
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (S.geo.cols - 1) * gap) / S.geo.cols);
        S.geo.w = Math.min(maxW, Math.round(size.width * 0.1334));
        S.geo.h = Math.max(40, Math.min(maxH, Math.round(S.geo.w * 0.811)));
        S.geo.pitchX = S.geo.w + gap;
        S.geo.pitchY = S.geo.h + Math.round(size.width * 0.0132);
        S.geo.font = Math.max(18, Math.min(42, Math.floor(S.geo.h * 0.35)));
      },
    },
  },
});
