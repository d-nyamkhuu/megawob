// Blue start marker and arrowhead, with the original smooth guide and label placement.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-07',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { guide: 'wave' },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 15, fill: '#1d7fe8' }],
    smooth: true,
    guideLayers: [{
      stroke: '#8b939c',
      'stroke-width': 4.5,
      'stroke-dasharray': '20 14',
      'stroke-linecap': 'butt',
      'stroke-linejoin': 'round',
    }],
    headLength: 36,
    headWidth: 20,
    headAttrs: { fill: '#1d7fe8', 'stroke-linejoin': 'round' },
    endText: '',
    startText: 'Start',
    startClass: 'dw-label',
    startOffset: 40,
  },
});
