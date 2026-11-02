// Right-angle board design: fixed dark endpoints and labels, with the original dashed radius and leg weight.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-06',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    gridPlain: false,
    style: { sw: 2.5 },
    clear: false,
    alwaysC: false,
    labelAt: { A: [Math.PI / 2, 30], B: [Math.PI / 2, 30] },
    dot: { r: 8.5, fill: 'var(--fg)' },
    minCircle: { 'stroke-width': 2.5, 'stroke-dasharray': '4 6' },
  },
});
