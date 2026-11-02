// Preserves this site's proportional picker, abbreviated axes, and extended color readouts.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-03',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      targetUpper: false,
      currentLabel: 'Current',
      panelSuffix: ':',
      parts: {
        fit: (base, S) => (ctx, card) => {
          const bounds = card.getBoundingClientRect();
          const W = Math.max(S.task.helpers.MIN_TRACK_PX, Math.floor(Math.min(bounds.width * 0.655, bounds.height * 0.916)));
          const H = Math.round(W * 0.994);
          return {
            W,
            H,
            hueH: Math.round(H * 0.916),
            radius: 0,
            hueW: Math.round(bounds.width * 0.072),
            knob: Math.max(18, Math.round(W * 0.084)),
            bounds,
          };
        },
        axes: (base) => (ctx, card, g) => {
          const { util } = ctx;
          const { W, H, hueW, bounds } = g;
          const axis = util.el('div', 'sv-axis', card);
          Object.assign(axis.style, {
            top: Math.round(bounds.height * 0.045) + 'px',
            height: Math.round(H * 0.95) + 'px',
            bottom: 'auto',
          });
          util.el('div', 'axis-arrow up', axis);
          util.el('div', 'axis-label', axis, 'V');
          util.el('div', 'axis-arrow down', axis);
          const saturation = util.el('div', 'saturation-axis', card);
          Object.assign(saturation.style, { top: Math.round(bounds.height * 0.045 + H) + 'px', bottom: 'auto' });
          util.el('span', 'horizontal-arrow left', saturation);
          util.el('span', '', saturation, 'S');
          util.el('span', 'horizontal-arrow right', saturation);
          const hueLabel = util.el('div', 'hue-label', card, 'H');
          Object.assign(hueLabel.style, { width: hueW + 'px', top: Math.round(H + W * 0.025) + 'px', bottom: 'auto' });
        },
        pickerHost: (base) => (ctx, card) => {
          const middle = ctx.util.el('section', 'instrument-panel picker-panel', card);
          return ctx.util.el('div', 'picker-controls', middle);
        },
        instrumentExtra: (base, S) => (ctx, card, target, current, host) => {
          const middle = host.parentElement;
          middle.before(current.panel);
          const readPanel = ctx.util.el('section', 'instrument-panel read-panel', card);
          ctx.util.el('div', 'panel-label', readPanel).textContent = 'Color Readouts (Current)';
          const rd = {};
          const groups = [['H', 'S', 'V'], ['R', 'G', 'B'], ['HEX'], ['Lab', 'dE']];
          for (const group of groups) {
            const box = ctx.util.el('dl', 'rd-group', readPanel);
            for (const key of group) {
              const row = group[0] === 'Lab' ? ctx.util.el('div', 'rd-inline', box) : box;
              ctx.util.el('dt', '', row, key === 'dE' ? 'ΔE00 (vs Target):' : key + ':');
              rd[key] = ctx.util.el('dd', '', row);
              if (key === 'dE') rd[key].dataset.role = 'color-difference';
            }
          }
          return (model, rgb) => {
            rd.H.textContent = (model.h || 0).toFixed(1) + ' °';
            rd.S.textContent = ((model.s || 0) * 100).toFixed(1) + ' %';
            rd.V.textContent = ((model.v || 0) * 100).toFixed(1) + ' %';
            rd.R.textContent = String(Math.round(rgb[0]));
            rd.G.textContent = String(Math.round(rgb[1]));
            rd.B.textContent = String(Math.round(rgb[2]));
            rd.HEX.textContent = S.math.hex(rgb).toUpperCase();
            rd.Lab.textContent = S.math.srgbToLab(rgb).map((c) => c.toFixed(1).padStart(5)).join(' ');
            rd.dE.textContent = S.task.error(model, ctx.spec).toFixed(1);
          };
        },
      },
    },
  });
})();
