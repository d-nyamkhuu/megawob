// Design on templates/crop-image/base.js, with the crop action beside the navigator.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-pan-03',
  name: 'design',
  split: 'train',
  scenarios: ['pan'],
  template: 'crop-image/base',
  design: {
    parts: {
      'placeIn@0': (base) => function (ctx, wrap, rng, pad) {
        // Keep the action beside the navigator rather than over its click area.
        const toolbar = wrap.querySelector('.cr-tools');
        const navigator = wrap.querySelector('.cr-nav');
        if (toolbar && navigator) toolbar.style.position = 'absolute';
        base(ctx, wrap, rng, pad);
        if (!toolbar || !navigator) return;
        const outer = wrap.getBoundingClientRect();
        const thumb = navigator.getBoundingClientRect();
        const gap = Math.min(40, ctx.size.width * .05);
        Object.assign(toolbar.style, {
          position: 'absolute',
          left: `${thumb.right - outer.left + gap}px`,
          top: `${thumb.top - outer.top}px`,
          width: `${Math.min(196, ctx.size.width * .23)}px`,
          height: `${thumb.height}px`,
          display: 'flex',
          alignItems: 'center',
          zIndex: '3',
        });
        Object.assign(navigator.parentElement.style, {
          position: 'relative',
          zIndex: '3',
          width: `${thumb.width}px`,
        });
        const action = toolbar.querySelector('.cr-apply');
        if (action) Object.assign(action.style, {
          width: '100%',
          height: `${Math.min(64, thumb.height)}px`,
          flex: 'none',
        });
      },
    },
  },
});
