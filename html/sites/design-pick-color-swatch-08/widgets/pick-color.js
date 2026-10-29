// Preserves the full-stage swatch layout and proportional controls used by this design.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-08',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      axes: false,
      parts: {
        fit: (base, S) => (ctx, card) => {
          const minPx = S.task.helpers.MIN_TRACK_PX;
          const bounds = card.getBoundingClientRect();
          const W = Math.max(minPx, Math.floor(bounds.width * 0.84));
          const H = Math.max(minPx, Math.floor(bounds.height));
          return {
            W,
            H,
            hueH: H,
            hueW: Math.round(bounds.width * 0.082),
            radius: 0,
            knob: Math.max(18, Math.round(W * 0.088)),
            bounds,
          };
        },
        hit: (base, S) => (ctx, el, kind, g) => {
          if (kind === 'hue') {
            el.style.left = Math.max(g.W + 4, Math.round(g.bounds.width - g.hueW)) + 'px';
          }
        },
        layout: (base, S) => (ctx, card) => {
          const { util, spec } = ctx;
          const { st } = S;
          util.el('div', 'mx-label mx-tl', card, spec.targetLabel);
          const tSw = util.el('div', 'cp-swatch mx-ts', card);
          tSw.style.background = S.math.hex(spec.rgb);
          util.el('div', 'mx-label mx-cl', card, 'Current');
          const cSw = util.el('div', 'cp-swatch mx-cs', card);
          const cHex = util.el('div', 'mx-hex', card);
          util.el('div', 'mx-rule', card);
          util.el('div', 'mx-label mx-pick', card, 'Pick a color');
          const controlHost = util.el('div', 'picker-controls', card);
          const rows = [
            ['Hex', 55.3, 'hex'],
            ['H', 62.3, 'h', '°'],
            ['S', 68.2, 's', '%'],
            ['V', 74.1, 'v', '%'],
            ['R', 83.1, 'r'],
            ['G', 89.0, 'g'],
            ['B', 94.9, 'b'],
          ];
          util.el('div', 'mx-rule2', card);
          const vals = {};
          for (const [label, top, key, unit] of rows) {
            const row = util.el('div', 'mx-row', card);
            row.style.top = top + '%';
            util.el('span', 'mx-key', row, label);
            const box = util.el('span', key === 'hex' ? 'mx-val wide' : 'mx-val', row);
            vals[key] = util.el('span', '', box);
            if (unit) util.el('span', 'unit', box, unit);
          }
          const hb = controlHost.getBoundingClientRect();
          st.controls = S.P.picker(ctx, controlHost, hb.height || ctx.size.height, hb.width || ctx.size.width);
          st.side = {
            anchors: [tSw, cSw],
            locators: {},
            paint(m) {
              const rgb = S.math.modelRgb(m);
              const code = S.math.hex(rgb);
              cSw.style.background = code;
              cHex.textContent = code;
              vals.hex.textContent = code;
              vals.h.textContent = String(Math.round(m.h));
              vals.s.textContent = String(Math.round(m.s * 100));
              vals.v.textContent = String(Math.round(m.v * 100));
              ['r', 'g', 'b'].forEach((k, i) => { vals[k].textContent = String(Math.round(rgb[i])); });
              const bar = card.querySelector('.cp-hue .cp-bar');
              if (bar) bar.style.background = code;
            },
          };
        },
      },
    },
  });
})();
