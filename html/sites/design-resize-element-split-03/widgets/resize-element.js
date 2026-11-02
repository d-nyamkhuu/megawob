// Keep the template's split behavior while fitting its logical pixels to the stage.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-split-03',
  name: 'design',
  split: 'train',
  scenarios: ['split'],
  template: 'resize-element/base',
  design: {
    parts: {
      renderSplit: (base) => (ctx) => {
        const vertical = ctx.spec.orient === 'v';
        const width = vertical ? ctx.spec.total : ctx.spec.cross;
        const height = vertical ? ctx.spec.cross : ctx.spec.total;
        // Include the widget's ridge border and the template's placement padding.
        const scale = Math.min(1,
          (ctx.size.width - 24) / (width + 6),
          (ctx.size.height - 24) / (height + 6));
        const util = {
          ...ctx.util,
          el(tag, cls, parent, text) {
            const node = ctx.util.el(tag, cls, parent, text);
            if (cls === 'rzs-box') node.style.zoom = String(scale);
            return node;
          },
          drag(node, handlers, ...args) {
            return ctx.util.drag(node, {
              ...handlers,
              move(event, dx, dy) {
                handlers.move(event, dx / scale, dy / scale);
              },
            }, ...args);
          },
        };
        // Inherit the live model getter; copying ctx would freeze the initial model.
        const view = base(Object.create(ctx, { util: { value: util } }));
        const locate = view.locate;
        view.locate = (target) => {
          const point = locate({ ...target, pos: undefined });
          if (target.pos !== undefined) {
            point[vertical ? 0 : 1] += (target.pos - ctx.model.pos) * scale;
          }
          return point;
        };
        return view;
      },
    },
  },
});
