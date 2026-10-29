// Design for the five-column grid: larger tiles, separate row spacing, and a stage-safe lift.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-07',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridCols: 5,
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { size, rng } = ctx;
        const geo = S.geo;
        const rows = Math.ceil(S.spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.max(gapDraw, Math.round(size.width * 0.0288));
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
        const wordy = S.spec.rule.kind !== 'number';
        geo.h = Math.max(40, Math.min(maxH, Math.round(size.height * 0.21)));
        geo.w = Math.min(maxW, Math.round(size.width * 0.103));
        geo.pitchX = geo.w + gap;
        const rowGap = rows > 1
          ? Math.min(Math.round(size.height * 0.096), Math.max(0, Math.floor((availH - rows * geo.h) / (rows - 1))))
          : 0;
        geo.pitchY = geo.h + rowGap;
        geo.font = Math.max(14, Math.min(wordy ? 22 : 38, Math.floor(geo.h * (wordy ? 0.23 : 0.38))));
        if (wordy) {
          const chars = Math.max(...S.spec.items.map((id) => String(S.spec.labels[id].value || S.spec.labels[id].title).length));
          geo.font = Math.min(geo.font, Math.max(10, Math.floor((geo.w - 6) / (chars * 0.61))));
        }
      },
      orderedFit: (base, S) => (ctx, wrap) => {
        if (S.spec.scenario !== 'grid') return base(ctx, wrap);
        const { size } = ctx;
        const desiredLift = Math.abs(new DOMMatrixReadOnly(getComputedStyle(wrap).transform).m42);
        const lift = Math.min(desiredLift, Math.max(0, (size.height - S.geo.boardH) / 2 - 4));
        wrap.style.transform = `translateY(-${lift}px)`;
      },
    },
  },
});
