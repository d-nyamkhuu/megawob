// Design on templates/set-date/calendar.js.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-01',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  traits: { inline: true, splitCals: true },
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M3 9h18M8 1v6M16 1v6"/><path stroke-width="2.4" d="M7 12h2m2 0h2m2 0h2M7 16h2m2 0h2m2 0h2M7 19h2m2 0h2m2 0h2"/></svg>', rangeLayout: null, adjacentDays: false, showOut: true, openOnPick: false,
    minWeeks: 5, weekCount: 'popup', splitCalendars: true, daySide: true,
    parts: {
      geometry: (base, S) => (ctx, extras, nAbove) => ({ ...base(ctx, extras, nAbove), inline: S.spec.scenario === 'range' }),
      calendarLabel: () => (range) => range ? 'Start Date' : 'Date',
      calendarRow: (base, S) => (ctx, range, row) => {
        if (range) row.classList.add('fd-start-row');
      },
      calendarFields: (base, S) => (ctx, range, row) => {
        const { geo } = S;
        const { util } = ctx;
        let endControl, endTxt;
        if (range) {
          const endRow = S.P.fieldRow(geo.body, 'End Date', null, util).row;
          endRow.classList.add('fd-end-row');
          endControl = S.P.clickControl(endRow, S.D.calendarIcon, util);
          endTxt = util.el('span', 'fd-txt', endControl);
          endControl.addEventListener('click', () => S.P.act({ field: 'main' }));
        }
        return { endControl, endTxt };
      },
      rangeReadout: (base, S) => (ctx, m, txt, fields) => {
        const { geo } = S;
        const { endTxt } = fields;
        const { util } = ctx;
        const a = util.el('span', m.start ? '' : 'fd-ph', txt, m.start ? S.P.fmtLocal(m.start, geo.disp) : '—  Select a date  —');
        a.dataset.part = 'start';
        endTxt.replaceChildren();
        util.el('span', m.end ? '' : 'fd-ph', endTxt, m.end ? S.P.fmtLocal(m.end, geo.disp) : '—  Select a date  —');
      },
    },
  },
});
