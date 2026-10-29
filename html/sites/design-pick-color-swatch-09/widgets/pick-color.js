// Keeps this site's proportional picker, three-column swatches and live numeric readouts.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-09',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      parts: {
        fit: (base, S) => (ctx, host) => {
          const bounds = host.getBoundingClientRect();
          const stripW = Math.max(18, Math.round(bounds.width * 0.064));
          const W = Math.max(S.task.helpers.MIN_TRACK_PX,
            Math.floor(bounds.width - stripW - Math.round(bounds.width * 0.042)));
          const H = Math.floor(bounds.height * 0.985);
          return {
            W,
            H,
            hueH: H - 1,
            hueW: stripW,
            radius: 4,
            knob: Math.max(18, Math.round(W * 0.064)),
            bounds,
          };
        },
        axes: (base, S) => (ctx, host, g) => {
          const { util } = ctx;
          const { W, H, hueW } = g;
          const axis = util.el('div', 'sv-axis', host);
          Object.assign(axis.style, {
            top: Math.round(H * 0.04) + 'px',
            height: Math.round(H * 0.925) + 'px',
            bottom: 'auto',
          });
          util.el('div', 'axis-arrow up', axis);
          util.el('div', 'axis-label', axis, 'Value (Brightness)');
          util.el('div', 'axis-arrow down', axis);
          const saturation = util.el('div', 'saturation-axis', host);
          Object.assign(saturation.style, { top: Math.round(H + W * 0.027) + 'px', bottom: 'auto' });
          util.el('span', 'horizontal-arrow left', saturation);
          util.el('span', '', saturation, 'Saturation');
          util.el('span', 'horizontal-arrow right', saturation);
          const hueLabel = util.el('div', 'hue-label', host, 'Hue');
          Object.assign(hueLabel.style, { width: hueW + 'px', top: Math.round(H + W * 0.025) + 'px', bottom: 'auto' });
        },
        hit: (base, S) => (ctx, el, kind, g) => {
          if (kind === 'hue') el.style.left = (g.W + Math.round(g.bounds.width * 0.042)) + 'px';
        },
        hue: (base, S) => (ctx, host, g) => {
          const hue = base(ctx, host, g);
          const paint = hue.paint;
          hue.paint = (model) => {
            paint(model);
            hue.bar.style.background = `hsl(${model.h} 100% 50%)`;
          };
          return hue;
        },
        layout: (base, S) => (ctx, card) => {
          const { util, spec } = ctx;
          const st = S.st;
          const controlHost = util.el('div', 'picker-controls', card);
          const readouts = util.el('div', 'readouts', card);
          const vals = {};
          const addRows = (keys, unit) => {
            const group = util.el('div', 'ro-group', readouts);
            for (const key of keys) {
              const row = util.el('div', 'ro-row', group);
              util.el('span', 'ro-lab', row, key);
              const box = util.el('div', 'ro-box', row);
              vals[key] = util.el('span', 'ro-val', box);
              if (unit && unit[key]) util.el('span', 'ro-unit', box, unit[key]);
            }
          };
          addRows(['H', 'S', 'V'], { H: '°', S: '%', V: '%' });
          addRows(['R', 'G', 'B', '#']);

          const swatches = util.el('div', 'sw-col', card);
          const targetBox = util.el('div', 'sw-box', swatches);
          util.el('div', 'sw-label', targetBox, spec.targetLabel);
          const target = { swatch: util.el('div', 'cp-swatch', targetBox) };
          const currentBox = util.el('div', 'sw-box', swatches);
          util.el('div', 'sw-label', currentBox, 'Current');
          const current = { swatch: util.el('div', 'cp-swatch', currentBox) };
          const hex = util.el('div', 'sw-hex', currentBox);

          target.swatch.style.background = S.math.hex(spec.rgb);
          st.controls = S.P.picker(ctx, controlHost, ctx.size.height, ctx.size.width);
          st.side = {
            anchors: [target.swatch, current.swatch],
            locators: {},
            paint(model) {
              const rgb = S.math.modelRgb(model);
              const code = S.math.hex(rgb);
              current.swatch.style.background = code;
              hex.textContent = code;
              vals.H.textContent = String(Math.round(model.h));
              vals.S.textContent = String(Math.round(model.s * 100));
              vals.V.textContent = String(Math.round(model.v * 100));
              vals.R.textContent = String(Math.round(rgb[0]));
              vals.G.textContent = String(Math.round(rgb[1]));
              vals.B.textContent = String(Math.round(rgb[2]));
              vals['#'].textContent = code.replace('#', '');
              const delta = document.querySelector('[data-role="color-difference"]');
              if (delta) delta.textContent = S.task.error(model, spec).toFixed(1);
            },
          };
        },
      },
    },
  });
})();
