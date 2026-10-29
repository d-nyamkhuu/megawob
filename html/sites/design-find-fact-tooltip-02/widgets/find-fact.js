// Design on templates/find-fact/base.js, with compact rows when the stage is short.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-tooltip-02',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip'],
  template: 'find-fact/base',
  design: {
    parts: {
      buildTooltip: (base) => (ctx, work, up, room) => {
        const result = base(ctx, work, up, room);
        const card = work.firstElementChild;
        const table = card.querySelector('.rl-table');
        if (table) {
          const rowHeight = Math.floor((ctx.size.height - 36 - 34 - 4) / (table.rows.length - 1));
          if (rowHeight < 33) {
            // Every hover target must fit: tooltip lookup has no paging step.
            const fontSize = Math.min(16, rowHeight - 4);
            table.style.setProperty('--ds-lookup-font', fontSize + 'px/1 Arial');
            table.style.setProperty('--ds-lookup-font-size', fontSize + 'px');
            table.style.setProperty('--ds-lookup-padding', '0 9px');
            for (const row of Array.from(table.rows).slice(1)) {
              for (const cell of row.cells) {
                Object.assign(cell.style, { height: rowHeight + 'px', verticalAlign: 'middle' });
              }
              const info = row.querySelector('.rl-info');
              const size = Math.min(22, rowHeight - 4) + 'px';
              Object.assign(info.style, { width: size, height: size, verticalAlign: 'middle' });
            }
          }
        }
        return result;
      },
    },
  },
});
