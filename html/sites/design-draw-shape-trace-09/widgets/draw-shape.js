// This design uses a green start marker, a solid smooth guide, and the original board gutter.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-09',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  template: 'draw-shape/canvas',
  design: {
    reserveH: 2,
    scaleGutter: 40,
    dotLayers: [{ r: 15, fill: '#2a9a35', stroke: '#111', 'stroke-width': 2 }],
    labelInsets: [16, 16, 16, 16],
    guideLayers: [{ stroke: '#444', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    headLength: 30,
    headWidth: 16,
    headAttrs: { fill: '#000', 'stroke-linejoin': 'round' },
    endText: '',
    startText: 'Start',
    startClass: 'dw-label',
    startDirection: [0, 1],
    startOffset: 34,
  },
});
