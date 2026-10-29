// This design uses compact pixel titles, larger cells, and explicit grid dimensions.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-11',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    titleClass: 'pixel-title',
    pixelMax: 49,
    pixelGap: 10,
    pixelInset: 130,
    parts: {
      pixelGrid: (base, S) => (ctx, wrap, grid, n) => {
        base(ctx, wrap, grid, n);
        S.ctx.util.el('small', 'pixel-dimensions', wrap, `${S.spec.cols} columns × ${S.spec.rows} rows`);
      },
    },
  },
});
