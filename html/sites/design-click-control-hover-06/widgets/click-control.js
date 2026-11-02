// Design of this site on click-control/controls: add the scene cursor, hover instructions, and its compact time meter.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-06',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const { page, content, h1 } = base(ctx);
        const pointer = ctx.util.el('div', 'scene-pointer', page);
        pointer.setAttribute('aria-hidden', 'true');
        pointer.innerHTML =
          '<svg viewBox="0 0 32 44" width="100%" height="100%"><path d="M3 2 27 23 16 25 24 39 18 42 11 28 5 35Z" fill="white" stroke="#080b0e" stroke-width="2.4"/></svg>';
        page.addEventListener('pointermove', () => {
          pointer.hidden = true;
        }, { once: true });
        return { page, content, h1 };
      },
      hoverAfter: () => (ctx) => {
        const { spec } = ctx;
        const notes = document.querySelectorAll('.notes li');
        if (notes.length) {
          notes[0].textContent = `The ${spec.color} square moves to different positions within the area.`;
          notes[2].textContent = `Keep going until the total reaches ${(spec.need / 1000).toFixed(1)} seconds.`;
        }
      },
      hoverMeter: (base) => (ctx, b, W, H) => {
        const update = base(ctx, b, W, H);
        const txt = b.querySelector('.dwell-value');
        return (m, rects) => {
          update(m, rects);
          txt.innerHTML = `<strong>${(Math.min(m.got, ctx.spec.need) / 1000).toFixed(1)} / ${(ctx.spec.need / 1000).toFixed(1)} seconds</strong>`;
        };
      },
    },
  },
});
