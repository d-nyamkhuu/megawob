// This design omits answer icons and uses the site's compact, heavier figure frame.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-identify-12',
  name: 'design',
  split: 'train',
  scenarios: ['identify'],
  template: 'read-figure/scene',
  design: {
    optionIcons: false,
    parts: {
      identifySize: () => (ctx) => {
        const H = Math.max(80, Math.min(244, ctx.size.height - 95));
        return { W: H * 1.1, H };
      },
      identifyFrame: (base) => (ctx, W, H) => {
        const svg = base(ctx, W, H);
        svg.classList.add('figure-frame');
        svg.style.border = '3px solid var(--line)';
        return svg;
      },
    },
  },
});
