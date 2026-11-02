// Keep the Studio layout in the widget so drawing and drag geometry agree.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-stops-02',
  name: 'design',
  split: 'train',
  scenarios: ['stops'],
  template: 'set-slider/base',
  design: {
    parts: {
      makeSlider: (base) => (ctx, parent, index, slider, geometry) => {
        const small = ctx.size.width <= 960;
        const width = ctx.size.width * (small ? .68 : .686);
        const labelWidth = Math.max(220, width * .27);
        const gap = 22;
        const vertical = geometry.vertical;
        const g = {
          ...geometry,
          thumb: small ? 23 : 30,
          rail: 6,
          readout: false,
          length: vertical
            ? Math.min(geometry.length, Math.floor(ctx.size.height * .57))
            : Math.max(80, Math.floor(width - labelWidth - gap)),
        };
        Object.assign(parent.style, vertical ? {
          width: width + 'px', gap: '24px', justifyContent: 'space-around',
        } : {
          width: width + 'px', gridTemplateColumns: labelWidth + 'px auto',
          columnGap: gap + 'px',
        });
        const result = base(ctx, parent, index, slider, g);
        const body = result.anchor.parentElement;
        const label = vertical ? body.parentElement.querySelector('.slc-label')
          : body.previousElementSibling;
        if (label) Object.assign(label.style, { minWidth: '0', textAlign: vertical ? 'center' : 'left' });
        if (!vertical) {
          const ticks = body.querySelector('.slc-ticks');
          if (ticks) {
            Object.assign(ticks.style, { top: 'auto', bottom: '100%', height: '38px' });
            for (const tick of ticks.children) Object.assign(tick.style, { top: 'auto', bottom: '5px' });
          }
        }
        return result;
      },
      'placeIn@0': (base) => (ctx, card, rng, pad) => {
        // Preserve all of the template's placement draws.
        base(ctx, card, rng, pad);
        Object.assign(card.style, {
          left: ctx.size.width * (ctx.size.width <= 960 ? .29 : .284) + 'px',
          top: ctx.size.height * (ctx.size.width <= 960 ? .25 : .18) + 'px',
          width: ctx.size.width * (ctx.size.width <= 960 ? .68 : .686) + 'px',
          height: 'auto', padding: '0',
        });
      },
    },
  },
});
