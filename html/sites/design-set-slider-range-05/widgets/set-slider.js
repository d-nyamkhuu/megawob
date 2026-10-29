// Metro design: scaled full-width tracks, value tags, range thumbs, and decorative adjustment rows.
(function () {
  'use strict';

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-range-05',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-slider/classic',
    design: {
      native: false,
      parts: {
        root: (base) => (ctx, root, index, s, g) => {
          base(ctx, root, index, s, g);
          if (s.target !== undefined) root.classList.add('slc-target');
        },
        thumb: (base) => (ctx, w, thumb, j) => {
          base(ctx, w, thumb, j);
          if (w.n > 1) thumb.classList.add('tr');
        },
        afterReadout: (base) => (ctx, w) => {
          base(ctx, w);
          if (w.g.vertical) return;
          w.metroReadouts = Array.from({ length: w.n }, () => ctx.util.el('div', 'slc-tv', w.body));
        },
        painted: (base) => (ctx, w, values, fractions) => {
          base(ctx, w, values, fractions);
          if (w.metroReadouts) w.metroReadouts.forEach((tag, j) => {
            tag.textContent = w.fmt(values[j]);
            tag.style.left = fractions[j] * w.L + 'px';
          });
        },
        geometry: (base) => (ctx, g, s, i, layout) => {
          base(ctx, g, s, i, layout);
          const U = layout.size.width / 1452;
          if (!layout.vertical) g.length = Math.max(160, Math.round(layout.size.width - 252 * U));
          g.thumb = Math.round(46 * U);
          g.rail = Math.max(6, Math.round(12 * U));
          g.ticks = true;
          g.readout = true;
          g.cross = 46 * U;
          g.thumbBox = [
            (ctx.model.values[i].length > 1 ? 30 : 26) * U,
            (ctx.model.values[i].length > 1 ? 46 : 42) * U,
          ];
        },
        controlled: (base) => (ctx, ctl, s, i, layout) => {
          base(ctx, ctl, s, i, layout);
          if (i !== layout.n - 1) return;
          const { spec, util, size } = ctx;
          const U = size.width / 1452;
          const fixedL = Math.max(160, Math.round(size.width - 252 * U));
          for (const label of ['Brightness', 'Saturation'].slice(Math.max(0, layout.n - 1))) {
            const row = util.el('div', 'slc-h metro-xtra', layout.group);
            util.el('div', 'slc-label', row, label);
            const body = util.el('div', 'slc-body slc-h', row);
            const hit = util.el('div', 'slc-hit', body);
            hit.style.width = fixedL + 'px';
            util.el('div', 'slc-rail', hit);
            util.el('div', 'slc-thumb', hit);
            const scale = spec.sliders[0];
            const ticks = util.el('div', 'slc-ticks', body);
            util.el('div', 'slc-tick', ticks, String(scale.min));
            util.el('div', 'slc-tick', ticks, String(scale.max));
            util.el('div', 'slc-tv', body, env.taskOf('set-slider').helpers.scale.fmtU(scale, (scale.min + scale.max) / 2));
          }
        },
      },
    },
  });
})();
