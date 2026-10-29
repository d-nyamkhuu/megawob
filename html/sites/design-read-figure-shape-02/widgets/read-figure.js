// Shape design: outlined glyphs and tuned item sizes.
(function () {
  'use strict';

  env.widget({
    task: 'read-figure',
    site: 'design-read-figure-shape-02',
    name: 'design',
    split: 'train',
    scenarios: ['shape'],
    template: 'read-figure/scene',
    design: {
      fontFamily: 'Times New Roman',
      textScale: 1.5,
      shapeStroke: '#111',
      shapeStrokeWidth: 1.8,
      smallScale: 0.36,
      parts: {
        figure: (base) => (u, p, it, cx, cy, size, color) => {
          base(u, p, it, cx, cy, size, color);
          const glyph = p.lastChild;
          if (it.kind === 'shape') glyph.setAttribute('stroke-width', Math.min(2.5, size / 20));
          else {
            glyph.setAttribute('stroke', '#111');
            glyph.setAttribute('stroke-width', '1.8');
            glyph.setAttribute('paint-order', 'stroke fill');
          }
        },
        itemGeometry: (base) => (it, i, geo) => {
          const q = base(it, i, geo);
          if (it.size !== 'tiny' && it.size !== 'small' && it.kind === 'shape') q.sz = Math.min(geo.cw, geo.ch) * 0.5;
          return q;
        },
      },
    },
  });
})();
