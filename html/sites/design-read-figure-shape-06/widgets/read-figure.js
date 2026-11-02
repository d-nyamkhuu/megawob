// This design uses a two-row staggered board with a centered final row and the nbook item count.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-06',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    menuLabels: null,
    smallScale: 0.44,
    largeScale: 0.95,
    parts: {
      shape: (base) => (ctx) => {
        const count = document.querySelector('.nb-count');
        if (count) count.textContent = 'Items: ' + ctx.spec.items.length;
        return base(ctx);
      },
      boardLayout: (base) => (items, cols, rows) => {
        cols = Math.min(5, Math.ceil(items.length / 2));
        rows = Math.ceil(items.length / cols);
        items = items.map((item, i) => ({ ...item, c: i % cols, r: Math.floor(i / cols) }));
        return { items, cols, rows };
      },
      itemGeometry: (base) => (item, index, geo) => {
        const { W, H, cols, rows, cw, ch, items } = geo;
        const rowCols = Math.min(cols, items.length - item.r * cols);
        const rowWidth = W / rowCols;
        const cell = Math.min(cw, ch);
        return {
          cx: (item.c + 0.5) * rowWidth,
          cy: (item.r + 0.5) * ch,
          sz: item.size === 'tiny' ? 14 : cell * (item.size === 'small' ? 0.44 : 0.95),
          x: item.c * rowWidth + 3,
          y: item.r * ch + 3,
          width: rowWidth - 6,
          height: ch - 6,
        };
      },
    },
  },
});
