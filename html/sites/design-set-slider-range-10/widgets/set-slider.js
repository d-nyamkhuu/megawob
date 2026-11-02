// Swiss range design: long horizontal tracks with labeled bounds and values on each thumb.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-range-10',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-slider/classic',
  design: {
    readout: true,
    native: false,
    bubble: { cls: 'slc-tip', units: true },
    parts: {
      label: (base) => (ctx, root, index, s, g) => {
        const lab = base(ctx, root, index, s, g);
        ctx.util.el('span', 'slc-sub', lab,
          `Range ${env.taskOf('set-slider').helpers.scale.fmt(s, s.min)} – ${env.taskOf('set-slider').helpers.scale.fmt(s, s.max)}`);
        return lab;
      },
      geometry: (base) => (ctx, g, s, index, layout) => {
        base(ctx, g, s, index, layout);
        if (!g.vertical) {
          g.length = Math.max(320, layout.size.width * 0.774);
          g.tickCount = 10;
          g.ticks = true;
          g.readout = false;
          g.thumb = Math.max(26, layout.size.width * 0.022);
          g.rail = 12;
        }
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
      sliderOptions: (base, S) => (ctx, w) => {
        const options = base(ctx, w);
        if (ctx.spec.scenario !== 'range' || w.g.vertical
            || (ctx.opts.instr !== 'toast' && ctx.opts.route !== 'wheel')) return options;
        const r = w.hit.getBoundingClientRect();
        const dy = 6.375 + ctx.size.width * 0.0069580078125;
        return {
          ...options,
          geometry: () => ({
            length: r.width,
            point: (f) => [r.left + f * r.width, r.top + r.height / 2 - dy],
            project: ([x]) => x - r.left,
          }),
        };
      },
    },
  },
});
