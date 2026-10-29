// Restores this site's full-height board, classic markers, and endpoint label placement.
(function () {
  const HALO = { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' };

  env.widget({
    task: 'draw-shape',
    site: 'design-draw-shape-line-12',
    name: 'design',
    split: 'train',
    scenarios: ['line'],
    template: 'draw-shape/canvas',
    design: {
      reserveH: 12,
      capHeight: false,
      dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 6.5, fill: 'var(--fg)' }],
      haloAttrs: HALO,
      parts: {
        begin: (base) => (ctx) => {
          if (ctx.spec.mode === 'connect') return base(ctx);
          const steps = document.querySelectorAll('.portal .ins li');
          if (steps[0]) steps[0].textContent = 'Click and hold to begin your line.';
          if (steps[1]) steps[1].textContent = 'Draw one continuous straight line as directed.';
        },
        label: () => (util, g, px, W, H, p, d, text, cls = 'dw-label', off = 20) => {
          const [x, y] = px(p);
          const lx = Math.min(W - 16, Math.max(16, x + (cls === 'dw-label' ? d[0] * 16 : d[0] * off)));
          const ly = Math.min(H - 10, Math.max(18, y + (cls === 'dw-label' ? -30 : d[1] * off)));
          return util.svg('text', { x: lx, y: ly, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g).textContent = text;
        },
      },
    },
  });
})();
