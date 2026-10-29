// Right-angle board design: use larger black points, a fixed dark minimum circle, and fixed A/B labels.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-11',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    clear: false,
    alwaysC: false,
    hollowA: 'always',
    hollowDot: { r: 8, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 3 },
    dotRadii: [8.5, 8],
    labelAt: null,
    style: { sw: 3 },
    minCircle: {
      fill: 'none',
      stroke: '#000',
      'stroke-width': 2,
      'stroke-dasharray': '5 5',
      opacity: 1,
    },
    parts: {
      raPoints: (base, S) => (util, g) => {
        const { a, b } = S.spec;
        const [ax, ay] = S.P.px(a);
        const [bx, by] = S.P.px(b);
        util.svg('circle', { cx: ax, cy: ay, r: 8, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 3 }, g);
        util.svg('circle', { cx: bx, cy: by, r: 8.5, fill: 'var(--panel)' }, g);
        util.svg('circle', { cx: bx, cy: by, r: 8, fill: 'var(--fg)' }, g);
      },
      raLabels: (base, S) => (util, g) => {
        const { a, b } = S.spec;
        S.P.label(util, g, a, -Math.PI / 2, 'A', 32);
        S.P.label(util, g, b, Math.PI / 4, 'B', 32);
      },
    },
  },
});
