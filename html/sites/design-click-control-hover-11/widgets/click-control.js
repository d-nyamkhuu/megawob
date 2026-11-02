// Adds the dwell progress bar, sample pointer, and task notes to the hover meter.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-11',
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
        const bar = util.el('div', 'bar', meter);
        const fill = util.el('i', '', bar);
        const notes = b.parentElement.closest('.wbody')?.querySelectorAll('.notes li');
        if (notes) {
          notes[0].textContent = `The ${spec.color} square will move to different positions within the area.`;
          notes[1].textContent = `Keep the mouse over it (continuous or in multiple visits) until the total reaches ${(spec.need / 1000).toFixed(1)} seconds.`;
        }
        const pointer = util.svg('svg', { viewBox: '0 0 24 36', class: 'sample-pointer', 'aria-hidden': 'true' }, b);
        util.svg('path', { d: 'M2 2v27l7-7 6 12 5-3-6-11h10Z', fill: '#111', stroke: '#fff', 'stroke-width': 2 }, pointer);
        return (m) => {
          fill.style.width = Math.min(100, (m.got / spec.need) * 100) + '%';
          txt.innerHTML = `<strong>${(Math.min(m.got, spec.need) / 1000).toFixed(1)} / ${(spec.need / 1000).toFixed(1)}</strong> seconds`;
        };
      },
    },
  },
});
