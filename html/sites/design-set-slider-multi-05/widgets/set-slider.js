// Multi-slider design: preserve vertical layouts, full-width tracks, and value labels beneath each track.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-05',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    horizontal: false,
    parts: {
      look: (base) => (ctx) => {
        const { rng, spec } = ctx;
        return {
          thumb: rng.int(14, 26),
          rail: rng.int(4, 10),
          ticks: rng.bool(0.6) || true,
          readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match' || true,
          native: rng.bool(0.3) && false,
        };
      },
      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        if (!layout.vertical) group.style.gridTemplateRows = `repeat(${layout.n}, minmax(0, 1fr))`;
        return group;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        const sampledLength = g.length;
        const tickCount = g.tickCount;
        base(ctx, g, s, i, layout);
        g.tickCount = tickCount;
        const { size, vertical, card } = layout;
        const padding = getComputedStyle(card);
        if (!vertical) {
          g.length = Math.max(
            100,
            size.width - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight) - 10,
          );
          g.thumb = Math.max(16, Math.min(24, (size.width * 24) / 665));
        } else {
          g.length = Math.min(
            sampledLength,
            Math.max(80, size.height - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom) - 110),
          );
        }
      },
      paintReadout: (base) => (ctx, w, values) => {
        base(ctx, w, values);
        if (w.readout && !w.g.vertical) {
          const fractions = values.map((value) => env.taskOf('set-slider').helpers.scale.frac(w.s, value));
          w.readout.style.left = w.body.offsetLeft + ((fractions[0] + fractions[fractions.length - 1]) / 2) * w.L + 'px';
          w.readout.style.top = w.body.offsetTop + w.cross / 2 + w.g.thumb * 1.3 + 'px';
        }
      },
    },
  },
});
