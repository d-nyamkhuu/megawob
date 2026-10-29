// Keep the horizontal orientation and the midpoint site's plain-grid and no-Clear behavior.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-05',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  traits: { orient: 'horizontal' },
  template: 'click-point/board',
  design: {
    gridPlain: false,
    clear: false,
    alwaysLabels: false,
    pairedLabels: false,
    labelAt: { A: [-Math.PI / 2, 28], B: [-Math.PI / 2, 28] },
    dot: { r: 9, fill: '#e8141c', stroke: '#8a0a10', 'stroke-width': 1.5 },
    guideLine: { stroke: '#111', 'stroke-width': 2 },
  },
});
