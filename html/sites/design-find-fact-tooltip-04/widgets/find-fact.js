// Keep the centered card inside the stage when an instruction panel narrows it.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-tooltip-04',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip'],
  template: 'find-fact/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        frame.app.style.maxWidth = Math.max(0, ctx.size.width - 16) + 'px';
        return frame;
      },
    },
  },
});
