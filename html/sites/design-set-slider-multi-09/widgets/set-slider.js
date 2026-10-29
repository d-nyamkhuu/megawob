// Extranet design: responsive multi-slider sizing, inset ticks, and compact value readouts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-09',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    horizontal: false,
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        const sw = ctx.stage.getBoundingClientRect().width || ctx.size.width;
        const u = sw / 590;
        look.thumb = Math.max(20, Math.round(34 * u));
        look.cross = 46 * u;
        look.rail = Math.max(6, Math.round(16 * u));
        look.ticks = true;
        look.readout = true;
        look.native = false;
        return look;
      },
      card: (base) => (ctx, layout) => {
        const card = base(ctx, layout);
        const unit = ctx.stage.getBoundingClientRect().width / 590;
        if (layout.vertical) card.style.setProperty('--column-width', (layout.size.width - 32 * unit) / layout.n + 'px');
        card.style.setProperty('--row-space', (layout.n <= 3
          ? 86 * unit
          : Math.max(0, (layout.size.height - 30 * unit) / layout.n - 82 * unit)) + 'px');
        return card;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        const sampledLength = g.length;
        base(ctx, g, s, i, layout);
        const stageWidth = ctx.stage.getBoundingClientRect().width || layout.size.width;
        const unit = ctx.stage.getBoundingClientRect().width / 590;
        const fixedL = Math.round(stageWidth * 0.756);
        g.length = layout.vertical
          ? Math.min(sampledLength, Math.max(100, layout.size.height - 150 * unit))
          : fixedL;
        g.tickCount = 4;
      },
      ticks: (base, S) => (ctx, w) => {
        base(ctx, w);
        if (w.g.vertical) return;
        const ticks = w.body.querySelector('.slc-ticks');
        if (!ticks) return;
        const values = S.P.tickValues(w.s, env.taskOf('set-slider').helpers.scale, w.g.tickCount, w.L, false);
        const inset = w.L * 0.014;
        [...ticks.querySelectorAll('.slc-tick')].forEach((tick, index) => {
          tick.style.left = (inset + w.frac(values[index]) * (w.L - inset * 2)) + 'px';
        });
      },
      paintReadout: (base) => (ctx, w, values) => {
        base(ctx, w, values);
        if (w.readout) w.readout.style.setProperty('--value-size', Math.min(25, 125 / Math.max(1, w.readout.textContent.length)));
      },
    },
  },
});
