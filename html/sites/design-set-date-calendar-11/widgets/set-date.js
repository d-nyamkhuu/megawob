// Council form design: moves the event fields ahead of the picker and adds its birth-place and notes rows.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-11',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  traits: { sceneRows: 2 },
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path stroke-width="1.6" d="M7 14h1m3 0h1m3 0h1M7 18h1m3 0h1"/></svg>',
    parts: {
      built: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card, control, geo } = S;
        const mainRow = control.parentElement;
        const extraRows = [...card.children].filter(el =>
          el.classList.contains('fd-row') && el !== mainRow && !el.classList.contains('fd-notes'));
        for (const el of extraRows) card.insertBefore(el, mainRow);
        if (extraRows[1]) extraRows[1].classList.add('fd-secondary');

        const place = util.el('div', 'fd-row fd-place', null);
        util.el('div', 'fd-label', place, 'Place of birth');
        util.el('div', 'fd-static', place, '');
        mainRow.after(place);

        let notes = card.querySelector('.fd-notes');
        if (!notes) {
          notes = util.el('div', 'fd-row fd-notes', card);
          util.el('div', 'fd-label', notes);
          util.el('div', 'fd-static', notes, geo.note);
        }
        notes.querySelector('.fd-label').textContent = 'Any additional notes (Optional)';
        card.style.setProperty('--picker-top', String(extraRows.length * 66 + 44));
        return base(ctx);
      },
    },
  },
});
