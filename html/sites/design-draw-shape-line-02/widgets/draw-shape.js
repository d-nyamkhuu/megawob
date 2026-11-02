// Full-stage canvas, top-left placement, and larger target marks define this line design.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-02',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  traits: { aspect: 2.2 },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 10, fill: 'var(--panel)' }, { r: 8, fill: 'var(--fg)' }],
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    connectDirection: [0, -1],
    connectOffset: 28,
    parts: {
      fit: () => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original sampled draw; the board fills the viewport.
        const H = Math.floor(size.height - 3);
        const W = Math.floor(size.width - 3);
        const scale = Math.min(H / spec.board.h, W / spec.board.w);
        return {
          H,
          W,
          scale,
          x: (W - spec.board.w * scale) / 2,
          y: (H - spec.board.h * scale) / 2,
        };
      },
      place: (base) => (wrap, ctx, rng) => {
        base(wrap, ctx, rng);
        wrap.style.left = '0px';
        wrap.style.top = '0px';
      },
    },
  },
});
