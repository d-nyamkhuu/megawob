// Riscos grid design: centered square-unit axes, an origin marker, and Clear All.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-09',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    resetLabel: 'Clear All',
    parts: {
      gridGeometry: (base, S) => (ctx) => {
        const s = S.spec,
          { W, H } = S.P.gridSize(ctx),
          pad = 38,
          unit = Math.min((W - 2 * pad) / (2 * s.xr), (H - 2 * pad) / (2 * s.yr));
        return {
          W,
          H,
          pad,
          X: (x) => W / 2 + x * unit,
          Y: (y) => H / 2 - y * unit,
        };
      },
      gridLabel: (base, S) => (ctx, svg, { X, Y }, value, axis) => {
        if (axis === 'x' && value === 0) {
          const t = ctx.util.svg('text', { x: X(value) + 9, y: Y(0) + 29 }, svg);
          t.textContent = '';
          return;
        }
        base(ctx, svg, { X, Y }, value, axis);
      },
      rendered: (base, S) => (ctx) => {
        const { X, Y } = S.P.gridGeometry(ctx),
          u = ctx.util,
          svg = S.scene;
        u.svg('circle', { cx: X(0), cy: Y(0), r: 7, class: 'origin-mark' }, svg.querySelector('svg'));
        const originLabel = u.svg(
          'text',
          { x: X(0) + 12, y: Y(0) + 31, class: 'origin-label' },
          svg.querySelector('svg'),
        );
        originLabel.textContent = '(0,0)';
      },
    },
  },
});
