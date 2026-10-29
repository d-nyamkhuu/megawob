// OS/2 vertical faders use fixed geometry, a full-stage notebook, and labeled multiple faders.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-09',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    parts: {
      afterReadout: (base) => (ctx, w) => {
        base(ctx, w);
        if (w.g.vertical && w.readout) ctx.util.el('div', 'slc-current-caption', w.root, 'Current value:');
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) Object.assign(g, {
          thumb: layout.look.thumb,
          length: Math.round(layout.size.height * 0.73),
          thumbBox: [layout.size.width * 0.064, layout.size.height * 0.06],
          ticks: true,
          tickCount: 10,
          readout: true,
        });
      },
      placed: (base) => (ctx, layout) => {
        base(ctx, layout);
        if (!layout.vertical) return;
        const { card, group, n } = layout;
        card.style.left = '0px';
        card.style.top = '0px';
        card.style.width = '100%';
        card.style.height = '100%';
        const legend = document.querySelector('.opacity .legend');
        if (legend && ctx.spec.sliders.length === 1) legend.textContent = ctx.spec.sliders[0].label;
        if (n > 1) {
          ctx.stage.parentElement.classList.add('multiple-faders');
          group.classList.add('multiple-faders');
          [...group.children].forEach((strip, i) => {
            strip.style.left = ((i + 0.12) * 100) / n + '%';
            strip.style.width = 92 / n + '%';
          });
        }
      },
    },
  },
});
