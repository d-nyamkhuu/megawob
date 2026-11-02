// Swiss inspector design: width based controls, fixed placement, and inactive fields.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-02',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    minor: { log: true, tag: 'i' },
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        look.thumb = Math.max(18, ctx.size.width * 0.038);
        look.rail = 14;
        return look;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        g.length = Math.max(180, Math.floor(ctx.size.width) - ctx.size.width * 0.095);
        g.thumb = Math.max(18, ctx.size.width * 0.038);
        g.rail = 14;
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        const { util, spec } = ctx;
        const extraLabels = ['Brightness', 'Saturation', 'Sharpness'];
        for (let i = spec.sliders.length; i < 4; i++) {
          const row = util.el('div', 'inspector-inactive', layout.group);
          row.setAttribute('aria-disabled', 'true');
          util.el('div', 'inspector-label', row, extraLabels[i - 1] || 'Sharpness');
          util.el('div', 'inspector-value', row, '100');
          const scale = util.el('div', 'inspector-scale', row);
          util.el('div', 'inspector-rail', scale);
          util.el('div', 'inspector-fill', scale);
          util.el('div', 'inspector-thumb', scale);
          for (let decade = 0; decade < 4; decade++) {
            for (let multiple = 2; multiple < 10; multiple++) {
              const tick = util.el('i', 'inspector-minor', scale);
              tick.style.left = (decade + Math.log10(multiple)) * 25 + '%';
            }
          }
          [1, 10, 100, 1000, 10000].forEach((value, j) => {
            const tick = util.el('span', 'inspector-tick', scale, String(value));
            tick.style.left = j * 25 + '%';
          });
        }
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
