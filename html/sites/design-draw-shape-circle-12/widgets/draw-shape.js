// A zoomed circle at an offset on a full-stage board, with both guide and rim markers.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-12',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  traits: { guide: 'both' },
  template: 'draw-shape/canvas',
  design: {
    circleBoth: true, rimOnGuide: 'spec',
    parts: {
      fit: (base) => (ctx) => {
        base(ctx); // Keep the scaffold's sampled height draw in order.
        const { size, spec } = ctx;
        const H = Math.floor(size.height);
        const scale = Math.min(H * .345 / spec.r, size.width * .30 / spec.r);
        const W = Math.floor(size.width);
        return { H, W, scale, x: W * .595 - spec.c[0] * scale, y: H * .482 - spec.c[1] * scale };
      },
    },
  },
});
