// Blue arrowhead, green start marker, and a large custom Start label on the trace guide.
(function () {
  const ARROW = {
    id: 'trace-arrow-shine', x1: '0', y1: '0', x2: '1', y2: '1',
    stops: ['#4d98d9', '#2771bd'],
  };

  env.widget({
    task: 'draw-shape',
    site: 'design-draw-shape-trace-01',
    name: 'design',
    split: 'train',
    scenarios: ['trace'],
    traits: { guide: 'wave' },
    template: 'draw-shape/canvas',
    design: {
      css: '.dw-small { text-transform: none; letter-spacing: -.5px; font-family: Arial, sans-serif; font-size: 26px; font-weight: 600; fill: #0a1424; }',
      smooth: true,
      startDot: 'start',
      startClass: 'dw-small',
      startDirection: [0, 1],
      startOffset: 36,
      guideLayers: [
        { stroke: 'var(--muted)', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 },
        { stroke: '#92969f', 'stroke-width': 4.5, 'stroke-dasharray': '26 16', 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' },
      ],
      headLength: 52,
      headWidth: 26,
      endText: null,
      headAttrs: { fill: 'url(#trace-arrow-shine)', stroke: '#2768ae', 'stroke-width': 2, 'stroke-linejoin': 'round' },
      parts: {
        dot: (base) => (util, g, px, p, hollow) => {
          if (hollow !== 'start') return base(util, g, px, p, hollow);
          const [x, y] = px(p);
          const defs = util.svg('defs', {}, g);
          const shine = util.svg('radialGradient', { id: 'trace-start-shine', cx: '.38', cy: '.3', r: '.8' }, defs);
          util.svg('stop', { offset: '0', 'stop-color': '#39bc31' }, shine);
          util.svg('stop', { offset: '1', 'stop-color': '#20921d' }, shine);
          util.svg('circle', { cx: x, cy: y, r: 16, fill: 'url(#trace-start-shine)', stroke: '#147216', 'stroke-width': 2.5 }, g);
          util.svg('circle', { cx: x, cy: y, r: 12.5, fill: 'none', stroke: '#56c344', 'stroke-width': 1, opacity: 0.45 }, g);
        },
        arrowHead: (base) => (b, g, a) => {
          const defs = b.ctx.util.svg('defs', {}, g);
          const shine = b.ctx.util.svg('linearGradient', ARROW, defs);
          b.ctx.util.svg('stop', { offset: '0', 'stop-color': ARROW.stops[0] }, shine);
          b.ctx.util.svg('stop', { offset: '1', 'stop-color': ARROW.stops[1] }, shine);
          return base(b, g, a);
        },
      },
    },
  });
})();
