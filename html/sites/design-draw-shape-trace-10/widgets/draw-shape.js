// Warm paper, green start marker, and red arrow preserve this site's trace-board design.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-10',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  template: 'draw-shape/canvas',
  design: {
    background: '#f4f0e6',
    reserveH: 4,
    dotLayers: [{ r: 15, fill: '#1c8f1c' }],
    smooth: true,
    guideLayers: [{ stroke: '#898989', 'stroke-width': 6, 'stroke-dasharray': '22 12', 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' }],
    headLength: 30,
    headWidth: 16,
    headAttrs: { fill: '#d03a36', 'stroke-linejoin': 'round' },
    endText: '',
    startDirection: [0, 1],
    startOffset: 35,
  },
});
