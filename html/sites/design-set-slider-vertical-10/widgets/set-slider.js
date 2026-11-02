// Vertical slideshow design: wider thumbs, inset end ticks, and stage-pinned placement.
(function () {
  'use strict';

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-vertical-10',
    name: 'design',
    split: 'train',
    scenarios: ['vertical'],
    template: 'set-slider/classic',
    design: {
      parts: {
        look: (base) => (ctx) => {
          const look = base(ctx);
          look.ticks = true;
          look.readout = true;
          return look;
        },
        geometry: (base) => (ctx, g, s, i, layout) => {
          base(ctx, g, s, i, layout);
          if (layout.vertical) Object.assign(g, {
            length: Math.max(160, layout.size.height * 0.77),
            rail: (22 * layout.size.width) / 1212,
            thumbBox: [(36 * layout.size.width) / 1212, (22 * layout.size.width) / 1212],
          });
        },
        ticks: (base) => (ctx, w) => {
          base(ctx, w);
          if (!w.g.vertical) return;
          const ticks = w.body.querySelector('.slc-ticks');
          if (!ticks) return;
          ticks.querySelectorAll('.slc-tick').forEach((tick, i, all) => {
            if (i !== 0 && i !== all.length - 1) tick.remove();
          });
          ticks.querySelectorAll('.slc-tick').forEach((tick) => {
            tick.style.top = 12 + (parseFloat(tick.style.top) * (w.L - 24)) / w.L + 'px';
          });
          for (let i = 1; i < 14; i++) {
            const minor = ctx.util.el('div', 'slc-tick' + (i % 5 ? ' slc-minor' : ''), ticks);
            minor.style.top = 12 + (i * (w.L - 24)) / 14 + 'px';
          }
        },
        placed: (base) => (ctx, layout, controllers) => {
          base(ctx, layout, controllers);
          layout.card.style.left = '0px';
          layout.card.style.top = '0px';
        },
      },
    },
  });
})();
