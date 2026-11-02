// Fixed size and look, with legacy decorative controls behind the active range sliders.
(function () {
  'use strict';

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-range-11',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-slider/classic',
    design: {
      thumb: 28,
      rail: 8,
      ticks: true,
      readout: true,
      native: false,
      bubble: { tag: 'span', cls: 'slc-current', units: true },
      sampleLook: false,
      sampleLength: false,
      clear: true,
      parts: {
        limits: (base) => (ctx, { size, presetsH }) => ({
          maxV: Math.max(90, Math.min(440, Math.floor(size.height) - 145 - presetsH)),
          maxH: Math.max(160, Math.min(1100, Math.floor(size.width * 0.635))),
        }),
        card: (base) => (ctx, layout) => {
          const { util } = ctx;
          for (const [name, value, pos, thumb] of [
            ['Brightness', '128', 45.1, 50],
            ['Saturation', '100', 76.7, 52],
            ['Sharpness', '50', 90.2, 48.5],
          ]) {
            const row = util.el('div', 'decor-slider', ctx.stage);
            row.setAttribute('aria-hidden', 'true');
            row.style.top = pos + '%';
            util.el('span', 'decor-label', row, name);
            const rail = util.el('div', 'decor-rail', row);
            const handle = util.el('i', 'decor-thumb', rail);
            handle.style.left = thumb + '%';
            util.el('span', 'decor-readout', row, value);
          }
          return base(ctx, layout);
        },
        painted: (base) => (ctx, w, values, fractions) => {
          base(ctx, w, values, fractions);
          w.thumbs.forEach((thumb, index) => {
            if (values[index] === undefined) return;
            thumb.firstChild.style.transform = fractions.length === 2 && Math.abs(fractions[1] - fractions[0]) * w.L < 64
              ? index === 0 ? 'translateX(-100%)' : 'translateX(0)'
              : 'translateX(-50%)';
          });
          const edgeTicks = w.body.querySelectorAll('.slc-tick');
          if (edgeTicks.length) {
            edgeTicks[0].style.visibility = fractions.some((f) => f < 0.065) ? 'hidden' : '';
            edgeTicks[edgeTicks.length - 1].style.visibility = fractions.some((f) => f > 0.935) ? 'hidden' : '';
          }
        },
      },
    },
  });
})();
