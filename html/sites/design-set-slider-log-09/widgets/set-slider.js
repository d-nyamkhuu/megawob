// Uses viewport-width tracks, a fixed large thumb, log minor ticks, and live preview values.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-09',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    thumb: 42,
    rail: 10,
    minor: { log: true, cls: 'slc-tick slc-minor' },
    parts: {
      geometry: () => (ctx, g) => {
        g.length = Math.max(200, Math.floor(ctx.size.width) - 16);
        g.ticks = true;
        g.readout = true;
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        const { card, size } = layout;
        card.style.width = Math.floor(size.width) + 'px';
        card.style.left = '0px';
        const cardHeight = card.offsetHeight + 28;
        const fit = Math.min(1, size.height / cardHeight);
        if (fit < 1) {
          card.style.transformOrigin = 'top left';
          card.style.transform = `scale(${fit})`;
          card.style.left = Math.round(size.width * (1 - fit) / 2) + 'px';
        }
        card.style.top = Math.max(0, Math.min(Math.round(size.height * 0.145), size.height - cardHeight * fit)) + 'px';
        const s = ctx.spec.sliders[0];
        const scale = env.taskOf('set-slider').helpers.scale;
        document.querySelectorAll('[data-info]').forEach((e) => {
          if (e.dataset.info === 'min') e.textContent = scale.fmt(s, s.min);
          if (e.dataset.info === 'max') e.textContent = scale.fmt(s, s.max);
        });
      },
      readout: (base) => (ctx, w) => {
        const el = base(ctx, w);
        if (el && !w.g.readoutEl) w.root.insertBefore(el, w.body);
        return el;
      },
      paintReadout: (base) => (ctx, w, values) => {
        base(ctx, w, values);
        if (w.index === 0) {
          document.querySelectorAll('[data-live]').forEach((e) => {
            e.textContent = e.dataset.live + values.map(w.fmt).join(' – ');
          });
          const img = document.querySelector('.preview-img');
          if (img) img.style.opacity = String(0.16 + 0.1 * w.frac(values[values.length - 1]));
        }
      },
    },
  },
});
