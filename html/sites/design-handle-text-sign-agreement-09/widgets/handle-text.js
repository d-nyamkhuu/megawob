// Keep the original whole-pixel agreement row height over the shared sign-agreement preset.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-09',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  design: {
    signFieldLabel: 'Name (type your full name):',
    parts: {
      lookMade: (base, S) => (ctx, look, box) => {
        base(ctx, look, box);
        if (ctx.spec.rows) {
          const reserve = parseFloat(getComputedStyle(ctx.stage).getPropertyValue('--agreement-reserve')) || 164;
          look.lh = Math.max(20, Math.floor((box.h - reserve - 2) / ctx.spec.rows));
        }
        look.vars['--ut-lh'] = look.lh + 'px';
      },
    },
  },
});
