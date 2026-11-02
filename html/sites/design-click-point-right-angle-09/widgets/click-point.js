// Right-angle board design: keep the original endpoint, label, and guide presentation.
(function () {
  env.widget({
    task: 'click-point',
    site: 'design-click-point-right-angle-09',
    name: 'design',
    split: 'train',
    scenarios: ['right-angle'],
    template: 'click-point/board',
    design: {
      style: { point: 'dot', minDash: '2 5', guide: false, sw: 2.5 },
      alwaysLabels: false,
      alwaysC: false,
      labelAt: null,
      parts: {
        raPoints: (base, S) => (util, g) => {
          for (const p of [S.spec.a, S.spec.b]) {
            const [x, y] = S.P.px(p);
            const hollow = p === S.spec.a && !S.spec.labels;
            util.svg('circle', {
              cx: x,
              cy: y,
              r: 7,
              fill: hollow ? 'var(--panel)' : 'var(--fg)',
              stroke: 'var(--fg)',
              'stroke-width': hollow ? 2 : 0,
            }, g);
          }
        },
      },
    },
  });
})();
