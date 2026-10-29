// Keeps this swatch design's proportional picker and four-panel HSL readouts.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-04',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      panelFields: ['HEX', 'RGB', 'HSL'],
      panelSuffix: '',
      pickerLabel: 'Pick a color',
      parts: {
        fit: (base, S) => (ctx, card) => {
          const bounds = card.getBoundingClientRect();
          const W = Math.max(S.task.helpers.MIN_TRACK_PX, Math.floor(Math.min(bounds.width * 0.86, bounds.height * 0.98)));
          const H = Math.round(W * 1.04);
          const radius = 0;
          const hueW = Math.round(bounds.width * 0.1);
          const knob = Math.max(18, Math.round(W * 0.068));
          return { W, H, hueH: H - 1, radius, hueW, knob, bounds };
        },
        panelPaint: (base, S) => (panel, rgb) => {
          const [r, g, b] = rgb.map((c) => c / 255);
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
          let h = 0, s = 0;
          if (d > 0) {
            s = d / (1 - Math.abs(2 * l - 1));
            h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
            h = (h * 60 + 360) % 360;
          }
          panel.swatch.style.background = S.math.hex(rgb);
          panel.fields.HEX.textContent = S.math.hex(rgb);
          panel.fields.RGB.textContent = rgb.map((c) => Math.round(c)).join(', ');
          panel.fields.HSL.textContent = `${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
        },
        markers: (base) => (ctx, knob, hue, model, geo) => {
          base(ctx, knob, hue, model, geo);
          hue.bar.style.background = `hsl(${model.h} 70% 45%)`;
        },
        layout: (base, S) => (ctx, card) => {
          const { util, spec } = ctx;
          const st = S.st;
          const target = S.P.panel(ctx, card, spec.targetLabel);
          const current = S.P.panel(ctx, card, 'Current');
          const host = S.P.pickerHost(ctx, card);
          const side = util.el('section', 'instrument-panel values-panel', card);
          const sideHead = util.el('div', 'panel-label', side);
          util.el('span', '', sideHead, 'Current values');
          util.el('small', '', sideHead, ' (display only)');
          const grid = util.el('div', 'values-grid', side);
          const fields = {};
          for (const key of ['HEX', 'R', 'G', 'B', 'H', 'S', 'V']) {
            if (key === 'H') util.el('hr', '', grid);
            util.el('span', 'vlab', grid, key);
            const box = util.el('div', 'vbox', grid, '');
            box.dataset.component = key;
            fields[key] = box;
            if (key === 'H') util.el('i', 'unit', grid, '°');
            else if (key === 'S' || key === 'V') util.el('i', 'unit', grid, '%');
          }
          const initial = [ctx.model.h, ctx.model.s, ctx.model.v];
          S.P.panelPaint(target, spec.rgb);
          st.controls = S.P.picker(ctx, host, ctx.size.height, ctx.size.width);
          st.side = {
            anchors: [target.swatch, current.swatch],
            locators: {},
            paint(model) {
              const rgb = S.math.modelRgb(model);
              S.P.panelPaint(current, rgb);
              const channels = rgb.map((c) => Math.round(c));
              fields.HEX.textContent = S.math.hex(rgb);
              fields.R.textContent = channels[0];
              fields.G.textContent = channels[1];
              fields.B.textContent = channels[2];
              fields.H.textContent = Math.round(model.h) % 360;
              fields.S.textContent = Math.round(model.s * 100);
              fields.V.textContent = Math.round(model.v * 100);
              const delta = document.querySelector('[data-role="color-difference"]');
              if (delta) delta.textContent = [model.h, model.s, model.v].every((v, i) => v === initial[i])
                ? '—' : S.task.error(model, spec).toFixed(1);
            },
          };
        },
      },
    },
  });
})();
