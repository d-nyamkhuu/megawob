// Keeps the full-stage board and centered board coordinates, with the original marker and Clear logging.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-07',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    grid: null,
    sampleHeight: [400, 600],
    seededPlace: false,
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 9.5, fill: 'var(--fg)' }],
    clearLog: true,
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // The original samples this height, although the full-stage SVG does not use it.
        const W = Math.floor(size.width);
        const H = Math.floor(size.height);
        const scale = Math.min(W / spec.board.w, H / spec.board.h);
        return {
          W,
          H,
          scale,
          x: (W - spec.board.w * scale) / 2,
          y: (H - spec.board.h * scale) / 2,
        };
      },
    },
  },
});
