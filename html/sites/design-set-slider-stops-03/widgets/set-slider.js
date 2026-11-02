// Design on templates/set-slider/base.js, sized to the playback dialog's stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-stops-03',
  name: 'design',
  split: 'train',
  scenarios: ['stops'],
  template: 'set-slider/base',
  design: {
    parts: {
      makeSlider: (base) => (ctx, parent, index, slider, geometry) => base(
        ctx, parent, index, slider,
        geometry.vertical ? {
          ...geometry,
          // Reserve space for the label, card padding and endpoint thumbs.
          length: Math.min(geometry.length, Math.max(1, ctx.size.height - 128)),
        } : geometry,
      ),
    },
  },
});
