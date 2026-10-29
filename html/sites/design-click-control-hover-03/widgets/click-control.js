// Design of this site on the click-control/controls template (templates/click-control/controls.js): the time meter follows the
// highlighted square, and a note under the stage names its color.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-03',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      hoverMeter: () => (ctx, b) => {
        const { spec, util } = ctx;
        const meter = util.el('div', 'uc-meter', b);
        util.el('span', '', meter, 'Time over square:');
        const txt = util.el('span', 'dwell-value', meter);
        return (m, rects) => {
          const active = rects[m.hl];
          if (active) {
            const q = active.getBoundingClientRect(),
              p = b.getBoundingClientRect();
            meter.style.left = q.left - p.left + q.width / 2 + 'px';
            meter.style.top = Math.min(p.height - 28, q.bottom - p.top + 40) + 'px';
          }
          txt.innerHTML = `<strong>${(Math.min(m.got, spec.need) / 1000).toFixed(1)} / ${(spec.need / 1000).toFixed(1)}</strong> seconds`;
        };
      },
      rendered: () => (ctx) => {
        ctx.stage.dataset.hoverColor = ctx.spec.color;
        ctx.util.el('span', 'area-note', ctx.stage, 'The ' + ctx.spec.color + ' square moves within this area.');
      },
    },
  },
});
