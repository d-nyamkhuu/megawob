// Larger black markers, fixed connect labels, and full-height board fitting preserve this site's canvas design.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-03',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  traits: { aspect: 800 / 450 },
  template: 'draw-shape/canvas',
  design: {
    sampleHeight: null,
    dotLayers: [
      { r: 12, fill: 'var(--panel)' },
      { r: 10.5, fill: '#050505', stroke: '#000', 'stroke-width': 1 },
    ],
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    connectDirection: [1, -0.55],
    connectOffset: 34,
    clearTarget: 'none',
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original sampled-height draw; this design fits the available stage.
        const H = Math.max(120, Math.floor(Math.min(size.height - 16, (size.width - 32) / (spec.board.w / spec.board.h))));
        const scale = H / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      },
    },
  },
});
