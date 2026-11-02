// OpenLook design: outline glyphs and use a three-column, shorter board.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-03',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    shapeStroke: '#080808',
    boardColumns: 3,
    menuLabels: null,
    parts: {
      boardSize: (base, S) => (ctx) => {
        const size = base(ctx);
        return { ...size, H: Math.max(80, (S.scene.clientHeight - 8) * 0.9) };
      },
      itemGeometry: (base, S) => (item, index, geo) => {
        const q = base(item, index, geo);
        const cell = Math.min(geo.cw, geo.ch / 0.9);
        q.sz = item.size === 'tiny' ? 14 : cell * (item.size === 'small' ? S.D.smallScale : S.D.largeScale);
        return q;
      },
    },
  },
});
