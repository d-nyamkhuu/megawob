// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-mixed-02',
  name: 'design',
  split: 'train',
  scenarios: ['mixed'],
  template: 'change-settings/preferences',
  design: {
    sideTabsAt: 100000,
    parts: {
      wrap: (base, S) => (ctx) => {
        const wrap = base(ctx);
        Object.assign(wrap.style, {
          width: Math.max(0, ctx.size.width - 44) + 'px',
          height: S.geo.long ? 'auto' : Math.max(0, ctx.size.height - 36) + 'px',
        });
        return wrap;
      },
      width: (base) => (ctx) => {
        base(ctx); // Preserve the template's seeded width draw.
        return Math.max(0, ctx.size.width - 44);
      },
      place: (base, S) => (ctx) => {
        base(ctx); // Preserve the template's seeded placement draw.
        // The full-width paper occupies the stage's measured area.
        S.els.wrap.style.marginTop = '18px';
      },
    },
  },
});
