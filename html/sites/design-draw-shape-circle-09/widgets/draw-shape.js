// Full-stage circle zoom with the original black guide ring and oversized markers.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-09',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    grid: null,
    sampleHeight: null,
    seededPlace: true,
    dotLayers: [{ r: 15, fill: 'var(--panel)' }, { r: 15, fill: 'var(--fg)' }],
    hollowAttrs: { r: 11, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 3.5 },
    circleAttrs: {
      fill: 'none', stroke: '#000', 'stroke-width': 3.5,
      'stroke-dasharray': '12 16', 'stroke-linecap': 'round',
    },
    parts: {
      circle: (base, S) => (b, g) => {
        base(b, g);
        if (b.ctx.spec.show === 'guide') {
          S.P.dot(b.ctx.util, g, b.px, [b.ctx.spec.c[0], b.ctx.spec.c[1] - b.ctx.spec.r], true);
        }
      },
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original height draw; this design fills the viewport.
        const H = Math.max(120, Math.floor(size.height - 4));
        const W = Math.max(120, Math.floor(size.width - 4));
        const scale = Math.min(H * 0.314, W * 0.314) / spec.r;
        return {
          H,
          W,
          scale,
          x: W / 2 - spec.c[0] * scale,
          y: H * 0.515 - spec.c[1] * scale,
        };
      },
    },
  },
});
