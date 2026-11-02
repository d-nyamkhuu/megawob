// Adds package and delivery notes rows beneath the calendar form control.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-12',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    parts: {
      staticRow: (base, S) => (parent, [label, value], util) => {
        const row = util.el('div', 'fd-row fd-extra-row', parent);
        if (parent.querySelectorAll('.fd-extra-row').length === 2) row.classList.add('fd-extra-second');
        util.el('div', 'fd-label', row, label);
        util.el('div', 'fd-static', row, value);
      },
      calendarRow: (base) => (ctx, range, row) => {
        base(ctx, range, row);
        row.classList.add('fd-date-row');
      },
      built: (base, S) => (ctx) => {
        base(ctx);
        const { util } = ctx;
        const card = S.card;
        const parcelRow = util.el('div', 'fd-row fd-parcel-row', card);
        util.el('div', 'fd-label', parcelRow, 'Package type');
        const parcelValue = util.el('div', 'fd-static', parcelRow, 'Standard (1–5 lb)');
        parcelValue.insertAdjacentHTML('beforeend', S.D.down);
        const notesRow = util.el('div', 'fd-row fd-delivery-notes', card);
        util.el('div', 'fd-label', notesRow, 'Special instructions (optional)');
        util.el('div', 'fd-static', notesRow, 'e.g., Leave at front desk');
      },
    },
  },
});
