// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-tooltip-inspect-01',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip-inspect'],
  template: 'click-control/base',
  design: {
    parts: {
      buildTooltip: (base) => function (ctx, content, up, page) {
        const view = base(ctx, content, up, page);
        if (ctx.spec.mode === 'id') {
          const table = content.querySelector('.uc-table');
          const rowHeight = Math.floor(content.clientHeight / ctx.spec.rows.length);
          table.rows[0].style.height = '0';
          table.style.tableLayout = 'fixed';
          table.style.setProperty('--contact-icon-height', Math.min(38, Math.max(12, rowHeight - 14)) + 'px');
          for (const row of Array.from(table.rows).slice(1)) {
            row.style.height = rowHeight + 'px';
            for (const cell of row.cells) cell.style.height = rowHeight + 'px';
            const name = row.querySelector('.uc-idname');
            // One continuous hover box, even when a long name wraps beside its icon.
            name.style.display = 'flex';
            name.style.alignItems = 'center';
          }
        }
        return view;
      },
    },
  },
});
