// Vertical Swiss design: responsive faders with endpoint labels, moving readouts, and a stage-height track.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-08',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        look.native = false;
        look.readout = true;
        return look;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          g.length = Math.floor(layout.size.height * 0.8);
          g.thumb = Math.max(24, (layout.size.height * 34) / 645);
          g.rail = Math.max(12, (layout.size.height * 18) / 645);
        }
      },
      ticks: (base, S) => (ctx, w) => {
        const { s, g, body, L, frac } = w;
        if (!(g.ticks || s.stops)) return;
        const ticks = ctx.util.el('div', 'slc-ticks', body);
        const values = g.vertical && !s.stops
          ? [s.min, s.max]
          : S.P.tickValues(s, env.taskOf('set-slider').helpers.scale, g.tickCount, L, g.vertical);
        for (const value of values) {
          const tick = ctx.util.el('div', 'slc-tick' + (s.stops ? ' slc-stop' : ''), ticks, env.taskOf('set-slider').helpers.scale.fmt(s, value));
          tick.style[g.vertical ? 'top' : 'left'] = (g.vertical ? (1 - frac(value)) * L : frac(value) * L) + 'px';
        }
      },
      readout: (base) => (ctx, { g, root, body }) => g.readoutEl ||
        (g.vertical || g.readout ? ctx.util.el('div', 'slc-readout', g.vertical ? body : root) : null),
      paintReadout: (base) => (ctx, w, values) => {
        base(ctx, w, values);
        if (w.readout && w.g.vertical) {
          const fractions = values.map(w.frac);
          const b = fractions.length === 2 ? fractions[1] : fractions[0];
          w.readout.style.top = (1 - b) * w.L + 'px';
        }
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
