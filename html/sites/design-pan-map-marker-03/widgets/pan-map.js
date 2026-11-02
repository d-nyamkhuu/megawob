// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-marker-03',
  name: 'design',
  split: 'train',
  scenarios: ['marker'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      explorerFrame(base) {
        return (ctx, chrome) => {
          const { util } = ctx;
          const card = util.el('div', 'mp-card mpp-main', chrome.work);
          const head = util.el('div', 'mp-head', card);
          const W = Math.max(320, card.clientWidth);
          const H = Math.max(220, card.clientHeight);
          const port = util.el('div', 'mp-port', card);
          Object.assign(port.style, { width: W + 'px', height: H + 'px' });
          return { card, head, port, W, H };
        };
      },
      explorerWorld(base) {
        return (ctx, port, W, H) => {
          const scene = base(ctx, port, W, H);
          const svg = scene.world.ownerSVGElement;
          const defs = env.util.svg('defs', {}, svg);
          const pattern = env.util.svg('pattern', { id: 'chronicle-street-grid', width: 72, height: 72,
            patternUnits: 'userSpaceOnUse' }, defs);
          env.util.svg('path', { d: 'M72 0H0V72', fill: 'none', stroke: '#fffdf8', 'stroke-width': 3.5,
            'vector-effect': 'non-scaling-stroke' }, pattern);
          const park = env.util.svg('pattern', { id: 'chronicle-park', width: 48, height: 42,
            patternUnits: 'userSpaceOnUse' }, defs);
          env.util.svg('rect', { width: 48, height: 42, fill: '#afd39d' }, park);
          for (const [x, y] of [[9, 10], [30, 7], [20, 28], [43, 30]]) {
            env.util.svg('path', { d: `M${x} ${y + 8}l-5 3 3-6-2-1 4-1 1-5 2 5 4 1-2 2 3 5-5-3v4h-3v-4z`,
              fill: '#7cae70', opacity: '.48' }, park);
          }
          svg.insertBefore(defs, svg.firstChild);
          const grid = env.util.svg('rect', { x: 0, y: 0, width: scene.wd.W, height: scene.wd.H,
            fill: 'url(#chronicle-street-grid)', 'pointer-events': 'none' });
          scene.world.insertBefore(grid, scene.world.firstChild);
          return scene;
        };
      },
    },
  },
});
