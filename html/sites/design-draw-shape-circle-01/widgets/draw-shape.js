// Oversized, high-contrast center and rim markers on the shared drawing board.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-01',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    grid: 'plain',
    sampleHeight: null,
    seededPlace: false,
    clearTarget: 'widget',
    dotLayers: [{ r: 16, fill: 'var(--panel)' }, { r: 16, fill: 'var(--fg)' }],
    hollowAttrs: { r: 15.5, fill: '#fff', stroke: 'var(--fg)', 'stroke-width': 2.5 },
  },
});
