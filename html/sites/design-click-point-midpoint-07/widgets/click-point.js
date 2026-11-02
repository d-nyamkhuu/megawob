// Midpoint design with a gray segment, orange endpoints and labels directly above each point.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-07',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  template: 'click-point/board',
  design: {
    parts: {
      midSegment: (base, S) => (util, g) => {
        S.P.line(util, g, S.spec.a, S.spec.b, { stroke: '#666', 'stroke-width': 2 });
      },
      midPoints: (base, S) => (util, g) => {
        for (const p of [S.spec.a, S.spec.b]) {
          const [x, y] = S.P.px(p);
          util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 12, fill: '#ff7a29' }, g);
        }
      },
      midLabels: (base, S) => (util, g) => {
        for (const [p, t] of [[S.spec.a, 'A'], [S.spec.b, 'B']]) {
          const [x, y] = S.P.px(p);
          const W = S.spec.board.w * S.scale;
          const tx = util.svg('text', {
            x: S.f1(Math.min(W - 14, Math.max(14, x))),
            y: S.f1(Math.max(14, y - 32)),
            class: 'cp-label',
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
          }, g);
          tx.textContent = t;
        }
      },
    },
  },
});
