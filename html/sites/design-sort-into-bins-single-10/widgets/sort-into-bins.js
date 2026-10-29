// This design uses the shared boxes template for the single-item bins task.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-10',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { layout: 'central', itemSize: .5 },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => {
        // Keep one model-to-pixel transform for the episode, including after a drop.
        let fittedSpec, fittedSize, fitted;
        return (ctx) => {
          const sizeKey = ctx.size.width + ':' + ctx.size.height;
          if (fittedSpec === S.spec && fittedSize === sizeKey) return fitted;
          const boardW = Math.max(1, Math.floor(ctx.size.width - 24));
          const boardH = Math.max(1, Math.floor(ctx.size.height - 24));
          const { item, containers, items } = S.spec;
          const rects = containers.map(c => ({ x: c.x, y: c.y, w: c.w, h: c.h }));
          for (const it of items) {
            const p = ctx.model.pos[it.id];
            rects.push({ x: p[0] - item.w / 2, y: p[1] - item.h / 2, w: item.w, h: item.h });
          }
          const x0 = Math.min(...rects.map(r => r.x));
          const y0 = Math.min(...rects.map(r => r.y));
          const x1 = Math.max(...rects.map(r => r.x + r.w));
          const y1 = Math.max(...rects.map(r => r.y + r.h));
          // Zoom the sampled scene without stretching shapes or moving scoring targets.
          const H = Math.min(
            boardW * .62 / (Math.max(.01, x1 - x0) * S.spec.aspect),
            boardH * .59 / Math.max(.01, y1 - y0),
          );
          const W = H * S.spec.aspect;
          fitted = {
            W, H, boardW, boardH,
            x: boardW * .51 - (x0 + x1) * W / 2,
            y: boardH * .51 - (y0 + y1) * H / 2,
          };
          fittedSpec = S.spec;
          fittedSize = sizeKey;
          return fitted;
        };
      },
      bounds: (base, S) => () => {
        const g = S.geo, item = S.spec.item;
        return {
          x0: Math.max(0, g.x),
          y0: Math.max(0, g.y),
          x1: Math.min(g.boardW - item.w * g.W, g.x + (1 - item.w) * g.W),
          y1: Math.min(g.boardH - item.h * g.H, g.y + (1 - item.h) * g.H),
        };
      },
    },
  },
});
