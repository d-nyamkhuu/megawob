// Vertical instrument design with the original lane sizing, geometry, and minor ticks.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-vertical-04',
  name: 'design',
  split: 'train',
  scenarios: ['vertical'],
  template: 'set-slider/classic',
  design: {
    thumb: 18,
    rail: 8,
    ticks: true,
    readout: true,
    native: false,
    parts: {
      size: (base) => (ctx) => {
        const size = { ...base(ctx) };
        if (ctx.spec.vertical && ctx.spec.sliders.length > 1) {
          const workspace = ctx.stage.parentElement;
          workspace.classList.add('dw-multiple-sliders');
          workspace.style.gridTemplateColumns = `minmax(0,1fr) ${Math.ceil(size.width * ctx.spec.sliders.length)}px 14.85%`;
          size.width = ctx.stage.clientWidth;
        }
        return size;
      },
      group: (base) => (ctx, layout) => {
        const group = base(ctx, layout);
        if (layout.vertical && layout.n > 1) group.classList.add('slc-multiple');
        return group;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        if (layout.vertical) {
          g.length = Math.floor(layout.size.height * 0.654);
          g.thumbBox = [Math.round((layout.size.width / layout.n) * 0.2), Math.round(layout.size.height * 0.05)];
          g.tickCount = 4;
        }
      },
      minorTicks: (base, S) => (ctx, w, ticks) => {
        if (!w.g.vertical) return base(ctx, w, ticks);
        for (let k = 1; k < 12; k++) {
          if (k % 3 === 0) continue;
          const mark = ctx.util.el('div', 'slc-minor', ticks);
          mark.style.top = (k / 12) * w.L + 'px';
        }
      },
    },
  },
});
