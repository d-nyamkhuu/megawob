// Red targets and large labels; retain the seeded grid draws while hiding the grid.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-08',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    sampleFactor: 1.5,
    labelFont: '700 30px "Trebuchet MS", "Segoe UI", sans-serif',
    css: '.dw-hint, .dw-swatch { display: none !important; }\n.dw-board { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }',
    gridAttrs: { opacity: 0 },
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 10.5, fill: '#ff0000' }],
    connectDirection: [0, -1], connectOffset: 30,
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', opacity: 0, 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    clearTarget: 'widget', clearLog: true, clearInkFirst: true,
  },
});
