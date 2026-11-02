// Inspector design: panel-sized tracks, five labels, and a fixed card origin.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-multi-04',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'set-slider/classic',
  design: {
    horizontal: false,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const { spec } = ctx;
        const inspector = ctx.stage.closest('.inspector');
        inspector.classList.toggle('multi-dense', spec.sliders.length > 2);
        inspector.classList.toggle('multi-vertical', spec.vertical);
        ctx.stage.style.setProperty('--slider-count', spec.sliders.length);
      },
      look: (base) => (ctx) => {
        const look = base(ctx);
        const em = parseFloat(getComputedStyle(document.body).fontSize) || 18;
        Object.assign(look, { thumb: em * 1.45, rail: em * 0.62, ticks: true, readout: true, native: false });
        return look;
      },
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const em = parseFloat(getComputedStyle(document.body).fontSize) || 18;
        const bounds = ctx.stage.getBoundingClientRect();
        g.length = layout.vertical
          ? Math.max(70, Math.floor(bounds.height - em * 7))
          : Math.max(110, Math.floor((layout.size.width || 392) - em * 6.3));
        g.cross = em * 2.12;
        g.tickCount = 5;
      },
      placed: (base) => (ctx, layout, controllers) => {
        base(ctx, layout, controllers);
        layout.card.style.left = '0px';
        layout.card.style.top = '0px';
      },
    },
  },
});
