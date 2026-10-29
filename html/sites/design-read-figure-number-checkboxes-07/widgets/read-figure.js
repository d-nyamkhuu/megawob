// Adds grid dimensions, expanded-grid styling, and this site's reset label.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-number-checkboxes-07',
  name: 'design',
  split: 'train',
  scenarios: ['number-checkboxes'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear All',
    parts: {
      pixelTitles: (base, S) => (ctx) => [
        `Example (${ctx.spec.cols} × ${ctx.spec.rows})`,
        `Your Answer (${ctx.spec.cols} × ${ctx.spec.rows})`,
      ],
      pixelGrid: (base, S) => (ctx, wrap, grid) => {
        grid.style.setProperty('--rows', ctx.spec.rows);
        if (ctx.spec.rows > 7 || ctx.spec.cols > 5) wrap.classList.add('expanded-grid');
      },
    },
  },
});
