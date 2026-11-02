// Adds the dwell progress track used by this hover design.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-05',
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
        const track = util.el('div', 'dwell-track', b);
        const fill = util.el('div', 'dwell-fill', track);
        return (m) => {
          fill.style.width = (100 * Math.min(m.got, spec.need) / spec.need) + '%';
          txt.innerHTML = `<strong>${(Math.min(m.got, spec.need) / 1000).toFixed(1)} / ${(spec.need / 1000).toFixed(1)}</strong> seconds`;
        };
      },
    },
  },
});
