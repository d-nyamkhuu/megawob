// Preserve this site's full-stage canvas fit and its larger black target marker.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-06',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 11, fill: 'var(--panel)' }, { r: 9, fill: 'var(--fg)' }],
    labelOffset: 32,
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const step = document.querySelector('.gp-steps li:nth-child(2)');
        if (step && ctx.spec.mode === 'connect') step.textContent = 'Draw one straight line from dot A to dot B.';
      },
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // The original draws this value but does not use it.
        const H = Math.max(120, Math.floor(size.height - 2));
        const W = Math.max(180, Math.floor(size.width - 2));
        const scale = Math.min(H / spec.board.h, W / spec.board.w);
        return {
          H,
          W,
          scale,
          x: (W - spec.board.w * scale) / 2,
          y: (H - spec.board.h * scale) / 2,
        };
      },
      place: (base, S) => (el, ctx, rng) => {
        base(el, ctx, rng); // Keep the original seeded placement draws before its final recentering.
        el.style.left = `${Math.max(0, Math.round((ctx.size.width - S.geo.W) / 2))}px`;
        el.style.top = '0px';
      },
    },
  },
});
