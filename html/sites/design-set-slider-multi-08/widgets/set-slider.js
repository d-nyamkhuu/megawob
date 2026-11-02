// Vista design: horizontal aligned rows, compact dense tracks, and major/minor tick marks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-08',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    thumb: 22,
    thumbBox: [20, 36],
    rail: 12,
    minor: { count: 20, before: true },
    horizontal: true,
    seededOrientation: true,
    parts: {
      begin: () => () => {},
      layout: (base) => (ctx, layout) => {
        base(ctx, layout);
        const { size, n, group } = layout;
        const dense = n >= 4;
        const rowHeight = dense ? 36 : 42;
        group.style.rowGap = Math.max(
          dense ? 0 : 10,
          Math.min(80, (size.height - n * rowHeight - (dense ? 20 : 42)) / Math.max(1, n - 1)),
        ) + 'px';
        if (dense) group.style.gridAutoRows = rowHeight + 'px';
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const { size, group, n } = layout;
        const labelWidth = Math.max(108, Math.min(171, size.width * 0.22));
        group.style.gridTemplateColumns = labelWidth + 'px 1fr 76px';
        g.length = Math.max(120, size.width - labelWidth - 104);
        g.tickCount = 4;
        g.thumb = 22;
        g.thumbBox = n >= 4 ? [14, 24] : [20, 36];
        g.rail = n >= 4 ? 8 : 12;
        g.ticks = true;
        g.readout = true;
        if (n >= 4) {
          g.cross = 26;
        }
      },
      minorTicks: () => (ctx, w, ticks) => {
        if (w.g.vertical || w.s.stops) return;
        for (let k = 0; k <= 20; k++) {
          const tick = ctx.util.el('i', 'slc-minor', ticks);
          tick.style.left = (k * w.L) / 20 + 'px';
          if (k % 5 === 0) tick.classList.add('major');
        }
      },
    },
  },
});
