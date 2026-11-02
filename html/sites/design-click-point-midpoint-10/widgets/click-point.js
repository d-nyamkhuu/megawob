// This design keeps plain grids empty and draws a pale segment with larger endpoints and labels below them.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-10',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  template: 'click-point/board',
  design: {
    gridPlain: false,
    parts: {
      midSegment: (base, S) => (util, g) => {
        const defs = util.svg('defs', {}, g);
        const blue = util.svg('linearGradient', { id: 'endpoint-blue', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        util.svg('stop', { offset: '0%', 'stop-color': '#71b5fa' }, blue);
        util.svg('stop', { offset: '100%', 'stop-color': '#4999ef' }, blue);
        S.P.line(util, g, S.spec.a, S.spec.b, { stroke: '#e8eaee', 'stroke-width': 2 });
      },
      midPoints: (base, S) => (util, g) => {
        for (const p of [S.spec.a, S.spec.b]) {
          const [x, y] = S.P.px(p);
          util.svg('circle', { cx: x, cy: y, r: 11 }, g);
        }
      },
      midLabels: (base, S) => (util, g) => {
        S.P.label(util, g, S.spec.a, Math.PI / 2, 'A', 32);
        S.P.label(util, g, S.spec.b, Math.PI / 2, 'B', 32);
      },
    },
  },
});
