// Design of this site on click-control/controls: a compact board, rounded targets, and a progress meter.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-02',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    rx: 4,
    parts: {
      hoverSize: () => (r) => ({
        W: Math.max(200, r.width - 20),
        H: Math.max(120, r.height - 106),
      }),
      hoverMeter: () => (ctx, b) => {
        const { spec, util } = ctx;
        const meter = util.el('div', 'uc-meter', b);
        util.el('span', '', meter, 'Time on target:');
        const bar = util.el('div', 'dwell-progress', meter);
        const fill = util.el('i', '', bar);
        const txt = util.el('strong', '', meter);
        util.el('span', 'dwell-total', meter, `/ ${(spec.need / 1000).toFixed(2)} seconds`);
        return (m) => {
          fill.style.width = (100 * Math.min(m.got, spec.need)) / spec.need + '%';
          txt.textContent = (Math.min(m.got, spec.need) / 1000).toFixed(2);
        };
      },
      rendered: () => (ctx) => {
        const noteText = document.querySelector('.instruction > span:not(.note-copy)');
        if (noteText) {
          const parts = noteText.textContent.split(/((?:blue|red|green) square|square is (?:blue|red|green)|\d+(?:\.\d+)? seconds?|\(it moves\))/gi);
          noteText.textContent = '';
          parts.forEach((part, index) => {
            if (index % 2) ctx.util.el('u', '', noteText, part);
            else noteText.append(part);
          });
        }
      },
    },
  },
});
