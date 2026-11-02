// Vertical slider design with compact tracks, square thumbs, and a multi-slider group marker.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-12',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    thumbBox: [26, 26],
    parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        const sampledThumb = g.thumb;
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          g.thumb = sampledThumb;
          g.length = Math.max(80, Math.min(204, layout.size.height - 38));
        }
      },
      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        if (layout.vertical && layout.n > 1) group.classList.add('multiple');
        return group;
      },
    },
  },
});
