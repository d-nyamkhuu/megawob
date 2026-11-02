env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-09',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: null,
    columns: 5,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, util, rng } = ctx;
        const n = spec.tiles.length;
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        const gap = rng.int(8, 14);
        const hintH = spec.select === 'modifier' ? 30 : 0;
        const seededSize = rng.int(54, 78); // Preserve the original draw and every later seeded choice.
        const spacing = Math.min(29, ctx.size.width * 0.021);
        const T = Math.floor(
          Math.min(
            ctx.size.width * 0.091,
            (ctx.size.width - spacing * (cols - 1) - 12) / cols,
            (ctx.size.height - hintH - 36 - spacing * 0.5 * (rows - 1)) / rows,
          ),
        );
        return { n, cols, rows, gap, hintH, T, spacing };
      },
      grid: (base, S) => (ctx, body, geo) => {
        const { spec, util, rng } = ctx;
        const { n, cols, rows, gap, hintH, T, TW, TH, spacing } = geo;
        const grid = util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${cols}, ${T}px)`;
        grid.style.gap = `${spacing * 0.5}px ${spacing}px`;
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, geo) => {
        const { T, TW, TH } = geo;
        return `width:${T}px;height:${Math.floor(T * 0.97)}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`;
      },
      selection: (base, S) => (ctx, tiles, up) => {
        const clear = document.querySelector('.bottom .clear');
        if (clear)
          clear.addEventListener('click', () => {
            ctx.log('clear');
            up({ selected: [] });
          });
        const sync = (m) => {
          tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
          const count = document.querySelector('.bottom .sel');
          if (count) count.textContent = 'Selected:  ' + m.selected.length;
          if (clear) clear.disabled = !m.selected.length;
        };
        return sync;
      },
      rendered: (base, S) => (ctx, panel) => {
        panel.style.left = '0';
        panel.style.top = '0';
        panel.style.width = '100%';
        panel.style.height = '100%';
        panel.style.transform = 'none';
      },
    },
  },
});
