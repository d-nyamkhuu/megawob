// Adds the fixed date, notes area, and segmented time display to the shared time form.
(function () {
  const ICON_CAL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-time-10',
    name: 'design',
    split: 'train',
    scenarios: ['time'],
    template: 'set-date/calendar',
    design: {
      timeParts: ['fd-timepart', 'fd-timecolon', 'fd-timepart', 'fd-timepart'],
      parts: {
        staticCreated: (base, S) => (parent, row, label, value, util) => {
          if (/guest|party size/i.test(label)) row.classList.add('fd-guest-row');
        },
        built: (base, S) => (ctx) => {
          const { card, control, pop, geo, D } = S;
          const timeRow = control.closest('.fd-row');
          timeRow.classList.add('fd-time-row');

          const extraRows = Array.from(card.querySelectorAll('.fd-row'))
            .filter((row) => row !== timeRow && !row.classList.contains('fd-notes'));
          if (extraRows.length) card.insertBefore(extraRows[0], timeRow);

          const dateRow = ctx.util.el('div', 'fd-row fd-scene-date', null);
          ctx.util.el('div', 'fd-label', dateRow, 'Date');
          const dateValue = ctx.util.el('div', 'fd-static', dateRow, 'April 14, 2025');
          ctx.util.el('span', 'fd-date-icon', dateValue).innerHTML = ICON_CAL;
          card.insertBefore(dateRow, timeRow);

          let notes = card.querySelector('.fd-notes');
          if (!notes) {
            notes = ctx.util.el('div', 'fd-row fd-notes', card);
            ctx.util.el('div', 'fd-label', notes, D.notesLabel);
            ctx.util.el('div', 'fd-static', notes, geo.note);
          }
          const noteValue = notes.querySelector('.fd-static');
          ctx.util.el('div', 'fd-counter', notes, noteValue.textContent.length + '/200');

          if (pop) pop.style.top = (control.offsetTop + control.offsetHeight + 6) + 'px';
        },
      },
    },
  });
})();
