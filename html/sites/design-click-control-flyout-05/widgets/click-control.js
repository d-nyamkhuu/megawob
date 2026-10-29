// Keep the shared flyout behavior and size its rows to the stage's available height.
env.widget({
  task: 'click-control',
  site: 'design-click-control-flyout-05',
  name: 'design',
  split: 'train',
  scenarios: ['flyout'],
  template: 'click-control/base',
  design: {
    parts: {
      buildFlyout: (base) => (ctx, content, up, page) => {
        let hoverAt = null;
        let pending = null;
        const view = base(ctx, content, (patch) => {
          if (hoverAt !== null && ctx.model.path === null && patch.path && !patch.path.length) {
            pending = patch;
            return;
          }
          pending = null;
          up(patch);
        }, page);
        const trigger = content.querySelector('.uc-flytrig');
        // Use the menu's hover delay so crossing the trigger on the way to
        // another control does not open it. A click still opens immediately.
        trigger.addEventListener('pointerenter', (event) => {
          if (event.target === trigger && ctx.model.path === null) hoverAt = ctx.clock();
        }, true);
        const clearHover = () => { hoverAt = null; pending = null; };
        trigger.addEventListener('pointerleave', clearHover);
        trigger.addEventListener('click', clearHover, true);
        const sync = view.sync;
        view.sync = (model) => {
          sync(model);
          if (pending && ctx.clock() - hoverAt >= Math.max(1, ctx.spec.hoverDelay)) {
            const patch = pending;
            clearHover();
            up(patch);
          }
        };
        const maxRows = (nodes) => Math.max(nodes.length,
          ...nodes.filter((node) => node.children).map((node) => maxRows(node.children)));
        const bottom = ctx.stage.getBoundingClientRect().top + ctx.size.height;
        // Reserve the panels' borders, padding and a little room below the menu.
        const available = bottom - trigger.getBoundingClientRect().bottom - 20;
        const rowHeight = Math.min(42, Math.floor(available / maxRows(ctx.spec.tree)));
        for (const row of content.querySelectorAll('.uc-flywrap .uc-mi')) {
          row.style.height = rowHeight + 'px';
        }
        return view;
      },
    },
  },
});
