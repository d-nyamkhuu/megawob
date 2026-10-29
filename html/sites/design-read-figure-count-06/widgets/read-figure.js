// This design adds dark outlines, a faux scrollbar, and a compact three-column board.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-06',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    shapeStroke: '#111',
    shapeStrokeWidth: 2.4,
    boardColumns: 3,
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util;
        const scroll = u.el('div', 'm-scrollbar', S.root);
        u.el('i', 'm-up', scroll);
        u.el('i', 'm-thumb', scroll);
        u.el('i', 'm-down', scroll);
        scroll.setAttribute('aria-hidden', 'true');
      },
      boardSize: (base, S) => (ctx) => ({
        W: S.scene.clientWidth,
        H: Math.max(80, S.scene.clientHeight),
      }),
    },
  },
});
