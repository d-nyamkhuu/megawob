// Notebook layout on the shared sort renderer. Targets keep the template's
// linear coordinate map and drag/drop conversion; only initial items form a row.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-04',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'sort-into-bins/boxes',
  traits: { layout: 'rows', itemSize: .14 },
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const boardW = ctx.size.width;
        const boardH = ctx.size.height;
        const minX = Math.min(...S.spec.containers.map(c => c.x));
        const maxX = Math.max(...S.spec.containers.map(c => c.x + c.w));
        const minY = Math.min(...S.spec.containers.map(c => c.y));
        const maxY = Math.max(...S.spec.containers.map(c => c.y + c.h));
        const W = boardW / (maxX - minX);
        const H = Math.min(boardH * .67 / (maxY - minY), boardH * .30 / S.spec.item.h);
        return { W, H, x: -minX * W, y: -minY * H, boardW, boardH };
      },
      toPx: (base, S) => (p) => {
        const index = S.spec.items.findIndex(it => S.ctx.model.pos[it.id] === p);
        const inBox = S.spec.containers.some(c => p[0] >= c.x && p[0] <= c.x + c.w && p[1] >= c.y && p[1] <= c.y + c.h);
        if (index < 0 || inBox) return base(p);
        const width = S.spec.item.w * S.geo.W;
        const height = S.spec.item.h * S.geo.H;
        const count = S.spec.items.length;
        const slot = S.geo.boardW / count;
        return [slot * (index + .5) - width / 2, S.geo.boardH * .85 - height / 2];
      },
      bounds: (base, S) => () => ({
        x0: 0, y0: 0,
        x1: S.geo.boardW - S.spec.item.w * S.geo.W,
        y1: S.geo.boardH - S.spec.item.h * S.geo.H,
      }),
      box: (base, S) => (ctx, el, c) => {
        base(ctx, el, c);
        const label = (c.label || '').toLowerCase();
        if (label === 'pink') el.style.setProperty('--bc', '#ef3785');
        if (label === 'purple') el.style.setProperty('--bc', '#7b3ee0');
        if (label) el.style.setProperty('--label-font', Math.min(86, ctx.size.width * .06, c.w * S.geo.W * .87 / (label.length * .42)) + 'px');
      },
      shapeSvg: (base, S) => (content, item) => {
        const color = item.color === 'pink' ? '#f65098' : item.color === 'purple' ? '#7f3fe0' : content.COLORS[item.color];
        return '<svg viewBox="0 0 100 100" fill="' + color + '">' + S.SHAPES[item.shape] + '</svg>';
      },
      item: (base, S) => (ctx, el, item) => {
        base(ctx, el, item);
        // Match the model's two axes even on a wide notebook page. SVG keeps
        // the actual shape square while the drag surface stays coordinate exact.
        el.style.height = S.spec.item.h * S.geo.H + 'px';
      },
    },
  },
});
