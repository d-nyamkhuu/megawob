// Photo Studio uses a narrower canvas than the base desktop scene.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-aspect-03',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'resize-element/base',
  design: {
    parts: {
      renderWindow: (base) => (ctx) => {
        // Preserve the full model-space resize range, including the initial size.
        // The base scene reserves up to 84px for its margins, origin and taskbar.
        const width = Math.max(ctx.size.width, ctx.spec.max.w + 84);
        const height = Math.max(ctx.size.height, ctx.spec.max.h + 84);
        const scale = Math.min(ctx.size.width / width, ctx.size.height / height);
        if (scale >= 1) return base(ctx);

        // Keep the wrapper inside the stage so a re-render discards it too.
        // The resize primitive reads the transform when mapping pointer motion.
        const workspace = ctx.util.el('div', 'photo-workspace', ctx.stage);
        Object.assign(workspace.style, {
          position: 'absolute',
          left: '0',
          top: '0',
          width: width + 'px',
          height: height + 'px',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        });
        // Inherit live context getters such as model; copying them would freeze
        // the lock state at render time and break later aspect-locked drags.
        const local = Object.create(ctx, {
          stage: { value: workspace },
          size: { value: { width, height } },
        });
        return base(local);
      },
    },
  },
});
