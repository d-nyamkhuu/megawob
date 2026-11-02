// GEM design: full-width sliders, fixed placement, and the site’s log ticks/readout.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-03',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    parts: {
      card: (base) => (ctx, layout) => {
        const card = base(ctx, layout);
        if (layout.n > 1 && !layout.vertical) {
          card.classList.add('gem-multiple');
          card.style.setProperty('--slider-count', layout.n);
        }
        return card;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (!layout.vertical) {
          g.length = Math.max(180, Math.floor(ctx.size.width) - 28);
          // The log preset fixes these for log-01; this site keeps its sampled look.
          g.thumb = layout.look.thumb;
          g.rail = layout.look.rail;
          g.ticks = true;
          g.readout = true;
        }
      },
      minorTicks: () => (ctx, w, ticks) => {
        if (!w.s.log || w.g.vertical) return;
        for (let decade = w.s.min; decade < w.s.max; decade *= 10) {
          for (let step = 1; step < 7; step++) {
            const value = decade * Math.pow(10, step / 7);
            if (value >= w.s.max) continue;
            const minor = ctx.util.el('div', 'slc-minor', ticks);
            minor.style.left = w.frac(value) * w.L + 'px';
          }
        }
      },
      afterReadout: () => (ctx, w) => {
        if (w.readout) ctx.util.el('span', 'slc-value', w.readout);
      },
      paintReadout: () => (ctx, w, vals) => {
        if (w.readout) w.readout.firstChild.textContent = vals.map(w.fmt).join(' – ');
      },
      placed: () => (ctx, layout) => {
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
