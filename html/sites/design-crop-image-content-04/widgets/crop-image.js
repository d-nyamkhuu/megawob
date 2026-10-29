// Keep reference crop geometry and the notebook's image placement.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-content-04',
  name: 'design',
  split: 'train',
  scenarios: ['content'],
  template: 'crop-image/base',
  design: {
    parts: {
      'placeIn@0': (base) => function (ctx, el, rng, pad) {
        // Preserve the template's random draws and fit calculation.
        base(ctx, el, rng, pad);
        const freeX = Math.max(0, ctx.size.width - el.offsetWidth);
        el.style.left = Math.min(6, freeX) + 'px';
        el.style.top = '0px';
      },
    },
  },
});
