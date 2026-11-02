// Keep the reference controls and seeded draws; size the stacked sheet from its stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-match-04',
  name: 'design',
  split: 'train',
  scenarios: ['match'],
  template: 'set-slider/base',
  design: {
    parts: {
      '+0.gemLayout': () => (ctx) => {
        const n = ctx.spec.sliders.length;
        const rows = (ctx.spec.presets || []).length + 1;
        const naturalHeight = 56 + 38 + rows * 38 + 34 + n * 60 + (2 * n - 1) * 25 + 28;
        const scale = Math.min(1, (ctx.size.height - 28) / naturalHeight, ctx.size.width / 1000);
        const width = Math.floor(ctx.size.width * .7);
        return { scale, width, length: Math.floor(width - 4 - (60 + 82 + 16 + 16) * scale) };
      },
      'ensureStyle@0': (base) => () => {
        base();
        if (document.getElementById('gem-slider-style')) return;
        const style = document.createElement('style');
        style.id = 'gem-slider-style';
        style.textContent = `
        body.gem .slc-card {
          width:var(--gem-width); padding:calc(26px * var(--gem-scale)) calc(30px * var(--gem-scale)) calc(30px * var(--gem-scale));
          font:calc(22px * var(--gem-scale))/1.22 "Courier New",monospace;
        }
        body.gem .slc-presets { margin:0 0 calc(34px * var(--gem-scale)); font-size:calc(19px * var(--gem-scale)); }
        body.gem .slc-presets caption, body.gem .slc-presets th, body.gem .slc-presets td {
          font-size:calc(19px * var(--gem-scale)); padding:calc(7px * var(--gem-scale)) calc(14px * var(--gem-scale));
        }
        body.gem .slc-grid { column-gap:calc(16px * var(--gem-scale)); align-items:center; }
        body.gem .slc-label { grid-column:1/-1; min-width:0; text-align:left; margin-bottom:calc(-15px * var(--gem-scale)); font-size:inherit; }
        body.gem .slc-card .slc-readout { width:calc(82px * var(--gem-scale)); height:calc(48px * var(--gem-scale)); padding:calc(5px * var(--gem-scale)) calc(8px * var(--gem-scale)); font-size:calc(20px * var(--gem-scale)); }
        body.gem .slc-hit { margin:0 calc(8px * var(--gem-scale)); }
        body.gem .slc-ticks { font:inherit; font-size:.78em; }
        body.gem .slc-h .slc-ticks { height:calc(37px * var(--gem-scale)); }
        body.gem .slc-h .slc-tick { top:calc(7px * var(--gem-scale)); }
        `;
        document.head.append(style);
      },
      renderPlain: (base, S) => (ctx, look) => {
        const g = S.gemLayout(ctx);
        ctx.stage.style.setProperty('--gem-scale', g.scale);
        ctx.stage.style.setProperty('--gem-width', g.width + 'px');
        return base(ctx, look);
      },
      makeSlider: (base, S) => (ctx, parent, index, slider, g) => {
        const fit = S.gemLayout(ctx);
        return base(ctx, parent, index, slider, {
          ...g, length:Math.min(g.length, fit.length), rail:20 * fit.scale,
          thumb:Math.max(12, 28 * fit.scale), thumbBox:[21 * fit.scale, 36 * fit.scale],
        });
      },
      makeNative: (base, S) => (ctx, parent, index, slider, g) => {
        const fit = S.gemLayout(ctx);
        const thumb = Math.max(12, g.thumb * fit.scale);
        return base(ctx, parent, index, slider, {
          ...g, thumb, length:Math.min(g.length, fit.length - thumb),
        });
      },
      'placeIn@0': (base, S) => (ctx, card, rng, pad) => {
        const fit = S.gemLayout(ctx);
        const grid = card.querySelector('.slc-grid');
        if (grid) {
          grid.style.gridTemplateColumns = `minmax(0,1fr) ${82 * fit.scale}px`;
          grid.style.rowGap = 25 * fit.scale + 'px';
        }
        // Preserve the template's placement draws before centering the measured sheet.
        base(ctx, card, rng, pad);
        card.style.left = Math.round((ctx.size.width - card.offsetWidth) / 2) + 'px';
        card.style.top = Math.max(12, Math.round((ctx.size.height - card.offsetHeight) / 2)) + 'px';
      },
    },
  },
});
