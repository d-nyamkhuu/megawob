// Design of this site on click-control/controls: the hover board fills the content width and its meter uses hundredths.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-08',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      hoverSize: (base) => (r, content) => ({
        ...base(r, content),
        W: Math.max(200, r.width),
      }),
      hoverMeter: () => (ctx, b) => {
        const { util } = ctx;
        const meter = util.el('div', 'uc-meter', b);
        util.el('span', '', meter, 'Time over square:');
        const txt = util.el('span', 'dwell-value', meter);
        return (m) => {
          txt.innerHTML = `<strong>${(m.got / 1000).toFixed(2)}</strong> seconds`;
        };
      },
    },
  },
});
