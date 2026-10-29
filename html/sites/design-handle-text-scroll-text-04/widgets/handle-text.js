// This scroll-text design keeps the site's printed line fit and important reading-space padding.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-04',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    parts: {
      printLineHeight: (base, S) => (ctx, look) =>
        Math.min(look.lh, Math.max(32, Math.min(36, (ctx.size.width / 0.654) * 0.0212))),
      lineLayout: (base, S) => (ctx, box, list, opts) => {
        base(ctx, box, list, opts);
        if (opts.printLh) {
          list.style.setProperty(
            'padding-bottom',
            Math.max(0, opts.rows * (opts.lh - opts.printLh)) + 'px',
            'important',
          );
        }
      },
    },
  },
});
