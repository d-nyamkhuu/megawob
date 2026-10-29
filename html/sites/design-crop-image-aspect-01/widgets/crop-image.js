// Design on templates/crop-image/base.js, with stage-sized editor placement.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-aspect-01',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'crop-image/base',
  design: {
    parts: {
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        // Keep the template's random draws, then lay out the editor in stage pixels.
        base(ctx, wrap, rng, pad);
        const width = Math.max(1, ctx.size.width - 24);
        const height = Math.max(1, ctx.size.height - 26);
        const compact = ctx.size.width < 850;
        const applyHeight = compact ? 54 : 72;
        const imageLeft = Math.round(width * .19);
        const imageTop = Math.round(height * .04);
        // Retain the design's 4:3 image presentation while fitting the available stage.
        const imageAspect = 4 / 3;
        S.W = Math.floor(Math.min(width - imageLeft - 12,
          (height - imageTop - applyHeight - 24) * imageAspect));
        S.H = Math.floor(S.W / imageAspect);
        Object.assign(wrap.style, {
          left: '12px', top: '14px', width: width + 'px', height: height + 'px',
          display: 'block', padding: '0', overflow: 'visible',
        });
        Object.assign(S.frame.style, {
          position: 'absolute', left: imageLeft + 'px', top: imageTop + 'px',
          width: S.W + 'px', height: S.H + 'px',
        });
        const canvas = S.frame.querySelector('canvas');
        Object.assign(canvas.style, { width: '100%', height: '100%' });
        const rail = wrap.querySelector('.cr-tools');
        Object.assign(rail.style, {
          position: 'absolute', left: '0', top: imageTop + 'px',
          width: Math.round(width * .17) + 'px', height: S.H + 'px',
          display: 'flex', flexDirection: 'column', alignItems: 'stretch',
          justifyContent: 'space-between', gap: '0', margin: '0',
        });
        for (const [ratio, chip] of Object.entries(S.chips)) {
          Object.assign(chip.style, {
            display: ratio === 'free' ? 'none' : 'block', flex: 'none',
            width: '100%', height: '14%', minHeight: '0', padding: '4px',
          });
        }
        const sep = rail.querySelector('.cr-sep');
        if (sep) sep.style.display = 'none';
        const readout = wrap.querySelector('.cr-readout');
        if (readout) readout.style.display = 'none';
        const grid = S.frame.querySelector('.cr-grid');
        if (grid) grid.style.display = 'none';
        for (const handle of S.frame.querySelectorAll('.cr-handle')) {
          Object.assign(handle.style, { width: '20px', height: '20px', margin: '-10px 0 0 -10px' });
        }
        if (S.applyBtn) {
          // The apply control belongs below the image, outside the preset rail.
          wrap.append(S.applyBtn);
          const buttonWidth = Math.round(width * .35);
          Object.assign(S.applyBtn.style, {
            position: 'absolute', left: Math.round(imageLeft + (S.W - buttonWidth) / 2) + 'px',
            top: imageTop + S.H + 20 + 'px', width: buttonWidth + 'px',
            height: applyHeight + 'px', padding: '10px', fontSize: compact ? '18px' : '26px',
          });
          const badge = rail.querySelector('.cr-badge');
          if (badge) {
            wrap.append(badge);
            Object.assign(badge.style, { position: 'absolute', left: imageLeft + 'px', top: imageTop + S.H + 24 + 'px' });
          }
        }
        // place() and cropbox now share exactly the displayed image dimensions.
        S.crop.set(ctx.model);
      },
    },
  },
});
