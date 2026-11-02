// GEM crop layout, with image pixels and interaction geometry sized together.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-position-04',
  name: 'design',
  split: 'train',
  scenarios: ['position'],
  template: 'crop-image/base',
  design: {
    parts: {
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        // Retain the template's placement draws, including their order.
        base(ctx, wrap, rng, pad);
        const compact = ctx.size.width < 1000;
        const left = compact ? 12 : 24;
        const top = compact ? 42 : 52;
        const bottom = compact ? 62 : 76;
        S.W = Math.max(1, Math.floor(ctx.size.width - 2 * left - 4));
        S.H = Math.max(1, Math.floor(ctx.size.height - top - bottom - 4));
        Object.assign(wrap.style, {
          left: '0px', top: '0px', width: ctx.size.width + 'px',
          height: ctx.size.height + 'px', padding: '0', display: 'block',
        });
        Object.assign(S.frame.style, {
          position: 'absolute', left: left + 'px', top: top + 'px',
          width: S.W + 'px', height: S.H + 'px', boxSizing: 'content-box',
        });
        const canvas = S.frame.querySelector('canvas');
        canvas.width = S.W;
        canvas.height = S.H;
        S.drawScene(canvas.getContext('2d'), ctx.spec, env.taskDef.helpers, rng);
        S.frame.querySelector('.cr-dim').style.opacity = '0';
        S.frame.querySelector('.cr-grid').hidden = true;
        wrap.querySelector('.cr-readout').hidden = true;
        const bar = wrap.querySelector('.cr-tools');
        if (bar) Object.assign(bar.style, {
          position: 'absolute', left: '0px', right: '0px', bottom: '14px',
          width: 'auto', height: compact ? '34px' : '42px', margin: '0',
          display: 'flex', justifyContent: 'center',
        });
        if (S.applyBtn) Object.assign(S.applyBtn.style, {
          width: '30%', height: '100%', padding: '3px',
        });
        S.crop.set(ctx.model);
      },
    },
  },
});
