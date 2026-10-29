// This design uses a four-column count board with a compact preview and capped glyphs.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-08',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    boardColumns: 4,
    parts: {
      boardSize: (base, S) => (ctx) => ({
        W: S.scene.clientWidth * 0.89 - 20,
        H: Math.max(80, S.scene.clientHeight * 0.78 - 8),
      }),
      itemGeometry: (base, S) => (item, index, geo) => ({
        ...base(item, index, geo),
        sz:
          item.size === 'tiny'
            ? 14
            : Math.min(geo.cw, geo.ch, 140) *
              (item.size === 'small' ? S.D.smallScale : S.D.largeScale),
      }),
    },
  },
});
