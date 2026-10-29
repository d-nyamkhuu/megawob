// Grid sizing and tile typography preserve this site's original design.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-05',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      available: (base, S) => (ctx, wrap) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const wrapStyle = getComputedStyle(wrap);
        const verticalInset = parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom)
          + parseFloat(wrapStyle.marginTop) + parseFloat(wrapStyle.marginBottom);
        return {
          availW: ctx.size.width - 60 - (S.spec.legend ? 190 : 0),
          availH: ctx.size.height - Math.max(36, verticalInset + 2),
        };
      },
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { rng, size } = ctx;
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.min(
          Math.max(gapDraw, Math.round(size.width * 0.024)),
          Math.max(2, Math.floor((availH - rows * 40) / Math.max(1, rows - 1))),
        );
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
        geo.h = Math.max(1, Math.min(maxH, Math.round(size.width * 0.095)));
        geo.w = Math.min(maxW, Math.floor((size.width * 0.91 - (geo.cols - 1) * gap) / geo.cols));
        geo.pitchX = geo.w + gap;
        geo.pitchY = geo.h + gap;
        geo.font = Math.max(18, Math.min(42, Math.floor(geo.h * 0.35)));
      },
      gridTitle: (base, S) => (ctx, card, lab, longest) => {
        const title = base(ctx, card, lab, longest);
        const text = lab.value || lab.title;
        const length = text.length;
        title.style.setProperty('--tile-font', Math.min(
          length > 2 ? 32 : 48,
          S.geo.h * 0.43,
          (S.geo.w - ctx.size.width * 0.06) / (length * 0.72),
        ) + 'px');
        return title;
      },
    },
  },
});
