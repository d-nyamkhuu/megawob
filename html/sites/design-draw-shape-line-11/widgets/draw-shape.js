// Black marker, labels above the dot, and line-specific page guidance.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-11',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    grid: 'plain', sampleHeight: null, seededPlace: false,
    haloAttrs: { r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' },
    parts: {
      dot: () => (util, g, px, p, hollow) => {
        const [x, y] = px(p);
        if (hollow) {
          util.svg('circle', { cx: x, cy: y, r: 7.5, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 }, g);
        } else {
          util.svg('circle', { cx: x, cy: y, r: 9, fill: 'var(--panel)' }, g);
          util.svg('circle', { cx: x, cy: y, r: 9, fill: '#080808' }, g);
        }
      },
      label: () => (util, g, px, W, H, p, d, text, cls = 'dw-label', off = 20) => {
        const [x, y] = px(p);
        const lx = Math.min(W - 16, Math.max(16, cls === 'dw-label' ? x : x + d[0] * off));
        const ly = Math.min(H - 10, Math.max(14, cls === 'dw-label' ? y - 27 : y + d[1] * off));
        return util.svg('text', { x: lx, y: ly, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g).textContent = text;
      },
      begin: () => (ctx) => {
        const { spec } = ctx;
        const points = document.querySelector('.ns-points');
        const goal = document.querySelector('.ns-goal');
        const help = document.querySelector('.ns-help');
        if (points) points.textContent = 'Points:  ' + (spec.mode === 'connect' ? 2 : 1);
        if (goal) goal.textContent = spec.mode === 'connect'
          ? 'Goal:  Connect A to B with one straight line.'
          : 'Goal:  Draw one straight line through the dot.';
        if (help) help.textContent = spec.mode === 'connect'
          ? 'Press and drag from A to B.'
          : 'Press and drag through the marked dot.';
      },
    },
  },
});
