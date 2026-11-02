// Keeps the inline split-calendar presentation and paired date fields of this range design.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-12',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  traits: { inline: true, splitCals: true },
  template: 'set-date/calendar',
  design: {
    inlineRange: true,
    inlineBinding: 'click',
    splitCalendars: true,
    calendarLabels: ['calendar', 'calendar'],
    adjacentDays: false,
    minWeeks: 4,
    weekCount: 'grid',
    rangeLayout: null,
    parts: {
      calendarRow: (base, S) => (ctx, range, row) => {
        base(ctx, range, row);
        if (!range) return;
        row.classList.add('fd-range-row');
        const label = row.querySelector('.fd-label');
        label.replaceChildren();
        S.ctxRef.util.el('span', '', label, `${S.spec.scene.label} (Start date):`);
        S.ctxRef.util.el('span', '', label, `${S.spec.scene.label2} (End date):`);
      },
      rangeReadout: (base, S) => (ctx, model, txt) => {
        const { util } = ctx;
        const start = util.el('span', `fd-date-part${model.start ? '' : ' fd-ph'}`, txt,
          model.start ? S.P.fmtLocal(model.start, S.geo.disp) : 'Select a date...');
        start.dataset.part = 'start';
        const end = util.el('span', `fd-date-part${model.end ? '' : ' fd-ph'}`, txt,
          model.end ? S.P.fmtLocal(model.end, S.geo.disp) : 'Select a date...');
        end.dataset.part = 'end';
      },
    },
  },
});
