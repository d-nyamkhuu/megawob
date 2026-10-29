// Right-angle board design: keep the original fixed endpoint labels and filled unlabeled A point.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-07',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    alwaysC: false,
    labelAt: { A: [Math.PI * 0.68, 32], B: [Math.PI * 0.32, 32] },
    hollowDot: { r: 8, fill: 'var(--fg)' },
  },
});
