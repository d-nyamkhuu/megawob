// Red start and finish markers, a dashed smooth guide, and a full-stage trace board.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-03',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { aspect: 1.65 },
  template: 'draw-shape/canvas',
  design: {
    labelFont: '700 24px Arial, sans-serif',
    reserveH: 0,
    insetW: 0,
    dotLayers: [{ r: 15, class: 'dw-start', fill: '#d62430' }],
    smooth: true,
    guideLayers: [{ stroke: '#959595', 'stroke-width': 4.5, 'stroke-dasharray': '17 16', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    headLength: 34,
    headWidth: 20,
    headAttrs: { fill: '#d62430', stroke: '#d62430', 'stroke-width': 5, 'stroke-linejoin': 'round' },
    startText: 'Start',
    startClass: 'dw-label',
    startDirection: [0, 1],
    startOffset: 42,
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec } = ctx;
        const fit = Math.min(size.height, size.width / (spec.board.w / spec.board.h));
        const H = Math.max(120, Math.floor(fit));
        const scale = H / spec.board.h;
        return { H, scale, W: Math.round(spec.board.w * scale) };
      },
      headGeometry: (base, S) => (b, path) => {
        const a = base(b, path);
        const markerScale = Math.min(1, Number(S.svg.viewBox.baseVal.width) / 1066);
        const { tip, d } = a;
        const n = [-d[1], d[0]];
        const back = [tip[0] - d[0] * 34 * markerScale, tip[1] - d[1] * 34 * markerScale];
        return {
          tip,
          d,
          markerScale,
          head: [tip, [back[0] + n[0] * 20 * markerScale, back[1] + n[1] * 20 * markerScale],
            [back[0] - n[0] * 20 * markerScale, back[1] - n[1] * 20 * markerScale]],
        };
      },
      endLabel: (base) => (b, g, a) => {
        const { tip, d, markerScale } = a;
        const lab = b.ctx.util.svg('text', {
          x: tip[0] + (d[1] < -0.5 ? 55 * markerScale : -d[0] * 16),
          y: tip[1] + (d[1] < -0.5 ? 20 : 48) * markerScale,
          class: 'dw-label', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-weight': 700,
        }, g);
        lab.textContent = 'Finish';
      },
    },
  },
});
