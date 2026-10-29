// Range design: academic slider geometry, live endpoint labels, scanner rows, and a top-left card.
(function () {
  const valueLabels = new WeakMap();
  const scannerSetting = (ctx, group, trackLength, label, value, fraction) => {
    const { util } = ctx;
    util.el('div', 'slc-label scanner-label', group, label);
    const body = util.el('div', 'scanner-body', group);
    const hit = util.el('div', 'scanner-hit', body);
    hit.style.width = trackLength + 'px';
    util.el('div', 'scanner-rail', hit);
    const thumb = util.el('div', 'scanner-thumb', hit);
    thumb.style.left = fraction * 100 + '%';
    util.el('div', 'scanner-readout', group, value);
  };

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-range-08',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-slider/classic',
    design: {
      parts: {
        look: () => (ctx) => {
          const { rng, spec } = ctx;
          const look = {
            thumb: rng.int(14, 26),
            rail: rng.int(4, 10),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match',
            native: rng.bool(0.3),
          };
          const academicScale = Math.min(1, ctx.size.width / 926);
          return Object.assign(look, {
            thumb: 26 * academicScale,
            thumbBox: [26 * academicScale, 28 * academicScale],
            rail: 8 * academicScale,
            ticks: true,
            readout: true,
            native: false,
            academicScale,
          });
        },
        root: (base) => (ctx, root, index, s, g) => {
          base(ctx, root, index, s, g);
          const n = ctx.model.values[index].length;
          root.classList.toggle('slc-single', n === 1);
          root.classList.toggle('slc-long', s.label.length > 13);
        },
        cross: (base) => (ctx, index, s, g) => Math.max(g.thumb, 24 * (g.academicScale || 1)) + 12 * (g.academicScale || 1),
        ticks: (base, S) => (ctx, w) => {
          if (!w.g.vertical && w.n === 2) {
            const wrap = ctx.util.el('div', 'slc-values', w.body);
            valueLabels.set(w, Array.from({ length: w.n }, () => ctx.util.el('div', 'slc-value', wrap)));
          } else if ((w.g.ticks || w.s.stops) && !w.g.academicScale) {
            const ticks = ctx.util.el('div', 'slc-ticks', w.body);
            for (const v of S.P.tickValues(w.s, env.taskOf('set-slider').helpers.scale, w.g.tickCount, w.L, w.g.vertical)) {
              const t = ctx.util.el('div', 'slc-tick' + (w.s.stops ? ' slc-stop' : ''), ticks, env.taskOf('set-slider').helpers.scale.fmt(w.s, v));
              t.style[w.g.vertical ? 'top' : 'left'] = (w.g.vertical ? (1 - w.frac(v)) * w.L : w.frac(v) * w.L) + 'px';
            }
          }
        },
        painted: (base) => (ctx, w, vals, fractions) => {
          base(ctx, w, vals, fractions);
          const labels = valueLabels.get(w);
          if (labels) labels.forEach((label, j) => {
            label.textContent = env.taskOf('set-slider').helpers.scale.fmt(w.s, vals[j]);
            label.style.left = fractions[j] * w.L + 'px';
          });
        },
        layout: (base) => (ctx, layout) => {
          base(ctx, layout);
          if (!layout.vertical && layout.n <= 2) {
            const trackLength = Math.floor(layout.size.width * 0.604);
            scannerSetting(ctx, layout.group, trackLength, 'Brightness', '128', 0.475);
          }
        },
        geometry: (base) => (ctx, g, s, i, layout) => {
          base(ctx, g, s, i, layout);
          const academicScale = layout.look.academicScale || 1;
          if (ctx.model.values[i].length === 1) g.thumbBox = [21 * academicScale, 28 * academicScale];
          g.length = Math.floor(layout.size.width * 0.604);
        },
        beforePlace: (base) => (ctx, layout, controllers) => {
          base(ctx, layout, controllers);
          if (!layout.vertical && layout.n === 1) {
            scannerSetting(ctx, layout.group, Math.floor(layout.size.width * 0.604), 'Saturation', '100', 0.445);
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
