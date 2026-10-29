// This design uses the wider frame and larger figure from the kinetic identification layout.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-06',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    figureScale: 0.85,
    parts: {
      identifySize: (base, S) => (ctx) => ({
        W: ctx.size.width * 0.49,
        H: ctx.size.height * 0.659,
      }),
    },
  },
});
