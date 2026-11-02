// This design keeps the identify frame at its original 476×309 proportions while fitting the viewport.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-09',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    parts: {
      identifySize: (base) => (ctx) => {
        const scale = Math.min(1, (ctx.size.width - 40) / 476, Math.max(80, ctx.size.height - 150) / 309);
        return { W: 476 * scale, H: 309 * scale };
      },
    },
  },
});
