// Design on templates/crop-image/base.js with the organizer's fitted image window.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-pan-01',
  name: 'design',
  split: 'train',
  scenarios: ['pan'],
  template: 'crop-image/base',
  design: {
    parts: {
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        base(ctx, wrap, rng, pad);
        // The organizer's window fills its paper frame. Keep the image and
        // crop coordinates at the matching zoom before the template anchors it.
        const view = S.frame.parentElement;
        const maxWidth = Math.floor((ctx.size.width - 36) * 0.7);
        const maxHeight = Math.floor((ctx.size.height - 40) * 0.94);
        const borderWidth = view.offsetWidth - view.clientWidth;
        const borderHeight = view.offsetHeight - view.clientHeight;
        const scale = Math.min((maxWidth - borderWidth) / view.clientWidth,
          (maxHeight - borderHeight) / view.clientHeight);
        Object.assign(view.style, {
          width: Math.round(view.clientWidth * scale) + borderWidth + 'px',
          height: Math.round(view.clientHeight * scale) + borderHeight + 'px',
        });
        S.W = Math.round(view.clientWidth / ctx.spec.view.w);
        S.H = Math.round(view.clientHeight / ctx.spec.view.h);
        Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
        const canvas = S.frame.querySelector('canvas');
        Object.assign(canvas.style, { width: S.W + 'px', height: S.H + 'px' });
        S.crop.set(ctx.model);
        if (S.applyBtn) {
          const side = view.parentElement.querySelector('.cr-side');
          const toolbar = S.applyBtn.parentElement;
          side.classList.add('has-apply');
          side.append(toolbar);
          Object.assign(toolbar.style, { width: '100%', flexDirection: 'column', alignItems: 'stretch' });
        }
      },
    },
  },
});
