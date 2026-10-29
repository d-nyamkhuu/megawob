// Uses the sort preset's sharp square shapes and color-coded boxes.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-10',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: { layout: 'rows', itemsAt: 'above', itemSize: 0.135 },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      shapeSvg: (base, S) => (content, item) => base({ ...content,
        COLORS: { ...content.COLORS, pink: '#f766bd', purple: '#8b43ef' },
      }, item),
      box: (base, S) => (ctx, el, container) => {
        base(ctx, el, container);
        const color = (container.label || '').toLowerCase();
        const heading = { pink: '#f572c4', purple: '#b08bf5' }[color];
        if (heading) el.style.setProperty('--bin-heading', heading);
      },
      // Expand the scored bin row, rather than moving its DOM away from its
      // model coordinates. The template's locate(point) uses this same geometry.
      fit: (base, S) => (ctx) => {
        const cs = S.spec.containers;
        const top = Math.min(...cs.map(c => c.y));
        const bottom = Math.max(...cs.map(c => c.y + c.h));
        const row = cs.every(c => Math.abs(c.y - top) < 0.001);
        const W = ctx.size.width, boardH = ctx.size.height;
        const H = row ? boardH * 0.56 / (bottom - top) : boardH;
        return { W, H, y: row ? boardH * 0.38 - top * H : 0,
          boardW: W, boardH };
      },
      // Outside shapes use the source tray. Shapes already in a scored bin
      // (including partial/wrong starts) retain their exact scored placement.
      toPx: (base, S) => p => {
        const g = S.geo, sp = S.spec, px = sp.item.w * g.W;
        const inside = sp.containers.some(c => p[0] >= c.x && p[0] <= c.x + c.w && p[1] >= c.y && p[1] <= c.y + c.h);
        const i = sp.items.findIndex(it => S.ctx.model.pos[it.id] === p);
        const row = sp.containers.every(c => Math.abs(c.y - sp.containers[0].y) < 0.001);
        if (row && !inside && i >= 0) {
          const x = sp.items.length === 1 ? 0.5 : 0.13 + i * 0.74 / (sp.items.length - 1);
          return [x * g.W - px / 2, g.boardH * 0.19 - px / 2];
        }
        return [p[0] * g.W - px / 2, (g.y || 0) + p[1] * g.H - px / 2];
      },
      // The elements are square in pixels, even if the expanded board's model
      // axes have different scales. Convert their actual centers on release.
      toModel: (base, S) => q => {
        const g = S.geo, half = S.spec.item.w * g.W / 2;
        return [(q[0] + half) / g.W, (q[1] + half - (g.y || 0)) / g.H];
      },
      bounds: (base, S) => () => {
        const g = S.geo, px = S.spec.item.w * g.W;
        return { x0: 0, y0: 0, x1: g.boardW - px, y1: g.boardH - px };
      },
    },
  },
});
