// Swiss inspector design: log minor ticks, width based geometry, sampled placement and look.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-06',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: null,
    readout: null,
    native: null,
    minor: { log: true, tag: 'i' },
    parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        if (!s.log || layout.vertical) return;
        base(ctx, g, s, i, layout);
        g.length = Math.floor(layout.size.width * 0.806);
        g.readout = true;
        g.ticks = true;
        g.thumb = Math.max(14, layout.size.width * 0.019);
        g.rail = Math.max(5, layout.size.width * 0.0073);
      },
      native: (base) => (ctx, { input, s, L }) => {
        base(ctx, { input, s, L });
        if (!s.log) return;
        const ticks = input.parentElement.querySelector('.slc-ticks');
        if (!ticks) return;
        const scale = env.taskOf('set-slider').helpers.scale;
        for (let decade = s.min; decade < s.max; decade *= 10) {
          for (let multiple = 2; multiple < 10; multiple++) {
            const value = decade * multiple;
            if (value >= s.max) continue;
            const tick = ctx.util.el('i', 'slc-minor', ticks);
            tick.style.left = scale.frac(s, value) * L + 'px';
          }
        }
      },
      placed: () => () => {},
    },
  },
});
