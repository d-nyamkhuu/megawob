// This design puts the example grid in the brief and keeps the site's compact grid labels.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-04',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    parts: {
      pixelTitles: () => () => ['Example', 'Your answer'],
      pixelParent: (base, S) => (ctx, row, n) =>
        n ? base(ctx, row, n) : document.querySelector('.center')?.querySelector('.brief'),
      pixelGrid: (base, S) => (ctx, wrap, grid, n) => {
        base(ctx, wrap, grid, n);
        grid.classList.add('cols-' + S.spec.cols);
        grid.style.setProperty('--rows', S.spec.rows);
      },
    },
  },
});
