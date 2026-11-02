// This design uses a compact square figure frame and labels its reset control “Clear.”
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-03',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear',
    parts: {
      identifySize: (base) => (ctx) => {
        const W = Math.max(80, Math.min(330, ctx.size.width * 0.4, ctx.size.height * 0.68));
        return { W, H: W };
      },
    },
  },
});
