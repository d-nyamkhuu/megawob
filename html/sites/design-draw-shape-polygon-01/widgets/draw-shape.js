// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-polygon-01',
  name: 'design',
  split: 'train',
  scenarios: ['polygon'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'drawMap': (base, S) => function drawMap(B) {
        const { fmtPx } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const land = rng.pick(['#f3f1ea', '#eef0e6', '#f1efe9']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: land }, svg);
        // Blocks.
        const blocks = util.svg('g', { opacity: 0.55 }, svg);
        for (let i = 0; i < 14; i++) {
          const x = rng.float(0, W - 40);
          const y = rng.float(0, H - 30);
          util.svg('rect', { x, y, width: rng.float(24, 70), height: rng.float(18, 50), rx: 3, fill: rng.pick(['#e2ddd2', '#dcd8cd', '#e6e1d6']) }, blocks);
        }
        // A denser, quiet residential grid gives this Vista map the detailed city fabric
        // visible around its task region. These ornaments are fixed to the canvas and do
        // not consume random values or overlap the task's target geometry deliberately.
        const blockColors = ['#e1ddd2', '#d9d5ca', '#e7e2d7', '#d6d2c7'];
        for (let row = 0; row < 5; row++) for (let col = 0; col < 10; col++) {
          const x = 14 + col * (W - 28) / 10 + ((row + col) % 3) * 3;
          const y = 10 + row * (H - 20) / 5 + ((row * 2 + col) % 4) * 2;
          const bw = Math.max(12, (W - 28) / 10 * (0.34 + ((row + col) % 3) * 0.11));
          const bh = Math.max(10, (H - 20) / 5 * (0.28 + ((row * 3 + col) % 3) * 0.09));
          util.svg('rect', { x, y, width: bw, height: bh, rx: 1.5, fill: blockColors[(row + col) % blockColors.length], opacity: 0.68 }, blocks);
        }
        if (spec.river) {
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const x = (i / 40) * spec.board.w;
            pts.push([x, spec.river.y0 + spec.river.amp * Math.sin(x * 4 + spec.river.phase)]);
          }
          util.svg('polyline', { points: fmtPx(pts, px), fill: 'none', stroke: '#a5cbe6', 'stroke-width': 0.05 * scale, 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
        }
        // A decorative park.
        const [pxx, pyy] = [rng.float(0.1, 0.9) * W, rng.float(0.1, 0.9) * H];
        util.svg('ellipse', { cx: pxx, cy: pyy, rx: rng.float(30, 60), ry: rng.float(20, 40), fill: '#cfe3c1', opacity: 0.8 }, svg);
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#ffffff', 'stroke-width': rng.pick([7, 9, 11]), 'stroke-linecap': 'round' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
      },
    },
  },
});
