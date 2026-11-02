// Human notebook design: fixed vertical slider look, range markings and a value callout.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-01',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    thumb: 28,
    rail: 8,
    thumbBox: [42, 54],
    ticks: true,
    readout: true,
    native: false,
    sampleLook: false,
    sampleLength: false,
    parts: {
      limits: (base) => (ctx, layout) => ({
        ...base(ctx, layout),
        maxV: Math.max(90, Math.floor(layout.size.height * 0.78) - layout.presetsH),
      }),
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          const presetsH = ctx.spec.presets ? 40 + 26 * (ctx.spec.presets.length + 1) : 0;
          g.length = Math.max(90, Math.floor(layout.size.height * 0.78) - presetsH);
          g.thumb = 28;
        }
      },
      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        if (layout.vertical) {
          ctx.util.el('h1', 'control-heading', ctx.stage, ctx.spec.sliders[0].label + ' Control');
          ctx.util.el('p', 'control-caption', ctx.stage, 'Drag the handle to set the value.');
        }
        return group;
      },
      afterReadout: () => (ctx, w) => {
        const scale = env.taskOf('set-slider').helpers.scale;
        ctx.util.el('div', 'slc-end slc-end-max', w.body, scale.fmt(w.s, w.s.max));
        ctx.util.el('div', 'slc-end slc-end-min', w.body, scale.fmt(w.s, w.s.min));
        const marks = ctx.util.el('div', 'human-marks', w.body);
        for (let k = 0; k <= 8; k++) {
          const mark = ctx.util.el('i', '', marks);
          mark.style.top = (k / 8) * 100 + '%';
        }
        const range = document.querySelector('[data-info="range"]');
        if (range) range.textContent = scale.fmt(w.s, w.s.min) + ' – ' + scale.fmt(w.s, w.s.max);
      },
      painted: () => (ctx, w, vals, fractions) => {
        if (w.g.vertical) {
          const [a, b] = fractions.length === 2 ? fractions : [0, fractions[0]];
          w.fill.style.height = ((b - a) * w.L + 9) + 'px';
          if (w.readout) {
            w.readout.style.top = (1 - fractions[0]) * w.L + 'px';
            const current = document.querySelector('[data-info="current"]');
            if (current) current.textContent = w.readout.textContent;
          }
        }
      },
    },
  },
});
