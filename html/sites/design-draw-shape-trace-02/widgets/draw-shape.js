// Smooth guide with a weight-sized arrowhead and a responsive blue starting dot.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-trace-02',
  name: 'design',
  split: 'train',
  scenarios: ['trace'],
  template: 'draw-shape/canvas',
  design: {
    headAttrs: { fill: '#cdd3db', 'stroke-linejoin': 'round' },
    parts: {
      dot: (base) => (util, g, px, p, hollow) => {
        if (hollow) return base(util, g, px, p, hollow);
        const [x, y] = px(p);
        util.svg('circle', { cx: x, cy: y, r: Math.min(25, g.ownerSVGElement.height.baseVal.value * .037), fill: '#126ddd', stroke: '#fff', 'stroke-width': 3 }, g);
      },
      guide: (base, S) => (b, g, path) => {
        const weight = Math.min(30, g.ownerSVGElement.height.baseVal.value * .044);
        const guide = b.ctx.util.svg('path', { d: S.P.curve(path, b.px), fill: 'none', stroke: '#cbd2da', 'stroke-width': weight, 'stroke-linecap': 'butt', 'stroke-linejoin': 'round' }, g);
        const length = guide.getTotalLength();
        guide.setAttribute('stroke-dasharray', `${Math.max(1, length - weight * 1.8)} ${length}`);
      },
      headGeometry: (base, S) => (b, path) => {
        const weight = Math.min(30, b.svg.height.baseVal.value * .044);
        const tip = b.px(path[path.length - 1]);
        const d = S.unit(path[path.length - 2], path[path.length - 1]);
        const n = [-d[1], d[0]];
        const back = [tip[0] - d[0] * weight * 2.4, tip[1] - d[1] * weight * 2.4];
        return { tip, d, head: [tip, [back[0] + n[0] * weight * 1.4, back[1] + n[1] * weight * 1.4], [back[0] - n[0] * weight * 1.4, back[1] - n[1] * weight * 1.4]] };
      },
    },
  },
});
