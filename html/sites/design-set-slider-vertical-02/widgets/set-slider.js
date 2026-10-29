// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-02',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    readout: true,
    parts: {
      geometry: () => (ctx, g, s, i, { size, vertical }) => {
        if (vertical) { g.length = Math.round(size.height * 0.69); g.thumbBox = [40, 22]; g.labelEl = false; }
      },
      ticks: (base) => (ctx, w) => {
        const { s, g, body, L } = w;
        if (g.vertical && !s.stops) {
          const hi = ctx.util.el('div', 'civ-end civ-end-hi', body, env.taskOf('set-slider').helpers.scale.fmt(s, s.max));
          const lo = ctx.util.el('div', 'civ-end civ-end-lo', body, env.taskOf('set-slider').helpers.scale.fmt(s, s.min));
          hi.style.top = '-1.5em'; lo.style.top = L + 0.2 * 16 + 'px';
        } else base(ctx, w);
      },
      commit: (base) => (ctx, index, vals) => {
        base(ctx, index, vals);
        const el = ctx.stage.querySelector('[data-slider-value="' + index + '"]');
        if (el) el.textContent = env.taskOf('set-slider').helpers.scale.fmtU(ctx.spec.sliders[index], vals[0]);
      },
      rendered: () => (ctx) => {
        const { spec } = ctx;
        // Read-only settings list beside the slider (civic-service form look).
        const rowVals = [];
        if (spec.scenario === 'vertical' && spec.sliders) {
          const S = env.taskOf('set-slider').helpers.scale;
          const hint = document.querySelector('.civic-hint');
          const setting = spec.sliders.find(s => s.target !== undefined) || spec.sliders[0];
          if (hint && setting) hint.textContent = 'Adjust the ' + setting.label.toLowerCase() + ' setting using the slider on the right. The current value is shown below the slider.';
          const panel = ctx.util.el('div', 'civ-panel', ctx.stage);
          ctx.util.el('div', 'civ-panel-title', panel, 'Display Settings');
          const list = ctx.util.el('div', 'civ-panel-list', panel);
          const filler = (label, value) => {
            const row = ctx.util.el('div', 'civ-row', list);
            ctx.util.el('span', '', row, label);
            ctx.util.el('span', 'civ-val', row, value);
          };
          if (!spec.sliders.some(s => s.label === 'Brightness')) filler('Brightness', '250');
          spec.sliders.forEach((s, i) => {
            const row = ctx.util.el('div', 'civ-row' + (s.target !== undefined ? ' on' : ''), list);
            ctx.util.el('span', '', row, s.label);
            const value = ctx.util.el('span', 'civ-val', row, '');
            value.dataset.sliderValue = i;
            rowVals.push(value);
          });
          if (!spec.sliders.some(s => s.label === 'Saturation')) filler('Saturation', '180');
          if (!spec.sliders.some(s => s.label === 'Sharpness')) filler('Sharpness', '50');
        }
        rowVals.forEach((el, i) => { el.textContent = env.taskOf('set-slider').helpers.scale.fmtU(spec.sliders[i], ctx.model.values[i][0]); });
      },
      sync: () => (ctx, m) => ctx.stage.querySelectorAll('[data-slider-value]').forEach(el => {
        const i = Number(el.dataset.sliderValue);
        el.textContent = env.taskOf('set-slider').helpers.scale.fmtU(ctx.spec.sliders[i], m.values[i][0]);
      }),
    },
  },
});
