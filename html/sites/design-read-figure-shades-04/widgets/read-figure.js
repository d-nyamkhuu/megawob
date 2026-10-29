// Keeps this site's fixed five-column tile layout over the shared shades widget.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-04',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    parts: {
      grid: (base, S) => (ctx, body, geo) => {
        const { spec, util } = ctx;
        const grid = util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = 'repeat(5, minmax(0, 1fr))';
        grid.style.setProperty('--tile-rows', Math.ceil(spec.tiles.length / 5));
        return grid;
      },
    },
  },
});
