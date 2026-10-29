// Platinum design adds a stage-filling shade grid and supports its Clear Selections control.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-05',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: null,
    parts: {
      grid: (base, S) => (ctx, body, geo) => {
        const { spec } = ctx;
        const grid = base(ctx, body, geo);
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const availableHeight = Math.max(1, ctx.size.height - 26 - hintH - (spec.recoverable ? 44 : 0));
        const displayCols = Math.max(
          1,
          Math.min(8, geo.n, Math.round(Math.sqrt((geo.n * Math.max(1, ctx.size.width - 48)) / (availableHeight * 1.54)))),
        );
        const displayRows = Math.ceil(geo.n / displayCols);
        grid.style.setProperty('--board-cols', displayCols);
        grid.style.setProperty('--board-rows', displayRows);
        return grid;
      },
      selection: (base, S) => (ctx, tiles, up) => {
        const sync = base(ctx, tiles, up);
        ctx.stage.addEventListener('clear-selections', () => up({ selected: [] }));
        return sync;
      },
    },
  },
});
