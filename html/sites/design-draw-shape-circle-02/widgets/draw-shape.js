// Use the shared circle canvas and expose Clear through the site's widget definition.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-02',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    clearTarget: 'widget',
    dotLayers: [{ r: 12, fill: 'var(--panel)' }, { r: 9, fill: '#111' }],
    hollowAttrs: { r: 10.5, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 },
  },
});
