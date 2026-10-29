// The window fits the SVG into its canvas; use that SVG's actual transform for
// pointer coordinates, including the letterboxing of its viewBox.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-tool-01',
  name: 'design',
  split: 'train',
  scenarios: ['tool'],
  template: 'draw-shape/base',
  design: {
    parts: {
      buildTool: (base) => function (B) {
        const { svg, scale } = B;
        const transform = (x, y, matrix) => {
          const p = svg.createSVGPoint();
          p.x = x;
          p.y = y;
          const q = p.matrixTransform(matrix);
          return [q.x, q.y];
        };
        return base({
          ...B,
          frame: {
            ...B.frame,
            toBoard: ([x, y]) => transform(x, y, svg.getScreenCTM().inverse()).map(v => v / scale),
            fromBoard: ([x, y]) => transform(x * scale, y * scale, svg.getScreenCTM()),
          },
        });
      },
    },
  },
});
