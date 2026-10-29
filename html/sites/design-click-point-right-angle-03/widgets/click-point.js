// Right-angle design: solid endpoints, fixed lower labels, and no dashed line extension.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-03',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    clear: false,
    hollowA: 'never',
    labelAt: { A: [Math.PI / 2, 30], B: [Math.PI / 2, 30] },
    dot: { r: 8, fill: 'var(--fg)' },
    parts: {
      raExtension: () => () => {},
    },
  },
});
