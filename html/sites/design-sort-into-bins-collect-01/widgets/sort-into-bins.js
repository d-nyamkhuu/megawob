// Design of this site on the bins/boxes template (templates/sort-into-bins/boxes.js): ink-outlined shapes, outline
// distractors drawn unfilled.
(function () {
  'use strict';
  const INK = '#252525';
  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-collect-01',
    name: 'design',
    split: 'train',
    scenarios: ['collect'],
    traits: { layout: 'central', itemSize: .18, itemCount: 12,
      palette: { target: 'blue', distractors: ['black', 'outline'] } },
    template: 'sort-into-bins/boxes',
    design: {
      parts: {
        fit: (base, S) => (ctx) => {
          const boardW = Math.max(1, Math.floor(ctx.size.width - 8));
          const boardH = Math.max(1, Math.floor(ctx.size.height - 8));
          return { W: Math.max(1, boardW - 8), H: Math.max(1, boardH - 40), x: 4, y: 4, boardW, boardH };
        },
        item: (base, S) => (ctx, el, it) => {
          base(ctx, el, it);
          // Project the scored model rectangle in both axes. The SVG keeps its
          // square geometry, and the item center remains the oracle target.
          el.style.height = S.spec.item.h * S.geo.H + 'px';
        },
        shapeSvg: (base, S) => (content, it) => {
          const color = it.color === 'blue' ? '#3183cc' : content.COLORS[it.color] || INK;
          const shade = it.color === 'blue' ? '#2b75bf' : it.color === 'black' ? '#222222' : color;
          const paint = 'lisa-shape-' + it.id;
          return `<svg viewBox="0 0 100 100" fill="${it.fill === 'outline' ? 'none' : 'url(#' + paint + ')'}" stroke="#111" stroke-width="3"><defs><linearGradient id="${paint}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${shade}"/></linearGradient></defs>${S.SHAPES[it.shape]}</svg>`;
        },
        title: () => (it) => `${it.fill === 'outline' ? 'outline ' : ''}${it.color} ${it.shape}`,
      },
    },
  });
})();
