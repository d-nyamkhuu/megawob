// Adds the palm wall photo and uses 0–100 decorative sliders set to 50.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-03',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    max: 100,
    heading: 'Adjust',
    ticks: null,
    fillMode: 'variable',
    decorative: { Brightness: 50, Contrast: 50, Saturation: 50, Sharpness: 50 },
    locateError: 'Unknown library slider',
    parts: {
      begin: () => (ctx) => {
        const photo = ctx.util.el('div', 'photo', ctx.stage);
        const image = ctx.util.el('img', 'photo-image', photo);
        image.src = 'sites/design-set-slider-horizontal-03/assets/palm-wall.webp';
        image.alt = 'Sunlit palm fronds and their shadows across a cream and coral stucco wall.';
      },
    },
  },
});
