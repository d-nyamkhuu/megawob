// Photo adjustment sheet design: bounded controls, fixed origin, and inactive settings.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-05',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: true,
    readout: true,
    native: false,
    thumb: 20,
    stageStyle: true,
    minor: { log: true, tag: 'i', cls: 'slc-minor', before: true },
    parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        g.length = Math.min(g.length, Math.max(60, Math.floor(layout.size.width * 0.675)));
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        const { util } = ctx;
        const n = layout.n;
        const fillers = [
          ['Brightness', '-100', '100'],
          ['Saturation', '-100', '100'],
          ['Sharpen', '0', '100'],
        ];
        const extra = Math.max(0, 4 - n);
        layout.card.style.setProperty('--rows', Math.max(4, n));
        if (n <= 4) layout.card.classList.add('four-settings');
        layout.group.style.gridRow = n === 1 ? '2' : '1 / span ' + n;
        fillers.slice(0, extra).forEach(([label, lo, hi], j) => {
          const row = util.el('div', 'photo-setting', layout.card);
          row.setAttribute('aria-disabled', 'true');
          row.style.gridRow = n === 1 ? [1, 3, 4][j] : n + j + 1;
          util.el('div', 'setting-label', row, label);
          const rail = util.el('div', 'setting-rail', row);
          const thumb = util.el('div', 'setting-thumb', rail);
          thumb.style.left = label === 'Sharpen' ? '5%' : '51%';
          const ends = util.el('div', 'setting-ends', row);
          util.el('span', '', ends, lo);
          util.el('span', '', ends, hi);
          util.el('div', 'setting-value', row, '0');
        });
      },
    },
  },
});
