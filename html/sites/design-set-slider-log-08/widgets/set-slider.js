// This design adds logarithmic minor ticks, static comparison rows, and its original compact slider geometry.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-08',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    minor: { log: true, tag: 'i', cls: 'slc-minor' },
    parts: {
      parent: (base) => (ctx, layout, s, i) => {
        const group = base(ctx, layout, s, i);
        if (i === 0) {
          const dummy = (label) => {
            ctx.util.el('div', 'slc-label wb-static-label', group, label);
            const track = ctx.util.el('div', 'wb-static-track', group);
            ctx.util.el('i', 'wb-static-thumb', track);
            ctx.util.el('div', 'slc-readout', group, '100');
          };
          dummy('Brightness');
        }
        return group;
      },
      controlled: (base) => (ctx, control, s, i, layout) => {
        base(ctx, control, s, i, layout);
        if (i === layout.n - 1) {
          const dummy = (label) => {
            ctx.util.el('div', 'slc-label wb-static-label', layout.group, label);
            const track = ctx.util.el('div', 'wb-static-track', layout.group);
            ctx.util.el('i', 'wb-static-thumb', track);
            ctx.util.el('div', 'slc-readout', layout.group, '100');
          };
          dummy('Saturation');
          dummy('Sharpness');
        }
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        g.length = Math.max(100, Math.floor(layout.size.width * 0.55));
        g.thumb = layout.look.thumb;
        g.thumbBox = [Math.max(13, Math.round(layout.size.width * 0.035)), Math.max(23, Math.round(layout.size.width * 0.057))];
        g.rail = Math.max(7, Math.round(layout.size.width * 0.02));
      },
      placed: () => (ctx, layout) => {
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
