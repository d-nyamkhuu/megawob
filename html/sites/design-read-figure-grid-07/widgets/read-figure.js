// Uses the narrower grid and four inward-pointing axis arrowheads from this design.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-07',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    arrowEnds: 'all',
    parts: {
      reset: (base, S) => (ctx) => {
        // The reset lives in the frame, which remains when the stage is re-rendered.
        document.querySelectorAll('.reference-reset').forEach((button) => button.remove());
        base(ctx);
      },
      gridSize: (base, S) => (ctx) => ({
        W: Math.max(260, Math.floor(ctx.size.width * 0.56)),
        H: Math.max(120, ctx.size.height - 55),
      }),
      gridArrows: (base, S) => (ctx, svg, { W, H, pad, X, Y }) => {
        const u = ctx.util;
        u.svg(
          'path',
          {
            d: `M${pad / 2 + 15} ${Y(0) - 8} L${pad / 2} ${Y(0)} L${pad / 2 + 15} ${Y(0) + 8}z M${W - pad / 2 - 15} ${Y(0) - 8} L${W - pad / 2} ${Y(0)} L${W - pad / 2 - 15} ${Y(0) + 8}z M${X(0) - 8} ${pad / 2 + 15} L${X(0)} ${pad / 2} L${X(0) + 8} ${pad / 2 + 15}z M${X(0) - 8} ${H - pad / 2 - 15} L${X(0)} ${H - pad / 2} L${X(0) + 8} ${H - pad / 2 - 15}z`,
            fill: '#143756',
          },
          svg,
        );
        const xlabel = u.svg('text', { x: W - 18, y: Y(0) - 18 }, svg);
        xlabel.textContent = 'x';
        const ylabel = u.svg('text', { x: X(0) + 16, y: 22 }, svg);
        ylabel.textContent = 'y';
      },
    },
  },
});
