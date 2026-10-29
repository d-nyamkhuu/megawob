// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-flyout-02',
  name: 'design',
  split: 'train',
  scenarios: ['flyout'],
  template: 'click-control/base',
  design: {
    parts: {
      buildFlyout: (base) => function(ctx, content, up, page) {
        // Layout can dispatch pointerenter beneath a stationary pointer after reset.
        // Open the trigger on the pointer's movement, retaining the template handler
        // and its click path, so a fresh page stays closed until an actual gesture.
        const taskContext = Object.create(ctx);
        taskContext.util = Object.create(ctx.util);
        taskContext.util.el = (...args) => {
          const element = ctx.util.el(...args);
          if (args[1] === 'uc-flytrig') {
            const listen = element.addEventListener.bind(element);
            element.addEventListener = (type, listener, options) =>
              listen(type === 'pointerenter' ? 'pointermove' : type, listener, options);
          }
          return element;
        };
        const view = base(taskContext, content, up, page);
        const bar = content.querySelector('.uc-shopbar');
        const title = page.querySelector('.uc-h1');
        // Keep the template's blank-space recovery target visible as the shop caption.
        title.textContent = 'Shop by department';
        Object.assign(title.style, {margin: '0 6px 0 0', fontSize: '18px', flex: 'none'});
        bar.prepend(title);
        const wrap = bar.querySelector('.uc-flywrap');
        const root = wrap.querySelector('.uc-mpanel');
        let depth = 0, rows = 0;
        const measure = (nodes, level) => {
          depth = Math.max(depth, level);
          rows = Math.max(rows, nodes.length);
          nodes.forEach(node => { if (node.children) measure(node.children, level + 1); });
        };
        measure(ctx.spec.tree, 1);
        const width = Math.min(220, Math.floor((page.clientWidth - 12) / depth));
        const room = page.getBoundingClientRect().bottom - wrap.getBoundingClientRect().bottom - 12;
        const rowHeight = Math.min(34, Math.floor((room - 10) / rows));
        wrap.querySelectorAll('.uc-mpanel').forEach(panel => {
          Object.assign(panel.style, {width: width + 'px', minWidth: '0', boxSizing: 'border-box', padding: '4px'});
        });
        wrap.querySelectorAll('.uc-mi').forEach(item => {
          item.style.height = rowHeight + 'px';
        });
        // Leave enough room for every level, including the held-out fourth level.
        const offset = wrap.getBoundingClientRect().left - page.getBoundingClientRect().left;
        root.style.left = Math.min(0, page.clientWidth - 12 - depth * width - offset) + 'px';
        return view;
      },
    },
  },
});
