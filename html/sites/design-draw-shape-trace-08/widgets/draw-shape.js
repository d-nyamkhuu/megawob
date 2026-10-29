// Orange markers and arrowhead with a broad, smooth pale guide define this trace design.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-08',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { guide: 'wave' },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 18, fill: '#ff6a00' }],
    smooth: true,
    guideLayers: [{
      stroke: '#cecfd4',
      'stroke-width': 14,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }],
    headLength: 38,
    headWidth: 20,
    headAttrs: {
      fill: '#ff6a00',
      stroke: '#ff6a00',
      'stroke-width': 4,
      'stroke-linejoin': 'round',
    },
  },
});
