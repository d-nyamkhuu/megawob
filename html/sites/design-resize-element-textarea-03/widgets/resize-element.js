// Preserve the reference resize behavior while fitting the form's reserved space to the stage.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-textarea-03',
  name: 'design',
  split: 'train',
  scenarios: ['textarea'],
  template: 'resize-element/base',
  design: {
    parts: {
      placeIn: (base) => function (ctx, el, rng, pad = 12) {
        if (el.classList.contains('rzt-card')) {
          el.style.width = Math.min(el.offsetWidth, ctx.size.width - 2 * pad) + 'px';
          el.style.height = Math.min(el.offsetHeight, ctx.size.height - 2 * pad) + 'px';
        }
        return base(ctx, el, rng, pad);
      },
    },
  },
});
