// Medoid design: an untextured board fitted to the stage, with the original Clear control.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-01',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    grid: 'plain', sampleHeight: null, seededPlace: false,
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 6.5, fill: 'var(--fg)' }],
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
  },
});
