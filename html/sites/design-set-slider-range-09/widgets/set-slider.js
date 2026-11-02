// GTK range design: fixed full-width tracks, thumb bubbles, and a selected-range summary.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-09',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    native: false,
    readout: false,
    bubble: { tag: 'span', cls: 'slc-bub', units: true },
    parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const { width, height } = layout.size;
        g.length = Math.max(260, Math.floor(width) - 55);
        g.thumb = 24;
        g.thumbBox = [Math.max(20, Math.round(width * 0.034)), Math.max(30, Math.round(height * 0.08))];
        g.rail = Math.max(14, Math.round(height * 0.034));
        g.ticks = true;
        g.tickCount = 4;
        g.readout = false;
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        const { spec, util } = ctx;
        const { card, n } = layout;
        card.style.left = card.style.top = '0px';
        const panel = util.el('div', 'range-panel' + (n > 1 ? ' with-extra-slider' : ''), ctx.stage);
        const selected = spec.scored[0];
        util.el('div', 'rp-label', panel, 'Selected ' + spec.sliders[selected].label.toLowerCase() + ' range:');
        const value = util.el('div', 'rp-val', panel);
        const scale = env.taskOf('set-slider').helpers.scale;
        value.textContent = ctx.model.values[selected].map((v) => scale.fmtU(spec.sliders[selected], v)).join(' – ');
      },
      painted: (base) => (ctx, w, values, fractions) => {
        base(ctx, w, values, fractions);
        const value = document.querySelector('.rp-val');
        if (value && w.index === ctx.spec.scored[0]) value.textContent = values.map(w.fmt).join(' – ');
      },
      widget: (base) => (ctx, w) => {
        base(ctx, w);
        if (ctx.opts.instr === 'toast' || ctx.opts.route === 'wheel') w.hit.style.transform = 'translateY(calc(-2.5512726em - 3.968701px))';
      },
    },
  },
});
