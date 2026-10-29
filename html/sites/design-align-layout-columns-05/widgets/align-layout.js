// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-columns-05',
  name: 'design',
  split: 'train',
  scenarios: ['columns'],
  template: 'align-layout/canvas',
  design: {
    tools: [], cardGap: 0, cardPadding: '0', bodyGap: 0,
    headerHeight: 44, rowHeight: 33, chipHeight: 29, chipRadius: 0,
    insetX: 0, insetY: 0,
    parts: {
      toolbar: (base, S) => (ctx, card) => {
        const bar = base(ctx, card); // Retain the template's seeded title draw.
        bar.hidden = true;
        return bar;
      },
      pane: (base, S) => (ctx, parent) => ctx.util.el('div', 'irix-table-pane', parent),
      frame: (base, S) => (ctx, parent) => ctx.util.el('div', 'irix-table-frame', parent),
      canvas: (base, S) => (ctx, frame) => {
        const table = ctx.util.el('div', 'lo-table irix-table', frame);
        S.st.sx = Math.max(0.5, (ctx.size.width - 26) / ctx.spec.W);
        table.style.width = (ctx.size.width - 4) + 'px';
        table.style.height = (ctx.size.height - 4) + 'px';
        const scroll = ctx.util.el('div', 'irix-scroll', table);
        ctx.util.el('span', 'irix-scroll-up', scroll, '▲');
        ctx.util.el('span', 'irix-scroll-thumb', scroll);
        ctx.util.el('span', 'irix-scroll-down', scroll, '▼');
        return table;
      },
      cell: (base, S) => (ctx, canvas, row, r, c) => {
        const td = base(ctx, canvas, row, r, c);
        const chip = td.firstElementChild;
        chip.classList.add('irix-cell-chip');
        const value = row[c];
        const labels = [
          `${ctx.spec.names[c].toLowerCase()}_${String(value).padStart(3, '0')}`,
          `2024-04-${String(18 + value % 10).padStart(2, '0')}`,
          `A${String(value).padStart(3, '0')}`,
          ['Render', 'Simulation', 'Post'][value % 3],
        ];
        if (c === 0) ctx.util.el('span', 'irix-file', chip, '▤');
        ctx.util.el('span', 'irix-cell-value', chip, labels[c] || String(value));
        return td;
      },
      paintCols: (base, S) => () => {
        base();
        const sx = S.st.sx;
        S.st.cells.forEach((col) => {
          for (const el of [col.th, ...col.tds]) {
            el.style.left = (parseFloat(el.style.left) * sx) + 'px';
            el.style.width = (parseFloat(el.style.width) * sx) + 'px';
          }
          col.div.style.left = (parseFloat(col.div.style.left) * sx) + 'px';
        });
      },
      bindDivider: (base, S) => (ctx, div, c) => {
        let start;
        env.ui.track(div, {
          start() { start = ctx.model.cols.slice(); div.classList.add('on'); },
          move(p) {
            ctx.update({ ...ctx.model, cols: env.taskDef.helpers.setCol(ctx.spec, start, c, start[c] + p.dx / S.st.sx) });
            S.P.paintCols();
          },
          end() { div.classList.remove('on'); },
        }, 'layout-divider');
      },
      locate: (base, S) => (target) => base(target.div === undefined ? target : { ...target, dx: (target.dx || 0) * S.st.sx }),
      place: (base, S) => (ctx, card) => {
        base(ctx, card); // Retain both float/pick placement draws.
        Object.assign(card.style, { left: '0px', top: '0px', width: ctx.size.width + 'px', height: ctx.size.height + 'px' });
      },
    },
  },
});
