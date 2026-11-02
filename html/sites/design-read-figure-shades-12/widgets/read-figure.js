env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-12',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: null,
    columns: 5,
    budgetWidth: 8,
    budgetHeight: 8,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, util, rng } = ctx;
        const n = spec.tiles.length;
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        // Consume the scaffold's draws in their original order; layout itself follows the reference.
        const sampledGap = rng.int(8, 14);
        const gap = Math.min(22, Math.max(12, B.w * 0.025));
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const sampledSize = rng.int(54, 78);
        const T = Math.floor(
          Math.min(
            140,
            (B.w - gap * (cols - 1)) / cols,
            (B.h - hintH - 18 * (Math.max(4, rows) - 1)) / Math.max(4, rows) / 0.9,
          ),
        );
        return { n, cols, rows, gap, hintH, T };
      },
      grid: (base, S) => (ctx, body, geo) => {
        const { spec, util, rng } = ctx;
        const { n, cols, rows, gap, hintH, T, TW, TH, spacing } = geo;
        const grid = util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${cols}, ${T}px)`;
        grid.style.gap = `18px ${gap}px`;
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, geo) => {
        const { T, TW, TH } = geo;
        return `width:${T}px;height:${Math.floor(T * 0.9)}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`;
      },
      selection: (base, S) => (ctx, tiles, up) => {
        ctx.stage.addEventListener('clear-selection', () => up({ selected: [] }));
        const sync = (m) => {
          tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
          const status = document.querySelector('.r-selection-count');
          if (status) status.textContent = `${m.selected.length} selected`;
        };
        return sync;
      },
    },
  },
});
