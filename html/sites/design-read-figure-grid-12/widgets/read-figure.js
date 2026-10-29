env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-12',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    recoveryParent: '.status-bar',
    resetParent: '.tool-panel',
    parts: {
      gridGeometry: (base, S) => (ctx) => {
        const s = ctx.spec;
        const W = ctx.size.width - 20,
          H = Math.max(120, ctx.size.height - 40),
          plotY = H - 12,
          plotX = Math.min(W - 76, plotY * 1.12),
          ox = (W - plotX) / 2,
          oy = (H - plotY) / 2,
          stepX = plotX / (2 * s.xr),
          stepY = plotY / (2 * s.yr),
          X = (x) => ox + plotX / 2 + x * stepX,
          Y = (y) => oy + plotY / 2 - y * stepY;
        return { W, H, pad: 38, plotX, plotY, ox, oy, stepX, stepY, X, Y };
      },
      gridLine: (base, S) => (ctx, svg, geo, v, axis) => {
        const { X, Y, ox, oy, plotX, plotY } = geo;
        ctx.util.svg(
          'line',
          axis === 'x'
            ? { x1: X(v), x2: X(v), y1: oy, y2: oy + plotY, class: v === 0 ? 'axis' : 'gridline' }
            : { x1: ox, x2: ox + plotX, y1: Y(v), y2: Y(v), class: v === 0 ? 'axis' : 'gridline' },
          svg,
        );
      },
      gridRadius:
        () =>
        (ctx, { stepX, stepY }) =>
          Math.min(stepX, stepY) * 0.38,
      resetModel: (base) => (first) => base({ ...first, answer: null, clicks: [] }),
      gridArrows: (base, S) => (ctx, svg, geo) => {
        const u = ctx.util,
          { X, Y, ox, oy, plotX, plotY } = geo;
        u.svg(
          'path',
          {
            d: `M${ox + plotX - 9} ${Y(0) - 6} L${ox + plotX} ${Y(0)} L${ox + plotX - 9} ${Y(0) + 6}z M${ox + 9} ${Y(0) - 6} L${ox} ${Y(0)} L${ox + 9} ${Y(0) + 6}z M${X(0) - 6} ${oy + 9} L${X(0)} ${oy} L${X(0) + 6} ${oy + 9}z M${X(0) - 6} ${oy + plotY - 9} L${X(0)} ${oy + plotY} L${X(0) + 6} ${oy + plotY - 9}z`,
            fill: '#23384c',
          },
          svg,
        );
        const xlabel = u.svg('text', { x: ox + plotX + 8, y: Y(0) - 13 }, svg);
        xlabel.textContent = 'x';
        const ylabel = u.svg('text', { x: X(0) + 12, y: oy + 2 }, svg);
        ylabel.textContent = 'y';
      },
    },
  },
});
