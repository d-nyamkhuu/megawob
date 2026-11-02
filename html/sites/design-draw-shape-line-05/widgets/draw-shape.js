// Full-height canvas with the original dark marker and upward connect labels.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-05',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  traits: { aspect: 924 / 730 },
  template: 'draw-shape/canvas',
  design: {
    sampleHeight: null,
    seededPlace: true,
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 6.5, fill: 'var(--fg)' }],
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    connectDirection: [0, -1],
    connectOffset: 40,
    clearTarget: 'widget',
    parts: {
      fit: (base) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original draw; the board uses the available viewport.
        const fit = Math.min(size.height - 4, (size.width - 4) / (spec.board.w / spec.board.h));
        const H = Math.max(120, Math.floor(fit));
        const scale = H / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      },
    },
  },
});
