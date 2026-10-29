// Keeps the ledger's extra rows and its original calendar field icon.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-09',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M7 14h10M7 17h10M10 12v7M14 12v7"/></svg>',
    fieldClass: 'fd-main-row',
    notesLabel: 'Notes (optional)',
    trimWeeks: true,
    parts: {
      cardCreated: (base, S) => (ctx) => {
        base(ctx);
        const unit = Math.min(ctx.size.width / 498, ctx.size.height / 508);
        S.card.style.setProperty('--u', unit + 'px');
        S.card.style.setProperty('--picker-room', Math.max(0, ctx.size.height - 230 * unit) + 'px');
        S.card.style.setProperty('--picker-foot', (S.spec.todayBtn ? 42 : 0) * unit + 'px');
      },
      staticRow: (base) => (parent, pair, util) => {
        const row = base(parent, pair, util);
        row.classList.add('fd-extra-row');
        return row;
      },
      calendarExtras: (base, S) => (ctx, range) => {
        base(ctx, range);
        if (range) return;
        const { util } = ctx;
        const quantity = util.el('div', 'fd-row fd-order-quantity', S.geo.body);
        util.el('div', 'fd-label', quantity, 'Quantity');
        const value = util.el('div', 'fd-static gg-quantity', quantity, '1');
        util.el('span', 'gg-spinarrows', value, '▴\n▾');
        const price = util.el('div', 'fd-row fd-order-price', S.geo.body);
        util.el('div', 'fd-label', price, 'Unit Price');
        util.el('div', 'fd-static gg-price', price);
      },
      dayGrid: (base) => (box, year, month, decorate, util, ...rest) => {
        base(box, year, month, decorate, util, ...rest);
        const grid = box.querySelector('.fd-grid');
        grid.style.setProperty('--picker-weeks', grid.children.length / 7);
      },
    },
  },
});
