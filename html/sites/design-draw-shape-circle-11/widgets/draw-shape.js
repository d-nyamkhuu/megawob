// Fill the viewport with the circle board while preserving its sampled sizing draw and widget Clear method.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-11',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    clearTarget: 'widget',
    dotLayers: [{ r: 12, fill: 'var(--panel)' }, { r: 10, fill: 'var(--fg)' }],
    hollowAttrs: { r: 9, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 },
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // Preserve the original sampled-height draw; circle sizing ignores its value.
        const H = Math.max(120, Math.floor(Math.min(size.height - 2, (size.width - 2) / (spec.board.w / spec.board.h))));
        const scale = H / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      },
    },
  },
});
