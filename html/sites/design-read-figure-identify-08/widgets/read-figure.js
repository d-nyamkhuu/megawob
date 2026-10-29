// This design uses a compact, wide figure frame with the site's figure-frame styling.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-08',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    parts: {
      identifySize: (base) => (ctx) => {
        const W = Math.min(ctx.size.width * 0.39, 440);
        return { W, H: W * 0.74 };
      },
      identifyFrame: (base, S) => (ctx, W, H) =>
        S.ctx.util.svg(
          'svg',
          { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'figure-frame' },
          S.scene,
        ),
    },
  },
});
