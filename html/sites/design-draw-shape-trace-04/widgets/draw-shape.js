// Orange marker and arrowhead, with the original Start label placement.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-04',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { guide: 'wave' },
  template: 'draw-shape/canvas',
  design: {
    dotLayers: [{ r: 17, fill: '#ff7a00', stroke: '#000', 'stroke-width': 4 }],
    smooth: true,
    guideLayers: [{ stroke: '#000', 'stroke-width': 6, 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' }],
    headLength: 48,
    headWidth: 23,
    headAttrs: { fill: '#ff7a00', stroke: '#000', 'stroke-width': 4, 'stroke-linejoin': 'miter' },
    endText: '',
    startText: 'Start',
    startClass: 'dw-label',
    startOffset: 30,
    parts: {
      label: () => (util, g, px, W, H, p, d, text, cls = 'dw-label', off = 20) => {
        const [x, y] = px(p);
        const lx = Math.min(W - 55, Math.max(55, text === 'Start' ? x : x + d[0] * off));
        const ly = text === 'Start'
          ? Math.min(H + 8, y + 44)
          : Math.min(H - 24, Math.max(24, y + d[1] * off));
        util.svg('text', { x: lx, y: ly, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g).textContent = text;
      },
    },
  },
});
