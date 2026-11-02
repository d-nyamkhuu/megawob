// Design on templates/set-date/calendar.js.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-07',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  traits: { timeControls: ['dropdowns'], sceneRows: 6 },
  template: 'set-date/calendar',
  design: {
    parts: {
      extras: (base, S) => (ctx) => {
        const extras = base(ctx);
        // Use the existing six unscored form rows, without moving the task field.
        const surroundingRows = document.querySelectorAll('.ds-colL > .ds-f, .ds-colR > .ds-f:not(.ds-notes)');
        surroundingRows.forEach((row, i) => {
          if (!extras[i]) return;
          row.querySelector('label').textContent = extras[i][0];
          row.querySelector('.ds-fi > span').textContent = extras[i][1];
        });

        return extras;
      },
      painted: (base, S) => (ctx) => {
        const { ctxRef, spec, fam, ui } = S;
        if (ui.dropdowns) for (const [kind, dd] of Object.entries(ui.dropdowns)) dd.set({ open: ctxRef.model.open === kind });
        const overviewTime = document.querySelector('.ds-table tbody tr:first-child td:nth-child(3)');
        if (overviewTime) {
          const m = ctxRef.model;
          const textTime = spec.control === 'text24' && /^(\d{2}):(\d{2})$/.exec(m.text || '');
          const value = spec.control === 'text24'
            ? (textTime && +textTime[1] < 24 && +textTime[2] < 60 ? +textTime[1] * 60 + +textTime[2] : null)
            : spec.control === 'dropdowns'
              ? (m.h !== null && m.m !== null && m.ap ? (m.h % 12) * 60 + m.m + (m.ap === 'PM' ? 720 : 0) : null)
              : m.value;
          overviewTime.textContent = Number.isFinite(value) ? fam.helpers.fmt12(value) : '—';
        }
      },
    },
  },
});
