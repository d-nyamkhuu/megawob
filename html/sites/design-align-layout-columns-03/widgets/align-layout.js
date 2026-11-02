// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-columns-03',
  name: 'design',
  split: 'train',
  scenarios: ['columns'],
  template: 'align-layout/canvas',
  design: {
    headerHeight: 80,
    rowHeight: 47,
    chipHeight: 32,
    titleSize: 19,
    itemSize: 16,
    panel: 'transparent',
    line: '#e4e9f2',
    accent: '#1478f8',
    parts: {
      canvas: (base, S) => (ctx, frame) => {
        const canvas = base(ctx, frame);
        canvas.style.setProperty('--lc-table-height', `${S.D.headerHeight + ctx.spec.cells.length * S.D.rowHeight}px`);
        return canvas;
      },
      columnHeader: (base, S) => (ctx, canvas, name, column) => {
        const th = base(ctx, canvas, name, column);
        ctx.util.el('span', 'lc-column-filter', th, 'All');
        return th;
      },
      cell: (base, S) => (ctx, canvas, row, r, c) => {
        const td = base(ctx, canvas, row, r, c);
        const chip = td.firstElementChild;
        const heading = ctx.spec.names[c].toLowerCase();
        const labels = {
          name: ['Starbucks', 'Target', 'Amazon', 'Apple', 'Airbnb', 'Delta Air Lines', 'Spotify', 'Netflix'],
          type: ['Food & Drink', 'Shopping', 'Shopping', 'Subscriptions', 'Travel'],
          status: ['Cleared', 'Pending', 'Cleared', 'Cleared', 'Pending'],
          amount: ['$5.48', '$84.21', '$23.90', '$9.99', '$312.00'],
          city: ['Seattle', 'Portland', 'Austin', 'Boston', 'Denver'],
          region: ['West', 'West', 'South', 'East', 'Central'],
          role: ['Member', 'Admin', 'Member', 'Member', 'Editor'],
          owner: ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan'],
          phone: ['(206) 555-0182', '(503) 555-0147', '(512) 555-0136'],
          email: ['alex@example.com', 'sam@example.com', 'jordan@example.com'],
          team: ['Design', 'Product', 'Engineering'],
          date: ['Oct 12', 'Oct 11', 'Oct 10'],
        };
        const values = labels[heading];
        if (values) {
          chip.textContent = values[r % values.length];
          td.classList.add('lc-text-cell');
          if (heading === 'status') chip.classList.add('lc-status-chip', r % 3 === 1 ? 'pending' : 'cleared');
          if (heading === 'amount') td.classList.add('lc-amount-cell');
          if (heading === 'name') {
            const label = ctx.util.el('span', 'lc-merchant-name', chip, chip.textContent);
            chip.firstChild.remove();
            const mark = ctx.util.el('span', 'lc-merchant-mark', chip, ['✳', '◎', 'a', '●', '♧', '✈', '≋', 'N'][r % 8]);
            mark.style.color = ['#198b55', '#ce1224', '#151515', '#72737c', '#ff436b', '#258cfa', '#0bc442', '#e50914'][r % 8];
            chip.insertBefore(mark, label);
          }
        }
        return td;
      },
    },
  },
});
