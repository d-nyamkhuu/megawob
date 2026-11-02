// Three-column tiles use this site's compact sizing, top offset, and tile count label.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-09',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridCols: 3,
    gridGap: .0247,
    gridHeight: .86,
    gridWidth: .224,
    parts: {
      gridFit: (base, S) => (ctx, { availW, availH }) => {
        const { size, rng } = ctx;
        const { geo, spec } = S;
        const rows = Math.ceil(spec.items.length / geo.cols);
        const gapDraw = rng.int(8, 16);
        const gap = Math.max(gapDraw, Math.round(size.width * S.D.gridGap));
        const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
        const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
        geo.w = Math.min(maxW, Math.floor(size.width * S.D.gridWidth));
        geo.h = Math.max(40, Math.min(Math.floor(maxH * S.D.gridHeight), Math.floor(geo.w * .752)));
        geo.pitchX = geo.w + gap;
        geo.pitchY = geo.h + gap;
        geo.font = Math.max(16, Math.min(Math.floor(geo.h * .38), Math.floor(
          (geo.w - 22) / (Math.max(...spec.items.map((id) =>
            (spec.labels[id].value || spec.labels[id].title).length)) * .54),
        )));
      },
      wrap: (base, S) => (ctx, wrap) => {
        base(ctx, wrap);
        wrap.style.margin = `${Math.round(ctx.size.height * .065)}px 0 0`;
      },
      rendered: (base, S) => (ctx, wrap) => {
        base(ctx, wrap);
        const count = document.querySelector('.cw-count');
        if (count) count.textContent = S.spec.items.length + ' tiles';
      },
    },
  },
});
