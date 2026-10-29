// Motif ledger design: fixed wide tracks, square thumbs, and a stage-aligned group.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-07',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    bubble: { tag: 'div', cls: 'slc-bubble' },
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        const k = ctx.size.width / 1112;
        return Object.assign(look, {
          thumb: Math.round(32 * k),
          thumbBox: [Math.round(28 * k), Math.round(34 * k)],
          rail: 5,
          ticks: true,
          readout: true,
          native: false,
        });
      },
      layout: (base) => (ctx, layout) => {
        base(ctx, layout);
        const { size, group } = layout;
        group.style.gridTemplateColumns = `${Math.round(size.width * 0.13)}px auto`;
        group.style.columnGap = '0px';
        group.style.paddingTop = Math.round(size.height * 0.23) + 'px';
        group.style.rowGap = '0px';
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        g.length = Math.round(layout.size.width * 0.84);
        g.tickCount = 10;
      },
      placed: (base) => (ctx, layout) => {
        base(ctx, layout);
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
