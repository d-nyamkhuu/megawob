// Keep the reference flyout behavior; size its cascading panels to this design's stage.
env.widget({
  task: 'click-control',
  site: 'design-click-control-flyout-03',
  name: 'design',
  split: 'train',
  scenarios: ['flyout'],
  template: 'click-control/base',
  design: {
    parts: {
      buildFlyout: (base) => function (ctx, content, up, page) {
        const depth = (nodes) => Math.max(...nodes.map(n => 1 + (n.children ? depth(n.children) : 0)));
        // All levels must fit inside the stage, including the held-out fourth level.
        const width = Math.min(205, Math.floor((ctx.size.width - 158) / depth(ctx.spec.tree)));
        content.classList.add('catalog-flyout');
        content.style.setProperty('--catalog-menu-width', width + 'px');
        content.style.setProperty('--catalog-menu-padding', width < 175 ? '7px' : '12px');
        const style = ctx.util.el('style', 'catalog-flyout-style', content);
        style.textContent = `
        .catalog-flyout .uc-flywrap .uc-mpanel {
          box-sizing: border-box;
          min-width: 0;
          width: var(--catalog-menu-width);
          padding: 4px 0;
        }
        .catalog-flyout .uc-mi {
          height: auto;
          min-height: 35px;
          padding: 7px var(--catalog-menu-padding);
          white-space: normal;
          gap: 4px;
        }
        .catalog-flyout .uc-mi .car { padding-left: 0; }
        `;
        return base(ctx, content, up, page);
      },
    },
  },
});
