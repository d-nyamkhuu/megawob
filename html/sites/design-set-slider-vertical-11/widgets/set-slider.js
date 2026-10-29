// Vertical slider design: fixed controls and thumb sizing, plus the original card and track layout.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-11',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    thumb: 28,
    rail: 8,
    ticks: true,
    readout: true,
    native: false,
    thumbBox: [34, 18],
    sampleLook: false,
    sampleLength: false,
    clear: true,
    parts: {
      card: (base) => (ctx, layout) => {
        const card = base(ctx, layout);
        if (layout.vertical && layout.n > 1) card.classList.add('slc-multiple');
        return card;
      },
      limits: (base) => (ctx, layout) => {
        const limits = base(ctx, layout);
        const { size, vertical, n, presetsH } = layout;
        limits.maxV = Math.max(90, Math.min(440, Math.floor(size.height) - (vertical && n > 1 ? 235 : 125) - presetsH));
        const room = Math.floor(size.width) - 120 - 96 - 24 - (layout.look.readout ? 152 : 0);
        limits.maxH = Math.max(160, Math.min(1100, room));
        return limits;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          g.thumb = 28;
          g.length = Math.max(90, Math.min(440, Math.floor(layout.size.height) - (layout.n > 1 ? 235 : 125) - (layout.presetsH || 0)));
          g.thumbBox = [34, 18];
        }
      },
    },
  },
});
