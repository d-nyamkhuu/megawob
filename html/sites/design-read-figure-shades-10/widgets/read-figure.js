// Uses five columns, compact viewport-sized tiles, a full-stage body budget, and a top-centered panel.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-10',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columns: 5,
    columnVar: null,
    budgetWidth: 8,
    budgetHeight: 8,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, rng } = ctx;
        const n = spec.tiles.length;
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        const sampledGap = rng.int(8, 14);
        const gap = 4;
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const sampledTileSize = rng.int(54, 78);
        const T = Math.floor(
          Math.min(ctx.size.width * 0.12, (B.w - gap * (cols - 1)) / cols, (B.h - hintH - gap * (rows - 1)) / rows),
        );
        return { n, cols, rows, gap, hintH, T };
      },
      position: (base, S) => (ctx, panel, { w }, { fx, fy, mx, my }) => {
        panel.style.left = `${Math.round((ctx.size.width - w) / 2)}px`;
        panel.style.top = '0px';
      },
    },
  },
});
