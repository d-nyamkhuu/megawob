// Preserve the site's legacy widget-level Clear method; the shared circle design supplies the rest.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-04',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 16, fill: 'var(--panel)' }, { r: 14, fill: 'var(--dot, var(--fg))' }],
    hollowAttrs: { r: 16, fill: 'none', stroke: 'var(--fg)', 'stroke-width': 4 },
    clearTarget: 'widget',
  },
});
