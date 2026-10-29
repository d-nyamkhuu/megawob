// Center board design: plain transparent grid treatment, 2.5px strokes, and the page's Clear control.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-06',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { shapes: ['arc'] },
  template: 'click-point/board',
  design: {
    style: { grid: 'plain', sw: 2.5, dashOutline: false, edges: false },
    boardFill: 'transparent',
    clear: true,
  },
});
