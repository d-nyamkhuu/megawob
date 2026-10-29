// Keeps the viewport-sized, rotated board and scaled circle markers of this design.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-03',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    sampleHeight: [400, 600],
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec, rng } = ctx;
        rng.int(400, 600);
        const W = size.width;
        const H = size.height;
        const center = [W / 2, ctx.stage.parentElement.clientHeight * 0.56 - ctx.stage.offsetTop];
        const scale = Math.min(size.width * 0.11665, center[1] - 16, H - center[1] - 16) / spec.r;
        const angle = spec.show !== 'guide'
          ? -Math.PI / 2 - Math.atan2(spec.rim[1] - spec.c[1], spec.rim[0] - spec.c[0])
          : 0;
        S.geo = { W, H, scale, center, angle, cos: Math.cos(angle), sin: Math.sin(angle) };
        return S.geo;
      },
      px: (base, S) => (p) => {
        const { center, scale, cos, sin } = S.geo;
        const { c } = S.spec;
        return [
          center[0] + ((p[0] - c[0]) * cos - (p[1] - c[1]) * sin) * scale,
          center[1] + ((p[0] - c[0]) * sin + (p[1] - c[1]) * cos) * scale,
        ];
      },
      toBoard: (base, S) => ([x, y]) => {
        const r = S.svg.getBoundingClientRect();
        const { center, scale, cos, sin } = S.geo;
        const { c } = S.spec;
        const dx = (x - r.left - center[0]) / scale;
        const dy = (y - r.top - center[1]) / scale;
        return [c[0] + dx * cos + dy * sin, c[1] - dx * sin + dy * cos];
      },
      fromBoard: (base, S) => ([bx, by]) => {
        const r = S.svg.getBoundingClientRect();
        const p = S.P.px([bx, by]);
        return [r.left + p[0], r.top + p[1]];
      },
      circle: () => (b, g) => {
        const { util, spec } = b.ctx;
        const [x, y] = b.px(spec.c);
        const unit = b.W / 1672;
        util.svg('circle', {
          cx: x, cy: y, r: spec.r * b.scale, fill: 'none', stroke: '#7c7e83',
          'stroke-width': 4.5 * unit, 'stroke-dasharray': `${16 * unit} ${15 * unit}`,
          'stroke-linecap': 'round',
        }, g);
        util.svg('circle', { cx: x, cy: y, r: 23 * unit, fill: 'var(--fg)' }, g);
        const rim = spec.show === 'guide' ? [x, y - spec.r * b.scale] : b.px(spec.rim);
        util.svg('circle', {
          cx: rim[0], cy: rim[1], r: 14 * unit, fill: 'var(--panel)', stroke: 'var(--fg)',
          'stroke-width': 5 * unit,
        }, g);
      },
    },
  },
});
