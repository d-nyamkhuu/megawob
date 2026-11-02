// Caps the grid size and adds the original site's ticks and four dark arrowheads.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-04',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    tickSize: 6,
    arrowColor: '#111',
    arrowEnds: 'all',
    parts: {
      gridSize: (base, S) => (ctx) => ({
        W: Math.min(ctx.size.width - 20, 620),
        H: Math.max(120, Math.min(ctx.size.height - 55, 600)),
      }),
    },
  },
});
