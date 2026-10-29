// This circle design uses the shared canvas template's circle preset.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-10',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 15, fill: 'var(--panel)' }, { r: 13, fill: 'var(--fg)' }],
    hollowAttrs: { r: 11, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 3.5 },
  },
});
