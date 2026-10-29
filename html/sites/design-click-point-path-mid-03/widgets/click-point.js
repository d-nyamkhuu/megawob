// Design on templates/click-point/base.js: the base site's click-point widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-point',
  site: 'design-click-point-path-mid-03',
  name: 'design',
  split: 'train',
  scenarios: ['path-mid'],
  template: 'click-point/base',
  design: {
    parts: {
      'drawPath': (base, S) => function drawPath(util, g) {
        const { f1, label, point, px } = S;
        const pts = S.spec.pts.map((p) => px(p).map(f1).join(',')).join(' ');
        util.svg('polyline', { points: pts, fill: 'none', stroke: S.style.fill, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
        const a = S.spec.pts[0];
        const b = S.spec.pts[S.spec.pts.length - 1];
        let markStart = g.children.length;
        point(util, g, a);
        for (const el of Array.from(g.children).slice(markStart)) el.classList.add('cp-end-a');
        markStart = g.children.length;
        point(util, g, b);
        for (const el of Array.from(g.children).slice(markStart)) el.classList.add('cp-end-b');
        const W = S.spec.board.w * S.scale;
        const H = S.spec.board.h * S.scale;
        // Put each end label on the first side (away from the path, then across it) where it fits unclamped.
        const side = (p, q) => {
          const th = Math.atan2(p[1] - q[1], p[0] - q[0]);
          for (const t of [th, th + Math.PI / 2, th - Math.PI / 2, th + Math.PI]) {
            const [x, y] = px(p);
            const lx = x + Math.cos(t) * 22;
            const ly = y + Math.sin(t) * 22;
            if (lx >= 14 && lx <= W - 14 && ly >= 14 && ly <= H - 12) return t;
          }
          return th;
        };
        label(util, g, a, side(a, S.spec.pts[1]), 'A');
        label(util, g, b, side(b, S.spec.pts[S.spec.pts.length - 2]), 'B');
      },
    },
  },
});
