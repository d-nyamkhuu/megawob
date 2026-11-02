// This design uses the site's five-column editorial grid, selection controls, and scaled panel styling.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-06',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columns: 5,
    columnVar: null,
    scaleVar: true,
    parts: {
      layout: (base, S) => (ctx, B) => {
        const { spec, rng } = ctx;
        const n = spec.tiles.length;
        const cols = Math.min(5, n);
        const rows = Math.ceil(n / cols);
        const gap = rng.int(8, 14);
        const hintH = spec.select === 'modifier' ? 30 : 0;
        rng.int(54, 78);
        const T = Math.floor(
          Math.min(
            ctx.size.width * 0.068,
            (B.w - gap * (cols - 1)) / cols,
            (ctx.size.height - hintH - 18 - gap * (rows - 1)) / rows,
          ),
        );
        return { n, cols, rows, gap, hintH, T };
      },
      grid: (base, S) => (ctx, body, { n, cols, T, gap }) => {
        const grid = ctx.util.el('div', 'up-tiles', body);
        grid.style.gridTemplateColumns = `repeat(${cols}, ${T}px)`;
        grid.style.columnGap = `${Math.round(T * 0.29)}px`;
        grid.style.rowGap = `${Math.round(T * 0.13)}px`;
        return grid;
      },
      tileStyle: (base, S) => (ctx, t, { T }) =>
        `width:${T}px;height:${Math.round(T * 0.96)}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`,
      selection: (base, S) => (ctx, tiles, up) => {
        const count = document.querySelector('.vt-selected');
        const clear = document.querySelector('.vt-clear');
        if (clear)
          clear.addEventListener('click', () => {
            ctx.log('select', { what: 'clear' });
            up({ selected: [] });
          });
        return (m) => {
          tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
          if (count) count.textContent = `Selected:  ${m.selected.length}`;
        };
      },
    },
  },
});
