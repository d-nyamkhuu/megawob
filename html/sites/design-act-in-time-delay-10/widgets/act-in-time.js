// This delay design pads the countdown clock and narrows the interval surface.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-10',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    clockPad: true,
    process: false,
    intervalWidth: 0.64,
    waitText: 'Waiting…',
    parts: {
      frame: (base) => (ctx) => {
        const f = base(ctx);
        const setClock = f.setClock;
        f.setClock = (t) => setClock(Math.max(0, (ctx.spec.ready || 10000) - t));
        return f;
      },
      go: (base) => (ctx, f, go) => {
        base(ctx, f, go);
        f.arena.style.setProperty('--ut-action-label', JSON.stringify(go.textContent));
      },
    },
  },
});
