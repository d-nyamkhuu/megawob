// Bisect design: bold points and a notched arrow on the fitted plain board, with labels beside inset ray marks.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-09',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    style: { sw: 2.6, minDash: '8 8' },
    dot: { r: 8, fill: 'var(--fg)' },
    labelAt: {
      A: [0, 30],
      B: [Math.PI / 2, 30],
      V: [Math.PI / 2, 30],
    },
    rayMarks: { back: 45 },
    arrow: { back: 28, half: 7, notch: 20, fill: '#444', stroke: 'var(--fg)' },
    parts: {
      bisectPoints: (base, S) => (util, g) => {
        for (const p of [S.spec.v, ...S.spec.rays.map((ray) => S.P.rayMark(ray))]) {
          const [x, y] = S.P.px(p);
          util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 8, fill: 'var(--fg)' }, g);
        }
      },
    },
  },
});
