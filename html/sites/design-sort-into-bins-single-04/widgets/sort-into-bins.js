// Design of this site on the bins/boxes template (templates/sort-into-bins/boxes.js): CSS enlarges the silhouettes, so the
// board frames the visible extents of the seeded boxes and shapes (close framing in sparse scenes).
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-04',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const { size } = ctx;
        const spec = S.spec;
        // Never let max-height silently change the coordinate frame.
        const style = getComputedStyle(ctx.stage);
        const availableW = size.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 12;
        const availableH = size.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 12;
        // Keep the reference's close framing in sparse scenes, expanding the view whenever a seeded item or
        // container occupies the lower part of the board.
        let x0 = 0, y0 = 0, x1 = 1, y1 = .75;
        for (const c of spec.containers) {
          const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
          x0 = Math.min(x0, cx - c.w * 1.5); x1 = Math.max(x1, cx + c.w * 1.5);
          y0 = Math.min(y0, cy - c.h * 1.05); y1 = Math.max(y1, cy + c.h * 1.05);
        }
        for (const p of Object.values(ctx.model.pos)) {
          x0 = Math.min(x0, p[0] - spec.item.w * 1.7); x1 = Math.max(x1, p[0] + spec.item.w * 1.7);
          y0 = Math.min(y0, p[1] - spec.item.h * 1.7); y1 = Math.max(y1, p[1] + spec.item.h * 1.7);
        }
        const H = Math.max(1, Math.floor(Math.min(availableH / (y1 - y0), availableW / (spec.aspect * (x1 - x0)))));
        const geo = { H, W: H * spec.aspect, x: -x0 * H * spec.aspect, y: -y0 * H };
        return { ...geo, boardW: geo.W * (x1 - x0), boardH: geo.H * (y1 - y0) };
      },
    },
  },
});
