// Outlook-style reservation context rows and details around the shared time control.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-04',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  traits: { timeControls: ['spin'] },
  template: 'set-date/calendar',
  design: {
    timeSummary: false,
    parts: {
      begin: (base, S) => (ctx) => {
        S.pop = null;
        return base(ctx);
      },
      built: (base, S) => (ctx) => {
        const { util, size } = ctx;
        const { card, control, geo, spec, P } = S;
        const taskRow = control.closest('.fd-row');
        taskRow.classList.add('fd-time-row');

        const titleRow = util.el('div', 'fd-row fd-event', card);
        util.el('div', 'fd-label', titleRow, 'Event title');
        util.el('div', 'fd-static', titleRow, 'Room reservation');

        const dateRow = util.el('div', 'fd-row fd-date-context', card);
        util.el('div', 'fd-label', dateRow, 'Date');
        const dateValue = util.el('div', 'fd-static', dateRow,
          spec.today ? P.fmtLocal(spec.today, 'medium') : 'Apr 24, 2018');
        dateValue.insertAdjacentHTML('beforeend', '<span class="fd-context-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 2v5M16 2v5M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2M15 17h2"/></svg></span>');
        card.insertBefore(titleRow, taskRow);
        card.insertBefore(dateRow, taskRow);
        card.insertBefore(taskRow, dateRow.nextSibling);

        const durationRow = util.el('div', 'fd-row fd-duration-context', card);
        util.el('div', 'fd-label', durationRow, 'Duration');
        util.el('div', 'fd-static fd-chevron', durationRow, '1 hour');
        card.insertBefore(durationRow, taskRow.nextSibling);

        const rail = document.querySelector('.ds-reservation-values');
        for (const row of [...card.querySelectorAll('.fd-row')]) {
          const label = row.querySelector('.fd-label');
          if (label && /organizer/i.test(label.textContent)) {
            row.classList.add('fd-organizer-context');
            rail.appendChild(row);
          } else if (label && /room|location|restaurant|venue/i.test(label.textContent)) {
            row.classList.add('fd-location-context');
            row.querySelector('.fd-static')?.classList.add('fd-chevron');
            card.insertBefore(row, durationRow.nextSibling);
          }
        }

        const attendeesRow = util.el('div', 'fd-row fd-attendees-context', card);
        util.el('div', 'fd-label', attendeesRow, 'Attendees');
        util.el('div', 'fd-static', attendeesRow, '4')
          .insertAdjacentHTML('beforeend', '<span class="fd-xtra-arrows">⌃<br>⌄</span>');
        let notesRow = card.querySelector('.fd-notes');
        if (!notesRow) {
          notesRow = util.el('div', 'fd-row fd-notes', card);
          util.el('div', 'fd-label', notesRow, 'Notes');
          util.el('div', 'fd-static', notesRow, geo.note);
        }
        notesRow.querySelector('.fd-label').textContent = 'Notes';
        card.appendChild(attendeesRow);
        card.appendChild(notesRow);
        const partyRow = [...card.querySelectorAll('.fd-row')].find((row) =>
          /party size|attendees|guests/i.test(row.querySelector('.fd-label')?.textContent || '') && row !== attendeesRow);
        if (partyRow) {
          attendeesRow.remove();
          partyRow.classList.add('fd-attendees-context');
          card.insertBefore(partyRow, notesRow);
        }

        if (S.pop) {
          const top = control.offsetTop + control.offsetHeight + 6;
          S.pop.style.top = top + 'px';
          const scale = Math.min(1, (size.height - 22 - top - 18) / parseFloat(S.pop.style.height));
          if (scale > 0 && scale < 1) {
            S.pop.style.transformOrigin = 'top left';
            S.pop.style.transform = `scale(${scale})`;
          }
        }
        return base(ctx);
      },
      positioned: (base, S) => (ctx) => {
        const { util } = ctx;
        const { spec } = S;
        const summary = document.querySelector('.ds-reservation-values');
        if (summary) {
          const room = spec.scene.extra.find((x) => /room|location|restaurant|venue/i.test(x[0]));
          const details = [
            ['Name', room ? room[1] : 'Conference Room B'],
            ['Capacity', '10'],
            ['Features', 'Display, Whiteboard, Video Conferencing'],
            ['Availability', 'Available'],
          ];
          details.forEach(([key, value]) => {
            const row = util.el('div', 'ds-detail' + (key === 'Availability' ? ' ds-available' : ''), summary);
            util.el('span', 'ds-k', row, key);
            util.el('span', 'ds-v', row, value);
            summary.insertBefore(row, summary.querySelector('.fd-row'));
          });
        }
        return base(ctx);
      },
    },
  },
});
