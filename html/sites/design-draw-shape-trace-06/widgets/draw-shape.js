// Green start marker, blue arrowhead, and the site's curved gray trace guide.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-06',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { aspect: 1.7 },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 12, fill: '#2d6a1e' }],
    smooth: true,
    guideLayers: [{ stroke: '#a6a6a8', 'stroke-width': 4, 'stroke-dasharray': '16 14', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    headLength: 40,
    headWidth: 20,
    headAttrs: { fill: '#0a72ee', 'stroke-linejoin': 'round' },
    endText: '',
    startDirection: [0, 1],
    startOffset: 37,
  },
});
