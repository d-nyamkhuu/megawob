// Multi slider design with a fixed size-scaled look and the original responsive layout.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-11',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    sampleLook: false,
    sampleLength: false,
    clear: true,
    horizontal: false,
    parts: {
      begin: () => () => {},
      look: () => (ctx) => ({
        thumb: Math.max(24, Math.round(ctx.size.width * 0.021)),
        thumbBox: [
          Math.max(24, Math.round(ctx.size.width * 0.021)),
          Math.max(32, Math.round(ctx.size.width * 0.028)),
        ],
        rail: 8,
        ticks: true,
        readout: true,
        native: false,
      }),
      geometry: (base) => (ctx, g, s, i, layout) => {
        const tickCount = g.tickCount;
        base(ctx, g, s, i, layout);
        const { size, vertical } = layout;
        const presetsH = ctx.spec.presets ? 40 + 26 * (ctx.spec.presets.length + 1) : 0;
        const maxV = Math.max(90, Math.min(440, Math.floor(size.height) - 145 - presetsH));
        const maxH = Math.max(160, Math.min(1100, Math.floor(size.width * 0.658)));
        g.length = vertical ? maxV : maxH;
        g.tickCount = tickCount;
      },
      layout: (base) => (ctx, layout) => {
        base(ctx, layout);
        const { size, n, look } = layout;
        const presetsH = ctx.spec.presets ? 40 + 26 * (ctx.spec.presets.length + 1) : 0;
        layout.group.style.rowGap = Math.max(
          12,
          Math.min(
            size.width * 0.04,
            (size.height - presetsH - 60 - n * (look.thumb + 12)) / Math.max(1, n - 1),
          ),
        ) + 'px';
      },
      minorTicks: () => (ctx, w, ticks) => {
        if (w.g.vertical || w.s.stops) return;
        for (let i = 0; i <= 20; i++) {
          const tick = ctx.util.el('div', 'slc-minor-tick', ticks);
          tick.style.left = (i * w.L) / 20 + 'px';
        }
      },
      beforePlace: (base) => (ctx, layout) => {
        base(ctx, layout);
        const { size, n, group, card } = layout;
        if (layout.vertical || n <= 1) return;
        const gap = parseFloat(getComputedStyle(group).rowGap) || 0;
        const overflow = card.offsetHeight + 32 - size.height;
        if (overflow > 0) group.style.rowGap = Math.max(0, gap - overflow / (n - 1)) + 'px';
      },
    },
  },
});
