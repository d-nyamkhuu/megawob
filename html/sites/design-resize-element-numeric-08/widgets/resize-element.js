// Keeps this design's review comments and read-only notice, roomy workspace fit, and area anchor.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-08',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    messages: [
      ['Jordan Diaz', 'The draft looks good. I’d like to see a bit more detail in the second section.', 'Apr 12, 10:24 AM'],
      ['Morgan Kim', 'Agreed. The overall structure works for me.', 'Apr 12, 11:03 AM'],
      ['Riley Scott', 'Let’s refine the intro and then we can move forward.', 'Apr 12, 1:17 PM'],
    ],
    parts: {
      body: (base, S) => (ctx) => {
        const body = base(ctx);
        ctx.util.el('div', 'rz-readonly', body, 'Comments are read-only in this view.');
        return body;
      },
      fit: (base, S) => (ctx) => {
        const { lim, pad, margin, W, H } = S.frame;
        const stage = ctx.size;
        const insetX = stage.width * 0.04425;
        const insetY = ctx.stage.getBoundingClientRect().height * 0.0937;
        return Math.min(
          1,
          (stage.width - insetX - 24) / (lim.max.w + pad),
          (stage.height - insetY - 24) / (lim.max.h + pad),
          (stage.width - 2 * margin) / W,
          (stage.height - 2 * margin) / H,
        );
      },
      compact: (base, S) => (ctx, size) => {
        base(ctx, size);
        S.frame.box.classList.toggle('narrow', size.w < 220);
      },
      place: (base, S) => (ctx) => {
        const { wrap, o, zoom, W, H, margin } = S.frame;
        const insetX = ctx.size.width * 0.04425;
        const insetY = ctx.stage.getBoundingClientRect().height * 0.0937;
        wrap.style.left = Math.max(margin, Math.min(insetX - o.x * zoom, ctx.size.width - W * zoom - margin)) + 'px';
        wrap.style.top = Math.max(margin, Math.min(insetY - o.y * zoom, ctx.size.height - H * zoom - margin)) + 'px';
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
