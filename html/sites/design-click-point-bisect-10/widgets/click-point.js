// Bisect design: use a heavier plain angle stroke, larger ink point, and gray minimum-distance circle.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-10',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  template: 'click-point/board',
  design: {
    style: { sw: 3, minDash: '3 5' },
    dotRadii: [8.5, 7],
    minCircle: { stroke: '#7e8793', 'stroke-width': 2 },
    arrow: { chevron: true },
  },
});
