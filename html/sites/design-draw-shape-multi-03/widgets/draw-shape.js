// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-multi-03',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildMulti': (base) => function buildMulti(B) {
        const { spec } = B.ctx;
        // Include the full circle, rather than just its centre, when fitting targets.
        const points = spec.targets.flatMap((t) => t.type === 'line'
          ? [t.a, t.b]
          : [[t.c[0] - t.r, t.c[1] - t.r], [t.c[0] + t.r, t.c[1] + t.r]]);
        const x0 = Math.min(...points.map((p) => p[0]));
        const x1 = Math.max(...points.map((p) => p[0]));
        const y0 = Math.min(...points.map((p) => p[1]));
        const y1 = Math.max(...points.map((p) => p[1]));
        // One uniform scale keeps circles round and strokes precise in the lower board.
        const scale = Math.min(B.W * 0.74 / Math.max(x1 - x0, 0.001),
          B.H * 0.55 / Math.max(y1 - y0, 0.001));
        const offsetX = (B.W - (x1 - x0) * scale) / 2 - x0 * scale;
        const offsetY = B.H * 0.88 - y1 * scale;
        const px = ([x, y]) => [offsetX + x * scale, offsetY + y * scale];
        // The SVG can be letterboxed by the page layout. Use its real transform
        // for both input and oracle locations, so they match the rendered figures.
        const toBoard = ([x, y]) => {
          const p = B.svg.createSVGPoint();
          p.x = x;
          p.y = y;
          const q = p.matrixTransform(B.svg.getScreenCTM().inverse());
          return [(q.x - offsetX) / scale, (q.y - offsetY) / scale];
        };
        const frame = {
          ...B.frame,
          toBoard,
          fromBoard: (point) => {
            const p = B.svg.createSVGPoint();
            [p.x, p.y] = px(point);
            const q = p.matrixTransform(B.svg.getScreenCTM());
            return [q.x, q.y];
          },
        };
        return base({ ...B, px, scale, toBoard, frame });
      },
    },
  },
});
