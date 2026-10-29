// This design adds row and column labels and allows slightly larger pixels.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-12',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    pixelMax: 38,
    parts: {
      pixelGrid: (base, S) => (ctx, wrap, grid, n) => {
        base(ctx, wrap, grid, n);
        const u = S.ctx.util,
          s = S.spec,
          cols = u.el('div', 'pixel-cols', wrap);
        cols.style.setProperty('--cols', s.cols);
        cols.style.setProperty('--pixel', S.P.pixelSize(ctx));
        for (let c = 0; c < s.cols; c++) u.el('span', '', cols, String(c + 1));
        const rownums = u.el('div', 'pixel-rows', wrap);
        rownums.style.setProperty('--pixel', S.P.pixelSize(ctx));
        for (let r = 0; r < s.rows; r++) u.el('span', '', rownums, String(r + 1));
      },
    },
  },
});
