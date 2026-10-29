// Swiss inspector design: fixed vertical controls sized to the available height and anchored at the upper left.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-06',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    thumb: 22,
    thumbBox: [34, 28],
    rail: 16,
    ticks: true,
    readout: true,
    native: false,
    parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const n = layout.n;
        g.length = Math.max(60, Math.floor(layout.size.height - (n > 1 ? 130 : 80)));
        g.tickCount = 2;
        g.thumb = 22;
        g.thumbBox = [34, 28];
        g.rail = 16;
        g.ticks = true;
        g.readout = true;
      },
      placed: () => (ctx, layout) => {
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
