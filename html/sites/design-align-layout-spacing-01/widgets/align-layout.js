// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-spacing-01',
  name: 'design',
  split: 'train',
  scenarios: ['spacing'],
  template: 'align-layout/canvas',
  design: {
    titles: { spacing: ['Project board', 'Studio projects', 'Campaigns'] },
    tools: [], canvasCaption: '', zoom: '',
    panel: '#f8f7f4', line: '#c4c6c3', accent: '#c4fa61',
    fg: '#080a09', muted: '#80817d',
    gridSize: 1, itemRadius: 0, itemSize: 16,
    cardPadding: '0px', cardGap: 0, rulerWidth: 0, rulerHeight: 0,
    parts: {},
  },
});
