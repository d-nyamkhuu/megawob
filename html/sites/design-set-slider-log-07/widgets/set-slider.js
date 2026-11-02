// Log-console design: exposes target and current values and expands the rail across the stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-07',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const s = ctx.spec.sliders[0];
        const S = env.taskOf('set-slider').helpers.scale;
        const target = Array.isArray(s.target) ? s.target[0] : s.target;
        if (Number.isFinite(target)) {
          document.querySelector('[data-role="target"]').textContent = S.fmt(s, target);
        }
      },
      beforeGroup: (base) => (ctx, layout) => {
        base(ctx, layout);
        const { size, n } = layout;
        ctx.stage.classList.toggle('multi-console', n > 1);
        layout.primaryHeight = size.height * 0.5;
        layout.extraHeight = (size.height - layout.primaryHeight - 32) / Math.max(1, n - 1);
      },
      root: (base) => (ctx, root, index, s, g) => {
        base(ctx, root, index, s, g);
        if (g.rowBox) {
          Object.assign(root.style, {
            position: 'absolute',
            top: g.rowBox[0] + 'px',
            height: g.rowBox[1] + 'px',
            width: '100%',
          });
          root.style.setProperty('--row-label-size', g.rowBox[1] * 0.38 + 'px');
        }
      },
      geometry: (base, S) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const { size, n } = layout;
        g.length = Math.floor(size.width * 0.918);
        g.thumb = Math.round(size.width * 0.048);
        if (n > 1 && i > 0) g.thumb = Math.min(24, g.thumb);
        g.rail = 10;
        g.ticks = true;
        g.readout = true;
        g.cls = n > 1 ? 'slc-console-row ' + (i === 0 ? 'primary-row' : 'extra-row') : g.cls;
        g.rowBox = n > 1
          ? [i === 0 ? 0 : layout.primaryHeight + (i - 1) * layout.extraHeight,
            i === 0 ? layout.primaryHeight : layout.extraHeight]
          : null;
      },
      sliderOptions: (base) => (ctx, w) => ({
        ...base(ctx, w),
        geometry: () => {
          const r = w.hit.getBoundingClientRect();
          return {
            length: w.L,
            point: (f) => (w.g.vertical
              ? [r.left + w.cross / 2, r.top + (1 - f) * w.L]
              : [r.left + f * w.L, r.top + w.cross / 2]),
            project: ([x, y]) => (w.g.vertical ? r.top + w.L - y : x - r.left),
          };
        },
      }),
      painted: (base) => (ctx, w, vals, fractions) => {
        base(ctx, w, vals, fractions);
        const current = document.querySelector('[data-role="current"]');
        if (current && w.index === 0) current.textContent = vals.map(w.fmt).join(' – ');
      },
    },
  },
});
