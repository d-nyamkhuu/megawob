// Design of this site on click-control/controls: use its target-time meter and update the movement note.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-07',
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
        const lbl = util.el('span', 'lbl', meter);
        util.el('span', '', lbl, 'Time over target:  ');
        const txt = util.el('span', 'dwell-value', lbl);
        const barEl = util.el('span', 'bar', meter);
        const barFill = util.el('i', '', barEl);
        return (m) => {
          txt.innerHTML = `<strong>${(Math.min(m.got, spec.need) / 1000).toFixed(1)} / ${(spec.need / 1000).toFixed(1)}</strong> seconds`;
          barFill.style.width = Math.min(1, m.got / spec.need) * 100 + '%';
        };
      },
      rendered: (base) => (ctx, page, content) => {
        const movementNote = document.querySelector('.group > .desc');
        if (movementNote) movementNote.textContent = `The ${ctx.spec.color} square moves around within the area below.`;
        base(ctx, page, content);
      },
    },
  },
});
