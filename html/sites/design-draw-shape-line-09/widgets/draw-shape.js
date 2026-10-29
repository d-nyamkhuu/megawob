// Keeps this site's full-stage board sizing, centered placement, and larger target marker.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-09',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  traits: { aspect: 875 / 502 },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 9, fill: 'var(--fg)' }],
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    connectDirection: [0, -1],
    connectOffset: 27,
    ink: 'var(--fg)',
    clearPreserve: true,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const tip = document.querySelector('.mac-tipbody li:nth-child(2)');
        if (tip) tip.textContent = ctx.spec.mode === 'connect'
          ? 'Draw a single straight line from one dot to the other.'
          : 'Draw a single straight line through the dot.';
      },
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600); // The original draws this value but does not use it to size the board.
        const H = Math.max(120, Math.floor(Math.min(
          size.height - 2,
          (size.width - 2) / (spec.board.w / spec.board.h),
        )));
        const scale = H / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.wrap.style.left = `${Math.round((ctx.size.width - S.geo.W) / 2)}px`;
        S.wrap.style.top = `${Math.round((ctx.size.height - S.geo.H) / 2)}px`;
      },
    },
  },
});
