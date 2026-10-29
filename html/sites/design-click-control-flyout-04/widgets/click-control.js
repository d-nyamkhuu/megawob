// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-flyout-04',
  name: 'design',
  split: 'train',
  scenarios: ['flyout'],
  template: 'click-control/base',
  design: {
    parts: {
      buildFlyout: (base) => function (ctx, content, up, page) {
        const view = base(ctx, content, up, page);
        const depth = (nodes) => Math.max(...nodes.map(n => 1 + (n.children ? depth(n.children) : 0)));
        const levels = depth(ctx.spec.tree);
        const wrap = content.querySelector('.uc-flywrap');
        const room = content.getBoundingClientRect().right - wrap.getBoundingClientRect().left - 16;
        const panelWidth = Math.floor(room / levels);
        // Deep held-out trees must fit alongside the inspector, including their final panel.
        // Size during the template's render, before the kit freezes its anchors.
        if (panelWidth < 196) {
          wrap.querySelectorAll('.uc-mpanel').forEach(panel => {
            panel.style.minWidth = '0';
            panel.style.width = panelWidth + 'px';
            panel.style.maxWidth = panelWidth + 'px';
          });
          wrap.querySelectorAll('.uc-mi').forEach(item => {
            item.style.whiteSpace = 'normal';
            item.style.height = 'auto';
            item.style.minHeight = '30px';
          });
        }
        return view;
      },
    },
  },
});
