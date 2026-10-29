// This design uses five columns of responsive rectangular tiles and the original wide body budget.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-11',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columns: 5,
    columnVar: null,
    budgetWidth: 44,
    budgetHeight: 8,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, rng } = ctx;
        const n = spec.tiles.length;
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        const sampledGap = rng.int(8, 14);
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const sampledSize = rng.int(54, 78);
        const tileW = Math.floor(Math.min(134, (B.w * 134) / 1244, (B.w - 8 * (cols - 1)) / cols));
        const tileH = Math.floor(Math.min((tileW * 104) / 134, (B.h - hintH - 8 * (rows - 1)) / rows));
        return { n, cols, rows, gap: 8, hintH, T: tileW, tileW, tileH };
      },
      grid: (base, S) => (ctx, body, geo) => {
        const { util } = ctx;
        const grid = util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${geo.cols}, ${geo.tileW}px)`;
        grid.style.gap = '8px';
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, geo) =>
        `width:${geo.tileW}px;height:${geo.tileH}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`,
    },
  },
});
