// Center board design: larger board with plain, consistently weighted ink.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-02',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { shapes: ['arc'] },
  template: 'click-point/board',
  design: {
    style: { grid: 'plain', sw: 4, dashOutline: false, edges: false },
    parts: {
      boardHeight: (base) => (fit, drawn) => Math.min(fit, drawn * 1.7),
    },
  },
});
