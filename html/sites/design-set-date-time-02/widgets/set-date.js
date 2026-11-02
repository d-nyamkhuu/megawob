// Reservation form design: adds the decorative date row and custom field ordering.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-02',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  template: 'set-date/calendar',
  design: {
    notesLabel: 'Special Requests',
    parts: {
      fieldLabel: (base, S) => (label) => label,
      staticCreated: (base, S) => (parent, row, label, value, util) => {
        base(parent, row, label, value, util);
        if (/party|size/i.test(label)) row.querySelector('.fd-static').classList.add('fd-small');
      },
      bodyStart: (base, S) => (ctx, extras) => {
        base(ctx, extras);
        const { card } = S;
        const dateRow = ctx.util.el('div', 'fd-row fd-date', card);
        ctx.util.el('div', 'fd-label', dateRow, 'Date');
        const dateValue = ctx.util.el('div', 'fd-static', dateRow, 'Tue, Apr 27, 1999');
        const calendarGlyph = ctx.util.el('span', 'fd-calendar-glyph', dateValue);
        calendarGlyph.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="2"><rect x="3" y="5" width="26" height="25"/><path d="M3 12h26M10 12v18M17 12v18M23 12v18M3 18h26M3 24h26M9 2v7M24 2v7"/></svg>';
      },
      built: (base, S) => (ctx) => {
        base(ctx);
        const { card, control, pop, ctxRef, geo } = S;
        const { util, size } = ctx;
        const dateRow = card.querySelector('.fd-date');
        const controlRow = control.closest('.fd-row');
        dateRow.after(controlRow);
        const party = card.querySelector('.fd-small');
        if (party) controlRow.after(party.parentElement);
        const staticFields = Array.from(card.querySelectorAll('.fd-row > .fd-static:not(.fd-small)'))
          .filter((el) => !el.parentElement.classList.contains('fd-date') && !el.parentElement.classList.contains('fd-notes'));
        if (staticFields.length) staticFields[staticFields.length - 1].classList.add('fd-select');
        if (!card.querySelector('.fd-notes')) {
          const notes = util.el('div', 'fd-row fd-notes', card);
          util.el('div', 'fd-label', notes, 'Special Requests');
          util.el('div', 'fd-static', notes, geo.note);
          card.style.height = 'auto';
        }
        card.style.height = 'auto';
        if (pop && pop.isConnected) {
          const popupHeight = parseFloat(pop.style.height);
          const popupTop = parseFloat(pop.style.top);
          const available = Math.max(100, size.height - popupTop - 8);
          if (popupHeight > available) {
            pop.style.transformOrigin = 'top left';
            pop.style.transform = `scale(${available / popupHeight})`;
          }
        }
      },
    },
  },
});
