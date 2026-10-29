// Matches the horizontal settings template while keeping this site's stage layout and row order.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-06',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    settings: false,
    rows: 4,
    labels: ['Brightness', 'Contrast', 'Saturation', 'Sharpness'],
    min: 0,
    max: 100,
    order: null,
    ticks: null,
    fill: true,
    fillFirst: true,
    decorative: { Brightness: 50, Contrast: 50, Saturation: 50, Sharpness: 50 },
    decorativeFraction: 50,
    parts: {
      entries: () => (ctx) => {
        const entries = ctx.spec.sliders.map((s, i) => ({ s, i }));
        const extra = ['Brightness', 'Contrast', 'Saturation', 'Sharpness'].filter(
          label => !entries.some(({ s }) => s.label === label),
        );
        while (entries.length < 4) {
          entries.push({ s: { label: extra.shift(), min: 0, max: 100, step: 1 }, i: null });
        }
        if (entries.length === 4 && ctx.spec.sliders.length === 1) entries.push(entries.shift());
        return entries;
      },
    },
  },
});
