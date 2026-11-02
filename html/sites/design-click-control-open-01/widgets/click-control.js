// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-open-01',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'click-control/base',
  design: {
    parts: {
      // Keep the file pane below the toolbar, including when the template chooses
      // a list rather than a grid. Calling the base preserves its seeded draws.
      box: (base) => function (ctx, content, opts) {
        const box = base(ctx, content, opts);
        Object.assign(box.style, {
          position: 'absolute', left: '12px', right: '12px',
          top: ctx.size.width < 650 ? '53px' : '62px', bottom: '55px',
          minHeight: '0',
        });
        return box;
      },
      fileView: (base) => function (ctx, parent, items, layout, avail) {
        const rect = parent.getBoundingClientRect();
        const stage = ctx.stage.getBoundingClientRect();
        const window = ctx.stage.parentElement.getBoundingClientRect();
        const height = Math.max(24, Math.min(rect.bottom, stage.bottom - 55, window.bottom - 55) - rect.top - 30);
        const capacity = Math.max(1, Math.floor(height / 24));
        const columns = Math.max(1, Math.ceil(items.length / capacity));
        const rowHeight = Math.min(34, Math.floor(height / Math.ceil(items.length / columns)));
        const heading = ctx.util.el('div', 'cal-file-head', parent, 'Name                                      Size                  Modified');
        heading.style.height = '30px';
        const view = base(ctx, parent, items, columns === 1 ? layout : 'grid', { w: rect.width, h: height });
        Object.assign(view.host.style, {
          width: '100%', height: height + 'px', boxSizing: 'border-box',
          overflow: 'auto',
        });
        if (view.host.classList.contains('uc-files')) {
          view.host.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
          view.host.style.gridAutoRows = rowHeight + 'px';
          for (const tile of Object.values(view.els)) {
            Object.assign(tile.style, {
              height: rowHeight + 'px', minHeight: '0',
              gridTemplateColumns: '28px minmax(0, 1fr)',
            });
          }
        }
        return view;
      },
    },
  },
});
