// Match the broad coordinate plane in the Luna workspace.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-06',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    gridArrows: true,
    arrowEnds: 'all',
    arrowColor: '#111111',
    tickSize: 6,
    parts: {
      gridSize: (base, S) => (ctx) => {
        const H = Math.max(120, ctx.size.height - 28);
        return { W: Math.min(ctx.size.width - 20, H * 1.65), H };
      },
    },
  },
});
