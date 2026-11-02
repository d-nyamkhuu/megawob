// Keep the viewer within the stage when instruction frame takes vertical space.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-count-03',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'find-fact/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        frame.app.style.maxHeight = Math.max(0, ctx.size.height - frame.app.offsetTop - 6) + 'px';
        return frame;
      },
    },
  },
});
