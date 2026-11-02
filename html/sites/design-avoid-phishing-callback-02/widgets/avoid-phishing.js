// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-callback-02',
  name: 'design',
  split: 'train',
  scenarios: ['callback'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      fit: () => (ctx) => {
        const compact = ctx.size.width < 960;
        const short = ctx.size.height < 650;
        return {
          width: Math.min(1000, ctx.size.width * (compact ? 0.9 : 60 / 87)),
          height: Math.min(735, ctx.size.height * (short ? 0.92 : compact ? 0.84 : 0.82)),
        };
      },
      frame: (base) => (ctx) => {
        const app = base(ctx);
        app.style.position = 'absolute';
        app.style.zIndex = '3';
        app.style.boxSizing = 'border-box';
        app.style.left = `${ctx.size.width * (ctx.size.width < 960 ? 0.05 : 0.2)}px`;
        app.style.top = `${ctx.size.height * (ctx.size.height < 650 ? 0.06 : ctx.size.width < 960 ? 0.13 : 0.155)}px`;
        return app;
      },
    },
  },
});
