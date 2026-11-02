// This design uses a tighter count board, caps glyph size, and adjusts three item colors.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-05',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    parts: {
      boardLayout: (base, S) => (items, cols, rows) => {
        cols = Math.min(items.length, items.length <= 8 ? 4 : Math.ceil(items.length / 2));
        rows = Math.ceil(items.length / cols);
        items = items.map((it, i) => ({ ...it, c: i % cols, r: Math.floor(i / cols) }));
        return { items, cols, rows };
      },
      boardSize: (base, S) => (ctx) => ({
        W: Math.min(S.scene.clientWidth - 20, ctx.size.width * 0.7),
        H: Math.max(80, S.scene.clientHeight - 48),
      }),
      itemGeometry: (base, S) => (it, i, geo) => {
        const { cw, ch } = geo;
        const cell = Math.min(cw, ch, 190);
        const sz = it.size === 'tiny' ? 14 : cell * (it.size === 'small' ? S.D.smallScale : S.D.largeScale);
        return {
          cx: (it.c + 0.5) * cw,
          cy: (it.r + 0.5) * ch,
          sz,
          x: it.c * cw + 3,
          y: it.r * ch + 3,
          width: cw - 6,
          height: ch - 6,
        };
      },
      itemColor: (base, S) => (it) => ({ red: '#ff1d25', blue: '#066bff', green: '#00ad22' }[it.color] || base(it)),
    },
  },
});
