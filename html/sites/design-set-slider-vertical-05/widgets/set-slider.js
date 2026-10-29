// Vertical sliders use a broad hit area, ruler marks, current readouts, and size-scaled tracks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-05',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    parts: {
      cross: (base) => (ctx, index, s, g) =>
        g.vertical ? Math.round(ctx.size.width * 0.13) : base(ctx, index, s, g),

      ticks: (base) => (ctx, w) => {
        if (!w.g.vertical) return base(ctx, w);
        const ticks = ctx.util.el('div', 'irix-scale', w.hit);
        for (let k = 0; k <= 20; k++) {
          const tick = ctx.util.el('i', '', ticks);
          tick.style.top = k * 5 + '%';
        }
        ctx.util.el('span', 'scale-max', w.body, w.fmt(w.s.max));
        ctx.util.el('span', 'scale-min', w.body, w.fmt(w.s.min));
      },

      readout: (base) => (ctx, w) => {
        if (!w.g.vertical) return base(ctx, w);
        const current = ctx.util.el('div', 'irix-value current-value', w.root);
        ctx.util.el('div', 'value-caption', current, 'Current Value');
        const readout = ctx.util.el('div', 'slc-readout', current);
        const mode = ctx.util.el('div', 'irix-value mode-value', w.root);
        ctx.util.el('div', 'value-caption', mode, 'Mode');
        ctx.util.el('div', 'slc-readout', mode, 'Manual');
        return readout;
      },

      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        if (layout.vertical && layout.n > 1) group.classList.add('multiple');
        return group;
      },

      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          g.length = Math.round((layout.size.height * 0.71) / layout.n);
          g.thumbBox = [Math.round(layout.size.width * 0.082), Math.round((layout.size.height * 0.075) / layout.n)];
          g.rail = Math.round(layout.size.width * 0.035);
        }
      },
    },
  },
});
