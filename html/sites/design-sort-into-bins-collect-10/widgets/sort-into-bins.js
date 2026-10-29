// Keep model geometry inside the operational canvas, above the action strip.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-collect-10',
  name: 'design',
  split: 'train',
  scenarios: ['collect'],
  traits: { layout: 'central', itemSize: 0.17 },
  template: 'sort-into-bins/boxes',
  design: {
    caption: null,
    shapes: { square: '<rect x="8" y="8" width="84" height="84"/>' },
    parts: {
      fit: (_base, S) => (ctx) => {
        const stageRect = ctx.stage.getBoundingClientRect();
        return { H: Math.floor(stageRect.height - 16), W: Math.floor(stageRect.width - 24) };
      },
      // The workspace is wide, but the scored shapes remain geometrically square.
      // All conversions use their visual centers, including the oracle's point targets.
      toPx: (_base, S) => (p) => {
        const g = S.geo, d = Math.min(S.spec.item.w * g.W, S.spec.item.h * g.H);
        return [(g.x || 0) + p[0] * g.W - d / 2, (g.y || 0) + p[1] * g.H - d / 2];
      },
      toModel: (_base, S) => (q) => {
        const g = S.geo, d = Math.min(S.spec.item.w * g.W, S.spec.item.h * g.H);
        return [(q[0] - (g.x || 0) + d / 2) / g.W, (q[1] - (g.y || 0) + d / 2) / g.H];
      },
      bounds: (_base, S) => () => {
        const g = S.geo, it = S.spec.item, d = Math.min(it.w * g.W, it.h * g.H);
        return { x0: (g.x || 0) + it.w * g.W / 2 - d / 2,
          y0: (g.y || 0) + it.h * g.H / 2 - d / 2,
          x1: (g.x || 0) + (1 - it.w / 2) * g.W - d / 2,
          y1: (g.y || 0) + (1 - it.h / 2) * g.H - d / 2 };
      },
      item: (base, S) => (ctx, el, item) => {
        base(ctx, el, item);
        const d = Math.min(S.spec.item.w * S.geo.W, S.spec.item.h * S.geo.H);
        Object.assign(el.style, { width: d + 'px', height: d + 'px' });
      },
      shapeSvg: (_base, S) => (content, item) => {
        const color = { blue: '#005ec1', red: '#e62028', black: '#151616' }[item.color] || content.COLORS[item.color];
        return `<svg viewBox="0 0 100 100" fill="${color}">${S.SHAPES[item.shape]}</svg>`;
      },
    },
  },
});
