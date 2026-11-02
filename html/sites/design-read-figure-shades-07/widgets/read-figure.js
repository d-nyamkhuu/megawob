env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-07',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: null,
    columns: 5,
    budgetWidth: 24,
    budgetHeight: 4,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, util, rng } = ctx;
        const n = spec.tiles.length;
        // Tile indices, colors and selection semantics stay in task order; only the sheet's layout changes.
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        const sampledGap = rng.int(8, 14);
        const sheetScale = ctx.size.width / 1603;
        const gap = 21 * sheetScale;
        const rowGap = 17 * sheetScale;
        const hintH = spec.select === 'modifier' ? 30 : 0;
        rng.int(54, 78);
        const TW = Math.floor(Math.min(188 * sheetScale, (B.w - 8 - gap * (cols - 1)) / cols));
        const TH = Math.floor(Math.min(TW * 0.78, (B.h - 8 - hintH - rowGap * (rows - 1)) / rows));
        return { n, cols, rows, gap, hintH, T: TW, TW, TH, rowGap };
      },
      grid: (base, S) => (ctx, body, geo) => {
        const { spec, util, rng } = ctx;
        const { n, cols, rows, gap, hintH, T, TW, TH, spacing, rowGap } = geo;
        const grid = util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${cols}, ${TW}px)`;
        grid.style.gap = `${rowGap}px ${gap}px`;
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, geo) => {
        const { T, TW, TH } = geo;
        return `width:${TW}px;height:${TH}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`;
      },
      selection: (base, S) => (ctx, tiles, up) => {
        const clear = document.querySelector('.metro .clear');
        if (clear)
          clear.addEventListener('click', () => {
            ctx.log('clear', { what: 'tiles' });
            up({ selected: [] });
          });
        const sync = (m) => tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
        return sync;
      },
      position:
        (base, S) =>
        (ctx, panel, { w, h }) => {
          panel.style.left =
            Math.round(Math.max(8, (ctx.size.width - w - ctx.stage.getBoundingClientRect().left) / 2)) + 'px';
          panel.style.top = '0px';
        },
    },
  },
});
