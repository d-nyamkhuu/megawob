// Design of this site on the bins/boxes template (templates/sort-into-bins/boxes.js): a full-stage form board with flat
// form colors; each shape's drawn size shrinks near the board edge (--shape-size).
(function () {
  'use strict';
  const FORM_COLORS = { orange: '#ff8000', blue: '#205cff', yellow: '#ffe100', red: '#df0b0b', green: '#079b08', purple: '#7d2dc2', black: '#000' };
  const fitShape = (S, el) => {
    const r = el.getBoundingClientRect(), b = S.board.getBoundingClientRect();
    const x = r.left - b.left + r.width / 2, y = r.top - b.top + r.height / 2;
    const px = S.spec.item.w * S.geo.W;
    const side = Math.max(1, Math.min(px, 2 * x, 2 * (S.geo.W - x), 2 * y, 2 * (S.geo.H - y)));
    el.style.setProperty('--shape-size', side + 'px');
  };
  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-collect-06',
    name: 'design',
    split: 'train',
    scenarios: ['collect'],
    traits: {
      containers: [{ x: .348, y: .112, w: .304, h: .772 }],
      palette: { target: 'orange', distractors: ['blue', 'yellow', 'red', 'green', 'purple'] },
    },
    template: 'sort-into-bins/boxes',
    design: {
      shapes: {
        square: '<rect x="8" y="8" width="84" height="84"/>',
        triangle: '<polygon points="50,5 95,90 5,90" stroke-linejoin="miter"/>',
      },
      parts: {
        fit: () => (ctx) => ({ H: Math.floor(ctx.size.height), W: Math.floor(ctx.size.width) }),
        // CSS makes the board fill the stage; use that same frame for model coordinates.
        board: (base, S) => (ctx) => {
          const el = base(ctx);
          const frame = el.getBoundingClientRect();
          S.geo = { W: frame.width, H: frame.height };
          return el;
        },
        shapeSvg: (base, S) => (content, it) => `<svg viewBox="0 0 100 100" fill="${it.color === 'outline' ? 'none' : FORM_COLORS[it.color] || content.COLORS[it.color]}" stroke="rgba(0,0,0,.38)" stroke-width="3">${S.SHAPES[it.shape]}</svg>`,
        item: (base, S) => (ctx, el) => {
          el.style.height = S.spec.item.h * S.geo.H + 'px';
          fitShape(S, el);
        },
        moved: (base, S) => (ctx, el) => fitShape(S, el),
      },
    },
  });
})();
