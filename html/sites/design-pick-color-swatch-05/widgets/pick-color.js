// Restores this site's custom picker sizing, axis labels, and current-color preview swatch.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-05',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      targetUpper: false,
      currentLabel: 'Current',
      parts: {
        panel: (base) => (ctx, card, label) =>
          base(ctx, card, label === ctx.spec.targetLabel ? 'Target' : label),
        fit: (base, S) => (ctx, card) => {
          const bounds = card.getBoundingClientRect();
          const W = Math.max(S.task.helpers.MIN_TRACK_PX,
            Math.floor(Math.min(bounds.width * 0.612, bounds.height / 0.978)));
          const H = Math.round(W * 0.978);
          return {
            W,
            H,
            hueH: H,
            radius: 0,
            hueW: Math.round(bounds.width * 0.101),
            knob: Math.max(18, Math.round(W * 0.055)),
            bounds,
          };
        },
        axes: (base) => (ctx, card, g) => {
          const { util } = ctx;
          const { W, H } = g;
          const axis = util.el('div', 'sv-axis', card);
          Object.assign(axis.style, { top: '0px', height: Math.round(H - 3) + 'px', bottom: 'auto' });
          util.el('div', 'axis-label', axis, 'Lighter');
          util.el('div', 'axis-arrow up down', axis);
          util.el('div', 'axis-label', axis, 'Darker');
          const title = util.el('div', 'sv-title', card, 'Saturation (→) / Value (↑)');
          Object.assign(title.style, { top: '-4.8cqh' });
          const saturation = util.el('div', 'saturation-axis', card);
          Object.assign(saturation.style, { top: Math.round(H + 14) + 'px', bottom: 'auto', width: W + 'px' });
          util.el('span', '', saturation, 'Less Saturated');
          util.el('span', '', saturation, 'More Saturated →');
          const hueLabel = util.el('div', 'hue-label', card, 'Hue');
          Object.assign(hueLabel.style, { top: '-4.8cqh', bottom: 'auto' });
        },
        instrumentExtra: (base, S) => (ctx, card, target, current, host) => {
          const ccBox = ctx.util.el('div', 'cc-box', host.parentElement);
          ctx.util.el('div', 'cc-label', ccBox, 'Current Color');
          const ccSwatch = ctx.util.el('div', 'cc-swatch', ccBox);
          ctx.util.el('div', 'cc-empty', ccBox);
          return (model, rgb) => {
            ccSwatch.style.background = S.math.hex(rgb);
          };
        },
      },
    },
  });
})();
