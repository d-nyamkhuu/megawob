// Swiss shape design: larger non-tiny labels and a four-column board with three rows minimum.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-07',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    smallScale: 0.54,
    parts: {
      figure: (base) => (u, parent, item, cx, cy, size, color) => {
        base(u, parent, item, cx, cy, size, color);
        if (item.kind !== 'shape') {
          parent.lastChild.setAttribute('font-size', size * (item.size === 'tiny' ? 1 : 1.5));
        }
      },
      boardLayout: () => (items) => {
        const cols = Math.min(4, items.length);
        const rows = Math.max(3, Math.ceil(items.length / cols));
        return {
          items: items.map((item, i) => ({ ...item, c: i % cols, r: Math.floor(i / cols) })),
          cols,
          rows,
        };
      },
      boardSize: (base, S) => (ctx) => ({
        W: S.scene.clientWidth - 20,
        H: Math.max(80, S.scene.clientHeight * 0.84 - 8),
      }),
    },
  },
});
