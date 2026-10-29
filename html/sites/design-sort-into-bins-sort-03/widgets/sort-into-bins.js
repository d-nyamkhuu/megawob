// Design of this site on the bins/boxes template (templates/sort-into-bins/boxes.js): a newspaper board filling the stage,
// with square shapes whose visual center is the model center even though the board's aspect differs.
(function () {
  'use strict';
  const itemHeight = (S) => (S.spec.scenario === 'desk' ? S.spec.item.h * S.geo.H : S.spec.item.w * S.geo.W);
  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-sort-03',
    name: 'design',
    split: 'train',
    scenarios: ['sort'],
    traits: {
      itemsAt: 'above', orient: 'row',
      containers: [{ x: .01, y: .31, w: .485, h: .54 }, { x: .51, y: .31, w: .485, h: .54 }],
    },
    template: 'sort-into-bins/boxes',
    design: {
      parts: {
        fit: () => (ctx) => ({ H: Math.floor(ctx.size.height - 12), W: Math.floor(ctx.size.width - 12) }),
        toPx: (base, S) => (p) => [(p[0] - S.spec.item.w / 2) * S.geo.W, p[1] * S.geo.H - itemHeight(S) / 2],
        toModel: (base, S) => (q) => [q[0] / S.geo.W + S.spec.item.w / 2, (q[1] + itemHeight(S) / 2) / S.geo.H],
        bounds: (base, S) => () => ({ x0: 0, y0: 0, x1: (1 - S.spec.item.w) * S.geo.W, y1: S.geo.H - itemHeight(S) }),
      },
    },
  });
})();
