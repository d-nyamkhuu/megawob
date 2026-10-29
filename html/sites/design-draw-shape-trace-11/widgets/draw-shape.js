// Gradient start marker, shortened polyline guide, and labels fitted by their measured bounds.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-11',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  traits: { guide: 'wave' },
  template: 'draw-shape/canvas',
  design: {
    background: 'transparent', smooth: false,
    headLength: 45, headWidth: 24,
    headAttrs: { fill: '#3593fc', stroke: '#3593fc', 'stroke-width': 2, 'stroke-linejoin': 'round' },
    startClass: 'dw-label dw-start-label', startOffset: 24,
    parts: {
      wrap: (base, S) => (ctx) => {
        const el = base(ctx);
        el.style.setProperty('--board-half', `${S.geo.W / 2 + 10}px`);
        return el;
      },
      dot: (base) => (util, g, px, p, hollow) => {
        if (hollow) return base(util, g, px, p, hollow);
        const [x, y] = px(p);
        const defs = util.svg('defs', {}, g);
        const grad = util.svg('radialGradient', { id: 'dw-start-green', cx: '.35', cy: '.25', r: '.85' }, defs);
        util.svg('stop', { offset: '0', 'stop-color': '#45c752' }, grad);
        util.svg('stop', { offset: '1', 'stop-color': '#2bbb3e' }, grad);
        util.svg('circle', { cx: x, cy: y, r: 17, fill: 'url(#dw-start-green)' }, g);
      },
      label: () => (util, g, px, W, H, p, d, text, cls = 'dw-label', off = 20) => {
        const [x, y] = px(p);
        const node = util.svg('text', { x, y, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        node.textContent = text;
        const bounds = node.getBBox();
        const hw = bounds.width / 2, hh = bounds.height / 2;
        node.setAttribute('x', Math.min(W - hw - 5, Math.max(hw + 5, x + d[0] * (off + hw))));
        node.setAttribute('y', Math.min(H - hh - 5, Math.max(hh + 5, y + d[1] * (off + hh))));
      },
      guide: (base, S) => (b, g, path) => {
        const tip = b.px(path[path.length - 1]);
        const d = S.unit(path[path.length - 2], path[path.length - 1]);
        const visible = path.map(b.px);
        visible[visible.length - 1] = [tip[0] - d[0] * 12, tip[1] - d[1] * 12];
        b.ctx.util.svg('polyline', { points: visible.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), fill: 'none', stroke: '#adb8c9', 'stroke-width': 9, 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' }, g);
      },
      endLabel: (base, S) => (b, g, a) => S.P.label(b.ctx.util, g, b.px, Number(b.svg.getAttribute('width')), Number(b.svg.getAttribute('height')), b.ctx.spec.path[b.ctx.spec.path.length - 1], a.d, 'Arrowhead', 'dw-label', 24),
    },
  },
});
