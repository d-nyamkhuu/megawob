// Pickup design: adds the booking details and segmented time readout.
(function () {
  const CALENDAR_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="5" width="20" height="17" rx="1"/><path d="M2 10h20M7 2v6M17 2v6"/><path fill="currentColor" stroke="none" d="M5 12h3v3H5zM10 12h3v3h-3zM15 12h3v3h-3zM5 17h3v3H5zM10 17h3v3h-3zM15 17h3v3h-3z"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-time-03',
    name: 'design',
    split: 'train',
    scenarios: ['time'],
    template: 'set-date/calendar',
    design: {
      title: 'Pickup Information',
      calendarIcon: CALENDAR_ICON,
      timeSummary: false,
      fit: null,
      parts: {
        timeReadout: (base, S) => (txt, value, util, kind) => {
          if (kind === 'clock') {
            const parts = S.fam.helpers.parts12(value);
            txt.replaceChildren();
            util.el('span', 'fd-time-part', txt, String(parts.h));
            util.el('span', 'fd-time-colon', txt, ':');
            util.el('span', 'fd-time-part', txt, String(parts.m).padStart(2, '0'));
            util.el('span', 'fd-time-part fd-time-ap', txt, parts.ap);
            return;
          }
          txt.replaceChildren();
          if (value === null) {
            util.el('span', 'fd-ph', txt, '--:-- --');
            return;
          }
          const parts = S.fam.helpers.parts12(value);
          util.el('span', 'fd-time-part', txt, String(parts.h));
          util.el('span', 'fd-time-colon', txt, ':');
          util.el('span', 'fd-time-part', txt, String(parts.m).padStart(2, '0'));
          util.el('span', 'fd-time-part fd-time-ap', txt, parts.ap);
        },
        positioned: (base, S) => (ctx) => {
          const { util } = ctx;
          const { card, control, geo, spec, fam, paintFns } = S;
          const timeRow = control.closest('.fd-row');
          timeRow.classList.add('fd-time-row');
          const existingRows = Array.from(card.querySelectorAll(':scope > .fd-row'));
          const extraRows = existingRows.filter(r => r !== timeRow && !r.classList.contains('fd-notes'));
          const dateRow = util.el('div', 'fd-row fd-pickup-date', card);
          util.el('div', 'fd-label', dateRow, 'Pickup date');
          const pickupDate = spec.today ? S.P.fmtLocal(spec.today, 'medium') : 'Apr 24, 2008';
          const dateValue = util.el('div', 'fd-static', dateRow, pickupDate);
          const calendar = util.el('span', 'fd-calendar-icon', dateValue);
          calendar.innerHTML = CALENDAR_ICON;
          card.insertBefore(dateRow, timeRow);
          let after = timeRow;
          for (const r of extraRows) { after.after(r); after = r; }
          S.P.staticRow(card, ['State', 'Illinois'], util).classList.add('fd-state-row');
          S.P.staticRow(card, ['ZIP code', '60611'], util).classList.add('fd-zip-row');
          let notes = card.querySelector('.fd-notes');
          if (!notes) {
            notes = util.el('div', 'fd-row fd-notes', card);
            util.el('div', 'fd-label', notes, 'Special instructions (optional)');
            util.el('div', 'fd-static', notes, geo.note);
          } else {
            notes.querySelector('.fd-label').textContent = 'Special instructions (optional)';
            card.append(notes);
          }
          card.style.height = 'auto';
          card.classList.add('fd-control-' + spec.control);

          const summary = document.querySelector('.ds-reservation-values');
          if (summary) {
            const fact = (label, value) => {
              const row = util.el('div', 'ds-fact', summary);
              util.el('span', 'ds-fact-label', row, label + ':');
              return util.el('span', 'ds-fact-value', row, value);
            };
            fact('Date', pickupDate);
            const time = fact('Time', '');
            paintFns.push(m => { time.textContent = spec.control === 'text24' ? m.text : fam.helpers.fmt12(m.value); });
            spec.scene.extra.forEach(x => fact(x[0], x[1]));
            fact('State', 'Illinois');
            fact('ZIP code', '60611');
          }
        },
        rendered: (base, S) => (ctx) => {
          const { card, control, pop } = S;
          const { size } = ctx;
          if (pop) {
            pop.style.left = control.offsetLeft + 'px';
            pop.style.top = Math.max(0, Math.min(control.offsetTop + control.offsetHeight + 6, size.height - parseFloat(pop.style.height) - 8)) + 'px';
          }
          const rr = card.getBoundingClientRect();
          const sr = ctx.stage.getBoundingClientRect();
          const ratio = Math.min(1, (sr.bottom - rr.top - 8) / rr.height);
          if (ratio < 1) { card.style.transformOrigin = 'top left'; card.style.transform = `scale(${ratio})`; }
        },
      },
    },
  });
})();
