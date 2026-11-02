// Pixel-shaped center and rim markers on the shared SVG drawing board.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-07',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    clearTarget: 'widget',
    parts: {
      dot: (base) => (util, g, px, p, hollow) => {
        if (g.ownerSVGElement?.dataset.role !== 'board') return base(util, g, px, p, hollow);
        const [x, y] = px(p);
        const r = hollow ? 17 : 20;
        const pts = [[-.4, -1], [.4, -1], [.75, -.75], [1, -.4], [1, .4], [.75, .75], [.4, 1], [-.4, 1], [-.75, .75], [-1, .4], [-1, -.4], [-.75, -.75]];
        util.svg('polygon', { points: pts.map(([a, b]) => `${x + a * r},${y + b * r}`).join(' '), fill: hollow ? 'var(--panel)' : 'var(--fg)', stroke: hollow ? 'var(--fg)' : 'none', 'stroke-width': hollow ? 5 : 0, 'shape-rendering': 'crispEdges' }, g);
      },
    },
  },
});
