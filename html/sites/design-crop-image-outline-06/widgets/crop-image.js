// This design fills the live stage, uses percentage crop geometry, and puts its size readout in the footer.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-06',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { startBox: { x: 0.214, y: 0.211, w: 0.295, h: 0.504 } },
  template: 'crop-image/box',
  design: {
    readoutParent: '.footer',
    parts: {
      fit: (base, S) => (ctx, tools) => {
        const stageRect = ctx.stage.getBoundingClientRect();
        const availW = Math.floor(Math.min(ctx.size.width, stageRect.width) - 20);
        const availH = Math.floor(Math.min(ctx.size.height, stageRect.height) - 20 - (tools ? 40 : 0));
        return { W: availW, H: availH };
      },
      place: (base, S) => (el, r, grow = 0) => {
        Object.assign(el.style, {
          left: `calc(${r.l * 100}% - ${grow}px)`,
          top: `calc(${r.t * 100}% - ${grow}px)`,
          width: `calc(${(r.r - r.l) * 100}% + ${2 * grow}px)`,
          height: `calc(${(r.b - r.t) * 100}% + ${2 * grow}px)`,
        });
      },
      placed: (base, S) => (ctx, el, m) => {
        base(ctx, el, m);
        const bounds = S.frame.getBoundingClientRect();
        S.W = bounds.width;
        S.H = bounds.height;
      },
      readoutText: (base, S) => (ctx, m) => {
        const px = (v, size) => Math.round(v * size);
        return `Crop size: ${px(m.r - m.l, S.W)} × ${px(m.b - m.t, S.H)} px`;
      },
    },
  },
});
