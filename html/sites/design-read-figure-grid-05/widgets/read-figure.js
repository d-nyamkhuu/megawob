// Square, capped plotting area with arrowheads at both ends of each axis.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-05',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    arrowColor: '#0645ad',
    arrowEnds: 'all',
    parts: {
      gridSize: (base) => (ctx) => {
        const W = Math.min(ctx.size.width - 20, ctx.size.height - 55, 620);
        return { W, H: W };
      },
    },
  },
});
