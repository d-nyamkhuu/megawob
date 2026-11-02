// Green chalk-like markers and a smooth pale guide with a custom Finish label.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-12',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 14, fill: '#55b995' }],
    smooth: true,
    guideLayers: [{
      stroke: '#d3d6da',
      'stroke-width': 13,
      'stroke-linecap': 'butt',
      'stroke-linejoin': 'round',
    }],
    headLength: 36,
    headWidth: 18,
    headAttrs: { fill: '#55b995', 'stroke-linejoin': 'round' },
    endText: 'Finish',
    startDirection: [0, 1],
    startText: 'Start',
    startClass: 'dw-label',
    startOffset: 30,
    parts: {
      endLabel: () => (b, g, a) => {
        const lab = b.ctx.util.svg('text', {
          x: a.tip[0],
          y: Math.max(...a.head.map((p) => p[1])) + 20,
          class: 'dw-label',
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-weight': 400,
        }, g);
        lab.textContent = 'Finish';
      },
    },
  },
});
