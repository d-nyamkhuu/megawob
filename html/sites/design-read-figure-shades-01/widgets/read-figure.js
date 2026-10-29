// Uses five columns of responsive rectangular shade tiles and updates the page's tile counters.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-01',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columns: 5,
    columnVar: null,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, rng } = ctx;
        const n = spec.tiles.length;
        const cols = 5;
        const rows = Math.ceil(n / cols);
        const gap = rng.int(8, 14);
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const T = Math.floor(
          Math.min(
            rng.int(54, 78),
            (B.w - gap * (cols - 1)) / cols,
            (B.h - hintH - gap * (rows - 1)) / rows,
          ),
        );
        const scale = Math.min(1, ctx.size.width / 1670);
        const tileW = Math.min(145 * scale, (ctx.size.width - 40) / cols - 10);
        const tileH = Math.min((ctx.size.height - hintH - 55 - 8 * (rows - 1)) / rows, 100 * scale);
        return { n, cols, rows, gap, hintH, T, tileW, tileH, scale };
      },
      grid: (base, S) => (ctx, body, geo) => {
        const grid = ctx.util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${geo.cols}, ${geo.tileW}px)`;
        grid.style.gap = `${8 * geo.scale}px ${10 * geo.scale}px`;
        const dimensions = document.querySelector('.combo > span');
        if (dimensions) dimensions.textContent = `${geo.cols} x ${geo.rows}`;
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, geo) =>
        `width:${geo.tileW}px;height:${geo.tileH}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`,
      tilesSync: (base, S) => (ctx, tiles, model) => {
        tiles.forEach((tile, i) => tile.setAttribute('aria-checked', String(model.selected.includes(i))));
        const count = document.querySelector('.tile-count');
        const selected = document.querySelector('.selection-count');
        if (count) count.textContent = `Tiles:  ${tiles.length}`;
        if (selected) selected.textContent = `Selected: ${model.selected.length}`;
      },
    },
  },
});
