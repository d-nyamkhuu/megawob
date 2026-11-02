// Fill the viewport with the circle board and keep its center/radius anchored to the sampled target.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-06',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    sampleHeight: null,
    clearTarget: 'widget',
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original sampled-height draw; circle sizing ignores its value.
        const H = Math.floor(size.height - 2);
        const W = Math.floor(size.width - 2);
        const scale = H * 0.386 / spec.r;
        return {
          H,
          W,
          scale,
          x: W / 2 - spec.c[0] * scale,
          y: H / 2 - spec.c[1] * scale,
        };
      },
    },
  },
});
