// Right-angle board design: fixed-width leg and labels, solid endpoint markers, and no extension guide.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-10',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    style: { sw: 2.5 },
    alwaysC: false,
    hollowA: 'always',
    dot: { r: 10, fill: 'var(--fg)' },
    hollowDot: { r: 5, fill: 'var(--fg)' },
    minCircle: { fill: 'none', 'stroke-width': 2.3, 'stroke-dasharray': '6 7' },
    labelAt: { A: [Math.PI / 2, 24], B: [Math.PI / 3, 24] },
    parts: {
      raExtension: () => () => {},
    },
  },
});
