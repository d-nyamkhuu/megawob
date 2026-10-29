// Keep the shared flyout behavior and size its rows to the stage's available height.
env.widget({
  task: 'click-control',
  site: 'design-click-control-flyout-01',
  name: 'design',
  split: 'train',
  scenarios: ['flyout'],
  template: 'click-control/base',
  design: {
    parts: {
      buildFlyout: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        const trigger = content.querySelector('.uc-flytrig');
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
