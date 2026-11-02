// XP photo editor design: three rows, dense ticks, and a scene preview.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-02',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    rows: 3,
    labels: ['Brightness', 'Sharpness', 'Contrast'],
    min: 0,
    max: 1000,
    order: 'swap',
    ticks: 16,
    major: 8,
    fill: true,
    fillFirst: false,
    labelSuffix: ':',
    parts: {
      settings: (base) => (ctx) => {
        const preview = ctx.util.el('div', 'preview', ctx.stage);
        if (env.xpScene) env.xpScene(preview, 'big');
        const settings = base(ctx);
        settings.dataset.realRows = ctx.spec.sliders.length;
        return settings;
      },
      decorative: () => (ctx, w, s) => {
        const value = s.label === 'Brightness' ? 512 : 300;
        w.thumb.style.left = (s.label === 'Brightness' ? 51.2 : 30) + '%';
        w.readout.textContent = String(value);
        w.row.classList.add('decorative');
      },
    },
  },
});
