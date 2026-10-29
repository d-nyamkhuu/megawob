// Design on templates/crop-image/base.js, with stage-sized editor placement.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-aspect-05',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'crop-image/base',
  design: {
    parts: {
      'box.render': (base, S) => function (ctx) {
        // Inspector values describe the current crop, never the requested crop.
        const paintCurrentCrop = (m) => {
          const values = {
            ratio: m.ratio === 'free' || !m.ratio ? 'Free' : m.ratio,
            size: `${Math.round((m.r - m.l) * S.W)} × ${Math.round((m.b - m.t) * S.H)} px`,
            position: `X: ${Math.round(m.l * S.W)}    Y: ${Math.round(m.t * S.H)}`,
          };
          for (const field of document.querySelectorAll('[data-current-crop]')) {
            field.textContent = values[field.dataset.currentCrop];
          }
        };
        const editorContext = Object.create(ctx);
        editorContext.update = (m) => {
          ctx.update(m);
          paintCurrentCrop(m);
        };
        const rendered = base.call(this, editorContext);
        paintCurrentCrop(ctx.model);
        return {
          ...rendered,
          sync(m) {
            rendered.sync(m);
            paintCurrentCrop(m);
          },
        };
      },
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        // Keep the template's random draws, then lay out the editor in stage pixels.
        base(ctx, wrap, rng, pad);
        const width = Math.max(1, ctx.size.width - 24);
        const height = Math.max(1, ctx.size.height - 26);
        const compact = ctx.size.width < 850;
        const applyHeight = compact ? 42 : 56;
        const imageLeft = Math.round(width * .11);
        const imageTop = Math.round(height * .03);
        // Retain the design's 4:3 image presentation while fitting the available stage.
        const imageAspect = 1.55;
        S.W = Math.floor(Math.min(width - imageLeft * 2,
          (height - imageTop - applyHeight - 32) * imageAspect));
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
        Object.assign(canvas.style, { width: '100%', height: '100%', opacity: '0' });
        let photo = S.frame.querySelector('.photo-still-life');
        if (!photo) {
          photo = document.createElement('div');
          photo.className = 'photo-still-life';
          S.frame.append(photo);
        }
        Object.assign(photo.style, { position: 'absolute', inset: '0', zIndex: '1', pointerEvents: 'none' });
        Object.assign(canvas.style, { position: 'relative', zIndex: '0' });
        const rail = wrap.querySelector('.cr-tools');
        Object.assign(rail.style, {
          position: 'absolute', left: imageLeft + 'px', top: imageTop + S.H + 14 + 'px',
          width: S.W + 'px', height: applyHeight + 'px',
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          justifyContent: 'center', gap: '16px', margin: '0',
        });
        for (const [ratio, chip] of Object.entries(S.chips)) {
          Object.assign(chip.style, {
            display: ratio === 'free' ? 'none' : 'block', flex: '1',
            width: '0', height: '100%', minHeight: '0', padding: '4px',
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
            top: imageTop + S.H + applyHeight + 18 + 'px', width: buttonWidth + 'px',
            height: applyHeight + 'px', padding: '10px', fontSize: compact ? '16px' : '21px',
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
