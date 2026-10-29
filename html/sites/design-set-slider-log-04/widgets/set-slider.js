// Platinum adjuster design: minor log ticks, a fixed horizontal track width, and current-value readouts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-04',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    minor: { log: true },
    parts: {
      look: (base) => (ctx) => {
        const look = base(ctx);
        look.readout = true;
        look.ticks = true;
        look.native = false;
        look.thumb = Math.round(ctx.size.width * 0.027);
        look.thumbBox = [Math.round(ctx.size.width * 0.0185), Math.round(ctx.size.width * 0.027)];
        look.rail = Math.max(8, Math.round(ctx.size.width * 0.0115));
        return look;
      },
      painted: (base) => (ctx, w, vals, fractions) => {
        base(ctx, w, vals, fractions);
        if (w.index === 0) {
          const info = document.querySelector('.info-box');
          if (info) {
            info.querySelector('.info-current').textContent = 'Current value: ' + vals.map(w.fmt).join(' – ');
          }
        }
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        g.thumb = layout.look.thumb;
        g.rail = layout.look.rail;
        g.thumbBox = layout.look.thumbBox;
        if (!layout.vertical) g.length = Math.max(260, Math.floor(layout.size.width * 0.787));
      },
      placed: () => () => {},
    },
  },
});
