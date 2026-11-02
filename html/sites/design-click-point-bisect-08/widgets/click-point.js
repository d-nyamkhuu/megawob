// Bisect board design: use the shared fitted camera and plain labeled angle presentation.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-08',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    parts: {
      arrowHead: (base, S) => (util, g, end, ray) => {
        const tip = S.P.px(end);
        const arrowSize = Math.max(14, Math.min(24, Number(S.svg.getAttribute('width')) * 0.02));
        const back = [tip[0] - Math.cos(ray.angle) * arrowSize, tip[1] - Math.sin(ray.angle) * arrowSize];
        const n = ray.angle + Math.PI / 2;
        const h1 = [back[0] + Math.cos(n) * arrowSize / 2, back[1] + Math.sin(n) * arrowSize / 2];
        const h2 = [back[0] - Math.cos(n) * arrowSize / 2, back[1] - Math.sin(n) * arrowSize / 2];
        util.svg('polygon', {
          points: [tip, h1, h2].map((p) => p.map(S.f1).join(',')).join(' '),
          fill: 'var(--fg)',
        }, g);
      },
    },
  },
});
